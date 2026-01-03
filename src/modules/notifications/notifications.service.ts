import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Notification } from './entities/notification.entity';
import { CreateNotificationDto } from './dto/create-notification.dto';
import { UpdateNotificationDto } from './dto/update-notification.dto';
import { MarkNotificationReadDto } from './dto/mark-notification-read.dto';

@Injectable()
export class NotificationsService {
  constructor(
    @InjectRepository(Notification)
    private readonly notificationRepository: Repository<Notification>,
  ) {}

  async create(dto: CreateNotificationDto): Promise<Notification> {
    const notification = this.notificationRepository.create({
      ...dto,
      readAt: dto.readAt ? new Date(dto.readAt) : null,
    });
    return this.notificationRepository.save(notification);
  }

  async findByUser(userId: string): Promise<Notification[]> {
    return this.notificationRepository.find({
      where: { userId },
      order: { createdAt: 'DESC' },
    });
  }

  async findUnreadByUser(userId: string): Promise<Notification[]> {
    return this.notificationRepository.find({
      where: { userId, isRead: false },
      order: { createdAt: 'DESC' },
    });
  }

  async getUnreadCount(userId: string): Promise<number> {
    return this.notificationRepository.count({
      where: { userId, isRead: false },
    });
  }

  async findOne(id: string): Promise<Notification> {
    const notification = await this.notificationRepository.findOne({
      where: { id },
      relations: ['user'],
    });
    if (!notification) throw new NotFoundException('Notification not found');
    return notification;
  }

  async markAsRead(
    id: string,
    dto?: MarkNotificationReadDto,
  ): Promise<Notification> {
    await this.findOne(id);

    const updateData = {
      isRead: dto?.isRead ?? true,
      readAt: dto?.readAt ? new Date(dto.readAt) : new Date(),
    };

    await this.notificationRepository.update(id, updateData);
    return this.findOne(id);
  }

  async markAllAsRead(userId: string): Promise<void> {
    await this.notificationRepository.update(
      { userId, isRead: false },
      { isRead: true, readAt: new Date() },
    );
  }

  async update(id: string, dto: UpdateNotificationDto): Promise<Notification> {
    await this.findOne(id);
    const updateData = {
      ...dto,
      readAt: dto.readAt ? new Date(dto.readAt) : undefined,
    };
    await this.notificationRepository.update(id, updateData);
    return this.findOne(id);
  }

  async remove(id: string): Promise<void> {
    await this.findOne(id);
    await this.notificationRepository.delete(id);
  }

  async sendSystemNotification(
    userId: string,
    title: string,
    message: string,
    type: string = 'info',
    actionUrl?: string,
    metadata?: any,
  ): Promise<Notification> {
    return this.create({
      userId,
      title,
      message,
      type,
      actionUrl,
      metadata,
    });
  }

  async sendBulkNotification(
    userIds: string[],
    title: string,
    message: string,
    type: string = 'info',
  ): Promise<Notification[]> {
    const notifications = userIds.map((userId) =>
      this.notificationRepository.create({
        userId,
        title,
        message,
        type,
      }),
    );

    return this.notificationRepository.save(notifications);
  }
}
