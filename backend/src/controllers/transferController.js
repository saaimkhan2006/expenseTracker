import mongoose from 'mongoose';
import Transaction from '../models/Transaction.js';
import Account from '../models/Account.js';

// POST /api/transfers — atomic balance move. Never touches income/expense stats.
export async function create(req, res, next) {
  const session = await mongoose.startSession();
  try {
    const { fromAccountId, toAccountId, amount, description = '', date, clientId = null, deviceId = null } = req.body;
    if (!fromAccountId || !toAccountId) return res.status(400).json({ message: 'fromAccountId and toAccountId required' });
    if (fromAccountId === toAccountId) return res.status(400).json({ message: 'Accounts must differ' });
    if (!amount || Number(amount) <= 0) return res.status(400).json({ message: 'amount must be > 0' });
    if (clientId) {
      const existing = await Transaction.findOne({ userId: req.userId, clientId });
      if (existing) return res.json({ transaction: existing, deduped: true });
    }
    let tx;
    await session.withTransaction(async () => {
      const from = await Account.findOneAndUpdate(
        { _id: fromAccountId, userId: req.userId },
        { $inc: { balance: -Number(amount), version: 1 } },
        { new: true, session }
      );
      if (!from) throw Object.assign(new Error('Source account not found'), { status: 400 });
      const to = await Account.findOneAndUpdate(
        { _id: toAccountId, userId: req.userId },
        { $inc: { balance: Number(amount), version: 1 } },
        { new: true, session }
      );
      if (!to) throw Object.assign(new Error('Destination account not found'), { status: 400 });
      tx = new Transaction({
        userId: req.userId, type: 'transfer', amount: Number(amount),
        category: 'Transfer', accountId: fromAccountId, toAccountId,
        date: date ? new Date(date) : new Date(), description,
        clientId, deviceId, syncStatus: 'synced',
      });
      await tx.save({ session });
    });
    res.status(201).json({ transaction: tx });
  } catch (e) { next(e); } finally { session.endSession(); }
}
