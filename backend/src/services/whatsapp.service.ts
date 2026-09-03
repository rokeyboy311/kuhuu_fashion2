import twilio from 'twilio';
import config from '../config';
import logger from '../utils/logger';

class WhatsAppService {
  private client: twilio.Twilio | null = null;

  constructor() {
    if (config.twilio.accountSid && config.twilio.authToken) {
      this.client = twilio(config.twilio.accountSid, config.twilio.authToken);
    }
  }

  private async send(to: string, message: string): Promise<void> {
    if (!this.client) {
      logger.warn('WhatsApp: Twilio not configured, skipping message');
      return;
    }

    try {
      await this.client.messages.create({
        from: config.twilio.whatsappFrom,
        to: `whatsapp:${to}`,
        body: message,
      });
      logger.info(`WhatsApp message sent to ${to}`);
    } catch (error) {
      logger.error('WhatsApp send failed:', error);
    }
  }

  async sendOrderConfirmation(phone: string, orderNumber: string, total: number): Promise<void> {
    const message = `✅ *Order Confirmed!*\n\nHi! Your order *#${orderNumber}* has been confirmed.\n\n💰 Total: ₹${total.toFixed(2)}\n\nWe'll notify you once it's packed and shipped.\n\nThank you for shopping with *Kuhuu Fashion* 🛍️`;
    await this.send(phone, message);
  }

  async sendShippingUpdate(
    phone: string,
    orderNumber: string,
    awbNumber: string,
    trackingUrl: string
  ): Promise<void> {
    const message = `📦 *Order Shipped!*\n\nYour order *#${orderNumber}* is on its way!\n\n🚀 AWB: ${awbNumber}\n📍 Track: ${trackingUrl}\n\n*Kuhuu Fashion* 🛍️`;
    await this.send(phone, message);
  }

  async sendDeliveryConfirmation(phone: string, orderNumber: string): Promise<void> {
    const message = `🎉 *Order Delivered!*\n\nYour order *#${orderNumber}* has been delivered.\n\nWe hope you love your purchase! Don't forget to leave a review.\n\n*Kuhuu Fashion* 🛍️`;
    await this.send(phone, message);
  }

  async sendOrderCancellation(phone: string, orderNumber: string): Promise<void> {
    const message = `❌ *Order Cancelled*\n\nYour order *#${orderNumber}* has been cancelled.\n\nIf you paid online, your refund will be processed in 5–7 business days.\n\n*Kuhuu Fashion* 🛍️`;
    await this.send(phone, message);
  }

  async sendCODReminder(phone: string, orderNumber: string, amount: number): Promise<void> {
    const message = `🏠 *Out for Delivery!*\n\nYour order *#${orderNumber}* is out for delivery today!\n\n💵 Please keep ₹${amount.toFixed(2)} ready for COD.\n\n*Kuhuu Fashion* 🛍️`;
    await this.send(phone, message);
  }
}

export default new WhatsAppService();
