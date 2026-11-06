import express from 'express';
import { auth } from '../middleware/auth.js';
import * as loanC from '../controllers/loanController.js';

const router = express.Router();

router.use(auth);

router.get('/', loanC.list);
router.post('/', loanC.create);
router.post('/:id/repay', loanC.repay);
router.delete('/:id', loanC.remove);

export default router;

