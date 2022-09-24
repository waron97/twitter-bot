import { Router } from 'express';

import logsRouter from './logs';

const appRouter = Router();

appRouter.get('/', (req, res) => {
  res.send('Server alive');
});

appRouter.use('/logs', logsRouter);

export default appRouter;
