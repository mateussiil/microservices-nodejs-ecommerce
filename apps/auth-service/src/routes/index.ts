import express from 'express';
import { signupRouter } from './signup';
import { getUsers } from './getUsers';
import { currentUserRouter } from './current-user';
import { signinRouter } from './signin';
import { signoutRouter } from './signout';

const router = express.Router();

router.use('/', signupRouter);
router.use('/', getUsers);
router.use('/', currentUserRouter);
router.use('/', signinRouter);
router.use('/', signoutRouter);

export {router as authRouter};
