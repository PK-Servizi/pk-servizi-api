import {
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Contact } from './entities/contact.entity';
import { CreateContactDto } from './dto/create-contact.dto';
import { UpdateContactStatusDto } from './dto/update-contact-status.dto';
import { EmailService } from '../notifications/email.service';

@Injectable()
export class ContactsService {
  private readonly logger = new Logger(ContactsService.name);

  constructor(
    @InjectRepository(Contact)
    private readonly contactRepository: Repository<Contact>,
    private readonly emailService: EmailService,
  ) {}

  async create(dto: CreateContactDto): Promise<{ success: boolean; message: string; data: Contact }> {
    // 1. Save to database first (always persist regardless of email result)
    const contact = this.contactRepository.create(dto);
    const saved = await this.contactRepository.save(contact);

    this.logger.log(`New contact submission #${saved.id} from ${saved.email}`);

    // 2. Fire emails (non-blocking — errors are logged, not thrown)
    const [adminSent, replySent] = await Promise.allSettled([
      this.emailService.sendContactFormToAdmin(
        saved.name,
        saved.email,
        saved.phone,
        saved.subject,
        saved.message,
        saved.id,
      ),
      this.emailService.sendContactFormAutoReply(
        saved.email,
        saved.name,
        saved.subject,
      ),
    ]);

    if (adminSent.status === 'rejected') {
      this.logger.error(`Failed to send contact notification to admin: ${adminSent.reason}`);
    }
    if (replySent.status === 'rejected') {
      this.logger.error(`Failed to send auto-reply to ${saved.email}: ${replySent.reason}`);
    }

    return {
      success: true,
      message: 'Your message has been sent successfully. We will get back to you soon.',
      data: saved,
    };
  }

  async findAll(query: {
    status?: string;
    search?: string;
    skip?: number;
    take?: number;
  } = {}): Promise<{ success: boolean; data: Contact[]; pagination: any }> {
    const qb = this.contactRepository
      .createQueryBuilder('c')
      .orderBy('c.createdAt', 'DESC');

    if (query.status) {
      qb.andWhere('c.status = :status', { status: query.status });
    }

    if (query.search) {
      qb.andWhere(
        '(c.name ILIKE :search OR c.email ILIKE :search OR c.subject ILIKE :search)',
        { search: `%${query.search}%` },
      );
    }

    const skip = query.skip || 0;
    const take = query.take || 20;
    qb.skip(skip).take(take);

    const [data, total] = await qb.getManyAndCount();

    return {
      success: true,
      data,
      pagination: {
        total,
        skip,
        take,
        pages: Math.ceil(total / take),
      },
    };
  }

  async findOne(id: string): Promise<{ success: boolean; data: Contact }> {
    const contact = await this.contactRepository.findOne({ where: { id } });
    if (!contact) {
      throw new NotFoundException(`Contact submission #${id} not found`);
    }
    // Auto-mark as read when fetched
    if (contact.status === 'new') {
      contact.status = 'read';
      await this.contactRepository.save(contact);
    }
    return { success: true, data: contact };
  }

  async updateStatus(
    id: string,
    dto: UpdateContactStatusDto,
  ): Promise<{ success: boolean; data: Contact }> {
    const contact = await this.contactRepository.findOne({ where: { id } });
    if (!contact) {
      throw new NotFoundException(`Contact submission #${id} not found`);
    }

    contact.status = dto.status;
    if (dto.adminNotes !== undefined) {
      contact.adminNotes = dto.adminNotes;
    }

    const updated = await this.contactRepository.save(contact);
    this.logger.log(`Contact #${id} status updated to ${dto.status}`);

    return { success: true, data: updated };
  }
}
