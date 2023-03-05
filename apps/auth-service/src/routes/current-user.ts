import express, { Request, Response } from 'express';
import { currentUser } from '../middleware/current-user';
import { exclude } from '../utils/prisma';

const router = express.Router();

router.get(
  '/current-user',
  currentUser,
  async (req: Request, res: Response) => {
    if (!req.currentUser) {
      return res.send(null);
    }

    const currentUser = await prisma.user.findFirst({
      where: { id: req.currentUser.id },
    });

    if (currentUser) {
      const userWithoutPassword = exclude(currentUser, ['password'])

      return res.send({ user: userWithoutPassword });
    }

    return res.send({ user: currentUser });
  }
);

export { router as currentUserRouter };
