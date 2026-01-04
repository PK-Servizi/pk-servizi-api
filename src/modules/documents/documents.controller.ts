import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Patch,
  Param,
  Body,
  UseGuards,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiConsumes } from '@nestjs/swagger';
import { DocumentsService } from './documents.service';
import { UploadDocumentDto } from './dto/upload-document.dto';
import { UpdateDocumentDto } from './dto/update-document.dto';
import { ApproveDocumentDto } from './dto/approve-document.dto';
import { RejectDocumentDto } from './dto/reject-document.dto';
import { AddNotesDto } from './dto/add-notes.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { PermissionsGuard } from '../../common/guards/permissions.guard';
import { Permissions } from '../../common/decorators/permissions.decorator';
import { CurrentUser } from '../auth/decorators/current-user.decorator';

@ApiTags('Documents')
@Controller('documents')
@UseGuards(JwtAuthGuard, PermissionsGuard)
export class DocumentsController {
  constructor(private readonly documentsService: DocumentsService) {}

  // Customer Routes
  @Post('upload')
  @Permissions('documents:write_own')
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Upload document' })
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FileInterceptor('file'))
  uploadDocument(
    @UploadedFile() file: Express.Multer.File,
    @Body() dto: UploadDocumentDto,
    @CurrentUser() user: any,
  ) {
    return this.documentsService.upload(file, dto, user.id);
  }

  @Get('request/:requestId')
  @Permissions('documents:read_own')
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'List request documents' })
  findByRequest(@Param('requestId') requestId: string, @CurrentUser() user: any) {
    return this.documentsService.findByRequest(requestId, user.id);
  }

  @Get(':id')
  @Permissions('documents:read_own')
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Get document details' })
  findOne(@Param('id') id: string, @CurrentUser() user: any) {
    return this.documentsService.findOne(id);
  }

  @Get(':id/download')
  @Permissions('documents:read_own')
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Download document' })
  download(@Param('id') id: string, @CurrentUser() user: any) {
    return this.documentsService.download(id, user.id);
  }

  @Put(':id')
  @Permissions('documents:write_own')
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Replace document' })
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FileInterceptor('file'))
  replace(
    @Param('id') id: string,
    @UploadedFile() file: Express.Multer.File,
    @Body() dto: UpdateDocumentDto,
    @CurrentUser() user: any,
  ) {
    return this.documentsService.replace(id, file);
  }

  @Delete(':id')
  @Permissions('documents:delete_own')
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Delete document' })
  remove(@Param('id') id: string, @CurrentUser() user: any) {
    return this.documentsService.remove(id);
  }

  // Admin/Operator Routes
  @Get('request/:requestId/all')
  @Permissions('documents:read')
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'List all request documents' })
  findAllByRequest(@Param('requestId') requestId: string) {
    return this.documentsService.findAllByRequest(requestId);
  }

  @Patch(':id/approve')
  @Permissions('documents:approve')
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Approve document' })
  approve(@Param('id') id: string, @Body() dto: ApproveDocumentDto) {
    return this.documentsService.approve(id, dto);
  }

  @Patch(':id/reject')
  @Permissions('documents:approve')
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Reject document' })
  reject(@Param('id') id: string, @Body() dto: RejectDocumentDto) {
    return this.documentsService.reject(id, dto);
  }

  @Post(':id/notes')
  @Permissions('documents:write')
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Add admin notes' })
  addNotes(@Param('id') id: string, @Body() dto: AddNotesDto) {
    return this.documentsService.addNotes(id, dto);
  }

  @Get(':id/preview')
  @Permissions('documents:read')
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Preview document' })
  preview(@Param('id') id: string) {
    return this.documentsService.preview(id);
  }
}