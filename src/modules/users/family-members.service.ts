import {
  Injectable,
  NotFoundException,
  BadRequestException,
  Logger,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { FamilyMember } from './entities/family-member.entity';
import { CreateFamilyMemberDto } from './dto/create-family-member.dto';
import { UpdateFamilyMemberDto } from './dto/update-family-member.dto';
import { AwsS3UploadService } from '../../common/services/aws-s3-upload.service';

@Injectable()
export class FamilyMembersService {
  private readonly logger = new Logger(FamilyMembersService.name);

  constructor(
    @InjectRepository(FamilyMember)
    private familyMemberRepository: Repository<FamilyMember>,
    private awsS3UploadService: AwsS3UploadService,
  ) {}

  async create(dto: CreateFamilyMemberDto, userId: string) {
    const familyMember = this.familyMemberRepository.create({
      userId,
      fullName: `${dto.firstName} ${dto.lastName}`,
      fiscalCode: dto.fiscalCode,
      relationship: dto.relationship,
      birthDate: dto.birthDate ? new Date(dto.birthDate) : null,
    });

    const saved = await this.familyMemberRepository.save(familyMember);

    return {
      success: true,
      message: 'Family member added successfully',
      data: saved,
    };
  }

  async findByUser(userId: string) {
    const familyMembers = await this.familyMemberRepository.find({
      where: { userId },
      order: { createdAt: 'ASC' },
    });

    return {
      success: true,
      message: 'Family members retrieved successfully',
      data: familyMembers,
    };
  }

  async findOne(userId: string, id: string) {
    const familyMember = await this.familyMemberRepository.findOne({
      where: { id, userId },
    });

    if (!familyMember) {
      throw new NotFoundException('Family member not found');
    }

    return {
      success: true,
      message: 'Family member retrieved successfully',
      data: familyMember,
    };
  }

  async update(id: string, dto: UpdateFamilyMemberDto, userId: string) {
    const familyMember = await this.familyMemberRepository.findOne({
      where: { id, userId },
    });

    if (!familyMember) {
      throw new NotFoundException('Family member not found');
    }

    Object.assign(familyMember, dto);
    if (dto.birthDate) {
      familyMember.birthDate = new Date(dto.birthDate);
    }

    const saved = await this.familyMemberRepository.save(familyMember);

    return {
      success: true,
      message: 'Family member updated successfully',
      data: saved,
    };
  }

  async remove(id: string, userId: string) {
    const familyMember = await this.familyMemberRepository.findOne({
      where: { id, userId },
    });

    if (!familyMember) {
      throw new NotFoundException('Family member not found');
    }

    await this.familyMemberRepository.remove(familyMember);

    return {
      success: true,
      message: 'Family member removed successfully',
    };
  }

  // Extended Operations - Document Management
  async getFamilyMemberDocuments(_id: string, _userId: string) {
    return {
      success: true,
      message: 'Family member documents retrieved',
      data: [],
    };
  }

  async uploadFamilyMemberDocuments(
    id: string,
    files: { [key: string]: Express.Multer.File[] },
    dto: any,
    userId: string,
  ) {
    const familyMember = await this.familyMemberRepository.findOne({
      where: { id, userId },
    });

    if (!familyMember) {
      throw new NotFoundException('Family member not found');
    }

    if (!files || Object.keys(files).length === 0) {
      throw new BadRequestException('No files provided');
    }

    const documentTypeMapping = {
      identityDocument: 'FAMILY_IDENTITY',
      fiscalCode: 'FAMILY_TAX_CODE',
      birthCertificate: 'BIRTH_CERTIFICATE',
      marriageCertificate: 'MARRIAGE_CERTIFICATE',
      dependencyDocuments: 'DEPENDENCY_DOCS',
      disabilityCertificates: 'DISABILITY_CERT',
      studentEnrollment: 'STUDENT_ENROLLMENT',
      incomeDocuments: 'FAMILY_INCOME',
    };

    const uploadedDocuments = [];

    try {
      for (const [fieldName, fileArray] of Object.entries(files)) {
        if (fileArray && fileArray.length > 0) {
          const file = fileArray[0];
          const documentType = documentTypeMapping[fieldName] || 'OTHER';

          this.logger.log(
            `Uploading ${documentType} for family member ${id} (${familyMember.fullName})...`,
          );

          // Upload to S3 using the same service as profile images
          // Path: users/{userId}/family-members/{familyMemberId}/documents/{filename}
          const { publicUrl } =
            await this.awsS3UploadService.uploadFamilyMemberDocument(
              userId,
              id,
              file,
            );

          uploadedDocuments.push({
            fileName: file.originalname,
            fileSize: file.size,
            mimeType: file.mimetype,
            documentType: documentType,
            familyMemberId: id,
            s3Url: publicUrl,
            uploadedAt: new Date(),
          });

          this.logger.log(
            `Successfully uploaded ${documentType} to S3: ${publicUrl}`,
          );
        }
      }

      return {
        success: true,
        message: `${uploadedDocuments.length} document(s) uploaded successfully to AWS S3`,
        data: uploadedDocuments,
      };
    } catch (error) {
      this.logger.error(
        `Failed to upload documents for family member ${id}:`,
        error.stack,
      );
      throw new BadRequestException(
        `Failed to upload documents: ${error.message}`,
      );
    }
  }
}
