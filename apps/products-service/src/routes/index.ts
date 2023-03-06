
import { stripeRouter } from './stripe/webhook';
import { Router } from 'express';
import { getProductRouter } from './get-products';

const router = Router();

router.use('/stripe', stripeRouter);
router.use('/', getProductRouter);

export default router;
