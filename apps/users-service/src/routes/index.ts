
import { prisma } from '../utils';
import { Router } from 'express';
import { Kafka } from 'kafkajs';

const router = Router();

const kafka = new Kafka({
  clientId: 'my-app',
  brokers: ['localhost:9092']
})

const producer = kafka.producer()

router.get('/', (req, res) => {
  return res.json({ id: 1 })
});

router.post('/register', async (req, res) => {
  const { name, email } = req.body;

  try {
    await producer.connect()

    await producer.send({
      topic: 'user-created',
      messages: [
        { value: JSON.stringify({ name, email }) }
      ]
    })
    await producer.disconnect()

    res.status(201).send({ id: 1 })
  } catch (error) {
    console.error(`Error sending message to Kafka: ${error}`)
    res.status(500).send({ message: 'Error creating user' })
  }
});

export default router;
