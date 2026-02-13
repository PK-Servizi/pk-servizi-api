import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FaqsService } from './faqs.service';
import { FaqsController } from './faqs.controller';
import { Faq } from './entities/faq.entity';
import { Service } from '../services/entities/service.entity';
import { GuardsModule } from '../../common/modules/guards.module';

@Module({
  imports: [TypeOrmModule.forFeature([Faq, Service]), GuardsModule],
  controllers: [FaqsController],
  providers: [FaqsService],
  exports: [FaqsService],
})
export class FaqsModule {}
