import Razorpay from 'razorpay';
import crypto from 'crypto';
import prisma from '../config/database';
import config from '../config';
import { PaymentError, NotFoundError } from '../utils/errors';
import { PaymentStatus, PaymentMethod, OrderStatus } from '@prisma/client';
import emailService from './email.service';
import whatsAppService from './whatsapp.service';
import logger from '../utils/logger';

class PaymentService {
  private razorpay: Razorpay;

  constructor() {
    this.razorpay = new Razorpay({
      key_id: config.razorpay.keyId,
      key_secret: config.razorpay.keySecret,
    });
  }

  async createRazorpayOrder(orderId: string): Promise<{
    razorpayOrderId: string;
    amount: number;
    currency: string;
    keyId: string;
  }> {
    const order = await prisma.order.findUnique({
      where: { id: orderId },
      include: { user: true },
    });

    if (!order) throw new NotFoundError('Order');

    const razorpayOrder = await this.razorpay.orders.create({
      amount: Math.round(order.total * 100), // paise
      currency: 'INR',
      receipt: order.orderNumber,
      notes: {
        orderId: order.id,
        orderNumber: order.orderNumber,
      },
    });

    // Store razorpay order ID
    await prisma.payment.update({
      where: { orderId },
      data: { razorpayOrderId: razorpayOrder.id },
    });

    return {
      razorpayOrderId: razorpayOrder.id,
      amount: order.total,
      currency: 'INR',
      keyId: config.razorpay.keyId,
    };
  }

  async verifyPayment(
    orderId: string,
    razorpayOrderId: string,
    razorpayPaymentId: string,
    razorpaySignature: string
  ): Promise<void> {
    // Verify signature
    const expectedSignature = crypto
      .createHmac('sha256', config.razorpay.keySecret)
      .update(`${razorpayOrderId}|${razorpayPaymentId}`)
      .digest('hex');

    if (expectedSignature !== razorpaySignature) {
      throw new PaymentError('Payment signature verification failed');
    }

    const order = await prisma.order.findUnique({
      where: { id: orderId },
      include: {
        user: true,
        items: true,
        address: true,
      },
    });

    if (!order) throw new NotFoundError('Order');

    // Update payment
    await prisma.$transaction([
      prisma.payment.update({
        where: { orderId },
        data: {
          status: PaymentStatus.PAID,
          razorpayPaymentId,
          razorpaySignature,
          paidAt: new Date(),
        },
      }),
      prisma.order.update({
        where: { id: orderId },
        data: {
          paymentStatus: PaymentStatus.PAID,
          status: OrderStatus.CONFIRMED,
        },
      }),
      prisma.orderStatusHistory.create({
        data: {
          orderId,
          status: OrderStatus.CONFIRMED,
          comment: 'Payment received via Razorpay',
        },
      }),
    ]);

    // Reduce inventory
    await this.reduceInventory(order.items);

    // Send notifications
    const addressText = `${order.address.addressLine1}, ${order.address.city}`;
    emailService
      .sendOrderConfirmation(order.user.email, order.user.firstName, order.orderNumber, {
        items: order.items.map((i) => ({
          name: i.productName,
          variant: i.variantInfo || '',
          qty: i.quantity,
          price: i.total,
        })),
        total: order.total,
        address: addressText,
      })
      .catch((e) => logger.error('Email notification failed:', e));

    if (order.user.phone) {
      whatsAppService
        .sendOrderConfirmation(order.user.phone, order.orderNumber, order.total)
        .catch((e) => logger.error('WhatsApp notification failed:', e));
    }
  }

  async handleWebhook(body: string, signature: string): Promise<void> {
    // Verify webhook signature
    const expectedSignature = crypto
      .createHmac('sha256', config.razorpay.webhookSecret)
      .update(body)
      .digest('hex');

    if (expectedSignature !== signature) {
      throw new PaymentError('Webhook signature invalid');
    }

    const event = JSON.parse(body);
    logger.info('Razorpay webhook received:', { event: event.event });

    switch (event.event) {
      case 'payment.captured':
        // Payment already handled via verifyPayment
        break;
      case 'payment.failed':
        await this.handlePaymentFailed(event.payload.payment.entity);
        break;
      case 'refund.processed':
        await this.handleRefundProcessed(event.payload.refund.entity);
        break;
      default:
        logger.info(`Unhandled webhook event: ${event.event}`);
    }
  }

  private async handlePaymentFailed(payment: {
    order_id: string;
    error_description: string;
  }): Promise<void> {
    const paymentRecord = await prisma.payment.findUnique({
      where: { razorpayOrderId: payment.order_id },
    });

    if (!paymentRecord) return;

    await prisma.payment.update({
      where: { id: paymentRecord.id },
      data: {
        status: PaymentStatus.FAILED,
        failureReason: payment.error_description,
      },
    });
  }

  private async handleRefundProcessed(refund: {
    payment_id: string;
    id: string;
    amount: number;
  }): Promise<void> {
    const paymentRecord = await prisma.payment.findUnique({
      where: { razorpayPaymentId: refund.payment_id },
    });

    if (!paymentRecord) return;

    await prisma.payment.update({
      where: { id: paymentRecord.id },
      data: {
        status: PaymentStatus.REFUNDED,
        refundId: refund.id,
        refundAmount: refund.amount / 100,
        refundedAt: new Date(),
      },
    });

    await prisma.order.update({
      where: { id: paymentRecord.orderId },
      data: { paymentStatus: PaymentStatus.REFUNDED },
    });
  }

  private async reduceInventory(
    items: Array<{ variantId: string; quantity: number; productId: string; productName: string }>
  ): Promise<void> {
    for (const item of items) {
      await prisma.$transaction([
        prisma.productVariant.update({
          where: { id: item.variantId },
          data: { stock: { decrement: item.quantity } },
        }),
        prisma.inventory.update({
          where: {
            productId_variantId: {
              productId: item.productId,
              variantId: item.variantId,
            },
          },
          data: { stock: { decrement: item.quantity } },
        }),
        prisma.inventoryTransaction.create({
          data: {
            variantId: item.variantId,
            quantity: -item.quantity,
            reason: 'sale',
            reference: item.productName,
          },
        }),
      ]);
    }
  }
}

export default new PaymentService();
