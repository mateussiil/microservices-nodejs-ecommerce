import Stripe from 'stripe';
import { Router } from 'express';
import appConfig from '../../../config';
import { prisma, stripe } from '../../utils';

// Stripe requires the raw body to construct the event.
export const config = {
  api: {
    bodyParser: false,
  },
};

async function buffer(readable: any) {
  const chunks = [];
  for await (const chunk of readable) {
    chunks.push(typeof chunk === 'string' ? Buffer.from(chunk) : chunk);
  }
  return Buffer.concat(chunks);
}

const relevantEvents = new Set([
  'product.created',
  'product.updated',
  'price.created',
  'price.updated',
  'checkout.session.completed',
  'customer.subscription.updated',
  'customer.subscription.deleted',
]);

const stripeRouter = Router();

stripeRouter.post('/webhook', async (req, res) => {
  const buf = await buffer(req);
  const sig = req.headers['stripe-signature'];
  let event;

  try {
    event = stripe.webhooks.constructEvent(
      buf,
      sig!,
      appConfig.STRIPE_WEBHOOK_SECRET!
    );
  } catch (err: any) {
    console.log(`❌ Error message: ${err?.message}`);
    return res.status(400).send(`Webhook Error: ${err?.message}`);
  }

  if (relevantEvents.has(event.type)) {
    try {
      switch (event.type) {
        case 'product.created':
        case 'product.updated':
          const data = event.data.object as Stripe.Product;
          await prisma.product.upsert({
            where: {
              id: data.id,
            },
            update: {
              name: data.name,
              description: data.description,
              active: data.active,
              metadata: data.metadata,
            },
            create: {
              id: data.id,
              name: data.name,
              description: data.description,
              active: data.active,
              metadata: data.metadata,
            },
          });
          break;
        default:
          throw new Error(`Unhandled relevant event! ${event.type}`);
      }
    } catch (error) {
      console.log(error);
      return res
        .status(400)
        .send('Webhook error: "Webhook handler failed. View logs."');
    }
  }

  res.json({ received: true });
});

export { stripeRouter };
