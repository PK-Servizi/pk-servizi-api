import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SubscriptionPlansController } from './subscription-plans.controller';
import { SubscriptionPlansService } from './subscription-plans.service';
import { UserSubscriptionsController } from './user-subscriptions.controller';
import { UserSubscriptionsService } from './user-subscriptions.service';
import { SubscriptionPlan } from './entities/subscription-plan.entity';
import { UserSubscription } from './entities/user-subscription.entity';

@Module({
  imports: [TypeOrmModule.forFeature([SubscriptionPlan, UserSubscription])],
  controllers: [SubscriptionPlansController, UserSubscriptionsController],
  providers: [SubscriptionPlansService, UserSubscriptionsService],
  exports: [SubscriptionPlansService, UserSubscriptionsService],
})
export class SubscriptionsModule {}
