import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DocumentsController } from './documents.controller';
import { DocumentsService } from './documents.service';
import { Document } from './entities/document.entity';

import { ConfigModule } from '@nestjs/config';
import { StorageService } from '../../common/services/storage.service';

@Module({
  imports: [TypeOrmModule.forFeature([Document]), ConfigModule],
  controllers: [DocumentsController],
  providers: [DocumentsService, StorageService],
  exports: [DocumentsService],
})
export class DocumentsModule {}
