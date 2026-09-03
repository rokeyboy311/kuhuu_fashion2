import { Request, Response, NextFunction } from 'express';
import prisma from '../config/database';
import { successResponse } from '../utils/response';
import { NotFoundError, AppError } from '../utils/errors';
import { AuthRequest } from '../middleware/auth';

export async function validateCoupon(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
  try {
    const { code, orderAmount } = req.body;
    const userId = req.user!.id;

    const coupon = await prisma.coupon.findFirst({
      where: {
        code: code.toUpperCase(),
        isActive: true,
        OR: [{ startDate: null }, { startDate: { lte: new Date() } }],
        AND: [
          { OR: [{ endDate: null }, { endDate: { gte: new Date() } }] },
        ],
      },
    });

    if (!coupon) throw new NotFoundError('Coupon');

    if (coupon.maxUsage && coupon.usageCount >= coupon.maxUsage) {
      throw new AppError('Coupon usage limit reached', 400);
    }

    if (coupon.minOrderAmount && orderAmount < coupon.minOrderAmount) {
      throw new AppError(`Minimum order amount of ₹${coupon.minOrderAmount} required`, 400);
    }

    const userUsage = await prisma.couponUsage.count({
      where: { couponId: coupon.id, userId },
    });

    if (userUsage >= coupon.maxUsagePerUser) {
      throw new AppError('You have already used this coupon', 400);
    }

    if (coupon.isFirstOrderOnly) {
      const orderCount = await prisma.order.count({ where: { userId } });
      if (orderCount > 0) throw new AppError('This coupon is for first orders only', 400);
    }

    let discountAmount = 0;
    if (coupon.discountType === 'PERCENTAGE') {
      discountAmount = (orderAmount * coupon.discountValue) / 100;
      if (coupon.maxDiscount) discountAmount = Math.min(discountAmount, coupon.maxDiscount);
    } else if (coupon.discountType === 'FIXED_AMOUNT') {
      discountAmount = Math.min(coupon.discountValue, orderAmount);
    }

    successResponse({
      res,
      data: {
        coupon: {
          id: coupon.id,
          code: coupon.code,
          discountType: coupon.discountType,
          discountValue: coupon.discountValue,
          isFreeShipping: coupon.isFreeShipping,
        },
        discountAmount,
        finalAmount: orderAmount - discountAmount,
      },
    });
  } catch (error) {
    next(error);
  }
}

export async function createCoupon(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
  try {
    const coupon = await prisma.coupon.create({ data: req.body });
    successResponse({ res, data: coupon, message: 'Coupon created', statusCode: 201 });
  } catch (error) {
    next(error);
  }
}

export async function getCoupons(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const coupons = await prisma.coupon.findMany({
      orderBy: { createdAt: 'desc' },
      include: { _count: { select: { usages: true } } },
    });
    successResponse({ res, data: coupons });
  } catch (error) {
    next(error);
  }
}

export async function updateCoupon(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { id } = req.params;
    const coupon = await prisma.coupon.update({ where: { id }, data: req.body });
    successResponse({ res, data: coupon });
  } catch (error) {
    next(error);
  }
}

export async function deleteCoupon(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { id } = req.params;
    await prisma.coupon.update({ where: { id }, data: { isActive: false } });
    successResponse({ res, message: 'Coupon deactivated' });
  } catch (error) {
    next(error);
  }
}
