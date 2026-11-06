import express from 'express';
import { auth } from '../middleware/auth.js';
import * as budgetC from '../controllers/budgetController.js';

const router = express.Router();

router.use(auth);

router.get('/', budgetC.list);
router.post('/', budgetC.create);
router.put('/:id', budgetC.update);
router.delete('/:id', budgetC.remove);

export default router;

