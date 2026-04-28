import { Router } from 'express';
import { getBuildAdvice, checkCompatibility } from './ai.controller';
import { aiRateLimit } from '../../middleware/rateLimit.middleware';

const router = Router();

router.post('/advisor', aiRateLimit, getBuildAdvice);
router.post('/compatibility-check', aiRateLimit, checkCompatibility);

export default router;
