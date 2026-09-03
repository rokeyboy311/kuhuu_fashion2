import { Request, Response, NextFunction } from 'express';
import prisma from '../config/database';
import { successResponse } from '../utils/response';
import { AuthRequest } from '../middleware/auth';
import { OrderStatus } from '@prisma/client';

export async function getDashboardStats(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
  try {
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const startOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const endOfLastMonth = new Date(now.getFullYear(), now.getMonth(), 0);

    const [
      totalRevenue,
      monthRevenue,
      lastMonthRevenue,
      totalOrders,
      monthOrders,
      totalCustomers,
      totalProducts,
      pendingOrders,
      recentOrders,
      topProducts,
    ] = await Promise.all([
      // Total all-time revenue
      prisma.order.aggregate({
        where: { paymentStatus: 'PAID' },
        _sum: { total: true },
      }),
      // This month revenue
      prisma.order.aggregate({
        where: { paymentStatus: 'PAID', createdAt: { gte: startOfMonth } },
        _sum: { total: true },
      }),
      // Last month revenue
      prisma.order.aggregate({
        where: {
          paymentStatus: 'PAID',
          createdAt: { gte: startOfLastMonth, lte: endOfLastMonth },
        },
        _sum: { total: true },
      }),
      // Total orders
      prisma.order.count(),
      // This month orders
      prisma.order.count({ where: { createdAt: { gte: startOfMonth } } }),
      // Total customers
      prisma.user.count({ where: { role: 'CUSTOMER' } }),
      // Total active products
      prisma.product.count({ where: { status: 'ACTIVE' } }),
      // Pending orders
      prisma.order.count({ where: { status: OrderStatus.PENDING } }),
      // Recent orders
      prisma.order.findMany({
        take: 10,
        orderBy: { createdAt: 'desc' },
        include: {
          user: { select: { firstName: true, lastName: true, email: true } },
          items: { take: 1, include: { product: { select: { name: true } } } },
        },
      }),
      // Top products by sales
      prisma.product.findMany({
        where: { status: 'ACTIVE' },
        orderBy: { totalSold: 'desc' },
        take: 5,
        include: { images: { where: { isPrimary: true }, take: 1 } },
        select: {
          id: true,
          name: true,
          totalSold: true,
          basePrice: true,
          images: true,
        },
      }),
    ]);

    const revenueGrowth =
      lastMonthRevenue._sum.total && lastMonthRevenue._sum.total > 0
        ? (((monthRevenue._sum.total || 0) - lastMonthRevenue._sum.total) /
            lastMonthRevenue._sum.total) *
          100
        : 0;

    successResponse({
      res,
      data: {
        stats: {
          totalRevenue: totalRevenue._sum.total || 0,
          monthRevenue: monthRevenue._sum.total || 0,
          revenueGrowth: Math.round(revenueGrowth * 10) / 10,
          totalOrders,
          monthOrders,
          totalCustomers,
          totalProducts,
          pendingOrders,
        },
        recentOrders,
        topProducts,
      },
    });
  } catch (error) {
    next(error);
  }
}

export async function getRevenueChart(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { period = '7d' } = req.query as { period: string };

    const days = period === '30d' ? 30 : period === '90d' ? 90 : 7;
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    const orders = await prisma.order.findMany({
      where: {
        paymentStatus: 'PAID',
        createdAt: { gte: startDate },
      },
      select: { createdAt: true, total: true },
      orderBy: { createdAt: 'asc' },
    });

    // Group by date
    const revenueByDate: Record<string, number> = {};
    for (let i = 0; i < days; i++) {
      const d = new Date();
      d.setDate(d.getDate() - (days - 1 - i));
      const key = d.toISOString().split('T')[0];
      revenueByDate[key] = 0;
    }

    for (const order of orders) {
      const key = order.createdAt.toISOString().split('T')[0];
      if (revenueByDate[key] !== undefined) {
        revenueByDate[key] += order.total;
      }
    }

    const chartData = Object.entries(revenueByDate).map(([date, revenue]) => ({
      date,
      revenue: Math.round(revenue * 100) / 100,
    }));

    successResponse({ res, data: chartData });
  } catch (error) {
    next(error);
  }
}

export async function getInventoryAlerts(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const lowStock = await prisma.productVariant.findMany({
      where: {
        isActive: true,
        OR: [
          { stock: { lte: 10, gt: 0 } },
          { stock: 0 },
        ],
      },
      include: {
        product: { select: { name: true, slug: true, images: { where: { isPrimary: true }, take: 1 } } },
      },
      orderBy: { stock: 'asc' },
      take: 50,
    });

    successResponse({ res, data: lowStock });
  } catch (error) {
    next(error);
  }
}
