const express = require('express');
const { body } = require('express-validator');
const auth = require('../middleware/auth');
const authC = require('../controllers/authController');
const accC = require('../controllers/accountController');
const catC = require('../controllers/categoryController');
const txC = require('../controllers/transactionController');
const dashC = require('../controllers/dashboardController');

const router = express.Router();

router.post('/auth/register', body('email').isEmail(), body('password').isLength({ min: 6 }), (req, res, next) => authC.register(req, res, next));
router.post('/auth/login', (req, res, next) => authC.login(req, res, next));
router.get('/auth/me', auth, (req, res, next) => authC.me(req, res, next));

router.get('/dashboard', auth, (req, res, next) => dashC.dashboard(req, res, next));

router.get('/accounts', auth, accC.list);
router.post('/accounts', auth, accC.create);
router.put('/accounts/:id', auth, accC.update);

router.get('/categories', auth, catC.list);
router.post('/categories', auth, catC.create);

router.get('/transactions', auth, txC.list);
router.post('/transactions', auth, txC.create);
router.post('/transactions/sync', auth, txC.syncBulk);
router.put('/transactions/:id', auth, txC.update);
router.delete('/transactions/:id', auth, txC.remove);

router.get('/health', (req, res) => res.json({ ok: true }));

module.exports = router;
