import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ServiceRequest } from './entities/service-request.entity';
import { RequestStatusHistory } from './entities/request-status-history.entity';
import { CreateServiceRequestDto } from './dto/create-service-request.dto';
import { UpdateServiceRequestDto } from './dto/update-service-request.dto';
import { UpdateServiceRequestStatusDto } from './dto/update-service-request-status.dto';
import { ServiceRequestQueryDto } from '../../common/dto/query.dto';

@Injectable()
export class ServiceRequestsService {
  constructor(
    @InjectRepository(ServiceRequest)
    private readonly requestRepository: Repository<ServiceRequest>,
    @InjectRepository(RequestStatusHistory)
    private readonly historyRepository: Repository<RequestStatusHistory>,
  ) {}

  async create(dto: CreateServiceRequestDto): Promise<ServiceRequest> {
    const request = this.requestRepository.create({
      ...dto,
      submittedAt: dto.submittedAt ? new Date(dto.submittedAt) : null,
      completedAt: dto.completedAt ? new Date(dto.completedAt) : null,
    });

    const savedRequest = await this.requestRepository.save(request);
    await this.createStatusHistory(
      savedRequest.id,
      null,
      dto.status || 'draft',
      dto.userId,
    );

    return this.findOne(savedRequest.id);
  }

  async findAll(
    query: ServiceRequestQueryDto,
  ): Promise<{ data: ServiceRequest[]; total: number }> {
    const queryBuilder = this.requestRepository
      .createQueryBuilder('request')
      .leftJoinAndSelect('request.user', 'user')
      .leftJoinAndSelect('request.serviceType', 'serviceType')
      .leftJoinAndSelect('request.assignedOperator', 'operator');

    if (query.status) {
      queryBuilder.andWhere('request.status = :status', {
        status: query.status,
      });
    }

    if (query.userId) {
      queryBuilder.andWhere('request.userId = :userId', {
        userId: query.userId,
      });
    }

    if (query.operatorId) {
      queryBuilder.andWhere('request.assignedOperatorId = :operatorId', {
        operatorId: query.operatorId,
      });
    }

    if (query.serviceType) {
      queryBuilder.andWhere('serviceType.code = :serviceType', {
        serviceType: query.serviceType,
      });
    }

    const total = await queryBuilder.getCount();

    queryBuilder
      .orderBy(
        `request.${query.sortBy || 'createdAt'}`,
        query.sortOrder || 'DESC',
      )
      .skip((query.page - 1) * query.limit)
      .take(query.limit);

    const data = await queryBuilder.getMany();

    return { data, total };
  }

  async findOne(id: string): Promise<ServiceRequest> {
    const request = await this.requestRepository.findOne({
      where: { id },
      relations: [
        'user',
        'serviceType',
        'assignedOperator',
        'documents',
        'statusHistory',
      ],
    });
    if (!request) throw new NotFoundException('Service request not found');
    return request;
  }

  async update(
    id: string,
    dto: UpdateServiceRequestDto,
  ): Promise<ServiceRequest> {
    await this.findOne(id);
    const updateData = {
      ...dto,
      submittedAt: dto.submittedAt ? new Date(dto.submittedAt) : undefined,
      completedAt: dto.completedAt ? new Date(dto.completedAt) : undefined,
    };
    await this.requestRepository.update(id, updateData);
    return this.findOne(id);
  }

  async updateStatus(
    id: string,
    dto: UpdateServiceRequestStatusDto,
    changedById: string,
  ): Promise<ServiceRequest> {
    const request = await this.findOne(id);
    const oldStatus = request.status;

    if (oldStatus === dto.status) {
      throw new BadRequestException('Request is already in this status');
    }

    await this.requestRepository.update(id, {
      status: dto.status,
      submittedAt:
        dto.status === 'submitted' ? new Date() : request.submittedAt,
      completedAt:
        dto.status === 'completed' ? new Date() : request.completedAt,
    });

    await this.createStatusHistory(
      id,
      oldStatus,
      dto.status,
      changedById,
      dto.notes,
    );

    return this.findOne(id);
  }

  async assignOperator(
    id: string,
    operatorId: string,
  ): Promise<ServiceRequest> {
    await this.findOne(id);
    await this.requestRepository.update(id, { assignedOperatorId: operatorId });
    return this.findOne(id);
  }

  private async createStatusHistory(
    requestId: string,
    fromStatus: string | null,
    toStatus: string,
    changedById: string,
    notes?: string,
  ): Promise<void> {
    const history = this.historyRepository.create({
      serviceRequestId: requestId,
      fromStatus,
      toStatus,
      changedById,
      notes,
    });
    await this.historyRepository.save(history);
  }
}
