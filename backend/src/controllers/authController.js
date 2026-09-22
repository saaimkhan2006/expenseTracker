import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import Category from '../models/Category.js';
import Account from '../models/Account.js';

const DEFAULT_EXPENSE_CATS = [
  ['Food', '🍔', '#f87171'], ['Transport', '🚕', '#fb923c'], ['Shopping', '🛍️', '#f472b6'],
  ['Rent', '🏠', '#a78bfa'], ['Bills', '🧾', '#38bdf8'], ['Education', '📚', '#34d399'],
  ['Health', '🏥', '#fbbf24'], ['Entertainment', '🎬', '#c084fc'], ['Travel', '✈️', '#22d3ee'],
  ['Technology', '💻', '#60a5fa'], ['Clothing', '👕', '#e879f9'], ['Subscriptions', '🔁', '#4ade80'],
  ['Other', '📦', '#94a3b8'],
];
const DEFAULT_INCOME_CATS = [
  ['Salary', '💼', '#22c55e'], ['Freelancing', '💻', '#38bdf8'], ['Business', '🏪', '#a3e635'],
  ['Scholarship', '🎓', '#facc15'], ['Allowance', '🎁', '#f472b6'], ['Investment', '📈', '#34d399'],
  ['Gift', '🎉', '#c084fc'], ['Other', '📦', '#94a3b8'],
];

function sign(userId) {
  return jwt.sign({ sub: userId }, process.env.JWT_SECRET || 'dev-secret', { expiresIn: '7d' });
}

async function bootstrap(userId) {
  const cats = [
    ...DEFAULT_EXPENSE_CATS.map(([name, icon, color]) => ({ userId, name, kind: 'expense', icon, color, isDefault: true })),
    ...DEFAULT_INCOME_CATS.map(([name, icon, color]) => ({ userId, name, kind: 'income', icon, color, isDefault: true })),
  ];
  await Category.insertMany(cats, { ordered: false }).catch(() => {});
  const existing = await Account.findOne({ userId });
  if (!existing) {
    await Account.create({ userId, name: 'Cash', type: 'cash', openingBalance: 0, balance: 0, icon: '💵', color: '#22c55e' });
  }
}

export async function register(req, res, next) {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) return res.status(400).json({ message: 'name, email, password required' });
    if (password.length < 6) return res.status(400).json({ message: 'Password must be 6+ characters' });
    const exists = await User.findOne({ email: email.toLowerCase() });
    if (exists) return res.status(409).json({ message: 'Email already registered' });
    const passwordHash = await bcrypt.hash(password, 10);
    const user = await User.create({ name, email: email.toLowerCase(), passwordHash });
    await bootstrap(user._id);
    res.status(201).json({ token: sign(user._id), user: { id: user._id, name, email: user.email } });
  } catch (e) { next(e); }
}

export async function login(req, res, next) {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email: (email || '').toLowerCase() });
    if (!user) return res.status(401).json({ message: 'Invalid credentials' });
    const ok = await bcrypt.compare(password, user.passwordHash);
    if (!ok) return res.status(401).json({ message: 'Invalid credentials' });
    res.json({ token: sign(user._id), user: { id: user._id, name: user.name, email: user.email } });
  } catch (e) { next(e); }
}

export async function me(req, res, next) {
  try {
    const user = await User.findById(req.userId).select('_id name email currency createdAt');
    res.json({ user });
  } catch (e) { next(e); }
}
