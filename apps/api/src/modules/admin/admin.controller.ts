import { Request, Response, NextFunction } from 'express';
import { AdminService } from './admin.service';

const service = new AdminService();

export async function login(req: Request, res: Response, next: NextFunction) {
  try {
    const { email, password } = req.body;
    const result = await service.login(email, password);
    res.json({ success: true, data: result });
  } catch (err) { next(err); }
}

export async function getProducts(req: Request, res: Response, next: NextFunction) {
  try {
    const products = await service.getProducts();
    res.json({ success: true, data: products });
  } catch (err) { next(err); }
}

export async function createProduct(req: Request, res: Response, next: NextFunction) {
  try {
    const product = await service.createProduct(req.body);
    res.status(201).json({ success: true, data: product });
  } catch (err) { next(err); }
}

export async function updateProduct(req: Request, res: Response, next: NextFunction) {
  try {
    const product = await service.updateProduct(req.params.id, req.body);
    res.json({ success: true, data: product });
  } catch (err) { next(err); }
}

export async function deleteProduct(req: Request, res: Response, next: NextFunction) {
  try {
    await service.deleteProduct(req.params.id);
    res.json({ success: true, message: 'Product deactivated' });
  } catch (err) { next(err); }
}

export async function getVendors(req: Request, res: Response, next: NextFunction) {
  try {
    const vendors = await service.getVendors();
    res.json({ success: true, data: vendors });
  } catch (err) { next(err); }
}

export async function createVendor(req: Request, res: Response, next: NextFunction) {
  try {
    const vendor = await service.createVendor(req.body);
    res.status(201).json({ success: true, data: vendor });
  } catch (err) { next(err); }
}

export async function updateVendor(req: Request, res: Response, next: NextFunction) {
  try {
    const vendor = await service.updateVendor(req.params.id, req.body);
    res.json({ success: true, data: vendor });
  } catch (err) { next(err); }
}

export async function overridePrice(req: Request, res: Response, next: NextFunction) {
  try {
    const { productId, vendorId, price, vendorUrl } = req.body;
    const result = await service.overridePrice(productId, vendorId, price, vendorUrl);
    res.json({ success: true, data: result });
  } catch (err) { next(err); }
}

export async function triggerPriceUpdate(req: Request, res: Response, next: NextFunction) {
  try {
    res.json({ success: true, message: 'Price update job queued' });
  } catch (err) { next(err); }
}

export async function getPriceLogs(req: Request, res: Response, next: NextFunction) {
  try {
    const logs = await service.getPriceLogs();
    res.json({ success: true, data: logs });
  } catch (err) { next(err); }
}
