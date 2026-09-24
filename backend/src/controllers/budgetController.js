import Budget from '../models/Budget.js';
import Transaction from '../models/Transaction.js';

function currentMonth() {
  const n = new Date();
  return `${n.getFullYear()}-${String(n.getMonth() + 1).padStart(2, '0')}`;
}

function monthBounds(month) {
  const [y, m] = month.split('-').map(Number);
  return { start: new Date(y, m - 1, 1), end: new Date(y, m, 0, 23, 59, 59, 999) };
}

// GET /api/budgets?month=YYYY-MM → envelopes with real spend computed
export async function list(req, res, next) {
  try {
    const month = req.query.month || currentMonth();
    const budgets = await Budget.find({ userId: req.userId, month }).sort({ category: 1 });
    const { start, end } = monthBounds(month);
    const spends = await Transaction.aggregate([
      { $match: { userId: req.userId, type: 'expense', date: { $gte: start, $lte: end } } },
      { $group: { _id: '$category', spent: { $sum: '$amount' } } },
    ]);
    const spentByCat = Object.fromEntries(spends.map((s) => [s._id, s.spent]));
    res.json({
      month,
      budgets: budgets.map((b) => ({
        ...b.toObject(),
        spent: spentByCat[b.category] || 0,
        remaining: b.cap - (spentByCat[b.category] || 0),
      })),
    });
  } catch (e) { next(e); }
}

export async function create(req, res, next) {
  try {
    const { category, cap, month = currentMonth() } = req.body;
    if (!category || !cap || Number(cap) <= 0) return res.status(400).json({ message: 'category and cap > 0 required' });
    const b = await Budget.create({ userId: req.userId, month, category, cap: Number(cap) });
    res.status(201).json({ budget: b });
  } catch (e) {
    if (e.code === 11000) return res.status(409).json({ message: 'Budget for this category and month already exists' });
    next(e);
  }
}

export async function update(req, res, next) {
  try {
    const b = await Budget.findOneAndUpdate(
      { _id: req.params.id, userId: req.userId },
      { ...(req.body.cap !== undefined ? { cap: Number(req.body.cap) } : {}), $inc: { version: 1 } },
      { new: true }
    );
    if (!b) return res.status(404).json({ message: 'Budget not found' });
    res.json({ budget: b });
  } catch (e) { next(e); }
}

export async function remove(req, res, next) {
  try {
    const b = await Budget.findOneAndDelete({ _id: req.params.id, userId: req.userId });
    if (!b) return res.status(404).json({ message: 'Budget not found' });
    res.json({ ok: true });
  } catch (e) { next(e); }
}
