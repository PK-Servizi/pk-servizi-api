import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
} from '@nestjs/common';
import { UserSubscriptionsService } from '../../modules/subscriptions/user-subscriptions.service';
import { Reflector } from '@nestjs/core';

@Injectable()
export class SubscriptionGuard implements CanActivate {
  constructor(
    private readonly userSubscriptionsService: UserSubscriptionsService,
    private readonly reflector: Reflector,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const user = request.user;

    if (!user) {
      return false; // User not authenticated (should be handled by AuthGuard)
    }

    // Bypass for Admins and Operators if needed
    // if (user.role === 'admin' || user.role === 'operator') return true;

    const activeSubscription =
      await this.userSubscriptionsService.findActiveByUser(user.id);

    if (!activeSubscription) {
      throw new ForbiddenException(
        'Active subscription required to access this service.',
      );
    }

    return true;
  }
}
