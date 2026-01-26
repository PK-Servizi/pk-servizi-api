import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Service } from './entities/service.entity';
import { ServiceType } from '../service-types/entities/service-type.entity';
import { CreateServiceDto } from './dto/create-service.dto';
import { UpdateServiceDto } from './dto/update-service.dto';
import { Faq } from '../faqs/entities/faq.entity';

@Injectable()
export class ServicesService {
  constructor(
    @InjectRepository(Service)
    private serviceRepository: Repository<Service>,
    @InjectRepository(ServiceType)
    private serviceTypeRepository: Repository<ServiceType>,
    @InjectRepository(Faq)
    private faqRepository: Repository<Faq>,
  ) {}

  async findActive(): Promise<any> {
    const services = await this.serviceRepository.find({
      where: { isActive: true },
      relations: ['serviceType'],
      order: { name: 'ASC' },
    });
    return { success: true, data: services };
  }

  async findOne(id: string): Promise<any> {
    const service = await this.serviceRepository.findOne({
      where: { id },
      relations: ['serviceType'],
    });
    if (!service) {
      throw new NotFoundException('Service not found');
    }
    return { success: true, data: service };
  }

  async getSchema(id: string): Promise<any> {
    const service = await this.serviceRepository.findOne({
      where: { id },
      select: ['id', 'name', 'formSchema'],
    });
    if (!service) {
      throw new NotFoundException('Service not found');
    }
    return { success: true, data: service.formSchema };
  }

  async create(dto: CreateServiceDto): Promise<any> {
    // Validate service type exists
    const serviceType = await this.serviceTypeRepository.findOne({
      where: { id: dto.serviceTypeId },
    });
    if (!serviceType) {
      throw new NotFoundException('Service type not found');
    }

    const service = this.serviceRepository.create(dto);
    const saved = await this.serviceRepository.save(service);
    return { success: true, message: 'Service created', data: saved };
  }

  async update(id: string, dto: UpdateServiceDto): Promise<any> {
    const service = await this.serviceRepository.findOne({ where: { id } });
    if (!service) {
      throw new NotFoundException('Service not found');
    }

    // If updating service type, validate it exists
    if (dto.serviceTypeId) {
      const serviceType = await this.serviceTypeRepository.findOne({
        where: { id: dto.serviceTypeId },
      });
      if (!serviceType) {
        throw new NotFoundException('Service type not found');
      }
    }

    Object.assign(service, dto);
    const updated = await this.serviceRepository.save(service);
    return { success: true, message: 'Service updated', data: updated };
  }

  async remove(id: string): Promise<any> {
    const service = await this.serviceRepository.findOne({
      where: { id },
      relations: ['requests', 'appointments'],
    });
    if (!service) {
      throw new NotFoundException('Service not found');
    }

    // Check for dependent FAQs
    const faqCount = await this.faqRepository.count({
      where: { serviceId: id },
    });
    if (faqCount > 0) {
      throw new BadRequestException(
        `Cannot delete service. There are ${faqCount} FAQ(s) associated with this service. Please delete or reassign them first.`,
      );
    }

    // Check for dependent service requests
    if (service.requests && service.requests.length > 0) {
      throw new BadRequestException(
        `Cannot delete service. There are ${service.requests.length} service request(s) associated with this service.`,
      );
    }

    // Check for dependent appointments
    if (service.appointments && service.appointments.length > 0) {
      throw new BadRequestException(
        `Cannot delete service. There are ${service.appointments.length} appointment(s) associated with this service.`,
      );
    }

    await this.serviceRepository.delete(id);
    return { success: true, message: 'Service deleted' };
  }

  async activate(id: string): Promise<any> {
    const service = await this.serviceRepository.findOne({ where: { id } });
    if (!service) {
      throw new NotFoundException('Service not found');
    }

    service.isActive = !service.isActive;
    await this.serviceRepository.save(service);

    return {
      success: true,
      message: `Service ${service.isActive ? 'activated' : 'deactivated'}`,
      data: service,
    };
  }

  // Extended Operations - Template Management
  async getRequiredDocuments(id: string): Promise<any> {
    const service = await this.serviceRepository.findOne({
      where: { id },
      select: ['id', 'name', 'documentRequirements'],
    });
    if (!service) {
      throw new NotFoundException('Service not found');
    }
    return { success: true, data: service.documentRequirements };
  }

  async updateSchema(id: string, schema: any): Promise<any> {
    const service = await this.serviceRepository.findOne({ where: { id } });
    if (!service) {
      throw new NotFoundException('Service not found');
    }

    service.formSchema = schema;
    await this.serviceRepository.save(service);

    return { success: true, message: 'Form schema updated', data: service };
  }
}
