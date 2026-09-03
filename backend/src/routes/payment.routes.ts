import { Router } from 'express';
import * as paymentController from '../controllers/payment.controller';
import { authenticate } from '../middleware/auth';
import express from 'express';

const router = Router();

router.post('/razorpay/create', authenticate, paymentController.createRazorpayOrder);
router.post('/razorpay/verify', authenticate, paymentController.verifyPayment);

// Webhook — raw body for signature verification
router.post(
  '/razorpay/webhook',
  express.raw({ type: 'application/json' }),
  paymentController.handleWebhook
);

export default router;
