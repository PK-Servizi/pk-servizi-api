import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AuditLog } from './entities/audit-log.entity';
import { CreateAuditLogDto } from './dto/create-audit-log.dto';

@Injectable()
export class AuditService {
  constructor(
    @InjectRepository(AuditLog)
    private auditRepository: Repository<AuditLog>,
  ) {}

  async create(createAuditLogDto: CreateAuditLogDto): Promise<AuditLog> {
    const auditLog = this.auditRepository.create(createAuditLogDto);
    return this.auditRepository.save(auditLog);
  }

  async findAll(page = 1, limit = 10) {
    const [data, total] = await this.auditRepository.findAndCount({
      skip: (page - 1) * limit,
      take: limit,
      order: { createdAt: 'DESC' },
      relations: ['user'],
    });

    return {
      data,
      total,
      page,
      totalPages: Math.ceil(total / limit),
    };
  }

  async findByUser(userId: string, page = 1, limit = 10) {
    const [data, total] = await this.auditRepository.findAndCount({
      where: { userId },
      skip: (page - 1) * limit,
      take: limit,
      order: { createdAt: 'DESC' },
    });

    return {
      data,
      total,
      page,
      totalPages: Math.ceil(total / limit),
    };
  }

  async findByAction(action: string, page = 1, limit = 10) {
    const [data, total] = await this.auditRepository.findAndCount({
      where: { action },
      skip: (page - 1) * limit,
      take: limit,
      order: { createdAt: 'DESC' },
      relations: ['user'],
    });

    return {
      data,
      total,
      page,
      totalPages: Math.ceil(total / limit),
    };
  }
}
