import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';
import routes from './routes/index.js';
import { errorHandler } from './middleware/errorHandler.js';
import { sanitize } from './middleware/sanitize.js';

export function createApp() {
  const app = express();
  app.use(helmet());
  
  const rawOrigins = process.env.CORS_ORIGIN || 'http://localhost:5173';
  const allowedOrigins = rawOrigins.split(',').map((o) => o.trim().replace(/\/$/, ''));

  app.use(
    cors({
      origin: (origin, callback) => {
        if (!origin) return callback(null, true);
        const cleanOrigin = origin.replace(/\/$/, '');
        if (allowedOrigins.includes('*') || allowedOrigins.includes(cleanOrigin)) {
          return callback(null, true);
        }
        return callback(null, false);
      },
      credentials: true,
    })
  );
  app.use(express.json({ limit: '1mb' }));
  app.use(sanitize);
  app.use(morgan('dev'));
  app.use('/api', rateLimit({ windowMs: 60_000, max: 300 }), routes);
  app.use(errorHandler);
  return app;
}

export default createApp;
