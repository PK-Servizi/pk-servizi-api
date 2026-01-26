import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseGuards,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiBearerAuth,
  ApiQuery,
} from '@nestjs/swagger';
import { FaqsService } from './faqs.service';
import { CreateFaqDto } from './dto/create-faq.dto';
import { UpdateFaqDto } from './dto/update-faq.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { PermissionsGuard } from '../../common/guards/permissions.guard';
import { Permissions } from '../../common/decorators/permissions.decorator';

@ApiTags('FAQs')
@Controller('faqs')
export class FaqsController {
  constructor(private readonly faqsService: FaqsService) {}

  // 1. PUBLIC: Get active FAQs (optionally filtered by service type)
  @Get('public')
  @ApiOperation({
    summary: '[Public] Get active FAQs',
    description:
      'Get all active FAQs. Filter by service type code (e.g., ISEE) or category',
  })
  @ApiQuery({
    name: 'serviceType',
    required: false,
    description: 'Service type code (e.g., ISEE, MODELLO_730)',
  })
  @ApiQuery({ name: 'category', required: false, description: 'FAQ category' })
  async getPublicFaqs(
    @Query('serviceType') serviceType?: string,
    @Query('category') category?: string,
  ) {
    if (serviceType) {
      return this.faqsService.findByServiceTypeCode(serviceType);
    }
    return this.faqsService.findActive(undefined, category);
  }

  // 2. ADMIN: Create FAQ
  @Post()
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @Permissions('faqs:create')
  @ApiBearerAuth()
  @ApiOperation({
    summary: '[Admin] Create FAQ',
    description: 'Create a new FAQ for a service type or general FAQ',
  })
  async create(@Body() createFaqDto: CreateFaqDto) {
    return this.faqsService.create(createFaqDto);
  }

  // 3. ADMIN: Get all FAQs (with filters)
  @Get()
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @Permissions('faqs:read')
  @ApiBearerAuth()
  @ApiOperation({
    summary: '[Admin] Get all FAQs',
    description: 'Get all FAQs with optional filters for admin management',
  })
  @ApiQuery({
    name: 'serviceTypeId',
    required: false,
    description: 'Filter by service type UUID',
  })
  @ApiQuery({
    name: 'category',
    required: false,
    description: 'Filter by category',
  })
  @ApiQuery({
    name: 'isActive',
    required: false,
    description: 'Filter by active status',
  })
  async findAll(
    @Query('serviceTypeId') serviceTypeId?: string,
    @Query('category') category?: string,
    @Query('isActive') isActive?: string,
  ) {
    const isActiveBool =
      isActive !== undefined ? isActive === 'true' : undefined;
    return this.faqsService.findAll(serviceTypeId, category, isActiveBool);
  }

  // 4. ADMIN: Update FAQ
  @Patch(':id')
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @Permissions('faqs:update')
  @ApiBearerAuth()
  @ApiOperation({
    summary: '[Admin] Update FAQ',
    description:
      'Update FAQ details including question, answer, order, status, etc.',
  })
  async update(@Param('id') id: string, @Body() updateFaqDto: UpdateFaqDto) {
    return this.faqsService.update(id, updateFaqDto);
  }

  // 5. ADMIN: Delete FAQ
  @Delete(':id')
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @Permissions('faqs:delete')
  @ApiBearerAuth()
  @ApiOperation({
    summary: '[Admin] Delete FAQ',
    description: 'Permanently delete a FAQ',
  })
  async remove(@Param('id') id: string) {
    return this.faqsService.remove(id);
  }
}
