import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserSubscription } from './entities/user-subscription.entity';
import { CreateUserSubscriptionDto } from './dto/create-user-subscription.dto';
import { UpdateUserSubscriptionDto } from './dto/update-user-subscription.dto';

@Injectable()
export class UserSubscriptionsService {
  constructor(
    @InjectRepository(UserSubscription)
    private readonly subscriptionRepository: Repository<UserSubscription>,
  ) {}

  async create(dto: CreateUserSubscriptionDto): Promise<UserSubscription> {
    const activeSubscription = await this.subscriptionRepository.findOne({
      where: { userId: dto.userId, status: 'active' },
    });

    if (activeSubscription) {
      throw new BadRequestException('User already has an active subscription');
    }

    const subscription = this.subscriptionRepository.create({
      ...dto,
      startDate: new Date(dto.startDate),
      endDate: dto.endDate ? new Date(dto.endDate) : null,
    });

    return this.subscriptionRepository.save(subscription);
  }

  async findByUser(userId: string): Promise<UserSubscription[]> {
    return this.subscriptionRepository.find({
      where: { userId },
      relations: ['plan'],
      order: { createdAt: 'DESC' },
    });
  }

  async findActiveByUser(userId: string): Promise<UserSubscription | null> {
    return this.subscriptionRepository.findOne({
      where: { userId, status: 'active' },
      relations: ['plan'],
    });
  }

  async findOne(id: string): Promise<UserSubscription> {
    const subscription = await this.subscriptionRepository.findOne({
      where: { id },
      relations: ['user', 'plan'],
    });
    if (!subscription) throw new NotFoundException('Subscription not found');
    return subscription;
  }

  async update(
    id: string,
    dto: UpdateUserSubscriptionDto,
  ): Promise<UserSubscription> {
    await this.findOne(id);
    const updateData = {
      ...dto,
      startDate: dto.startDate ? new Date(dto.startDate) : undefined,
      endDate: dto.endDate ? new Date(dto.endDate) : undefined,
    };
    await this.subscriptionRepository.update(id, updateData);
    return this.findOne(id);
  }

  async cancel(id: string): Promise<UserSubscription> {
    const subscription = await this.findOne(id);
    subscription.status = 'cancelled';
    subscription.autoRenew = false;
    return this.subscriptionRepository.save(subscription);
  }
}
