import express from 'express';
import { auth } from '../middleware/auth.js';
import * as goalC from '../controllers/goalController.js';

const router = express.Router();

router.use(auth);

router.get('/', goalC.list);
router.post('/', goalC.create);
router.put('/:id', goalC.update);
router.post('/:id/deposit', goalC.deposit);
router.delete('/:id', goalC.remove);

export default router;

