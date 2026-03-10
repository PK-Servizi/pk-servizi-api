import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Contact } from './entities/contact.entity';
import { ContactsService } from './contacts.service';
import { ContactsController } from './contacts.controller';
import { NotificationsModule } from '../notifications/notifications.module';
import { GuardsModule } from '../../common/modules/guards.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Contact]),
    NotificationsModule,
    GuardsModule,
  ],
  controllers: [ContactsController],
  providers: [ContactsService],
  exports: [ContactsService],
})
export class ContactsModule {}
