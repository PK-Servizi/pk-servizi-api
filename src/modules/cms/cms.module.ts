import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CmsService } from './cms.service';
import { CmsController } from './cms.controller';
import { CmsContent } from './entities/cms-content.entity';

@Module({
  imports: [TypeOrmModule.forFeature([CmsContent])],
  controllers: [CmsController],
  providers: [CmsService],
  exports: [CmsService],
})
export class CmsModule {}
