import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { APP_GUARD, APP_INTERCEPTOR, APP_FILTER } from '@nestjs/core';

import { UsersModule } from './modules/users/users.module';
import { RolesModule } from './modules/roles/roles.module';
import { AuthModule } from './modules/auth/auth.module';
import { PermissionsModule } from './modules/permissions/permissions.module';
import { RolePermissionsModule } from './modules/role-permissions/role-permissions.module';
import { AuditModule } from './modules/audit/audit.module';
import { CmsModule } from './modules/cms/cms.module';
import { CoursesModule } from './modules/courses/courses.module';
import { PaymentsModule } from './modules/payments/payments.module';
import { NotificationsModule } from './modules/notifications/notifications.module';
import { ServiceRequestsModule } from './modules/service-requests/service-requests.module';
import { DocumentsModule } from './modules/documents/documents.module';
import { AppointmentsModule } from './modules/appointments/appointments.module';
import { SubscriptionsModule } from './modules/subscriptions/subscriptions.module';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import databaseConfig from './config/database.config';
import { GlobalExceptionFilter } from './common/filters/global-exception.filter';
import { ResponseInterceptor } from './common/interceptor/response.interceptor';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env.local', '.env'],
      cache: true,
      expandVariables: true,
    }),

    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: databaseConfig,
      inject: [ConfigService],
    }),

    ThrottlerModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        throttlers: [
          {
            ttl: config.get<number>('THROTTLE_TTL', 60000),
            limit: config.get<number>('THROTTLE_LIMIT', 100),
          },
        ],
      }),
    }),

    UsersModule,
    RolesModule,
    AuthModule,
    PermissionsModule,
    RolePermissionsModule,
    AuditModule,
    CmsModule,
    CoursesModule,
    PaymentsModule,
    NotificationsModule,
    ServiceRequestsModule,
    DocumentsModule,
    AppointmentsModule,
    SubscriptionsModule,
  ],
  controllers: [AppController],
  providers: [
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: ResponseInterceptor,
    },
    {
      provide: APP_FILTER,
      useClass: GlobalExceptionFilter,
    },
    AppService,
  ],
})
export class AppModule {}
