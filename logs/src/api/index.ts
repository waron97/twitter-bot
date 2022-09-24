import { Router } from 'express';

const appRouter = Router();

appRouter.get('/', (req, res) => {
  res.send('Server alive');
});

export default appRouter;
