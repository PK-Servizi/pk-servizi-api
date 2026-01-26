import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
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

  async findAll(): Promise<any> {
    const serviceTypes = await this.serviceTypeRepository.find({
      where: { isActive: true },
      order: { name: 'ASC' },
    });
    return { success: true, data: serviceTypes };
  }

  async findOne(id: string): Promise<any> {
    const serviceType = await this.serviceTypeRepository.findOne({
      where: { id },
      relations: ['services'],
    });
    if (!serviceType) {
      throw new NotFoundException('Service type not found');
    }
    return { success: true, data: serviceType };
  }

  async create(dto: CreateServiceTypeDto): Promise<any> {
    // Check if service type with same name already exists
    const existing = await this.serviceTypeRepository.findOne({
      where: { name: dto.name },
    });
    
    if (existing) {
      throw new ConflictException(`Service type with name "${dto.name}" already exists`);
    }

    const serviceType = this.serviceTypeRepository.create(dto);
    const saved = await this.serviceTypeRepository.save(serviceType);
    return { success: true, message: 'Service type created', data: saved };
  }

  async update(id: string, dto: UpdateServiceTypeDto): Promise<any> {
    const serviceType = await this.serviceTypeRepository.findOne({
      where: { id },
    });
    if (!serviceType) {
      throw new NotFoundException('Service type not found');
    }

    // Check if updating name and if new name already exists
    if (dto.name && dto.name !== serviceType.name) {
      const existing = await this.serviceTypeRepository.findOne({
        where: { name: dto.name },
      });
      
      if (existing) {
        throw new ConflictException(`Service type with name "${dto.name}" already exists`);
      }
    }

    Object.assign(serviceType, dto);
    const updated = await this.serviceTypeRepository.save(serviceType);
    return { success: true, message: 'Service type updated', data: updated };
  }

  async remove(id: string): Promise<any> {
    const result = await this.serviceTypeRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException('Service type not found');
    }
    return { success: true, message: 'Service type deleted' };
  }

  async activate(id: string): Promise<any> {
    const serviceType = await this.serviceTypeRepository.findOne({
      where: { id },
    });
    if (!serviceType) {
      throw new NotFoundException('Service type not found');
    }

    serviceType.isActive = !serviceType.isActive;
    await this.serviceTypeRepository.save(serviceType);

    return {
      success: true,
      message: `Service type ${serviceType.isActive ? 'activated' : 'deactivated'}`,
      data: serviceType,
    };
  }
}
