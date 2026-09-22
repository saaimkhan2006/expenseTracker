import Account from '../models/Account.js';
import Transaction from '../models/Transaction.js';
import { monthRange, summarize } from '../utils/finance.js';
import { bootstrap } from './authController.js';

export async function dashboard(req, res, next) {
  try {
    const now = new Date();
    const year = Number(req.query.year) || now.getFullYear();
    const month = Number(req.query.month) || now.getMonth() + 1;
    const { start, end } = monthRange(year, month);
    let accounts = await Account.find({ userId: req.userId, isActive: true });
    if (!accounts.length) {
      await bootstrap(req.userId);
      accounts = await Account.find({ userId: req.userId, isActive: true });
    }
    const totalBalance = accounts.reduce((s, a) => s + a.balance, 0);
    const txs = await Transaction.find({ userId: req.userId, date: { $gte: start, $lte: end } });
    const monthly = summarize(txs);
    const recent = await Transaction.find({ userId: req.userId }).sort({ date: -1, createdAt: -1 }).limit(8);
    res.json({ totalBalance, accounts, monthly, recent, period: { year, month } });
  } catch (e) { next(e); }
}
