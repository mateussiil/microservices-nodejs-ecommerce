import config from '../../../config';
import * as yup from 'yup';
import { requireAuth } from '../../middleware/require-auth';
import { validate } from '../../middleware/validate-request';
import { prisma, stripe } from '../../utils';
import { getCustomerId } from '../../utils/stripe';
import { Router } from 'express';

const createCheckoutSessionRoute = Router();

createCheckoutSessionRoute.post('/',
  validate(yup.object({
    body: yup.object({
      price: yup.string().required('Missing parameter price'),
    })
  })),
  requireAuth,
  async (req, res) => {
    const { price, quantity = 1, metadata = {} } = req.body;

    const userId = req.currentUser?.id!;

    const customerId = await getCustomerId(userId);

    const checkoutSession = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      billing_address_collection: 'required',
      customer: customerId,
      client_reference_id: userId,
      line_items: [
        {
          price: price,
          quantity: 1,
        },
      ],
      mode: 'subscription',
      allow_promotion_codes: true,
      subscription_data: {
        trial_from_plan: true,
        metadata: {},
      },
      success_url: `${config.AUTH_URL}/account`,
      cancel_url: `${config.AUTH_URL}/`,
    });

    return res.status(200).json({ sessionId: checkoutSession.id });
  }
);

export default createCheckoutSessionRoute;
