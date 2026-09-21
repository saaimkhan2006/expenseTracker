const Category = require('../models/Category');

async function list(req, res, next) {
  try {
    const filter = { userId: req.userId };
    if (req.query.kind) filter.kind = req.query.kind;
    const categories = await Category.find(filter).sort({ kind: 1, name: 1 });
    res.json({ categories });
  } catch (e) { next(e); }
}

async function create(req, res, next) {
  try {
    const { name, kind, icon = '📦', color = '#38bdf8' } = req.body;
    if (!name || !kind) return res.status(400).json({ message: 'name and kind required' });
    const cat = await Category.create({ userId: req.userId, name, kind, icon, color });
    res.status(201).json({ category: cat });
  } catch (e) {
    if (e.code === 11000) return res.status(409).json({ message: 'Category already exists' });
    next(e);
  }
}

module.exports = { list, create };
