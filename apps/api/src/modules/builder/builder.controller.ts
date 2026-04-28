import { Request, Response, NextFunction } from 'express';
import { BuilderService } from './builder.service';

const service = new BuilderService();

export async function validateBuild(req: Request, res: Response, next: NextFunction) {
  try {
    const { selectedComponents } = req.body as { selectedComponents: Record<string, string> };
    const result = await service.validateBuild(selectedComponents || {});
    res.json({ success: true, data: result });
  } catch (err) {
    next(err);
  }
}

export async function getBuildSummary(req: Request, res: Response, next: NextFunction) {
  try {
    const { selectedComponents } = req.body as { selectedComponents: Record<string, string> };
    const result = await service.getBuildSummary(selectedComponents || {});
    res.json({ success: true, data: result });
  } catch (err) {
    next(err);
  }
}
