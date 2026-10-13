import 'dotenv/config';
import express from 'express';
import apiRoutes from './routes/index.js';
import { initializeServices } from './startup.js';

import dotenv from "dotenv";
dotenv.config();

import redisManager from './config/redis.js';

import { createServer } from 'http';
import cors from 'cors';
import { cspHeaders } from './middleware/cspHeaders.js';
import helmet from 'helmet';
import compressionMiddleware from './middleware/compression.js';
import rateLimit from 'express-rate-limit';


import { globalErrorHandler } from './middleware/globalErrorHandler.js';
import {
  metricsMiddleware,
  metricsHandler,
} from "./middleware/metrics.js";





import swaggerUi from 'swagger-ui-express';
import swaggerSpec from './config/swagger.js';

import { connectDB as baseConnectDB } from './config/database.js';


import { initGitHubSyncCron } from './services/portfolioGitHubSync.js';

const shouldInitGitHubSyncCron =
  process.env.ENABLE_GITHUB_SYNC_CRON !== 'false' &&
  process.env.NODE_ENV !== 'test';

const connectDB = async (...args) => {
  await baseConnectDB(...args);

  if (shouldInitGitHubSyncCron) {
    initGitHubSyncCron();
  }
};



import { getSafeConfig } from './utils/safeConfig.js';
import { validateEmailConfig } from './utils/emailConfig.js';

// ==========================================================================
// Configuration validation - Check for required API keys (dev only)
// ==========================================================================
if (process.env.NODE_ENV === 'development') {
  if (!process.env.GEMINI_API_KEY) {
    console.warn('⚠️  GEMINI_API_KEY is not configured - AI features will be unavailable.');
    console.warn('   Set GEMINI_API_KEY in your .env file to enable Google Gemini features.');
  }

  if (!process.env.GROQ_API_KEY) {
    console.warn('⚠️  GROQ_API_KEY is not configured - Groq AI provider will not be available.');
  }

  if (!process.env.OPENAI_API_KEY) {
    console.warn('⚠️  OPENAI_API_KEY is not configured - OpenAI provider will not be available.');
  }
}

// Validate and normalize CORS origin URLs
function validateOriginUrl(url) {
  if (!url) return null;
  const trimmed = url.trim();
  try {
    const parsed = new URL(trimmed);
    // Ensure valid protocol
    if (!['http:', 'https:'].includes(parsed.protocol)) {
      console.error(`Invalid protocol in origin URL: ${trimmed}`);
      return null;
    }
    // Ensure no pathname, search, or hash
    if (parsed.pathname !== '/' || parsed.search || parsed.hash) {
      console.error(`Origin URL must have no path, query, or hash: ${trimmed}`);
      return null;
    }
    // Return normalized origin (no trailing slash)
    return `${parsed.protocol}//${parsed.host}`;
  } catch (error) {
    console.error(`Failed to parse origin URL: ${trimmed}`, error.message);
    return null;
  }
}

// Production safety: FRONTEND_URL must be explicitly set and valid in production
if (process.env.NODE_ENV === 'production') {
  if (!process.env.FRONTEND_URL) {
    throw new Error('FRONTEND_URL environment variable must be set in production');
  }
  const validatedFrontendUrl = validateOriginUrl(process.env.FRONTEND_URL);
  if (!validatedFrontendUrl) {
    throw new Error('FRONTEND_URL must be a valid origin URL (scheme://host[:port])');
  }
}

const app = express();
app.use(metricsMiddleware);
app.use(compressionMiddleware);
const httpServer = createServer(app);
const PORT = process.env.PORT || 5000;

// Log a presence-only configuration summary in development only.
// Secrets cannot leak into startup logs or aggregated log output.
if (process.env.NODE_ENV === 'development') {
  console.log('✓ Config summary:', getSafeConfig(process.env, [
    'NODE_ENV',
    'FRONTEND_URL',
    'EMAIL_SERVICE_URL',
    'GEMINI_API_KEY',
    'GROQ_API_KEY',
    'OPENAI_API_KEY',
  ]));
}
// CORS configuration - MUST come before helmet
const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:3000',
  'https://teachforplacementyy.netlify.app',
  validateOriginUrl(process.env.FRONTEND_URL),
].filter(Boolean);

if (process.env.NODE_ENV === 'development') {
  console.log('🔧 Allowed origins:', allowedOrigins);
}

