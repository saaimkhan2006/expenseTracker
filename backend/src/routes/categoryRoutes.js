import express from 'express';
import { auth } from '../middleware/auth.js';
import * as catC from '../controllers/categoryController.js';

const router = express.Router();

router.use(auth);

router.get('/', catC.list);
router.post('/', catC.create);

export default router;

