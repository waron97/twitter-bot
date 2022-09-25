import { RequestHandler } from 'express';
import * as cachehandler from 'memory-cache';

export const mcache = (duration: number) => {
  const middleware: RequestHandler = (req, res, next) => {
    const key = `__express__${req.originalUrl}`;
    const body = cachehandler.get(key);
    if (body) {
      res.send(body).end();
    } else {
      req.registerCachedContent = (content) => {
        cachehandler.put(key, content, duration * 1000);
      };
      next();
    }
  };

  return middleware;
};
