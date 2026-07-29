import rateLimit from 'express-rate-limit';

/**
 * Global API rate limiter
 * Limits each IP to 100 requests per 15-minute window
 */
export const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  limit: 100,
  standardHeaders: true, // Return rate limit info in `RateLimit-*` headers
  legacyHeaders: false, // Disable legacy `X-RateLimit-*` headers
  message: {
    status: 429,
    message: 'Too many requests from this IP, please try again after 15 minutes.',
  },
});

/**
 * Auth rate limiter
 * Limits each IP to 10 requests per 15-minute window for sensitive login/register operations
 */
export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  limit: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    status: 429,
    message: 'Too many authentication attempts from this IP. Please try again after 15 minutes.',
  },
});

/**
 * Write/State-mutation rate limiter
 * Limits each IP to 30 requests per 15-minute window for purchases, restocks, and vehicle creation/updates
 */
export const writeLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  limit: 30,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    status: 429,
    message: 'Too many transaction operations. Please try again after 15 minutes.',
  },
});
