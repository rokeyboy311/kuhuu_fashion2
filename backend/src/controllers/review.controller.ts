import { Request, Response, NextFunction } from 'express';
import prisma from '../config/database';
import { successResponse, createdResponse } from '../utils/response';
import { NotFoundError } from '../utils/errors';
import { AuthRequest } from '../middleware/auth';
import { ReviewStatus } from '@prisma/client';

export async function getProductReviews(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { productId } = req.params;
    const { page = '1', limit = '10' } = req.query as Record<string, string>;
    const pageNum = parseInt(page, 10);
    const limitNum = parseInt(limit, 10);

    const [reviews, total] = await Promise.all([
      prisma.review.findMany({
        where: { productId, status: ReviewStatus.APPROVED },
        orderBy: { createdAt: 'desc' },
        skip: (pageNum - 1) * limitNum,
        take: limitNum,
        include: {
          user: { select: { firstName: true, lastName: true, avatar: true } },
        },
      }),
      prisma.review.count({ where: { productId, status: ReviewStatus.APPROVED } }),
    ]);

    successResponse({ res, data: { reviews, total, page: pageNum, limit: limitNum } });
  } catch (error) {
    next(error);
  }
}

export async function createReview(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
  try {
    const { productId } = req.params;
    const userId = req.user!.id;
    const { rating, title, body, images } = req.body;

    // Check if user purchased the product
    const hasPurchased = await prisma.orderItem.findFirst({
      where: {
        productId,
        order: { userId, paymentStatus: 'PAID', status: { in: ['DELIVERED'] } },
      },
    });

    const review = await prisma.review.create({
      data: {
        productId,
        userId,
        rating: parseInt(rating, 10),
        title,
        body,
        images: images || [],
        isVerifiedPurchase: !!hasPurchased,
        status: ReviewStatus.PENDING,
      },
    });

    // Update product average rating
    const stats = await prisma.review.aggregate({
      where: { productId, status: ReviewStatus.APPROVED },
      _avg: { rating: true },
      _count: { id: true },
    });

    await prisma.product.update({
      where: { id: productId },
      data: {
        averageRating: stats._avg.rating || 0,
        reviewCount: stats._count.id,
      },
    });

    createdResponse({ res, data: review, message: 'Review submitted for moderation' });
  } catch (error) {
    next(error);
  }
}

export async function moderateReview(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
  try {
    const { id } = req.params;
    const { status, adminReply } = req.body;

    const review = await prisma.review.update({
      where: { id },
      data: { status: status as ReviewStatus, adminReply },
    });

    // Update product rating stats if approved
    if (status === ReviewStatus.APPROVED) {
      const stats = await prisma.review.aggregate({
        where: { productId: review.productId, status: ReviewStatus.APPROVED },
        _avg: { rating: true },
        _count: { id: true },
      });

      await prisma.product.update({
        where: { id: review.productId },
        data: {
          averageRating: stats._avg.rating || 0,
          reviewCount: stats._count.id,
        },
      });
    }

    successResponse({ res, data: review, message: `Review ${status.toLowerCase()}` });
  } catch (error) {
    next(error);
  }
}

export async function getPendingReviews(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
  try {
    const reviews = await prisma.review.findMany({
      where: { status: ReviewStatus.PENDING },
      include: {
        product: { select: { name: true, slug: true } },
        user: { select: { firstName: true, lastName: true, email: true } },
      },
      orderBy: { createdAt: 'asc' },
    });
    successResponse({ res, data: reviews });
  } catch (error) {
    next(error);
  }
}
