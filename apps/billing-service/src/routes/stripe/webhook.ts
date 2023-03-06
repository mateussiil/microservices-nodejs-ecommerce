import Stripe from 'stripe';
import { Router } from 'express';
import appConfig from '../../../config';
import { prisma, stripe } from '../../utils';
import { timestampToDate } from '../../utils/common';
import { SubscriptionStatus } from '@prisma/client';

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

const webhookRouter = Router();

webhookRouter.post('/', async (req, res) => {
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
        case 'customer.subscription.deleted': {
          const data = event.data.object as Stripe.Subscription;

          await prisma.subscription.delete({
            where: {
              id: data.id,
            },
          });
        }
        case 'customer.subscription.updated': {
          const data = event.data.object as Stripe.Subscription;

          await prisma.subscription.update({
            where: {
              id: data.id,
            },
            data: {
              priceId: data.items.data[0].price.id,
              status: data.status,
              metadata: data.metadata,
              cancel_at_period_end: data.cancel_at_period_end,
              canceled_at: timestampToDate(data.canceled_at!),
              cancel_at: timestampToDate(data.cancel_at!),
              start_date: timestampToDate(data.start_date!),
              ended_at: timestampToDate(data.ended_at!),
              trial_start: timestampToDate(data.trial_start!),
              trial_end: timestampToDate(data.trial_end!),
            },
          });
          break;
        }
        case 'checkout.session.completed':
          {
            const data = event.data.object as Stripe.Checkout.Session;

            const subscription = await stripe.subscriptions.retrieve(
              data.subscription as string,
              {
                expand: ['default_payment_method'],
              }
            );

            await prisma.subscription.upsert({
              where: {
                id: subscription.id,
              },
              create: {
                id: subscription.id,
                userId: data.client_reference_id!,
                priceId: subscription.items.data[0].price.id,
                status: subscription.status as SubscriptionStatus,
                metadata: subscription.metadata,
                cancel_at_period_end: subscription.cancel_at_period_end,
                canceled_at: timestampToDate(subscription.canceled_at!),
                cancel_at: timestampToDate(subscription.cancel_at!),
                start_date: timestampToDate(subscription.start_date!),
                ended_at: timestampToDate(subscription.ended_at!),
                trial_start: timestampToDate(subscription.trial_start!),
                trial_end: timestampToDate(subscription.trial_end!),
              },
              update: {
                status: subscription.status as SubscriptionStatus,
                metadata: subscription.metadata,
                priceId: subscription.items.data[0].price.id,
                cancel_at_period_end: subscription.cancel_at_period_end,
                canceled_at: timestampToDate(subscription.canceled_at!),
                cancel_at: timestampToDate(subscription.cancel_at!),
                start_date: timestampToDate(subscription.start_date!),
                ended_at: timestampToDate(subscription.ended_at!),
                trial_start: timestampToDate(subscription.trial_start!),
                trial_end: timestampToDate(subscription.trial_end!),
              },
            });
          }

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

export { webhookRouter };
