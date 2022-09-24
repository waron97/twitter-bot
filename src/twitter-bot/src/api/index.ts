import { Router } from 'express';

import tweetsRouter from './tweets';

const appRouter = Router();

appRouter.get('/', (req, res) => {
  res.send('Bot server alive');
});

appRouter.use('/tweets', tweetsRouter);

export default appRouter;
