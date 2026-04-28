import { Router } from 'express';
import { getVendors, getVendorById } from './vendor.controller';

const router = Router();

router.get('/', getVendors);
router.get('/:id', getVendorById);

export default router;
