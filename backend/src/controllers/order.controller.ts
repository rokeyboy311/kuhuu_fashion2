import { Response, NextFunction } from 'express';
import prisma from '../config/database';
import { successResponse } from '../utils/response';
import { NotFoundError, AppError } from '../utils/errors';
import { AuthRequest } from '../middleware/auth';
import { OrderStatus, PaymentMethod, PaymentStatus } from '@prisma/client';
import paymentService from '../services/payment.service';
import emailService from '../services/email.service';
import whatsAppService from '../services/whatsapp.service';
import logger from '../utils/logger';

function generateOrderNumber(): string {
  const year = new Date().getFullYear().toString().slice(-2);
  const random = Math.floor(10000 + Math.random() * 90000);
  return `KF${year}${random}`;
}

export async function createOrder(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
  try {
    const { addressId, paymentMethod, couponCode, notes, codCharge = 0 } = req.body;
    const userId = req.user!.id;

    // Get cart items
    const cartItems = await prisma.cartItem.findMany({
      where: { userId },
      include: {
        product: { include: { images: { where: { isPrimary: true }, take: 1 } } },
        variant: true,
      },
    });

    if (cartItems.length === 0) {
      throw new AppError('Cart is empty', 400);
    }

    // Validate stock
    for (const item of cartItems) {
      if (item.variant.stock < item.quantity) {
        throw new AppError(
          `Insufficient stock for ${item.product.name} (${item.variant.size || ''} ${item.variant.color || ''})`,
          400
        );
      }
    }

    // Calculate subtotal
    let subtotal = 0;
    const orderItemsData = cartItems.map((item) => {
      const price = item.variant.price;
      const total = price * item.quantity;
      subtotal += total;

      return {
        productId: item.productId,
        variantId: item.variantId,
        productName: item.product.name,
        variantInfo: [item.variant.color, item.variant.size].filter(Boolean).join(' / '),
        sku: item.variant.sku,
        quantity: item.quantity,
        price,
        total,
        image: item.product.images[0]?.id ? `/api/v1/images/${item.product.images[0].id}/thumb` : null,
      };
    });

    // Apply coupon if provided
    let discountAmount = 0;
    let couponId: string | undefined;
    let shippingCharge = 50; // default

    if (couponCode) {
      const coupon = await prisma.coupon.findFirst({
        where: {
          code: couponCode.toUpperCase(),
          isActive: true,
          AND: [
            { OR: [{ endDate: null }, { endDate: { gte: new Date() } }] },
          ],
        },
      });

      if (!coupon) {
        throw new AppError('Invalid or expired coupon code', 400);
      }

      if (coupon.minOrderAmount && subtotal < coupon.minOrderAmount) {
        throw new AppError(`Minimum order amount of ₹${coupon.minOrderAmount} required`, 400);
      }

      // Check per-user usage
      const userUsage = await prisma.couponUsage.count({
        where: { couponId: coupon.id, userId },
      });

      if (userUsage >= coupon.maxUsagePerUser) {
        throw new AppError('Coupon usage limit reached', 400);
      }

      if (coupon.isFirstOrderOnly) {
        const orderCount = await prisma.order.count({ where: { userId } });
        if (orderCount > 0) {
          throw new AppError('This coupon is valid for first order only', 400);
        }
      }

      if (coupon.discountType === 'PERCENTAGE') {
        discountAmount = (subtotal * coupon.discountValue) / 100;
        if (coupon.maxDiscount && discountAmount > coupon.maxDiscount) {
          discountAmount = coupon.maxDiscount;
        }
      } else if (coupon.discountType === 'FIXED_AMOUNT') {
        discountAmount = Math.min(coupon.discountValue, subtotal);
      } else if (coupon.discountType === 'FREE_SHIPPING') {
        shippingCharge = 0;
      }

      couponId = coupon.id;
    }

    // Free shipping above ₹999
    if (subtotal >= 999 && shippingCharge > 0) {
      shippingCharge = 0;
    }

    const isCOD = paymentMethod === 'COD';
    const total = subtotal - discountAmount + shippingCharge + (isCOD ? codCharge : 0);

    const orderNumber = generateOrderNumber();

    const order = await prisma.$transaction(async (tx) => {
      const newOrder = await tx.order.create({
        data: {
          orderNumber,
          userId,
          addressId,
          paymentMethod: paymentMethod as PaymentMethod,
          paymentStatus: isCOD ? PaymentStatus.PENDING : PaymentStatus.PENDING,
          status: OrderStatus.PENDING,
          subtotal,
          shippingCharge,
          discountAmount,
          total,
          couponId,
          couponCode: couponCode?.toUpperCase(),
          notes,
          isCOD,
          codCharge: isCOD ? codCharge : 0,
          items: { create: orderItemsData },
          statusHistory: {
            create: { status: OrderStatus.PENDING, comment: 'Order placed' },
          },
          payment: {
            create: {
              method: paymentMethod as PaymentMethod,
              status: PaymentStatus.PENDING,
              amount: total,
            },
          },
        },
        include: {
          items: true,
          address: true,
          payment: true,
        },
      });

      // Update coupon usage
      if (couponId) {
        await tx.coupon.update({
          where: { id: couponId },
          data: { usageCount: { increment: 1 } },
        });
        await tx.couponUsage.create({
          data: { couponId, userId, orderId: newOrder.id },
        });
      }

      // Clear cart
      await tx.cartItem.deleteMany({ where: { userId } });

      return newOrder;
    });

    successResponse({
      res,
      data: order,
      message: 'Order created',
      statusCode: 201,
    });
  } catch (error) {
    next(error);
  }
}

