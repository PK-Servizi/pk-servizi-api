import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  UseInterceptors,
  UploadedFile,
  ParseFilePipe,
  MaxFileSizeValidator,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import {
  ApiTags,
  ApiOperation,
  ApiBearerAuth,
  ApiConsumes,
  ApiBody,
} from '@nestjs/swagger';
import { DocumentsService } from './documents.service';
import { CreateDocumentDto } from './dto/create-document.dto';
import { UpdateDocumentDto } from './dto/update-document.dto';
import { ApproveDocumentDto } from './dto/approve-document.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { PermissionsGuard } from '../../common/guards/permissions.guard';
import { Permissions } from '../../common/decorators/permissions.decorator';

@ApiTags('Documents')
@Controller('documents')
@UseGuards(JwtAuthGuard, RolesGuard, PermissionsGuard)
@ApiBearerAuth('JWT-auth')
export class DocumentsController {
  constructor(private readonly service: DocumentsService) {}

  @Post('upload')
  @ApiOperation({ summary: 'Upload document' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
        },
        serviceRequestId: { type: 'string' },
        category: { type: 'string' },
        mimeType: { type: 'string' }, // Optional, can be inferred
        fileSize: { type: 'number' }, // Optional
      },
    },
  })
  @Permissions('documents.create')
  @UseInterceptors(FileInterceptor('file'))
  upload(
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({ maxSize: 10 * 1024 * 1024 }), // 10MB
          // new FileTypeValidator({ fileType: '.(png|jpeg|jpg|pdf)' }), // Strict type check
        ],
      }),
    )
    file: Express.Multer.File,
    @Body() dto: CreateDocumentDto,
  ) {
    return this.service.uploadAndCreate(file, dto);
  }

  @Post()
  @ApiOperation({ summary: 'Create document record only' })
  @Permissions('documents.create')
  create(@Body() dto: CreateDocumentDto) {
    return this.service.create(dto);
  }

  @Get('service-request/:serviceRequestId')
  @ApiOperation({ summary: 'Get documents by service request' })
  @Permissions('documents.read')
  findByServiceRequest(@Param('serviceRequestId') serviceRequestId: string) {
    return this.service.findByServiceRequest(serviceRequestId);
  }

  @Get('service-request/:serviceRequestId/category/:category')
  @ApiOperation({ summary: 'Get documents by category' })
  @Permissions('documents.read')
  getByCategory(
    @Param('serviceRequestId') serviceRequestId: string,
    @Param('category') category: string,
  ) {
    return this.service.getDocumentsByCategory(serviceRequestId, category);
  }

  @Get('service-request/:serviceRequestId/required')
  @ApiOperation({ summary: 'Get required documents' })
  @Permissions('documents.read')
  getRequired(@Param('serviceRequestId') serviceRequestId: string) {
    return this.service.getRequiredDocuments(serviceRequestId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get document by ID' })
  @Permissions('documents.read')
  findOne(@Param('id') id: string) {
    return this.service.findOne(id);
  }

  @Get(':id/download')
  @ApiOperation({ summary: 'Get download URL for document' })
  @Permissions('documents.read')
  getDownloadUrl(@Param('id') id: string) {
    return this.service.getDownloadUrl(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update document' })
  @Permissions('documents.update')
  update(@Param('id') id: string, @Body() dto: UpdateDocumentDto) {
    return this.service.update(id, dto);
  }

  @Patch(':id/approve')
  @ApiOperation({ summary: 'Approve or reject document' })
  @Permissions('documents.approve')
  approve(@Param('id') id: string, @Body() dto: ApproveDocumentDto) {
    return this.service.approve(id, dto);
  }

  @Post(':id/replace')
  @ApiOperation({ summary: 'Replace document with new version' })
  @Permissions('documents.create')
  replace(@Param('id') id: string, @Body() dto: CreateDocumentDto) {
    return this.service.replace(id, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete document' })
  @Permissions('documents.delete')
  remove(@Param('id') id: string) {
    return this.service.remove(id);
  }
}
