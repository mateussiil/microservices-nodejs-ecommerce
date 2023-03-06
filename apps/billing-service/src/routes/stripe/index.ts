
import { Router } from 'express';
import { webhookRouter } from './webhook';
import { createPortalRoute } from './create-portal';
import createCheckoutSessionRoute from './create-checkout-session';

const stripeRouter = Router();

stripeRouter.use('/webhook', webhookRouter);
stripeRouter.use('/create-portal', createPortalRoute);
stripeRouter.use('/create-checkout-session', createCheckoutSessionRoute);

export { stripeRouter };
