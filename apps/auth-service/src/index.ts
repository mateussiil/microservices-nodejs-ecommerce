import express from 'express';
import cookieSession from 'cookie-session';
import cors from 'cors';

import { currentUser } from './middleware/current-user';
import { NotFoundError } from './errors/not-found-request';
import { authRouter } from './routes';

const app = express();

app.use(cors({
  origin: '*',
}))

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