import { Response, NextFunction } from 'express';
import prisma from '../config/database';
import { successResponse } from '../utils/response';
import { AuthRequest } from '../middleware/auth';

export async function getCart(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
  try {
    const userId = req.user!.id;

    const cartItems = await prisma.cartItem.findMany({
      where: { userId },
      include: {
        product: {
          include: {
            images: { where: { isPrimary: true }, take: 1 },
          },
        },
        variant: true,
      },
    });

    const subtotal = cartItems.reduce(
      (sum, item) => sum + item.variant.price * item.quantity,
      0
    );

    successResponse({ res, data: { items: cartItems, subtotal, itemCount: cartItems.length } });
  } catch (error) {
    next(error);
  }
}

export async function addToCart(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
  try {
    const userId = req.user!.id;
    const { productId, variantId, quantity = 1 } = req.body;

    const variant = await prisma.productVariant.findUnique({ where: { id: variantId } });
    if (!variant || variant.stock < quantity) {
      throw new Error('Insufficient stock');
    }

    const cartItem = await prisma.cartItem.upsert({
      where: { userId_variantId: { userId, variantId } },
      update: { quantity: { increment: quantity } },
      create: { userId, productId, variantId, quantity },
      include: {
        product: { include: { images: { where: { isPrimary: true }, take: 1 } } },
        variant: true,
      },
    });

    successResponse({ res, data: cartItem, message: 'Added to cart', statusCode: 200 });
  } catch (error) {
    next(error);
  }
}

export async function updateCartItem(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
  try {
    const userId = req.user!.id;
    const { id } = req.params;
    const { quantity } = req.body;

    if (quantity <= 0) {
      await prisma.cartItem.delete({ where: { id, userId } });
      successResponse({ res, message: 'Item removed from cart' });
      return;
    }

    const updated = await prisma.cartItem.update({
      where: { id, userId },
      data: { quantity },
    });

    successResponse({ res, data: updated });
  } catch (error) {
    next(error);
  }
}

export async function removeFromCart(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
  try {
    const userId = req.user!.id;
    const { id } = req.params;

    await prisma.cartItem.delete({ where: { id, userId } });
    successResponse({ res, message: 'Item removed from cart' });
  } catch (error) {
    next(error);
  }
}

export async function clearCart(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
  try {
    const userId = req.user!.id;
    await prisma.cartItem.deleteMany({ where: { userId } });
    successResponse({ res, message: 'Cart cleared' });
  } catch (error) {
    next(error);
  }
}
