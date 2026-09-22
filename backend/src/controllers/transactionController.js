import mongoose from 'mongoose';
import Transaction from '../models/Transaction.js';
import Account from '../models/Account.js';

async function adjustBalance(accountId, userId, delta, session) {
  const acc = await Account.findOneAndUpdate(
    { _id: accountId, userId },
    { $inc: { balance: delta, version: 1 } },
    { new: true, session }
  );
  if (!acc) {
    const err = new Error('Account not found');
    err.status = 400;
    throw err;
  }
  return acc;
}

function deltaFor(tx) {
  if (tx.type === 'income') return tx.amount;
  if (tx.type === 'expense') return -tx.amount;
  return 0;
}

export async function list(req, res, next) {
  try {
    const { type, category, accountId, from, to, q, limit = 100, skip = 0 } = req.query;
    const filter = { userId: req.userId };
    if (type) filter.type = type;
    if (category) filter.category = category;
    if (accountId) filter.accountId = accountId;
    if (from || to) {
      filter.date = {};
      if (from) filter.date.$gte = new Date(from);
      if (to) filter.date.$lte = new Date(to);
    }
    if (q) filter.description = { $regex: q, $options: 'i' };
    const transactions = await Transaction.find(filter).sort({ date: -1, createdAt: -1 }).limit(Number(limit)).skip(Number(skip));
    res.json({ transactions });
  } catch (e) { next(e); }
}

export async function create(req, res, next) {
  // Idempotent on clientId for offline retry safety (last-write-wins v1)
  const session = await mongoose.startSession();
  try {
    const { type, amount, category = 'Other', subcategory = '', accountId, date, time = '', description = '', tags = [], paymentMethod = '', clientId = null, deviceId = null } = req.body;
    if (!['expense', 'income', 'transfer', 'lending', 'borrowing', 'repayment'].includes(type)) return res.status(400).json({ message: 'Invalid type' });
    if (!amount || Number(amount) <= 0) return res.status(400).json({ message: 'amount must be > 0' });
    if (!accountId) return res.status(400).json({ message: 'accountId required' });
    if (clientId) {
      const existing = await Transaction.findOne({ userId: req.userId, clientId });
      if (existing) return res.json({ transaction: existing, deduped: true });
    }
    let tx;
    await session.withTransaction(async () => {
      tx = new Transaction({
        userId: req.userId, type, amount: Number(amount), category, subcategory, accountId,
        date: date ? new Date(date) : new Date(), time, description, tags, paymentMethod, clientId, deviceId, syncStatus: 'synced',
      });
      await tx.save({ session });
      await adjustBalance(accountId, req.userId, deltaFor(tx), session);
    });
    res.status(201).json({ transaction: tx });
  } catch (e) { next(e); } finally { session.endSession(); }
}

// Bulk sync endpoint: POST /api/transactions/sync { items: [...] }
export async function syncBulk(req, res, next) {
  try {
    const items = Array.isArray(req.body.items) ? req.body.items : [];
    const results = [];
    for (const item of items.slice(0, 200)) {
      if (item.clientId) {
        const existing = await Transaction.findOne({ userId: req.userId, clientId: item.clientId });
        if (existing) { results.push({ clientId: item.clientId, id: existing._id, deduped: true }); continue; }
      }
      if (!item.accountId || !item.amount) { results.push({ clientId: item.clientId, error: 'accountId/amount required' }); continue; }
      const session = await mongoose.startSession();
      try {
        let tx;
        await session.withTransaction(async () => {
          tx = new Transaction({
            userId: req.userId,
            type: item.type || 'expense',
            amount: Number(item.amount),
            category: item.category || 'Other',
            subcategory: item.subcategory || '',
            accountId: item.accountId,
            date: item.date ? new Date(item.date) : new Date(),
            time: item.time || '', description: item.description || '',
            tags: item.tags || [], paymentMethod: item.paymentMethod || '',
            clientId: item.clientId || null, deviceId: item.deviceId || null,
            syncStatus: 'synced',
          });
          await tx.save({ session });
          await adjustBalance(item.accountId, req.userId, deltaFor(tx), session);
        });
        results.push({ clientId: item.clientId, id: tx._id });
      } catch (e) {
        results.push({ clientId: item.clientId, error: e.message });
      } finally { session.endSession(); }
    }
    res.json({ results });
  } catch (e) { next(e); }
}

export async function remove(req, res, next) {
  const session = await mongoose.startSession();
  try {
    const tx = await Transaction.findOne({ _id: req.params.id, userId: req.userId });
    if (!tx) return res.status(404).json({ message: 'Transaction not found' });
    await session.withTransaction(async () => {
      await adjustBalance(tx.accountId, req.userId, -deltaFor(tx), session);
      await tx.deleteOne({ session });
    });
    res.json({ ok: true });
  } catch (e) { next(e); } finally { session.endSession(); }
}

export async function update(req, res, next) {
  // Simple last-write-wins: reverse old delta, apply new one.
  const session = await mongoose.startSession();
  try {
    const tx = await Transaction.findOne({ _id: req.params.id, userId: req.userId });
    if (!tx) return res.status(404).json({ message: 'Transaction not found' });
    await session.withTransaction(async () => {
      await adjustBalance(tx.accountId, req.userId, -deltaFor(tx), session);
      const allowed = ['amount', 'category', 'subcategory', 'description', 'tags', 'date', 'time', 'paymentMethod'];
      for (const k of allowed) if (req.body[k] !== undefined) tx[k] = req.body[k];
      tx.version += 1;
      await tx.save({ session });
      await adjustBalance(tx.accountId, req.userId, deltaFor(tx), session);
    });
    res.json({ transaction: tx });
  } catch (e) { next(e); } finally { session.endSession(); }
}
