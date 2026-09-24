import mongoose from 'mongoose';
import Loan from '../models/Loan.js';
import Account from '../models/Account.js';
import Transaction from '../models/Transaction.js';

function deriveStatus(loan) {
  if (loan.paidAmount >= loan.amount) return 'paid';
  if (loan.dueDate && new Date(loan.dueDate) < new Date()) return loan.paidAmount > 0 ? 'partial' : 'overdue';
  return loan.paidAmount > 0 ? 'partial' : 'pending';
}

async function moveBalance(accountId, userId, delta, session) {
  const acc = await Account.findOneAndUpdate(
    { _id: accountId, userId },
    { $inc: { balance: delta, version: 1 } },
    { new: true, session }
  );
  if (!acc) throw Object.assign(new Error('Account not found'), { status: 400 });
  return acc;
}

export async function list(req, res, next) {
  try {
    const filter = { userId: req.userId };
    if (req.query.kind) filter.kind = req.query.kind;
    if (req.query.status) filter.status = req.query.status;
    const loans = await Loan.find(filter).sort({ dueDate: 1, createdAt: -1 });
    const receivable = loans.filter((l) => l.kind === 'lent' && l.status !== 'paid')
      .reduce((s, l) => s + (l.amount - l.paidAmount), 0);
    const payable = loans.filter((l) => l.kind === 'borrowed' && l.status !== 'paid')
      .reduce((s, l) => s + (l.amount - l.paidAmount), 0);
    res.json({ loans, receivable, payable });
  } catch (e) { next(e); }
}

// Lending cash-out / borrowing cash-in hits the account immediately.
export async function create(req, res, next) {
  const session = await mongoose.startSession();
  try {
    const { kind, person, amount, accountId, dueDate = null, description = '', date, clientId = null, deviceId = null } = req.body;
    if (!['lent', 'borrowed'].includes(kind)) return res.status(400).json({ message: 'kind must be lent|borrowed' });
    if (!person || !amount || Number(amount) <= 0) return res.status(400).json({ message: 'person and amount > 0 required' });
    if (!accountId) return res.status(400).json({ message: 'accountId required' });
    if (clientId) {
      const existing = await Loan.findOne({ userId: req.userId, clientId });
      if (existing) return res.json({ loan: existing, deduped: true });
    }
    let loan;
    await session.withTransaction(async () => {
      loan = new Loan({
        userId: req.userId, kind, person, amount: Number(amount), accountId,
        dueDate: dueDate ? new Date(dueDate) : null, description,
        date: date ? new Date(date) : new Date(), clientId, deviceId,
      });
      loan.status = deriveStatus(loan);
      await loan.save({ session });
      // lent → cash leaves; borrowed → cash arrives. Never income/expense.
      await moveBalance(accountId, req.userId, kind === 'lent' ? -loan.amount : loan.amount, session);
    });
    res.status(201).json({ loan });
  } catch (e) { next(e); } finally { session.endSession(); }
}

// POST /api/loans/:id/repay { amount } — partial or full settlement.
export async function repay(req, res, next) {
  const session = await mongoose.startSession();
  try {
    const loan = await Loan.findOne({ _id: req.params.id, userId: req.userId });
    if (!loan) return res.status(404).json({ message: 'Loan not found' });
    const amount = Number(req.body.amount);
    if (!amount || amount <= 0) return res.status(400).json({ message: 'amount must be > 0' });
    const remaining = loan.amount - loan.paidAmount;
    if (amount > remaining + 0.001) return res.status(400).json({ message: `Only ₹${remaining.toFixed(0)} remaining` });
    await session.withTransaction(async () => {
      loan.paidAmount = Math.min(loan.amount, loan.paidAmount + amount);
      loan.repayments.push({ amount, date: req.body.date ? new Date(req.body.date) : new Date(), note: req.body.note || '' });
      loan.status = deriveStatus(loan);
      loan.version += 1;
      await loan.save({ session });
      // Repayment received (lent) → cash in; repayment paid (borrowed) → cash out.
      await moveBalance(loan.accountId, req.userId, loan.kind === 'lent' ? amount : -amount, session);
      await new Transaction({
        userId: req.userId, type: 'repayment', amount, category: 'Repayment',
        accountId: loan.accountId, date: new Date(),
        description: `${loan.kind === 'lent' ? 'Received from' : 'Paid to'} ${loan.person}`,
      }).save({ session });
    });
    res.json({ loan });
  } catch (e) { next(e); } finally { session.endSession(); }
}

export async function remove(req, res, next) {
  try {
    const loan = await Loan.findOneAndDelete({ _id: req.params.id, userId: req.userId });
    if (!loan) return res.status(404).json({ message: 'Loan not found' });
    res.json({ ok: true });
  } catch (e) { next(e); }
}
