import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SubscriptionPlan } from './entities/subscription-plan.entity';
import { CreateSubscriptionPlanDto } from './dto/create-subscription-plan.dto';
import { UpdateSubscriptionPlanDto } from './dto/update-subscription-plan.dto';

@Injectable()
export class SubscriptionPlansService {
  constructor(
    @InjectRepository(SubscriptionPlan)
    private planRepository: Repository<SubscriptionPlan>,
  ) {}

  async findActive(): Promise<any> {
    return { success: true, data: [] };
  }

  async findAll(): Promise<any> {
    return { success: true, data: [] };
  }

  async create(dto: CreateSubscriptionPlanDto): Promise<any> {
    return { success: true, message: 'Plan created' };
  }

  async update(id: string, dto: UpdateSubscriptionPlanDto): Promise<any> {
    return { success: true, message: 'Plan updated' };
  }

  async findOne(id: string): Promise<any> {
    return { success: true, data: {} };
  }

  async deactivate(id: string): Promise<any> {
    return { success: true, message: 'Plan deactivated' };
  }

  async getComparison(): Promise<any> {
    return { success: true, data: [] };
  }
}