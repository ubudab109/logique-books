// securityMiddleware.ts
import rateLimit from 'express-rate-limit';
import helmet from 'helmet';

// Rate limiter instance
const limiter = rateLimit({
  max: 50, // Limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later.',
});

export const securityMiddleware = [
  limiter,
  helmet(),
];
