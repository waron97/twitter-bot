import { Router } from 'express';

import Logger from '../../services/logs';

const router = Router();

router.get('/', (req, res) => {
  Logger.debug('/tweets', 'GET endpoint invoked');
  res.send('ok');
});

export default router;
