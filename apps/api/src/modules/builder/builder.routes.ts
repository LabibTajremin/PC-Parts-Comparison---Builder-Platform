import { Router } from 'express';
import { validateBuild, getBuildSummary } from './builder.controller';

const router = Router();

router.post('/validate', validateBuild);
router.post('/summary', getBuildSummary);

export default router;
