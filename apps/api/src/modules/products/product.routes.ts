import { Router } from 'express';
import { getProducts, getProductById, getProductPrices, getProductsByCategory, searchProducts } from './product.controller';

const router = Router();

router.get('/', getProducts);
router.get('/search', searchProducts);
router.get('/category/:category', getProductsByCategory);
router.get('/:id', getProductById);
router.get('/:id/prices', getProductPrices);

export default router;
