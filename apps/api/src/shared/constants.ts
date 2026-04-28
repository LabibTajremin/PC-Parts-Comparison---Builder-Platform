export const CACHE_TTL = {
  PRODUCTS_LIST: 5 * 60,        // 5 minutes
  PRODUCTS_DETAIL: 5 * 60,      // 5 minutes
  PRODUCTS_PRICES: 5 * 60,      // 5 minutes
  AI_BUILD_ADVICE: 60 * 60,     // 1 hour
  AI_COMPATIBILITY: 24 * 60 * 60, // 24 hours
  AI_NORMALIZE: 7 * 24 * 60 * 60, // 7 days
};

export const CACHE_KEYS = {
  PRODUCTS_LIST: (hash: string) => `products:list:${hash}`,
  PRODUCTS_DETAIL: (id: string) => `products:detail:${id}`,
  PRODUCTS_PRICES: (id: string) => `products:prices:${id}`,
  AI_BUILD_ADVICE: (hash: string) => `ai:build-advice:${hash}`,
  AI_COMPATIBILITY: (p1: string, p2: string) => `ai:compatibility:${p1}:${p2}`,
};

export const PRICE_STALE_THRESHOLD_HOURS = 24;

export const PAGINATION = {
  DEFAULT_PAGE: 1,
  DEFAULT_LIMIT: 20,
  MAX_LIMIT: 100,
};
