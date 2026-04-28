import { scraperManager } from '../scrapers/scraper.manager';
import { logger } from '../shared/logger';

export async function runPriceUpdateJob() {
  logger.info('Price update job started');
  try {
    await scraperManager.runAll();
    logger.info('Price update job completed');
  } catch (err) {
    logger.error('Price update job failed', err);
  }
}

export function schedulePriceUpdateJob() {
  const intervalHours = parseInt(process.env.SCRAPER_INTERVAL_HOURS || '12');
  const intervalMs = intervalHours * 60 * 60 * 1000;

  setInterval(() => {
    runPriceUpdateJob();
  }, intervalMs);

  logger.info(`Price update job scheduled every ${intervalHours} hours`);
}
