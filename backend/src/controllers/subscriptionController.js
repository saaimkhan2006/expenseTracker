import mongoose from 'mongoose';
import Subscription from '../models/Subscription.js';
import Transaction from '../models/Transaction.js';
import Account from '../models/Account.js';

function advance(date, cycle) {
  const d = new Date(date);
  if (cycle === 'daily') d.setDate(d.getDate() + 1);
  else if (cycle === 'weekly') d.setDate(d.getDate() + 7);
  else if (cycle === 'yearly') d.setFullYear(d.getFullYear() + 1);
  else d.setMonth(d.getMonth() + 1);
  return d;
}

// Lazily post every elapsed billing cycle as an expense (bounded loop).
async function chargeDue(sub, userId) {
  let charged = 0;
  const now = new Date();
  let next = new Date(sub.nextBilling);
  while (sub.active && next <= now && charged < 24) {
    const session = await mongoose.startSession();
    try {
      const billingDate = new Date(next);
      await session.withTransaction(async () => {
        await Account.findOneAndUpdate(
          { _id: sub.accountId, userId },
          { $inc: { balance: -sub.amount, version: 1 } },
          { session }
        );
        await new Transaction({
          userId, type: 'expense', amount: sub.amount, category: sub.category,
          accountId: sub.accountId, date: billingDate,
          description: `${sub.name} (${sub.cycle})`,
          recurringId: String(sub._id),
        }).save({ session });
        next = advance(next, sub.cycle);
        sub.nextBilling = next;
        await sub.save({ session });
      });
      charged += 1;
    } finally {
      session.endSession();
    }
  }
  return charged;
}

export async function list(req, res, next) {
  try {
    const subs = await Subscription.find({ userId: req.userId }).sort({ nextBilling: 1 });
    let charged = 0;
    for (const s of subs) charged += await chargeDue(s, req.userId);
    const monthly = subs.filter((s) => s.active)
      .reduce((sum, s) => sum + (s.cycle === 'monthly' ? s.amount : s.cycle === 'yearly' ? s.amount / 12 : s.cycle === 'weekly' ? (s.amount * 52) / 12 : s.amount * 30), 0);
    res.json({ subscriptions: subs, monthly: Math.round(monthly), annual: Math.round(monthly * 12), charged });
  } catch (e) { next(e); }
}

export async function create(req, res, next) {
  try {
    const { name, amount, cycle = 'monthly', category = 'Subscriptions', accountId, nextBilling, icon = 'repeat' } = req.body;
    if (!name || !amount || Number(amount) <= 0) return res.status(400).json({ message: 'name and amount > 0 required' });
    if (!accountId) return res.status(400).json({ message: 'accountId required' });
    const sub = await Subscription.create({
      userId: req.userId, name, amount: Number(amount), cycle, category, accountId,
      nextBilling: nextBilling ? new Date(nextBilling) : advance(new Date(), cycle),
      icon,
    });
    res.status(201).json({ subscription: sub });
  } catch (e) { next(e); }
}

export async function update(req, res, next) {
  try {
    const allowed = ['name', 'amount', 'cycle', 'category', 'accountId', 'nextBilling', 'active', 'icon'];
    const patch = {};
    for (const k of allowed) if (req.body[k] !== undefined) patch[k] = req.body[k];
    const sub = await Subscription.findOneAndUpdate(
      { _id: req.params.id, userId: req.userId },
      { $set: patch, $inc: { version: 1 } },
      { new: true }
    );
    if (!sub) return res.status(404).json({ message: 'Subscription not found' });
    res.json({ subscription: sub });
  } catch (e) { next(e); }
}

export async function remove(req, res, next) {
  try {
    const sub = await Subscription.findOneAndDelete({ _id: req.params.id, userId: req.userId });
    if (!sub) return res.status(404).json({ message: 'Subscription not found' });
    res.json({ ok: true });
  } catch (e) { next(e); }
}
