import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseGuards,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiBearerAuth,
  ApiQuery,
} from '@nestjs/swagger';
import { NotificationsService } from './notifications.service';
import { CreateNotificationDto } from './dto/create-notification.dto';
import { UpdateNotificationDto } from './dto/update-notification.dto';
import { MarkNotificationReadDto } from './dto/mark-notification-read.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';

@ApiTags('notifications')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('notifications')
export class NotificationsController {
  constructor(private readonly notificationsService: NotificationsService) {}

  @Post()
  @ApiOperation({ summary: 'Create notification' })
  create(@Body() createNotificationDto: CreateNotificationDto) {
    return this.notificationsService.create(createNotificationDto);
  }

  @Post('bulk')
  @ApiOperation({ summary: 'Create bulk notifications' })
  createBulk(@Body() createNotificationDto: CreateNotificationDto) {
    return this.notificationsService.sendBulkNotification(
      [createNotificationDto.userId],
      createNotificationDto.title,
      createNotificationDto.message,
      createNotificationDto.type,
    );
  }

  @Get()
  @ApiOperation({ summary: 'Get current user notifications' })
  @ApiQuery({ name: 'unreadOnly', required: false, type: Boolean })
  findAll(@CurrentUser() user: any, @Query('unreadOnly') unreadOnly?: boolean) {
    return unreadOnly
      ? this.notificationsService.findUnreadByUser(user.id)
      : this.notificationsService.findByUser(user.id);
  }

  @Get('my-notifications')
  @ApiOperation({ summary: 'Get current user notifications' })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiQuery({ name: 'unreadOnly', required: false, type: Boolean })
  findMyNotifications(
    @CurrentUser() user: any,
    @Query('page') page?: number,
    @Query('limit') limit?: number,
    @Query('unreadOnly') unreadOnly?: boolean,
  ) {
    return unreadOnly
      ? this.notificationsService.findUnreadByUser(user.id)
      : this.notificationsService.findByUser(user.id);
  }

  @Get('unread-count')
  @ApiOperation({ summary: 'Get unread notifications count for current user' })
  getUnreadCount(@CurrentUser() user: any) {
    return this.notificationsService.getUnreadCount(user.id);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get notification by ID' })
  findOne(@Param('id') id: string) {
    return this.notificationsService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update notification' })
  update(
    @Param('id') id: string,
    @Body() updateNotificationDto: UpdateNotificationDto,
  ) {
    return this.notificationsService.update(id, updateNotificationDto);
  }

  @Patch(':id/read')
  @ApiOperation({ summary: 'Mark notification as read' })
  markAsRead(
    @Param('id') id: string,
    @Body() markReadDto: MarkNotificationReadDto,
  ) {
    return this.notificationsService.markAsRead(id, markReadDto);
  }

  @Post('mark-all-read')
  @ApiOperation({ summary: 'Mark all notifications as read for current user' })
  markAllAsRead(@CurrentUser() user: any) {
    return this.notificationsService.markAllAsRead(user.id);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete notification' })
  remove(@Param('id') id: string) {
    return this.notificationsService.remove(id);
  }

  @Delete('user/clear-all')
  @ApiOperation({ summary: 'Clear all notifications for current user' })
  clearAllForUser() {
    return { message: 'Feature not implemented yet' };
  }
}
