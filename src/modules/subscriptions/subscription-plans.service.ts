import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SubscriptionPlan } from './entities/subscription-plan.entity';
import { CreateSubscriptionPlanDto } from './dto/create-subscription-plan.dto';
import { UpdateSubscriptionPlanDto } from './dto/update-subscription-plan.dto';

@Injectable()
export class SubscriptionPlansService {
  constructor(
    @InjectRepository(SubscriptionPlan)
    private readonly planRepository: Repository<SubscriptionPlan>,
  ) {}

  async create(dto: CreateSubscriptionPlanDto): Promise<SubscriptionPlan> {
    const plan = this.planRepository.create(dto);
    return this.planRepository.save(plan);
  }

  async findAll(): Promise<SubscriptionPlan[]> {
    return this.planRepository.find({ where: { isActive: true } });
  }

  async findOne(id: string): Promise<SubscriptionPlan> {
    const plan = await this.planRepository.findOne({ where: { id } });
    if (!plan) throw new NotFoundException('Subscription plan not found');
    return plan;
  }

  async update(
    id: string,
    dto: UpdateSubscriptionPlanDto,
  ): Promise<SubscriptionPlan> {
    await this.findOne(id);
    await this.planRepository.update(id, dto);
    return this.findOne(id);
  }

  async remove(id: string): Promise<void> {
    await this.findOne(id);
    await this.planRepository.update(id, { isActive: false });
  }
}
