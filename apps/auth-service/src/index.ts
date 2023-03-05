import express from 'express';
import cookieSession from 'cookie-session';

import { signupRouter } from './routes/singup';
import { getUsers } from './routes/getUsers';
import { signinRouter } from './routes/singin';
import { currentUser } from './middleware/current-user';
import { currentUserRouter } from './routes/current-user';
import { NotFoundError } from './errors/not-found-request';
import { authRouter } from './routes';

const app = express();

app.use(cookieSession({ signed: false, secure: false }));
app.use(express.json());
app.use(currentUser);

app.use('/auth', authRouter);

app.all('*', (req,res) => {
  return NotFoundError(res)
});

app.listen(3000, () => {
  console.log('Server listening on port 3000')
})