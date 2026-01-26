import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ServicesController } from './services.controller';
import { ServicesService } from './services.service';
import { Service } from './entities/service.entity';
import { ServiceType } from '../service-types/entities/service-type.entity';
import { User } from '../users/entities/user.entity';
import { Faq } from '../faqs/entities/faq.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Service, ServiceType, User, Faq])],
  controllers: [ServicesController],
  providers: [ServicesService],
  exports: [ServicesService],
})
export class ServicesModule {}
