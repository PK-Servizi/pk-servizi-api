import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CmsContent } from './entities/cms-content.entity';
import { CreateCmsContentDto } from './dto/create-cms-content.dto';
import { UpdateCmsContentDto } from './dto/update-cms-content.dto';

@Injectable()
export class CmsService {
  constructor(
    @InjectRepository(CmsContent)
    private cmsRepository: Repository<CmsContent>,
  ) {}

  async create(createCmsContentDto: CreateCmsContentDto): Promise<CmsContent> {
    const content = this.cmsRepository.create(createCmsContentDto);
    return this.cmsRepository.save(content);
  }

  async findAll(page = 1, limit = 10) {
    const [data, total] = await this.cmsRepository.findAndCount({
      skip: (page - 1) * limit,
      take: limit,
      order: { updatedAt: 'DESC' },
    });

    return {
      data,
      total,
      page,
      totalPages: Math.ceil(total / limit),
    };
  }

  async findByType(type: string) {
    return this.cmsRepository.find({
      where: { type, status: 'published' },
      order: { updatedAt: 'DESC' },
    });
  }

  async findBySlug(slug: string): Promise<CmsContent> {
    const content = await this.cmsRepository.findOne({
      where: { slug, status: 'published' },
    });

    if (!content) {
      throw new NotFoundException(`Content with slug "${slug}" not found`);
    }

    return content;
  }

  async findOne(id: string): Promise<CmsContent> {
    const content = await this.cmsRepository.findOne({ where: { id } });
    if (!content) {
      throw new NotFoundException(`Content with ID ${id} not found`);
    }
    return content;
  }

  async update(
    id: string,
    updateCmsContentDto: UpdateCmsContentDto,
  ): Promise<CmsContent> {
    await this.cmsRepository.update(id, updateCmsContentDto);
    return this.findOne(id);
  }

  async remove(id: string): Promise<void> {
    const result = await this.cmsRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Content with ID ${id} not found`);
    }
  }

  async toggleActive(id: string): Promise<CmsContent> {
    const content = await this.findOne(id);
    content.status = content.status === 'published' ? 'draft' : 'published';
    return this.cmsRepository.save(content);
  }
}
