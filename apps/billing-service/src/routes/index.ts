
import { stripeRouter } from './stripe';
import { Router } from 'express';

const router = Router();

router.use('/stripe', stripeRouter);

export default router;
