import { Request, Response, NextFunction } from 'express';
import { VendorService } from './vendor.service';
import { AppError } from '../../middleware/error.middleware';

const service = new VendorService();

export async function getVendors(req: Request, res: Response, next: NextFunction) {
  try {
    const vendors = await service.getAll();
    res.json({ success: true, data: vendors });
  } catch (err) {
    next(err);
  }
}

export async function getVendorById(req: Request, res: Response, next: NextFunction) {
  try {
    const vendor = await service.getById(req.params.id);
    if (!vendor) throw new AppError(404, 'Vendor not found');
    res.json({ success: true, data: vendor });
  } catch (err) {
    next(err);
  }
}
