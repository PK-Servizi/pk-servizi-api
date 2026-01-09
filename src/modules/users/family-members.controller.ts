import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Put,
  Delete,
  UseGuards,
  UseInterceptors,
  UploadedFile,
  UploadedFiles,
} from '@nestjs/common';
import { FileInterceptor, FileFieldsInterceptor } from '@nestjs/platform-express';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiConsumes } from '@nestjs/swagger';
import { FamilyMembersService } from './family-members.service';
import { CreateFamilyMemberDto } from './dto/create-family-member.dto';
import { UpdateFamilyMemberDto } from './dto/update-family-member.dto';
import { UploadDocumentDto } from '../documents/dto/upload-document.dto';
import { UploadFamilyMemberDocumentsDto } from './dto/upload-family-member-documents.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { PermissionsGuard } from '../../common/guards/permissions.guard';
import { Permissions } from '../../common/decorators/permissions.decorator';
import { CurrentUser } from '../auth/decorators/current-user.decorator';

@ApiTags('Family Members')
@Controller('family-members')
@UseGuards(JwtAuthGuard, PermissionsGuard)
export class FamilyMembersController {
  constructor(private readonly familyMembersService: FamilyMembersService) {}

  // Customer Routes
  @Get()
  @Permissions('family_members:read_own')
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'List own family members' })
  findMy(@CurrentUser() user: any) {
    return this.familyMembersService.findByUser(user.id);
  }

  @Post()
  @Permissions('family_members:write_own')
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Add family member' })
  create(@Body() dto: CreateFamilyMemberDto, @CurrentUser() user: any) {
    return this.familyMembersService.create(dto, user.id);
  }

  @Get(':id')
  @Permissions('family_members:read_own')
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Get family member' })
  findOne(@Param('id') id: string, @CurrentUser() user: any) {
    return this.familyMembersService.findOne(user.id, id);
  }

  @Put(':id')
  @Permissions('family_members:write_own')
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Update family member' })
  update(@Param('id') id: string, @Body() dto: UpdateFamilyMemberDto, @CurrentUser() user: any) {
    return this.familyMembersService.update(id, dto, user.id);
  }

  @Delete(':id')
  @Permissions('family_members:delete_own')
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Delete family member' })
  remove(@Param('id') id: string, @CurrentUser() user: any) {
    return this.familyMembersService.remove(id, user.id);
  }

  // Extended Operations - Document Management
  @Get(':id/documents')
  @Permissions('family_members:read_own')
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Get documents for family member' })
  getFamilyMemberDocuments(@Param('id') id: string, @CurrentUser() user: any) {
    return this.familyMembersService.getFamilyMemberDocuments(id, user.id);
  }

  @Post(':id/documents')
  @Permissions('family_members:write_own')
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Upload document for family member' })
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FileFieldsInterceptor([
    { name: 'identityDocument', maxCount: 1 },
    { name: 'fiscalCode', maxCount: 1 },
    { name: 'birthCertificate', maxCount: 1 },
    { name: 'marriageCertificate', maxCount: 1 },
    { name: 'dependencyDocuments', maxCount: 1 },
    { name: 'disabilityCertificates', maxCount: 1 },
    { name: 'studentEnrollment', maxCount: 1 },
    { name: 'incomeDocuments', maxCount: 1 },
  ]))
  uploadFamilyMemberDocument(
    @Param('id') id: string,
    @UploadedFiles() files: { [key: string]: Express.Multer.File[] },
    @Body() dto: UploadFamilyMemberDocumentsDto,
    @CurrentUser() user: any,
  ) {
    return this.familyMembersService.uploadFamilyMemberDocuments(id, files, dto, user.id);
  }

  // Admin Routes
  @Get('user/:userId')
  @Permissions('family_members:read')
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'List user\'s family members' })
  findByUser(@Param('userId') userId: string) {
    return this.familyMembersService.findByUser(userId);
  }
}