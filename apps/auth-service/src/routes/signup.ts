import { prisma } from '../utils';
import { Request, Response, Router } from 'express';
import { Kafka } from 'kafkajs';
import * as yup from 'yup';
import jwt from 'jsonwebtoken';
import { validate } from '../middleware/validate-request';
import { BadRequestError } from '../errors/bad-request';

const kafka = new Kafka({
  clientId: 'auth-service',
  brokers: [
  'kafka:9092', 
  'localhost:9092']
})

const producer = kafka.producer()

const signupRouter = Router();

signupRouter.post('/signup', 
  validate(yup.object({
    body: yup.object({
      name: yup.string().required('Name must be valid'),
      email: yup.string().email().required('Email must be valid'),
      password: yup.string().min(4).required('Password must be between 4 and 20 characters'),
    })
  })),
  async (req: Request, res: Response) => {
    const { name, email, password } = req.body;

    const existingUser = await prisma.user.findFirst({
      where: { 
        email
      },
    });

    if (existingUser) {
      return BadRequestError(res, 'That email or username is already in use');
    }

    const user = await prisma.user.create({
      data:{
        email,
        password,
        name
      }
    })

    const userJwt = jwt.sign(
      {
        id: user.id,
      },
      process.env.JWT_KEY!
    );

    req.session = { jwt: userJwt };

    try {
      const admin = kafka.admin()

      await admin.connect()

      await producer.connect()

      await producer.send({
        topic: 'user-created',
        messages: [
          { value: JSON.stringify(user) }
        ]
      })

      await producer.disconnect()

      return res.status(201).send({ user })
    } catch (error) {
      console.error(`Error sending message to Kafka: ${error}`)
      return res.status(500).send({ message: 'Error creating user' })
    }
  }
);

export { signupRouter }