export async function getMyOrders(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
  try {
    const userId = req.user!.id;
    const { page = '1', limit = '10' } = req.query as Record<string, string>;
    const pageNum = parseInt(page, 10);
    const limitNum = parseInt(limit, 10);

    const [orders, total] = await Promise.all([
      prisma.order.findMany({
        where: { userId },
        orderBy: { createdAt: 'desc' },
        skip: (pageNum - 1) * limitNum,
        take: limitNum,
        include: {
          items: {
            include: {
              product: { include: { images: { where: { isPrimary: true }, take: 1 } } },
            },
          },
          shipment: true,
        },
      }),
      prisma.order.count({ where: { userId } }),
    ]);

    successResponse({ res, data: { orders, total, page: pageNum, limit: limitNum } });
  } catch (error) {
    next(error);
  }
}

export async function getOrder(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
  try {
    const { id } = req.params;
    const userId = req.user!.id;

    const order = await prisma.order.findFirst({
      where: { id, userId },
      include: {
        items: {
          include: {
            product: { include: { images: { where: { isPrimary: true }, take: 1 } } },
            variant: true,
          },
        },
        address: true,
        payment: true,
        shipment: true,
        statusHistory: { orderBy: { createdAt: 'asc' } },
      },
    });

    if (!order) throw new NotFoundError('Order');
    successResponse({ res, data: order });
  } catch (error) {
    next(error);
  }
}

export async function updateOrderStatus(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
  try {
    const { id } = req.params;
    const { status, comment } = req.body;
    const adminId = req.user!.id;

    const order = await prisma.order.findUnique({
      where: { id },
      include: { user: true, shipment: true },
    });

    if (!order) throw new NotFoundError('Order');

    const updatedOrder = await prisma.$transaction(async (tx) => {
      const updated = await tx.order.update({
        where: { id },
        data: { status: status as OrderStatus },
      });

      await tx.orderStatusHistory.create({
        data: { orderId: id, status: status as OrderStatus, comment, createdBy: adminId },
      });

      return updated;
    });

    // Send notifications based on status
    const { user } = order;
    if (status === OrderStatus.SHIPPED && order.shipment) {
      emailService.sendShippingUpdate(
        user.email,
        user.firstName,
        order.orderNumber,
        order.shipment.awbNumber || '',
        order.shipment.trackingUrl || ''
      ).catch((e) => logger.error(e));

      if (user.phone) {
        whatsAppService.sendShippingUpdate(
          user.phone,
          order.orderNumber,
          order.shipment.awbNumber || '',
          order.shipment.trackingUrl || ''
        ).catch((e) => logger.error(e));
      }
    }

    if (status === OrderStatus.CANCELLED) {
      emailService.sendOrderCancellationEmail(user.email, user.firstName, order.orderNumber, comment)
        .catch((e) => logger.error(e));
    }

    successResponse({ res, data: updatedOrder, message: 'Order status updated' });
  } catch (error) {
    next(error);
  }
}

export async function getAllOrders(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
  try {
    const {
      page = '1',
      limit = '20',
      status,
      search,
      paymentStatus,
    } = req.query as Record<string, string>;

    const pageNum = parseInt(page, 10);
    const limitNum = parseInt(limit, 10);

    const where = {
      ...(status && { status: status as OrderStatus }),
      ...(paymentStatus && { paymentStatus: paymentStatus as PaymentStatus }),
      ...(search && {
        OR: [
          { orderNumber: { contains: search, mode: 'insensitive' as const } },
          { user: { email: { contains: search, mode: 'insensitive' as const } } },
        ],
      }),
    };

    const [orders, total] = await Promise.all([
      prisma.order.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip: (pageNum - 1) * limitNum,
        take: limitNum,
        include: {
          user: { select: { firstName: true, lastName: true, email: true, phone: true } },
          items: { include: { product: true } },
          address: true,
          payment: true,
          shipment: true,
        },
      }),
      prisma.order.count({ where }),
    ]);

    successResponse({ res, data: { orders, total, page: pageNum, limit: limitNum } });
  } catch (error) {
    next(error);
  }
}
