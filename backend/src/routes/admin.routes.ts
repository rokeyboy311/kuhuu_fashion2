import { Router } from 'express';
import * as adminController from '../controllers/admin.controller';
import { authenticate, authorizeRoles } from '../middleware/auth';
import prisma from '../config/database';
import { successResponse } from '../utils/response';

const router = Router();

const adminAuth = [authenticate, authorizeRoles('SUPER_ADMIN', 'ADMIN', 'STAFF')];

router.get('/dashboard', ...adminAuth, adminController.getDashboardStats);
router.get('/revenue-chart', ...adminAuth, adminController.getRevenueChart);
router.get('/inventory-alerts', ...adminAuth, adminController.getInventoryAlerts);

// Category management
router.get('/categories', ...adminAuth, async (req, res, next) => {
  try {
    const categories = await prisma.category.findMany({ orderBy: { sortOrder: 'asc' } });
    successResponse({ res, data: categories });
  } catch (e) { next(e); }
});

// Customer management
router.get('/customers', ...adminAuth, async (req, res, next) => {
  try {
    const { page = '1', limit = '20', search } = req.query as Record<string, string>;
    const pageNum = parseInt(page, 10);
    const limitNum = parseInt(limit, 10);
    const where = {
      role: 'CUSTOMER' as const,
      ...(search && {
        OR: [
          { email: { contains: search, mode: 'insensitive' as const } },
          { firstName: { contains: search, mode: 'insensitive' as const } },
          { phone: { contains: search } },
        ],
      }),
    };
    const [customers, total] = await Promise.all([
      prisma.user.findMany({
        where,
        skip: (pageNum - 1) * limitNum,
        take: limitNum,
        select: { id: true, firstName: true, lastName: true, email: true, phone: true, createdAt: true, isActive: true },
        orderBy: { createdAt: 'desc' },
      }),
      prisma.user.count({ where }),
    ]);
    successResponse({ res, data: { customers, total, page: pageNum, limit: limitNum } });
  } catch (e) { next(e); }
});

// Banners
router.get('/banners', ...adminAuth, async (req, res, next) => {
  try {
    const banners = await prisma.banner.findMany({ orderBy: { sortOrder: 'asc' } });
    successResponse({ res, data: banners });
  } catch (e) { next(e); }
});

router.post('/banners', ...adminAuth, async (req, res, next) => {
  try {
    const banner = await prisma.banner.create({ data: req.body });
    successResponse({ res, data: banner, statusCode: 201 });
  } catch (e) { next(e); }
});

router.put('/banners/:id', ...adminAuth, async (req, res, next) => {
  try {
    const banner = await prisma.banner.update({ where: { id: req.params.id }, data: req.body });
    successResponse({ res, data: banner });
  } catch (e) { next(e); }
});

// Instagram posts (CMS)
router.get('/instagram-posts', ...adminAuth, async (req, res, next) => {
  try {
    const posts = await prisma.instagramPost.findMany({ orderBy: { sortOrder: 'asc' } });
    successResponse({ res, data: posts });
  } catch (e) { next(e); }
});

router.post('/instagram-posts', ...adminAuth, async (req, res, next) => {
  try {
    const post = await prisma.instagramPost.create({ data: req.body });
    successResponse({ res, data: post, statusCode: 201 });
  } catch (e) { next(e); }
});

// Announcement bar
router.get('/announcement', async (req, res, next) => {
  try {
    const announcement = await prisma.announcementBar.findFirst({
      where: { isActive: true },
      orderBy: { createdAt: 'desc' },
    });
    successResponse({ res, data: announcement });
  } catch (e) { next(e); }
});

router.post('/announcement', ...adminAuth, async (req, res, next) => {
  try {
    const announcement = await prisma.announcementBar.create({ data: req.body });
    successResponse({ res, data: announcement, statusCode: 201 });
  } catch (e) { next(e); }
});

// Audit logs
router.get('/audit-logs', authenticate, authorizeRoles('SUPER_ADMIN', 'ADMIN'), async (req, res, next) => {
  try {
    const logs = await prisma.auditLog.findMany({
      orderBy: { createdAt: 'desc' },
      take: 100,
      include: { admin: { select: { firstName: true, lastName: true, email: true } } },
    });
    successResponse({ res, data: logs });
  } catch (e) { next(e); }
});

export default router;
