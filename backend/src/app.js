const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const mongoSanitize = require('express-mongo-sanitize');
const routes = require('./routes');
const errorHandler = require('./middleware/errorHandler');

function createApp() {
  const app = express();
  app.use(helmet());
  app.use(cors({ origin: (process.env.CORS_ORIGIN || 'http://localhost:5173').split(','), credentials: true }));
  app.use(express.json({ limit: '1mb' }));
  app.use(mongoSanitize());
  app.use(morgan('dev'));
  app.use('/api', rateLimit({ windowMs: 60_000, max: 300 }), routes);
  app.use(errorHandler);
  return app;
}

module.exports = createApp;
