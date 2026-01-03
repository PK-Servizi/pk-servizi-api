import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ServiceRequestsController } from './service-requests.controller';
import { ServiceRequestsService } from './service-requests.service';
import { ServiceTypesController } from './service-types.controller';
import { ServiceTypesService } from './service-types.service';
import { ServiceRequest } from './entities/service-request.entity';
import { ServiceType } from './entities/service-type.entity';
import { RequestStatusHistory } from './entities/request-status-history.entity';
import { SubscriptionsModule } from '../subscriptions/subscriptions.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      ServiceRequest,
      ServiceType,
      RequestStatusHistory,
    ]),
    SubscriptionsModule,
  ],
  controllers: [ServiceRequestsController, ServiceTypesController],
  providers: [ServiceRequestsService, ServiceTypesService],
  exports: [ServiceRequestsService, ServiceTypesService],
})
export class ServiceRequestsModule {}
