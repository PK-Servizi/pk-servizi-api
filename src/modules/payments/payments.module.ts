import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PaymentsService } from './payments.service';
import { PaymentsController } from './payments.controller';
import { Payment } from './entities/payment.entity';

import { ConfigModule } from '@nestjs/config';
import { SubscriptionsModule } from '../subscriptions/subscriptions.module';
import { StripeService } from './stripe.service';
import { StripeWebhookController } from './stripe-webhook.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([Payment]),
    ConfigModule,
    SubscriptionsModule,
  ],
  controllers: [PaymentsController, StripeWebhookController],
  providers: [PaymentsService, StripeService],
  exports: [PaymentsService, StripeService],
})
export class PaymentsModule {}
