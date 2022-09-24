import { Router } from 'express';

import { apiKey } from '../../services/auth/apiKey';
import { pagination } from '../../services/pagination';
import { create, index } from './controller';
import { validate } from './validate';

const router = Router();

router.get('/', apiKey(), pagination(), index);

router.post('/', apiKey(), validate, create);

export default router;
