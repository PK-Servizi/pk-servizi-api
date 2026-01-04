import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ServiceType } from './entities/service-type.entity';
import { CreateServiceTypeDto } from './dto/create-service-type.dto';
import { UpdateServiceTypeDto } from './dto/update-service-type.dto';

@Injectable()
export class ServiceTypesService {
  constructor(
    @InjectRepository(ServiceType)
    private serviceTypeRepository: Repository<ServiceType>,
  ) {}

  async findActive(): Promise<any> {
    return { success: true, data: [] };
  }

  async findOne(id: string): Promise<any> {
    return { success: true, data: {} };
  }

  async getSchema(id: string): Promise<any> {
    return { success: true, data: {} };
  }

  async create(dto: CreateServiceTypeDto): Promise<any> {
    return { success: true, message: 'Service type created' };
  }

  async update(id: string, dto: UpdateServiceTypeDto): Promise<any> {
    return { success: true, message: 'Service type updated' };
  }

  async remove(id: string): Promise<any> {
    return { success: true, message: 'Service type deleted' };
  }

  async activate(id: string): Promise<any> {
    return { success: true, message: 'Service type activated' };
  }
}