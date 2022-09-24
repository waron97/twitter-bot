import { RequestHandler } from 'express';

import { paginated, success } from '../../services/responses';
import Log from './model';
import { processLogFilters } from './service';

export const index: RequestHandler = async (req, res, next) => {
  const filters = processLogFilters(req.query);
  const {
    pagination: { page, pageSize, limit, skip },
  } = req;
  const op = Log.find(filters);
  op.estimatedDocumentCount().then((size) => {
    op.skip(skip).limit(limit).then(paginated(res, { page, pageSize, size }));
  });
};

export const create: RequestHandler = (req, res, next) => {
  Log.create(req.body).then(success(res, 201)).catch(next);
};
