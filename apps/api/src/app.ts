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

// Build allowed origins list from env (supports comma-separated values)
const rawOrigins = process.env.FRONTEND_URL || 'http://localhost:3000';
const allowedOrigins = rawOrigins
  .split(',')
  .map((o) => o.trim())
  .filter(Boolean);

// Always allow localhost in development
if (process.env.NODE_ENV !== 'production') {
  if (!allowedOrigins.includes('http://localhost:3000')) allowedOrigins.push('http://localhost:3000');
  if (!allowedOrigins.includes('http://localhost:3001')) allowedOrigins.push('http://localhost:3001');
}

app.use(cors({
  origin: (origin, callback) => {
    // Allow server-to-server requests (no Origin header)
    if (!origin) return callback(null, true);
    if (allowedOrigins.includes(origin)) return callback(null, true);
    // Allow any *.vercel.app preview deploy
    if (origin.endsWith('.vercel.app')) return callback(null, true);
    callback(new Error(`CORS: origin not allowed — ${origin}`));
  },
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
