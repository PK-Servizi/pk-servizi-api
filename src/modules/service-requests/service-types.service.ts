import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ServiceType } from './entities/service-type.entity';
import { CreateServiceTypeDto } from './dto/create-service-type.dto';
import { UpdateServiceTypeDto } from './dto/update-service-type.dto';

@Injectable()
export class ServiceTypesService {
  constructor(
    @InjectRepository(ServiceType)
    private readonly serviceTypeRepository: Repository<ServiceType>,
  ) {}

  async create(dto: CreateServiceTypeDto): Promise<ServiceType> {
    const existing = await this.serviceTypeRepository.findOne({
      where: { code: dto.code },
    });

    if (existing) {
      throw new ConflictException('Service type with this code already exists');
    }

    const serviceType = this.serviceTypeRepository.create(dto);
    return this.serviceTypeRepository.save(serviceType);
  }

  async findAll(): Promise<ServiceType[]> {
    return this.serviceTypeRepository.find({
      where: { isActive: true },
      order: { name: 'ASC' },
    });
  }

  async findOne(id: string): Promise<ServiceType> {
    const serviceType = await this.serviceTypeRepository.findOne({
      where: { id },
    });
    if (!serviceType) throw new NotFoundException('Service type not found');
    return serviceType;
  }

  async findByCode(code: string): Promise<ServiceType> {
    const serviceType = await this.serviceTypeRepository.findOne({
      where: { code, isActive: true },
    });
    if (!serviceType) throw new NotFoundException('Service type not found');
    return serviceType;
  }

  async update(id: string, dto: UpdateServiceTypeDto): Promise<ServiceType> {
    await this.findOne(id);

    if (dto.code) {
      const existing = await this.serviceTypeRepository.findOne({
        where: { code: dto.code },
      });
      if (existing && existing.id !== id) {
        throw new ConflictException(
          'Service type with this code already exists',
        );
      }
    }

    await this.serviceTypeRepository.update(id, dto);
    return this.findOne(id);
  }

  async remove(id: string): Promise<void> {
    await this.findOne(id);
    await this.serviceTypeRepository.update(id, { isActive: false });
  }
}
