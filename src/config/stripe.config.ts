import { ConfigService } from '@nestjs/config';

export const stripeConfig = (config: ConfigService) => ({
  apiKey: config.get<string>('STRIPE_SECRET_KEY'),
  apiVersion: '2023-10-16' as const,
  webhookSecret: config.get<string>('STRIPE_WEBHOOK_SECRET'),
  currency: config.get<string>('STRIPE_CURRENCY', 'EUR'),
});
