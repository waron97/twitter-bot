import { RequestHandler } from 'express';

import appEnv from '../../constants/env';

export const apiKey: () => RequestHandler = () => (req, res, next) => {
  const { authorization } = req.headers;

  const authFail = () =>
    res.status(401).json({
      error: 'INVALID_API_KEY',
      message: 'No API key or invalid API key provided.',
    });

  if (!authorization) {
    authFail();
    return;
  }

  const apiKey = authorization?.split?.('apiKey ')?.[1];

  if (apiKey && apiKey === appEnv.apiKey) {
    next();
  } else {
    authFail();
  }
};
