import mongoose from 'mongoose';
import Goal from '../models/Goal.js';
import Account from '../models/Account.js';
import Transaction from '../models/Transaction.js';

export async function list(req, res, next) {
  try {
    const goals = await Goal.find({ userId: req.userId }).sort({ createdAt: -1 });
    res.json({ goals });
  } catch (e) {
    next(e);
  }
}

export async function create(req, res, next) {
  try {
    const { name, target, current = 0, deadline, monthlyCommitment = 0, icon = 'flag', color = '#c3f400' } = req.body;
    if (!name || !target || Number(target) <= 0) {
      return res.status(400).json({ message: 'Goal name and target amount (> 0) are required.' });
    }
    const goal = await Goal.create({
      userId: req.userId,
      name: name.trim(),
      target: Number(target),
      current: Math.max(0, Number(current) || 0),
      deadline: deadline || null,
      monthlyCommitment: Math.max(0, Number(monthlyCommitment) || 0),
      icon,
      color,
      status: Number(current) >= Number(target) ? 'completed' : 'active',
    });
    res.status(201).json({ goal });
  } catch (e) {
    next(e);
  }
}

export async function update(req, res, next) {
  try {
    const { name, target, current, deadline, monthlyCommitment, icon, color, status } = req.body;
    const goal = await Goal.findOne({ _id: req.params.id, userId: req.userId });
    if (!goal) return res.status(404).json({ message: 'Goal not found' });

    if (name !== undefined) goal.name = name.trim();
    if (target !== undefined) goal.target = Number(target);
    if (current !== undefined) goal.current = Number(current);
    if (deadline !== undefined) goal.deadline = deadline;
    if (monthlyCommitment !== undefined) goal.monthlyCommitment = Number(monthlyCommitment);
    if (icon !== undefined) goal.icon = icon;
    if (color !== undefined) goal.color = color;
    if (status !== undefined) goal.status = status;
    else if (goal.current >= goal.target) goal.status = 'completed';
    else goal.status = 'active';

    await goal.save();
    res.json({ goal });
  } catch (e) {
    next(e);
  }
}

export async function deposit(req, res, next) {
  const session = await mongoose.startSession();
  try {
    const { amount, accountId } = req.body;
    const depositAmt = Number(amount);
    if (!depositAmt || depositAmt <= 0) {
      return res.status(400).json({ message: 'Valid deposit amount required' });
    }

    let updatedGoal;
    await session.withTransaction(async () => {
      const goal = await Goal.findOne({ _id: req.params.id, userId: req.userId }).session(session);
      if (!goal) throw Object.assign(new Error('Goal not found'), { status: 404 });

      if (accountId) {
        const acc = await Account.findOneAndUpdate(
          { _id: accountId, userId: req.userId },
          { $inc: { balance: -depositAmt } },
          { new: true, session }
        );
        if (!acc) throw Object.assign(new Error('Account not found'), { status: 404 });
      }

      goal.current += depositAmt;
      if (goal.current >= goal.target) goal.status = 'completed';
      await goal.save({ session });
      updatedGoal = goal;
    });

    res.json({ goal: updatedGoal });
  } catch (e) {
    next(e);
  } finally {
    session.endSession();
  }
}

export async function remove(req, res, next) {
  try {
    const goal = await Goal.findOneAndDelete({ _id: req.params.id, userId: req.userId });
    if (!goal) return res.status(404).json({ message: 'Goal not found' });
    res.json({ ok: true, id: req.params.id });
  } catch (e) {
    next(e);
  }
}

