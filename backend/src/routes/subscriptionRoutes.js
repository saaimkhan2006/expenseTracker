import express from 'express';
import { auth } from '../middleware/auth.js';
import * as subC from '../controllers/subscriptionController.js';

const router = express.Router();

router.use(auth);

router.get('/', subC.list);
router.post('/', subC.create);
router.put('/:id', subC.update);
router.delete('/:id', subC.remove);

export default router;

