import express from 'express';
import { auth } from '../middleware/auth.js';
import * as accC from '../controllers/accountController.js';

const router = express.Router();

router.use(auth);

router.get('/', accC.list);
router.post('/', accC.create);
router.put('/:id', accC.update);

export default router;

