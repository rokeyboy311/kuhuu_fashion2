import nodemailer from 'nodemailer';
import config from '../config';
import logger from '../utils/logger';

class EmailService {
  private transporter: nodemailer.Transporter;

  constructor() {
    this.transporter = nodemailer.createTransport({
      host: config.smtp.host,
      port: config.smtp.port,
      secure: config.smtp.secure,
      auth: {
        user: config.smtp.user,
        pass: config.smtp.pass,
      },
    });
  }

  private async send(options: {
    to: string;
    subject: string;
    html: string;
  }): Promise<void> {
    try {
      await this.transporter.sendMail({
        from: config.smtp.from,
        ...options,
      });
      logger.info(`Email sent to ${options.to}: ${options.subject}`);
    } catch (error) {
      logger.error('Email send failed:', error);
      throw error;
    }
  }

  async sendWelcomeEmail(email: string, firstName: string): Promise<void> {
    await this.send({
      to: email,
      subject: `Welcome to ${config.app.storeName}! 🎉`,
      html: `
        <div style="font-family: 'Georgia', serif; max-width: 600px; margin: 0 auto; padding: 40px 20px; background: #fff;">
          <div style="text-align: center; margin-bottom: 40px;">
            <h1 style="font-size: 28px; letter-spacing: 4px; text-transform: uppercase; color: #000;">${config.app.storeName}</h1>
          </div>
          <h2 style="font-size: 22px; color: #000; margin-bottom: 16px;">Welcome, ${firstName}!</h2>
          <p style="color: #555; line-height: 1.7; font-size: 16px;">
            Thank you for joining Kuhuu Fashion. Discover our latest collections, exclusive offers, and premium fashion curated just for you.
          </p>
          <div style="margin: 32px 0; text-align: center;">
            <a href="${config.app.frontendUrl}/shop" 
               style="background: #000; color: #fff; padding: 14px 40px; text-decoration: none; font-size: 14px; letter-spacing: 2px; text-transform: uppercase;">
              SHOP NOW
            </a>
          </div>
          <p style="color: #999; font-size: 12px; text-align: center;">
            ${config.app.storeName} • ${config.app.supportEmail}
          </p>
        </div>
      `,
    });
  }

  async sendOrderConfirmation(
    email: string,
    firstName: string,
    orderNumber: string,
    orderDetails: {
      items: Array<{ name: string; variant: string; qty: number; price: number }>;
      total: number;
      address: string;
    }
  ): Promise<void> {
    const itemsHtml = orderDetails.items
      .map(
        (item) => `
        <tr>
          <td style="padding: 12px 0; border-bottom: 1px solid #f0f0f0; color: #333;">${item.name} (${item.variant})</td>
          <td style="padding: 12px 0; border-bottom: 1px solid #f0f0f0; text-align: center; color: #333;">${item.qty}</td>
          <td style="padding: 12px 0; border-bottom: 1px solid #f0f0f0; text-align: right; color: #333;">₹${item.price.toFixed(2)}</td>
        </tr>
      `
      )
      .join('');

    await this.send({
      to: email,
      subject: `Order Confirmed — #${orderNumber} | ${config.app.storeName}`,
      html: `
        <div style="font-family: 'Georgia', serif; max-width: 600px; margin: 0 auto; padding: 40px 20px; background: #fff;">
          <h1 style="font-size: 24px; letter-spacing: 4px; text-align: center; margin-bottom: 32px;">${config.app.storeName}</h1>
          <h2 style="font-size: 20px; color: #000;">Order Confirmed ✓</h2>
          <p style="color: #555; line-height: 1.7;">Hi ${firstName}, your order <strong>#${orderNumber}</strong> has been placed successfully.</p>
          
          <table style="width: 100%; border-collapse: collapse; margin: 24px 0;">
            <thead>
              <tr style="border-bottom: 2px solid #000;">
                <th style="text-align: left; padding: 8px 0; font-size: 12px; text-transform: uppercase; letter-spacing: 1px;">Product</th>
                <th style="text-align: center; padding: 8px 0; font-size: 12px; text-transform: uppercase; letter-spacing: 1px;">Qty</th>
                <th style="text-align: right; padding: 8px 0; font-size: 12px; text-transform: uppercase; letter-spacing: 1px;">Price</th>
              </tr>
            </thead>
            <tbody>${itemsHtml}</tbody>
            <tfoot>
              <tr>
                <td colspan="2" style="padding: 16px 0; font-weight: bold; font-size: 16px;">Total</td>
                <td style="padding: 16px 0; text-align: right; font-weight: bold; font-size: 16px;">₹${orderDetails.total.toFixed(2)}</td>
              </tr>
            </tfoot>
          </table>
          
          <p style="color: #555; line-height: 1.7;"><strong>Shipping to:</strong> ${orderDetails.address}</p>
          
          <div style="margin: 32px 0; text-align: center;">
            <a href="${config.app.frontendUrl}/account/orders" 
               style="background: #000; color: #fff; padding: 14px 40px; text-decoration: none; font-size: 13px; letter-spacing: 2px; text-transform: uppercase;">
              TRACK ORDER
            </a>
          </div>
        </div>
      `,
    });
  }

