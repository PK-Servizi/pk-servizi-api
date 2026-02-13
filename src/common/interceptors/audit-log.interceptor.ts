import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  Logger,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { AuditService } from '../../modules/audit/audit.service';
import {
  AUDIT_LOG_KEY,
  AuditLogMetadata,
} from '../decorators/audit-log.decorator';

@Injectable()
export class AuditLogInterceptor implements NestInterceptor {
  private readonly logger = new Logger(AuditLogInterceptor.name);

  constructor(
    private reflector: Reflector,
    private auditService: AuditService,
  ) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const metadata = this.reflector.get<AuditLogMetadata>(
      AUDIT_LOG_KEY,
      context.getHandler(),
    );

    if (!metadata) {
      return next.handle();
    }

    const request = context.switchToHttp().getRequest();
    const user = request.user;
    const { action, resourceType, captureOldValues } = metadata;

    const resourceId = request.params?.id || request.body?.id || 'N/A';
    const ipAddress = request.ip || request.connection?.remoteAddress;
    const userAgent = request.headers['user-agent'];

    return next.handle().pipe(
      tap((response) => {
        // Fire and forget - don't await
        this.auditService
          .create({
            userId: user?.id,
            action,
            resourceType,
            resourceId,
            oldValues: captureOldValues ? request.body : undefined,
            newValues: response?.data || response,
            ipAddress,
            userAgent,
          })
          .then(() => {
            this.logger.debug(`Audit log created: ${action}`);
          })
          .catch((error) => {
            this.logger.error(`Failed to create audit log: ${error.message}`);
          });
      }),
    );
  }
}
