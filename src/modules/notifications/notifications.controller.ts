import {
  Controller,
  Get,
  Post,
  Delete,
  Patch,
  Param,
  Body,
  UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { NotificationsService } from './notifications.service';
import { SendNotificationDto } from './dto/send-notification.dto';
import { BroadcastNotificationDto } from './dto/broadcast-notification.dto';
import { SendToRoleDto } from './dto/send-to-role.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { PermissionsGuard } from '../../common/guards/permissions.guard';
import { Permissions } from '../../common/decorators/permissions.decorator';
import { CurrentUser } from '../auth/decorators/current-user.decorator';

@ApiTags('Notifications')
@Controller('notifications')
@UseGuards(JwtAuthGuard, PermissionsGuard)
export class NotificationsController {
  constructor(private readonly notificationsService: NotificationsService) {}

  // Customer Routes
  @Get('my')
  @Permissions('notifications:read_own')
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'List my notifications' })
  findMy(@CurrentUser() user: any) {
    return this.notificationsService.findByUser(user.id);
  }

  @Get('unread-count')
  @Permissions('notifications:read_own')
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Get unread count' })
  getUnreadCount(@CurrentUser() user: any) {
    return this.notificationsService.getUnreadCount(user.id);
  }

  @Patch(':id/read')
  @Permissions('notifications:write_own')
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Mark as read' })
  markAsRead(@Param('id') id: string, @CurrentUser() user: any) {
    return this.notificationsService.markAsRead(id, user.id);
  }

  @Patch('mark-all-read')
  @Permissions('notifications:write_own')
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Mark all as read' })
  markAllAsRead(@CurrentUser() user: any) {
    return this.notificationsService.markAllAsRead(user.id);
  }

  @Delete(':id')
  @Permissions('notifications:delete_own')
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Delete notification' })
  remove(@Param('id') id: string, @CurrentUser() user: any) {
    return this.notificationsService.remove(id);
  }

  // Admin Routes
  @Post('send')
  @Permissions('notifications:write')
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Send notification' })
  send(@Body() dto: SendNotificationDto) {
    return this.notificationsService.send(dto);
  }

  @Post('broadcast')
  @Permissions('notifications:broadcast')
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Broadcast to all users' })
  broadcast(@Body() dto: BroadcastNotificationDto) {
    return this.notificationsService.broadcast(dto);
  }

  @Post('send-to-role')
  @Permissions('notifications:write')
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Send to role' })
  sendToRole(@Body() dto: SendToRoleDto) {
    return this.notificationsService.sendToRole(dto);
  }
}