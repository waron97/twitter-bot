import * as bodyParser from 'body-parser';
import * as cors from 'cors';
import * as express from 'express';
import mongoose from 'mongoose';

import appRouter from './api';
import appEnv from './constants/env';
import { mongoUri } from './constants/mongo';
import initTwitterCron from './services/twitter';

mongoose.connect(mongoUri).then(() => {
  initTwitterCron();
});

const app = express();

app.use(cors());
app.use(bodyParser.json());
app.use(appRouter);
app.use(express.static('static'));

app.listen(appEnv.port, () => {
  // eslint-disable-next-line
  console.log(`Bot service listening on port ${appEnv.port}`);
});

export default app;
