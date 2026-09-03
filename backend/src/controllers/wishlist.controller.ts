import { Response, NextFunction } from 'express';
import prisma from '../config/database';
import { successResponse } from '../utils/response';
import { AuthRequest } from '../middleware/auth';

export async function getWishlist(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
  try {
    const items = await prisma.wishlistItem.findMany({
      where: { userId: req.user!.id },
      include: {
        product: {
          include: {
            images: { where: { isPrimary: true }, take: 1 },
            variants: { where: { isActive: true }, select: { price: true, stock: true, size: true, color: true } },
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
    successResponse({ res, data: items });
  } catch (error) {
    next(error);
  }
}

export async function toggleWishlist(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
  try {
    const userId = req.user!.id;
    const { productId } = req.body;

    const existing = await prisma.wishlistItem.findUnique({
      where: { userId_productId: { userId, productId } },
    });

    if (existing) {
      await prisma.wishlistItem.delete({ where: { id: existing.id } });
      successResponse({ res, data: { wishlisted: false }, message: 'Removed from wishlist' });
    } else {
      await prisma.wishlistItem.create({ data: { userId, productId } });
      successResponse({ res, data: { wishlisted: true }, message: 'Added to wishlist', statusCode: 201 });
    }
  } catch (error) {
    next(error);
  }
}

export async function removeFromWishlist(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
  try {
    const userId = req.user!.id;
    const { productId } = req.params;
    await prisma.wishlistItem.deleteMany({ where: { userId, productId } });
    successResponse({ res, message: 'Removed from wishlist' });
  } catch (error) {
    next(error);
  }
}
