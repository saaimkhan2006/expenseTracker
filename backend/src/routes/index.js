import express from 'express';
import { body } from 'express-validator';
import { auth } from '../middleware/auth.js';
import * as authC from '../controllers/authController.js';
import * as accC from '../controllers/accountController.js';
import * as catC from '../controllers/categoryController.js';
import * as txC from '../controllers/transactionController.js';
import * as dashC from '../controllers/dashboardController.js';

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

export default router;
