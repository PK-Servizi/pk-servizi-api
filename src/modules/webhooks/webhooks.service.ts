import { Injectable } from '@nestjs/common';

@Injectable()
export class WebhooksService {
  async handleStripeWebhook(body: any, signature: string): Promise<any> {
    return { received: true };
  }
}