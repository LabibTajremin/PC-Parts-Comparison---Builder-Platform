import { Request, Response, NextFunction } from 'express';
import { AIService } from './ai.service';

const service = new AIService();

export async function getBuildAdvice(req: Request, res: Response, next: NextFunction) {
  try {
    const { currentBuild, budget, useCase, availableProducts } = req.body;
    const result = await service.getBuildAdvice({ currentBuild, budget, useCase, availableProducts });
    res.json({ success: true, data: result });
  } catch (err) {
    next(err);
  }
}

export async function checkCompatibility(req: Request, res: Response, next: NextFunction) {
  try {
    const { component1, component2, issue } = req.body;
    const explanation = await service.explainCompatibility({ component1, component2, issue });
    res.json({ success: true, data: { explanation } });
  } catch (err) {
    next(err);
  }
}
