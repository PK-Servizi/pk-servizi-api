import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { WebhooksController } from './webhooks.controller';
import { WebhooksService } from './webhooks.service';
import { User } from '../users/entities/user.entity';
import { Payment } from '../payments/entities/payment.entity';
import { UserSubscription } from '../subscriptions/entities/user-subscription.entity';
import { PaymentsModule } from '../payments/payments.module';
import { NotificationsModule } from '../notifications/notifications.module';
import { ServiceRequestsModule } from '../service-requests/service-requests.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, Payment, UserSubscription]),
    PaymentsModule,
    NotificationsModule,
    ServiceRequestsModule,
  ],
  controllers: [WebhooksController],
  providers: [WebhooksService],
})
export class WebhooksModule {}
