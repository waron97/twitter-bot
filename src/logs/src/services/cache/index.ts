import { RequestHandler } from 'express';
import cachehandler from 'memory-cache';

export const mcache = (duration: number) => {
  const middleware: RequestHandler = (req, res, next) => {
    const key = `__express__${req.originalUrl}`;
    const body = cachehandler.get(key);
    if (body) {
      res.send(body);
      return;
    } else {
      const sendResponse = res.send;
      res.send = ((body: any) => {
        cachehandler.put(key, body, duration * 1000);
        sendResponse(body);
      }) as any;
    }
    next();
  };

  return middleware;
};
