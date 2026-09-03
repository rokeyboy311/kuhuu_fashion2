import { Request, Response, NextFunction } from 'express';
import prisma from '../config/database';
import { successResponse, createdResponse } from '../utils/response';
import paymentService from '../services/payment.service';
import { AuthRequest } from '../middleware/auth';

export async function createRazorpayOrder(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
  try {
    const { orderId } = req.body;
    const result = await paymentService.createRazorpayOrder(orderId);
    successResponse({ res, data: result });
  } catch (error) {
    next(error);
  }
}

export async function verifyPayment(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
  try {
    const { orderId, razorpayOrderId, razorpayPaymentId, razorpaySignature } = req.body;
    await paymentService.verifyPayment(orderId, razorpayOrderId, razorpayPaymentId, razorpaySignature);
    successResponse({ res, message: 'Payment verified and order confirmed' });
  } catch (error) {
    next(error);
  }
}

export async function handleWebhook(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const signature = req.headers['x-razorpay-signature'] as string;
    const body = JSON.stringify(req.body);
    await paymentService.handleWebhook(body, signature);
    res.status(200).json({ received: true });
  } catch (error) {
    next(error);
  }
}
