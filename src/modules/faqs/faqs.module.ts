import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FaqsService } from './faqs.service';
import { FaqsController } from './faqs.controller';
import { Faq } from './entities/faq.entity';
import { ServiceType } from '../service-requests/entities/service-type.entity';
import { GuardsModule } from '../../common/modules/guards.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Faq, ServiceType]),
    GuardsModule,
  ],
  controllers: [FaqsController],
  providers: [FaqsService],
  exports: [FaqsService],
})
export class FaqsModule {}
