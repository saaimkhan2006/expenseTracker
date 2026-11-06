import express from 'express';
import { body } from 'express-validator';
import { auth } from '../middleware/auth.js';
import * as authC from '../controllers/authController.js';

const router = express.Router();

router.post(
  '/register',
  body('email').isEmail().withMessage('Valid email required'),
  body('password').isLength({ min: 6 }).withMessage('Password must be 6+ characters'),
  body('name').trim().notEmpty().withMessage('Name is required'),
  (req, res, next) => authC.register(req, res, next)
);

router.post('/login', (req, res, next) => authC.login(req, res, next));
router.get('/me', auth, (req, res, next) => authC.me(req, res, next));
router.put('/me', auth, (req, res, next) => authC.updateMe(req, res, next));

export default router;

