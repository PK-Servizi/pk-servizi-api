import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ServiceRequestsController } from './service-requests.controller';
import { ServiceRequestsService } from './service-requests.service';
import { ServiceRequest } from './entities/service-request.entity';
import { Service } from '../services/entities/service.entity';
import { RequestStatusHistory } from './entities/request-status-history.entity';
import { IseeRequest } from './entities/isee-request.entity';
import { Modello730Request } from './entities/modello-730-request.entity';
import { ImuRequest } from './entities/imu-request.entity';
import { Document } from '../documents/entities/document.entity';
import { Payment } from '../payments/entities/payment.entity';
import { User } from '../users/entities/user.entity';
import { UserSubscription } from '../subscriptions/entities/user-subscription.entity';
import { SubscriptionPlan } from '../subscriptions/entities/subscription-plan.entity';
import { SubscriptionsModule } from '../subscriptions/subscriptions.module';
import { NotificationsModule } from '../notifications/notifications.module';
import { UsersModule } from '../users/users.module';
import { AwsModule } from '../aws/aws.module';
import { PaymentsModule } from '../payments/payments.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      ServiceRequest,
      Service,
      RequestStatusHistory,
      IseeRequest,
      Modello730Request,
      ImuRequest,
      Document,
      Payment,
      User,
      UserSubscription,
      SubscriptionPlan,
    ]),
    SubscriptionsModule,
    NotificationsModule,
    UsersModule,
    AwsModule,
    PaymentsModule,
  ],
  controllers: [ServiceRequestsController],
  providers: [ServiceRequestsService],
  exports: [ServiceRequestsService],
})
export class ServiceRequestsModule {}