app.use(cors({
  origin: function (origin, callback) {
    if (!origin) return callback(null, true);
    const normalizedOrigin = origin.replace(/\/$/, '');
    if (allowedOrigins.includes(normalizedOrigin)) {
      callback(null, true);
    } else {
      console.log('❌ CORS blocked origin:', origin, '| Allowed:', allowedOrigins);
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'X-AI-Provider', 'X-AI-Key', 'X-AI-Model', 'X-OpenRouter-Key', 'X-GitHub-Token']
}));

// Helmet security headers - configured to not interfere with CORS
app.use(cspHeaders);
app.use(helmet({
  crossOriginResourcePolicy: { policy: 'cross-origin' },
  crossOriginOpenerPolicy: { policy: 'same-origin-allow-popups' },
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: [
        "'self'",
        "'unsafe-inline'",
        "https://apis.google.com",
        "https://accounts.google.com",
        "https://www.gstatic.com",
      ],
      styleSrc: [
        "'self'",
        "'unsafe-inline'",
        "https://fonts.googleapis.com",
      ],
      fontSrc: [
        "'self'",
        "https://fonts.gstatic.com",
      ],
      imgSrc: [
        "'self'",
        "https:",
      ],
      connectSrc: [
        "'self'",
        process.env.FRONTEND_URL || "http://localhost:5173",
        "https://firebaseapp.com",
        "https://*.googleapis.com",
        "https://*.firebaseio.com",
        "https://identitytoolkit.googleapis.com",
        "wss:",
        "ws:",
      ],
      frameSrc: [
        "'self'",
        "https://accounts.google.com",
      ],
      objectSrc: ["'none'"],
      upgradeInsecureRequests: [],
    },
  },
}));

const limiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000,
  max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS) || 1000,
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req, res, next, options) => {
    const resetTime = req.rateLimit?.resetTime;
    const retryAfterSeconds = resetTime
      ? Math.max(1, Math.ceil((resetTime - Date.now()) / 1000))
      : Math.ceil((options.windowMs || 0) / 1000);

    const headers = {
      'Retry-After': String(retryAfterSeconds),
      'X-RateLimit-Limit': String(options.max),
      'X-RateLimit-Remaining': String(req.rateLimit?.remaining ?? 0),
      'X-RateLimit-Quota': String(options.max)
    };

    if (resetTime) {
      headers['X-RateLimit-Reset'] = String(Math.ceil(resetTime / 1000));
    }

    res.set(headers);
    res.status(options.statusCode).json({
      success: false,
      error: options.message?.error || 'Rate limit exceeded',
      message: options.message
    });
  },
  message: {
    error: 'Too many requests, please try again later.'
  }
});

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'OK',
    timestamp: new Date().toISOString(),
  });
});

app.get('/metrics', metricsHandler);

app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.use('/api', limiter);
app.use('/api', apiRoutes);

app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});
app.use(globalErrorHandler);

const startServer = async () => {
  try {
    // Fail fast in production when email is not configured; warn otherwise.
    // Without this check, missing credentials surface only later as silent
    // send failures.
    const emailStatus = validateEmailConfig(process.env);
    if (emailStatus.enabled) {
      console.log(`📧 ${emailStatus.message}`);
    } else {
      console.warn(`⚠️ ${emailStatus.message}`);
    }

    await connectDB();

    httpServer.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
      console.log(`📍 Environment: ${process.env.NODE_ENV || 'development'}`);
      console.log(`🔗 Frontend URL: ${process.env.FRONTEND_URL || 'http://localhost:5173'}`);
    });

    await initializeServices(httpServer);

  } catch (error) {
    console.error('❌ Failed to start server:', error.message);
    process.exit(1);
  }
};

if (!process.env.NETLIFY && !process.env.VERCEL) {
  startServer();
}

const shutdown = async (signal) => {
    console.log(`\n📥 Received ${signal}, shutting down gracefully...`);
    await redisManager.shutdown();
    console.log('👋 Server shutdown complete');
    process.exit(0);
};

process.on('SIGTERM', () => shutdown('SIGTERM'));
process.on('SIGINT', () => shutdown('SIGINT'));

process.on("unhandledRejection", (reason) => {
  console.error("❌ UNHANDLED REJECTION:", reason);
});

process.on("uncaughtException", (err) => {
  console.error("❌ UNCAUGHT EXCEPTION:", err);
  httpServer.close();
  redisManager.shutdown().finally(() => process.exit(1));
  setTimeout(() => process.exit(1), 10000).unref();
});

export default app;
