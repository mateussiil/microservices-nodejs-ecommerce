import { PrismaClient } from '@prisma/client';
import Stripe from 'stripe';

const prisma = new PrismaClient();
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2022-11-15',
});

async function main() {
  const products = await stripe.products.list();

  await Promise.all(
    products.data.map((each) =>
      prisma.product.upsert({
        where: {
          id: each.id,
        },
        create: {
          id: each.id,
          name: each.name,
          description: each.description,
          active: each.active,
          image: each.images?.[0],
          metadata: each.metadata,
        },
        update: {
          name: each.name,
          description: each.description,
          active: each.active,
          image: each.images?.[0],
          metadata: each.metadata,
        },
      })
    )
  );
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
