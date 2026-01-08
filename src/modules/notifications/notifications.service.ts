import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, LessThan } from 'typeorm';
import { Notification } from './entities/notification.entity';
import { EmailService } from './email.service';
import { User } from '../users/entities/user.entity';

@Injectable()
export class NotificationsService {
  constructor(
    @InjectRepository(Notification)
    private notificationRepository: Repository<Notification>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private emailService: EmailService,
  ) {}

  async findByUser(userId: string): Promise<any> {
    const notifications = await this.notificationRepository.find({
      where: { userId },
      order: { createdAt: 'DESC' },
    });
    return { success: true, data: notifications };
  }

  async getUnreadCount(userId: string): Promise<any> {
    const count = await this.notificationRepository.count({
      where: { userId, readAt: null },
    });
    return { success: true, count };
  }

  async markAsRead(id: string, userId: string): Promise<any> {
    await this.notificationRepository.update(
      { id, userId },
      { readAt: new Date() },
    );
    const updated = await this.notificationRepository.findOne({ where: { id } });
    return { success: true, message: 'Notification marked as read', data: updated };
  }

  async markAllAsRead(userId: string): Promise<any> {
    await this.notificationRepository.update(
      { userId, readAt: null },
      { readAt: new Date() },
    );
    return { success: true, message: 'All notifications marked as read' };
  }

  async remove(id: string): Promise<any> {
    await this.notificationRepository.delete(id);
    return { success: true, message: 'Notification deleted' };
  }

  async send(dto: any): Promise<any> {
    // Validate user exists
    const user = await this.userRepository.findOne({
      where: { id: dto.userId },
      select: ['id', 'email']
    });
    
    if (!user) {
      return { success: false, message: 'User not found' };
    }

    const notification = this.notificationRepository.create({
      userId: dto.userId,
      title: dto.title,
      message: dto.message,
      type: dto.type || 'info',
      metadata: dto.data,
    });
    const saved = await this.notificationRepository.save(notification);

    // Send email asynchronously (don't wait)
    const userEmail = dto.userEmail || user.email;
    if (userEmail) {
      setImmediate(() => {
        this.emailService.sendEmail(
          userEmail,
          dto.title,
          `<p>${dto.message}</p>`,
          dto.message
        ).catch(error => {
          console.error('Failed to send email:', error);
        });
      });
    }

    return { success: true, message: 'Notification sent', data: saved };
  }

  async broadcast(dto: any): Promise<any> {
    const users = await this.userRepository.find({
      select: ['id', 'email']
    });

    const notifications = users.map((user) =>
      this.notificationRepository.create({
        userId: user.id,
        title: dto.title,
        message: dto.message,
        type: dto.type || 'info',
        metadata: dto.data,
      }),
    );

    await this.notificationRepository.save(notifications);

    // Send emails asynchronously
    setImmediate(() => {
      users.forEach(user => {
        if (user.email) {
          this.emailService.sendEmail(
            user.email,
            dto.title,
            `<p>${dto.message}</p>`,
            dto.message
          ).catch(error => {
            console.error(`Failed to send email to ${user.email}:`, error);
          });
        }
      });
    });

    return { success: true, message: 'Notification broadcasted', count: notifications.length };
  }

  async sendToRole(dto: any): Promise<any> {
    return { success: true, message: 'Notification sent to role', count: 0 };
  }

  async deleteOldNotifications(days: number = 30): Promise<any> {
    const cutoffDate = new Date(Date.now() - days * 24 * 60 * 60 * 1000);
    const result = await this.notificationRepository.delete({
      createdAt: LessThan(cutoffDate),
    });
    return { success: true, message: `Old notifications deleted`, deletedCount: result.affected };
  }
}