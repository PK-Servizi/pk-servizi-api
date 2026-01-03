import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from '../decorators/roles.decorator';
import { RoleEnum } from '../../modules/roles/role.enum';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<RoleEnum[]>(
      ROLES_KEY,
      [context.getHandler(), context.getClass()],
    );
    if (!requiredRoles || requiredRoles.length === 0) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const user = request.user;
    if (!user) {
      throw new UnauthorizedException('User not authenticated');
    }
    let userRoleName: string | null = null;

    if (user.role) {
      if (typeof user.role === 'object' && user.role.name) {
        userRoleName = user.role.name;
      } else if (typeof user.role === 'string') {
        userRoleName = user.role;
      }
    }
    if (!userRoleName) {
      throw new ForbiddenException('User has no assigned role');
    }
    const hasRequiredRole = requiredRoles.some((requiredRole) => {
      return (
        requiredRole === userRoleName ||
        requiredRole.toString() === userRoleName ||
        Object.values(RoleEnum).includes(userRoleName as RoleEnum)
      );
    });

    if (!hasRequiredRole) {
      throw new ForbiddenException(
        `Access denied. Required roles: ${requiredRoles.join(', ')}. User role: ${userRoleName}`,
      );
    }

    return true;
  }
}
