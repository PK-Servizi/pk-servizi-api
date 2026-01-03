import {
  Injectable,
  NotFoundException,
  BadRequestException,
  Logger,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Document } from './entities/document.entity';
import { CreateDocumentDto } from './dto/create-document.dto';
import { UpdateDocumentDto } from './dto/update-document.dto';
import { ApproveDocumentDto } from './dto/approve-document.dto';
import { StorageService } from '../../common/services/storage.service';

@Injectable()
export class DocumentsService {
  private readonly logger = new Logger(DocumentsService.name);

  constructor(
    @InjectRepository(Document)
    private readonly documentRepository: Repository<Document>,
    private readonly storageService: StorageService,
  ) {}

  async create(dto: CreateDocumentDto): Promise<Document> {
    const document = this.documentRepository.create(dto);
    return this.documentRepository.save(document);
  }

  async uploadAndCreate(
    file: Express.Multer.File,
    dto: CreateDocumentDto,
  ): Promise<Document> {
    const pathPrefix = `requests/${dto.serviceRequestId}/${dto.category}`;
    const { path } = await this.storageService.uploadFile(file, pathPrefix);

    const document = this.documentRepository.create({
      ...dto,
      filename: file.originalname,
      filePath: path,
      fileSize: file.size,
      mimeType: file.mimetype,
    });

    return this.documentRepository.save(document);
  }

  async findByServiceRequest(serviceRequestId: string): Promise<Document[]> {
    return this.documentRepository.find({
      where: { serviceRequestId },
      order: { createdAt: 'DESC' },
    });
  }

  async findOne(id: string): Promise<Document> {
    const document = await this.documentRepository.findOne({
      where: { id },
      relations: ['serviceRequest'],
    });
    if (!document) throw new NotFoundException('Document not found');
    return document;
  }

  async getDownloadUrl(id: string): Promise<{ url: string }> {
    const document = await this.findOne(id);
    const url = await this.storageService.getSignedUrl(document.filePath);
    return { url };
  }

  async update(id: string, dto: UpdateDocumentDto): Promise<Document> {
    await this.findOne(id);
    await this.documentRepository.update(id, dto);
    return this.findOne(id);
  }

  async approve(id: string, dto: ApproveDocumentDto): Promise<Document> {
    const document = await this.findOne(id);

    if (document.status === dto.status) {
      throw new BadRequestException(`Document is already ${dto.status}`);
    }

    await this.documentRepository.update(id, {
      status: dto.status,
      adminNotes: dto.adminNotes,
    });

    return this.findOne(id);
  }

  async replace(id: string, dto: CreateDocumentDto): Promise<Document> {
    const oldDocument = await this.findOne(id);

    const newDocument = this.documentRepository.create({
      ...dto,
      version: oldDocument.version + 1,
    });

    return this.documentRepository.save(newDocument);
  }

  async remove(id: string): Promise<void> {
    const document = await this.findOne(id);

    // Attempt to delete from storage, but don't block DB deletion if it fails (soft fail)
    try {
      await this.storageService.deleteFile(document.filePath);
    } catch (error) {
      this.logger.warn(
        `Failed to delete file from storage: ${document.filePath}`,
      );
    }

    await this.documentRepository.delete(id);
  }

  async getDocumentsByCategory(
    serviceRequestId: string,
    category: string,
  ): Promise<Document[]> {
    return this.documentRepository.find({
      where: { serviceRequestId, category },
      order: { version: 'DESC' },
    });
  }

  async getRequiredDocuments(serviceRequestId: string): Promise<Document[]> {
    return this.documentRepository.find({
      where: { serviceRequestId, isRequired: true },
      order: { category: 'ASC' },
    });
  }
}
