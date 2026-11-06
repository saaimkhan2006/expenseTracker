import express from 'express';
import { auth } from '../middleware/auth.js';
import * as txC from '../controllers/transactionController.js';

const router = express.Router();

router.use(auth);

router.get('/', txC.list);
router.post('/', txC.create);
router.post('/sync', txC.syncBulk);
router.put('/:id', txC.update);
router.delete('/:id', txC.remove);

export default router;

