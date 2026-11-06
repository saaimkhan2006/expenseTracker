import express from 'express';
import authRoutes from './authRoutes.js';
import accountRoutes from './accountRoutes.js';
import transactionRoutes from './transactionRoutes.js';
import categoryRoutes from './categoryRoutes.js';
import budgetRoutes from './budgetRoutes.js';
import transferRoutes from './transferRoutes.js';
import loanRoutes from './loanRoutes.js';
import subscriptionRoutes from './subscriptionRoutes.js';
import goalRoutes from './goalRoutes.js';
import dashboardRoutes from './dashboardRoutes.js';
import healthRoutes from './healthRoutes.js';

const router = express.Router();

// System & Health
router.use('/health', healthRoutes);

// Authentication & Identity
router.use('/auth', authRoutes);

// Financial Ledger & Rails
router.use('/accounts', accountRoutes);
router.use('/transactions', transactionRoutes);
router.use('/categories', categoryRoutes);
router.use('/transfers', transferRoutes);

// Planning & Commitments
router.use('/budgets', budgetRoutes);
router.use('/loans', loanRoutes);
router.use('/subscriptions', subscriptionRoutes);
router.use('/goals', goalRoutes);

// Analytics & Aggregates
router.use('/dashboard', dashboardRoutes);

export default router;
