import express from 'express';

import authRouter from './routes/auth';
import eventRouter from './routes/event';


const router = express.Router();

router.use('/auth', authRouter);
router.use('/events', eventRouter);

export default router;