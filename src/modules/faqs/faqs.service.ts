import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Faq } from './entities/faq.entity';
import { CreateFaqDto } from './dto/create-faq.dto';
import { UpdateFaqDto } from './dto/update-faq.dto';
import { Service } from '../services/entities/service.entity';

@Injectable()
export class FaqsService {
  constructor(
    @InjectRepository(Faq)
    private faqRepository: Repository<Faq>,
    @InjectRepository(Service)
    private serviceRepository: Repository<Service>,
  ) {}

  /**
   * Create a new FAQ
   */
  async create(createFaqDto: CreateFaqDto) {
    // Validate service type if provided
    if (createFaqDto.serviceId) {
      const Service = await this.serviceRepository.findOne({
        where: { id: createFaqDto.serviceId },
      });
      if (!Service) {
        throw new BadRequestException('Service type not found');
      }
    }

    const faq = this.faqRepository.create(createFaqDto);
    const savedFaq = await this.faqRepository.save(faq);

    return {
      success: true,
      message: 'FAQ created successfully',
      data: savedFaq,
    };
  }

  /**
   * Get all FAQs (admin view)
   */
  async findAll(serviceId?: string, category?: string, isActive?: boolean) {
    const query = this.faqRepository
      .createQueryBuilder('faq')
      .orderBy('faq.order', 'ASC')
      .addOrderBy('faq.createdAt', 'DESC');

    if (serviceId !== undefined) {
      query.andWhere('faq.serviceId = :serviceId', { serviceId });
    }

    if (category !== undefined) {
      query.andWhere('faq.category = :category', { category });
    }

    if (isActive !== undefined) {
      query.andWhere('faq.isActive = :isActive', { isActive });
    }

    const faqs = await query.getMany();

    return {
      success: true,
      data: faqs,
      total: faqs.length,
    };
  }

  /**
   * Get all active FAQs (public view)
   */
  async findActive() {
    return this.findAll(undefined, undefined, true);
  }

  /**
   * Get active FAQs by service ID
   */
  async findByServiceId(serviceId: string) {
    const Service = await this.serviceRepository.findOne({
      where: { id: serviceId },
    });

    if (!Service) {
      throw new NotFoundException('Service not found');
    }

    return this.findAll(serviceId, undefined, true);
  }

  /**
   * Get single FAQ by ID
   */
  async findOne(id: string) {
    const faq = await this.faqRepository.findOne({
      where: { id },
      relations: ['Service'],
    });

    if (!faq) {
      throw new NotFoundException('FAQ not found');
    }

    return {
      success: true,
      data: faq,
    };
  }

  /**
   * Update FAQ
   */
  async update(id: string, updateFaqDto: UpdateFaqDto) {
    const faq = await this.faqRepository.findOne({ where: { id } });

    if (!faq) {
      throw new NotFoundException('FAQ not found');
    }

    // Validate service type if being updated
    if (updateFaqDto.serviceId) {
      const Service = await this.serviceRepository.findOne({
        where: { id: updateFaqDto.serviceId },
      });
      if (!Service) {
        throw new BadRequestException('Service type not found');
      }
    }

    Object.assign(faq, updateFaqDto);
    const updatedFaq = await this.faqRepository.save(faq);

    return {
      success: true,
      message: 'FAQ updated successfully',
      data: updatedFaq,
    };
  }

  /**
   * Delete FAQ
   */
  async remove(id: string) {
    const faq = await this.faqRepository.findOne({ where: { id } });

    if (!faq) {
      throw new NotFoundException('FAQ not found');
    }

    await this.faqRepository.remove(faq);

    return {
      success: true,
      message: 'FAQ deleted successfully',
    };
  }

  /**
   * Toggle FAQ active status
   */
  async toggleActive(id: string) {
    const faq = await this.faqRepository.findOne({ where: { id } });

    if (!faq) {
      throw new NotFoundException('FAQ not found');
    }

    faq.isActive = !faq.isActive;
    const updatedFaq = await this.faqRepository.save(faq);

    return {
      success: true,
      message: `FAQ ${updatedFaq.isActive ? 'activated' : 'deactivated'} successfully`,
      data: updatedFaq,
    };
  }

  /**
   * Reorder FAQs
   */
  async reorder(orders: Array<{ id: string; order: number }>) {
    const updatePromises = orders.map(({ id, order }) =>
      this.faqRepository.update(id, { order }),
    );

    await Promise.all(updatePromises);

    return {
      success: true,
      message: 'FAQs reordered successfully',
    };
  }

  /**
   * Get FAQ categories
   */
  async getCategories() {
    const categories = await this.faqRepository
      .createQueryBuilder('faq')
      .select('DISTINCT faq.category', 'category')
      .where('faq.category IS NOT NULL')
      .getRawMany();

    return {
      success: true,
      data: categories.map((c) => c.category),
    };
  }
}