  async sendShippingUpdate(
    email: string,
    firstName: string,
    orderNumber: string,
    awbNumber: string,
    trackingUrl: string
  ): Promise<void> {
    await this.send({
      to: email,
      subject: `Your order #${orderNumber} has been shipped! 📦`,
      html: `
        <div style="font-family: 'Georgia', serif; max-width: 600px; margin: 0 auto; padding: 40px 20px;">
          <h1 style="font-size: 24px; letter-spacing: 4px; text-align: center;">${config.app.storeName}</h1>
          <h2 style="font-size: 20px; color: #000;">Your Order is on its way! 🚀</h2>
          <p style="color: #555; line-height: 1.7;">Hi ${firstName}, your order <strong>#${orderNumber}</strong> has been shipped.</p>
          <p style="color: #555;">AWB Number: <strong>${awbNumber}</strong></p>
          <div style="margin: 32px 0; text-align: center;">
            <a href="${trackingUrl}" style="background: #000; color: #fff; padding: 14px 40px; text-decoration: none; font-size: 13px; letter-spacing: 2px; text-transform: uppercase;">
              TRACK NOW
            </a>
          </div>
        </div>
      `,
    });
  }

  async sendPasswordResetEmail(email: string, firstName: string, resetUrl: string): Promise<void> {
    await this.send({
      to: email,
      subject: `Reset Your Password — ${config.app.storeName}`,
      html: `
        <div style="font-family: 'Georgia', serif; max-width: 600px; margin: 0 auto; padding: 40px 20px;">
          <h1 style="font-size: 24px; letter-spacing: 4px; text-align: center;">${config.app.storeName}</h1>
          <h2>Password Reset Request</h2>
          <p style="color: #555; line-height: 1.7;">Hi ${firstName}, we received a request to reset your password. Click the button below to create a new password. This link expires in 1 hour.</p>
          <div style="margin: 32px 0; text-align: center;">
            <a href="${resetUrl}" style="background: #000; color: #fff; padding: 14px 40px; text-decoration: none; font-size: 13px; letter-spacing: 2px; text-transform: uppercase;">
              RESET PASSWORD
            </a>
          </div>
          <p style="color: #999; font-size: 12px;">If you didn't request this, please ignore this email.</p>
        </div>
      `,
    });
  }

  async sendOrderCancellationEmail(
    email: string,
    firstName: string,
    orderNumber: string,
    reason?: string
  ): Promise<void> {
    await this.send({
      to: email,
      subject: `Order #${orderNumber} Cancelled — ${config.app.storeName}`,
      html: `
        <div style="font-family: 'Georgia', serif; max-width: 600px; margin: 0 auto; padding: 40px 20px;">
          <h1 style="font-size: 24px; letter-spacing: 4px; text-align: center;">${config.app.storeName}</h1>
          <h2>Order Cancelled</h2>
          <p style="color: #555; line-height: 1.7;">Hi ${firstName}, your order <strong>#${orderNumber}</strong> has been cancelled.${reason ? ` Reason: ${reason}` : ''}</p>
          <p style="color: #555;">If you paid online, your refund will be processed within 5–7 business days.</p>
          <div style="margin: 32px 0; text-align: center;">
            <a href="${config.app.frontendUrl}/shop" style="background: #000; color: #fff; padding: 14px 40px; text-decoration: none; font-size: 13px; letter-spacing: 2px; text-transform: uppercase;">
              CONTINUE SHOPPING
            </a>
          </div>
        </div>
      `,
    });
  }
}

export default new EmailService();
