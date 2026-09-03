import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import compression from 'compression';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import rateLimit from 'express-rate-limit';
import 'express-async-errors';

import config from './config';
import logger from './utils/logger';
import { errorHandler, notFoundHandler } from './middleware/errorHandler';

// Routes
import authRoutes from './routes/auth.routes';
import productRoutes from './routes/product.routes';
import orderRoutes from './routes/order.routes';
import cartRoutes from './routes/cart.routes';
import wishlistRoutes from './routes/wishlist.routes';
import reviewRoutes from './routes/review.routes';
import couponRoutes from './routes/coupon.routes';
import paymentRoutes from './routes/payment.routes';
import adminRoutes from './routes/admin.routes';
import imageRoutes from './routes/image.routes';

const app = express();

// ============================================================
// Security
// ============================================================
app.use(helmet({
  crossOriginResourcePolicy: { policy: 'cross-origin' },
}));

const allowedOrigins = [
  'https://kuhuufashion.vercel.app',
  'http://localhost:5173',
  'http://localhost:3000',
  ...(config.cors.origin ? config.cors.origin.split(',').map((s) => s.trim()) : []),
];

app.use(cors({
  origin: (origin, callback) => {
    if (!origin) return callback(null, true);
    if (
      allowedOrigins.includes(origin) ||
      origin.endsWith('.vercel.app') ||
      origin.includes('localhost')
    ) {
      return callback(null, true);
    }
    return callback(null, true);
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

// Global rate limiter
const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 300,
  message: { success: false, message: 'Too many requests, please try again later.' },
  standardHeaders: true,
  legacyHeaders: false,
});

// Stricter rate limiter for auth endpoints
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  message: { success: false, message: 'Too many login attempts, please try again later.' },
});

app.use(globalLimiter);

// ============================================================
// Body Parsing
// ============================================================
// Note: /payments/razorpay/webhook needs raw body — handled in payment routes
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(cookieParser());
app.use(compression());

// ============================================================
// Logging
// ============================================================
if (config.env !== 'test') {
  app.use(morgan('combined', {
    stream: { write: (msg) => logger.http(msg.trim()) },
  }));
}

// ============================================================
// Health Check
// ============================================================
app.get('/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString(), env: config.env });
});

// ============================================================
// API Routes
// ============================================================
const API = config.apiPrefix;

app.use(`${API}/auth`, authLimiter, authRoutes);
app.use(`${API}/products`, productRoutes);
app.use(`${API}/orders`, orderRoutes);
app.use(`${API}/cart`, cartRoutes);
app.use(`${API}/wishlist`, wishlistRoutes);
app.use(`${API}/reviews`, reviewRoutes);
app.use(`${API}/coupons`, couponRoutes);
app.use(`${API}/payments`, paymentRoutes);
app.use(`${API}/admin`, adminRoutes);
app.use(`${API}/images`, imageRoutes);  // PostgreSQL image serving

// ============================================================
// Categories & Collections (public)
// ============================================================
import prisma from './config/database';
import { successResponse } from './utils/response';
import slugify from 'slugify';

app.get(`${API}/categories`, async (_req, res, next) => {
  try {
    const categories = await prisma.category.findMany({
      where: { isActive: true },
      orderBy: { sortOrder: 'asc' },
    });
    successResponse({ res, data: categories });
  } catch (e) { next(e); }
});

app.get(`${API}/collections`, async (_req, res, next) => {
  try {
    const collections = await prisma.collection.findMany({
      where: { isActive: true },
      orderBy: { sortOrder: 'asc' },
    });
    successResponse({ res, data: collections });
  } catch (e) { next(e); }
});

app.get(`${API}/search`, async (req, res, next) => {
  try {
    const { q = '', limit = '20' } = req.query as Record<string, string>;
    if (!q.trim()) {
      successResponse({ res, data: [] });
      return;
    }

    const products = await prisma.product.findMany({
      where: {
        status: 'ACTIVE',
        OR: [
          { name: { contains: q, mode: 'insensitive' } },
          { description: { contains: q, mode: 'insensitive' } },
          { tags: { has: q } },
          { variants: { some: { sku: { contains: q, mode: 'insensitive' } } } },
        ],
      },
      take: parseInt(limit, 10),
      include: {
        images: { where: { isPrimary: true }, take: 1 },
        variants: { where: { isActive: true }, select: { price: true, compareAtPrice: true }, take: 1 },
      },
    });

    successResponse({ res, data: products });
  } catch (e) { next(e); }
});

// Instagram posts for homepage
app.get(`${API}/instagram-posts`, async (_req, res, next) => {
  try {
    const posts = await prisma.instagramPost.findMany({
      where: { isActive: true },
      orderBy: { sortOrder: 'asc' },
      take: 9,
    });
    successResponse({ res, data: posts });
  } catch (e) { next(e); }
});

// Banners (public)
app.get(`${API}/banners`, async (_req, res, next) => {
  try {
    const banners = await prisma.banner.findMany({
      where: {
        isActive: true,
        OR: [{ startDate: null }, { startDate: { lte: new Date() } }],
        AND: [{ OR: [{ endDate: null }, { endDate: { gte: new Date() } }] }],
      },
      orderBy: { sortOrder: 'asc' },
    });
    successResponse({ res, data: banners });
  } catch (e) { next(e); }
});

// ============================================================
// Error Handling
// ============================================================
app.use(notFoundHandler);
app.use(errorHandler);

export default app;
