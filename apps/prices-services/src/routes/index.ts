
import { stripeRouter } from '@app/src/routes/stripe/webhook';
import { prisma } from '../utils';
import { Router } from 'express';
import { Kafka } from 'kafkajs';

const router = Router();

const kafka = new Kafka({
  clientId: 'users-service',
  brokers: ['kafka:9092', 'localhost:9092']
})

const producer = kafka.producer()

router.get('/', async (req, res) => {
  const products = await prisma.product.findMany({
    where: {
      active: true
    }
  })

  return res.json({ products })
});

router.get('/stripe/weebhook', stripeRouter);

router.post('/products', async (req, res) => {
  const { name, email } = req.body;

  try {
    const admin = kafka.admin()

    await admin.connect()

    await producer.connect()

    await producer.send({
      topic: 'user-created',
      messages: [
        { value: JSON.stringify({ name, email }) }
      ]
    })
    await producer.disconnect()

    return res.status(201).send({ id: 1 })
  } catch (error) {
    console.error(`Error sending message to Kafka: ${error}`)
    return res.status(500).send({ message: 'Error creating user' })
  }
});

export default router;
