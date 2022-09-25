import { Router } from 'express';

import { apiKey } from '../../services/auth/apiKey';
import { mcache } from '../../services/cache';
import { pagination } from '../../services/pagination';
import { create, getAppIds, index } from './controller';
import { validate } from './validate';

const router = Router();

router.get('/', apiKey(), pagination(), index);

router.get('/app-ids', apiKey(), mcache(5), getAppIds);

router.post('/', apiKey(), validate, create);

export default router;
