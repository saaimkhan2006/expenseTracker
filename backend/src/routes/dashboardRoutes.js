import express from 'express';
import { auth } from '../middleware/auth.js';
import * as dashC from '../controllers/dashboardController.js';

const router = express.Router();

router.use(auth);

router.get('/', (req, res, next) => dashC.dashboard(req, res, next));

export default router;

