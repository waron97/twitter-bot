import { Router } from 'express';

import app from '../app';
import { apiKey } from '../services/auth/apiKey';
import logsRouter from './logs';

const appRouter = Router();

appRouter.get('/', (req, res) => {
  res.send('Server alive');
});

app.get('/validate-key', apiKey(), (req, res) => res.send('ok'));

appRouter.use('/logs', logsRouter);

export default appRouter;
