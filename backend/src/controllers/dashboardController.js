const Account = require('../models/Account');
const Transaction = require('../models/Transaction');
const { monthRange, summarize } = require('../utils/finance');

async function dashboard(req, res, next) {
  try {
    const now = new Date();
    const year = Number(req.query.year) || now.getFullYear();
    const month = Number(req.query.month) || now.getMonth() + 1;
    const { start, end } = monthRange(year, month);
    const accounts = await Account.find({ userId: req.userId, isActive: true });
    const totalBalance = accounts.reduce((s, a) => s + a.balance, 0);
    const txs = await Transaction.find({ userId: req.userId, date: { $gte: start, $lte: end } });
    const monthly = summarize(txs);
    const recent = await Transaction.find({ userId: req.userId }).sort({ date: -1, createdAt: -1 }).limit(8);
    res.json({ totalBalance, accounts, monthly, recent, period: { year, month } });
  } catch (e) { next(e); }
}

module.exports = { dashboard };
