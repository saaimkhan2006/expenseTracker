import Account from '../models/Account.js';
import { bootstrap } from './authController.js';

export async function list(req, res, next) {
  try {
    let accounts = await Account.find({ userId: req.userId, isActive: true }).sort({ createdAt: 1 });
    if (!accounts.length) {
      await bootstrap(req.userId);
      accounts = await Account.find({ userId: req.userId, isActive: true }).sort({ createdAt: 1 });
    }
    res.json({ accounts });
  } catch (e) { next(e); }
}

export async function create(req, res, next) {
  try {
    const { name, type = 'bank', openingBalance = 0, icon = '🏦', color = '#38bdf8' } = req.body;
    if (!name) return res.status(400).json({ message: 'name required' });
    const acc = await Account.create({
      userId: req.userId, name, type,
      openingBalance: Number(openingBalance) || 0,
      balance: Number(openingBalance) || 0,
      icon, color,
    });
    res.status(201).json({ account: acc });
  } catch (e) {
    if (e.code === 11000) return res.status(409).json({ message: 'Account name already exists' });
    next(e);
  }
}

export async function update(req, res, next) {
  try {
    const acc = await Account.findOneAndUpdate(
      { _id: req.params.id, userId: req.userId },
      { $set: req.body, $inc: { version: 1 } },
      { new: true }
    );
    if (!acc) return res.status(404).json({ message: 'Account not found' });
    res.json({ account: acc });
  } catch (e) { next(e); }
}
