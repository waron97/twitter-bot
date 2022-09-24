import * as bodyParser from 'body-parser';
import * as cors from 'cors';
import * as express from 'express';

import appEnv from './constants/env';

const app = express();

app.use(cors());
app.use(bodyParser.json());

app.listen(appEnv.port, () => {
  // eslint-disable-next-line
  console.log(`Express server listening on port ${appEnv.port}`);
});

export default app;
