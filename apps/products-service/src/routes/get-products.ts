
import { prisma } from '../utils';
import { Router } from 'express';

const getProductRouter = Router();

getProductRouter.get('/', async (req, res) => {
  const products = await prisma.product.findMany({
    where: {
      active: true
    },
    include: {
      prices: {
        where: {
          active: true
        }
      }
    }
  })

  return res.json({ products })
});

export {getProductRouter};
