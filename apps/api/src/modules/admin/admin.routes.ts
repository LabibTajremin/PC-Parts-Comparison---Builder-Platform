import { Router } from 'express';
import { authMiddleware } from '../../middleware/auth.middleware';
import {
  login, getProducts, createProduct, updateProduct, deleteProduct,
  getVendors, createVendor, updateVendor, overridePrice, triggerPriceUpdate, getPriceLogs,
} from './admin.controller';

const router = Router();

router.post('/auth/login', login);

// Protected routes
router.use(authMiddleware as unknown as Parameters<typeof router.use>[0]);

router.get('/products', getProducts);
router.post('/products', createProduct);
router.put('/products/:id', updateProduct);
router.delete('/products/:id', deleteProduct);

router.get('/vendors', getVendors);
router.post('/vendors', createVendor);
router.put('/vendors/:id', updateVendor);

router.post('/prices/override', overridePrice);
router.post('/prices/trigger-update', triggerPriceUpdate);
router.get('/price-logs', getPriceLogs);

export default router;
