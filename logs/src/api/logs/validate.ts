import { RequestHandler } from 'express';
import * as Yup from 'yup';

export const validate: RequestHandler = (req, res, next) => {
  const schema = Yup.object().shape({});

  schema.validate(req.body, { stripUnknown: true });
};
