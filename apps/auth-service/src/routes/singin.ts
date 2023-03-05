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
    // 'kafka:9092', 
  'localhost:9092']
})

const producer = kafka.producer()

const router = Router();

router.post('/signin', 
  validate(yup.object({
    body: yup.object({
      email: yup.string().email().required('Email must be valid'),
      password: yup.string().min(4).required('You must supply a password'),
    })
  })),
  async (req: Request, res: Response) => {
    const { email, password } = req.body;

    const existingUser = await prisma.user.findFirst({
      where: { 
        email
      },
    });

    if (!existingUser) {
      return BadRequestError(res, 'Invalid credentials');
    }

    if (existingUser.password !== password) {
      return BadRequestError(res, 'Invalid credentials');
    }
    
    const userJwt = jwt.sign(
      {
        id: existingUser.id,
        email: existingUser.email,
      },
      process.env.JWT_KEY!
    );

    req.session = { jwt: userJwt };

    res.status(200).send(existingUser);
  }
);

export { router as signinRouter }