import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import { connectDatabase, disconnectDatabase } from './shared/database';
import { getRedisClient } from './shared/redis';
import { logger } from './shared/logger';
import { errorMiddleware } from './middleware/error.middleware';
import { publicRateLimit } from './middleware/rateLimit.middleware';
import productRoutes from './modules/products/product.routes';
import vendorRoutes from './modules/vendors/vendor.routes';
import builderRoutes from './modules/builder/builder.routes';
import aiRoutes from './modules/ai/ai.routes';
import adminRoutes from './modules/admin/admin.routes';
import { schedulePriceUpdateJob } from './jobs/price-update.job';

const app = express();
const PORT = parseInt(process.env.API_PORT || '4000');

// Security middleware
app.use(helmet());
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true,
}));
app.use(compression());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health check
app.get('/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// API routes
app.use('/api/v1', publicRateLimit);
app.use('/api/v1/products', productRoutes);
app.use('/api/v1/vendors', vendorRoutes);
app.use('/api/v1/builder', builderRoutes);
app.use('/api/v1/ai', aiRoutes);
app.use('/api/v1/admin', adminRoutes);

// Error handler
app.use(errorMiddleware);

// Connect DB eagerly (non-blocking for serverless)
connectDatabase().catch((err) => logger.error('DB connection error', err));

// Connect redis (non-fatal)
try {
  getRedisClient();
} catch (err) {
  logger.warn('Redis unavailable, continuing without cache', err);
}

// Start server only when run directly (not on Vercel serverless)
if (process.env.NODE_ENV !== 'production' || process.env.VERCEL !== '1') {
  app.listen(PORT, () => {
    logger.info(`API server running on port ${PORT}`);
  });

  if (process.env.NODE_ENV === 'production') {
    schedulePriceUpdateJob();
  }

  process.on('SIGTERM', async () => {
    logger.info('Shutting down...');
    await disconnectDatabase();
    process.exit(0);
  });
}

export default app;
