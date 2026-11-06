import express from 'express';
import { auth } from '../middleware/auth.js';
import * as transferC from '../controllers/transferController.js';

const router = express.Router();

router.use(auth);

router.post('/', transferC.create);

export default router;

