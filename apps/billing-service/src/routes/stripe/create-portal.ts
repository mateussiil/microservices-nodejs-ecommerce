import config from '../../../config';
import { requireAuth } from '../../middleware/require-auth';
import { prisma, stripe } from '../../utils';
import { getCustomerId } from '../../utils/stripe';
import { Router } from 'express';

const createPortalRoute = Router();

createPortalRoute.post('/', 
  requireAuth,
  async (req, res) => {
    const userId = req.currentUser?.id!;

    const customerId = await getCustomerId(userId);

    // https://billing.stripe.com/p/login/test_00gcQ14N3dIP3Ti8ww
    const { url } = await stripe.billingPortal.sessions.create({
      customer: customerId,
      return_url: `${config.AUTH_URL}/account`,
    });

    return res.status(200).json({ url });
  }
);

export { createPortalRoute };
