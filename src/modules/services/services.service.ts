import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
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

  async findActive(serviceTypeId?: string): Promise<any> {
    const query = this.serviceRepository
      .createQueryBuilder('service')
      .select([
        'service.id',
        'service.name',
        'service.code',
        'service.description',
        'service.category',
        'service.basePrice',
        'service.isActive',
      ])
      .leftJoin('service.serviceType', 'serviceType')
      .addSelect(['serviceType.id', 'serviceType.name'])
      .where('service.isActive = :isActive', { isActive: true });

    // Filter by service type if provided
    if (serviceTypeId) {
      query.andWhere('service.serviceTypeId = :serviceTypeId', { serviceTypeId });
    }

    const services = await query.orderBy('service.name', 'ASC').getMany();
    
    return { success: true, data: services };
  }

  async findByServiceType(serviceTypeId: string): Promise<any> {
    // Verify service type exists
    const serviceType = await this.serviceTypeRepository.findOne({
      where: { id: serviceTypeId },
    });

    if (!serviceType) {
      throw new NotFoundException('Service type not found');
    }

    const services = await this.serviceRepository
      .createQueryBuilder('service')
      .select([
        'service.id',
        'service.name',
        'service.code',
        'service.description',
        'service.category',
        'service.basePrice',
        'service.isActive',
      ])
      .where('service.serviceTypeId = :serviceTypeId', { serviceTypeId })
      .andWhere('service.isActive = :isActive', { isActive: true })
      .orderBy('service.name', 'ASC')
      .getMany();

    return {
      success: true,
      data: {
        serviceType: {
          id: serviceType.id,
          name: serviceType.name,
          description: serviceType.description,
        },
        services,
        count: services.length,
      },
    };
  }

  async findOne(id: string): Promise<any> {
    const service = await this.serviceRepository
      .createQueryBuilder('service')
      .leftJoinAndSelect('service.serviceType', 'serviceType')
      .where('service.id = :id', { id })
      .getOne();
    if (!service) {
      throw new NotFoundException('Service not found');
    }
    return { success: true, data: service };
  }

  async getSchema(id: string): Promise<any> {
    const service = await this.serviceRepository
      .createQueryBuilder('service')
      .select(['service.id', 'service.name', 'service.formSchema'])
      .where('service.id = :id', { id })
      .getOne();
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
    const service = await this.serviceRepository
      .createQueryBuilder('service')
      .select(['service.id', 'service.name', 'service.documentRequirements'])
      .where('service.id = :id', { id })
      .getOne();
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

  async updateDocumentRequirements(
    id: string,
    documentRequirements: any,
  ): Promise<any> {
    const service = await this.serviceRepository.findOne({ where: { id } });
    if (!service) {
      throw new NotFoundException('Service not found');
    }

    service.documentRequirements = documentRequirements;
    await this.serviceRepository.save(service);

    return {
      success: true,
      message: 'Document requirements updated',
      data: service,
    };
  }
}
