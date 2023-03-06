import express from 'express';
import cookieSession from 'cookie-session';

import routes from './routes';
import { currentUser } from './middleware/current-user';
import { NotFoundError } from './errors/not-found-request';

const app = express();

app.use(cookieSession({ signed: false, secure: false }));
app.use(express.json());
app.use(currentUser);

app.use('/products', routes);

app.all('*', (req, res) => {
  return NotFoundError(res)
});

app.listen(3000, () => {
  console.log('Server listening on port 3000')
})