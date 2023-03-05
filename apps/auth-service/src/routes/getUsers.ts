
import { prisma } from '../utils';
import { Router } from 'express';
import { Kafka } from 'kafkajs';
import { requireAuth } from '../middleware/require-auth';

const getUsers = Router();

getUsers.get(
  '/users', 
  requireAuth,
  async (req, res) => {
    const users = await prisma.user.findMany()
    
    return res.json({ users })
  }
);

export { getUsers };
