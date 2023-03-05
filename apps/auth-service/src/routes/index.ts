import express from 'express';
import { signupRouter } from './singup';
import { getUsers } from './getUsers';
import { currentUserRouter } from './current-user';
import { signinRouter } from './singin';

const router = express.Router();

router.use('/', signupRouter);
router.use('/', getUsers);
router.use('/', currentUserRouter);
router.use('/', signinRouter);

export {router as authRouter};
