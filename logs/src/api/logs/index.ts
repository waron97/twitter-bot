import { Router } from 'express';

import { apiKey } from '../../services/auth/apiKey';
import { create, index } from './controller';

const router = Router();

router.get('/', apiKey(), index);

router.post('/', apiKey(), create);

export default router;
