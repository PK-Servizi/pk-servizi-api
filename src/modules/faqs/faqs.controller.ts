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
  UseInterceptors,
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
import { HttpCacheInterceptor } from '../../common/interceptors/http-cache.interceptor';

@ApiTags('FAQs')
@Controller('faqs')
export class FaqsController {
  constructor(private readonly faqsService: FaqsService) {}

  // 1. PUBLIC: Get all active FAQs
  @Get('public')
  @UseInterceptors(HttpCacheInterceptor)
  @ApiOperation({
    summary: '[Public] Get all active FAQs',
    description: 'Get all active FAQs',
  })
  async getPublicFaqs() {
    return this.faqsService.findActive();
  }

  // 2. PUBLIC: Get FAQs by service ID
  @Get('service/:serviceId')
  @UseInterceptors(HttpCacheInterceptor)
  @ApiOperation({
    summary: '[Public] Get FAQs for a specific service',
    description: 'Get all active FAQs for a specific service',
  })
  async getFaqsByService(@Param('serviceId') serviceId: string) {
    return this.faqsService.findByServiceId(serviceId);
  }

  // 3. ADMIN: Create FAQ
  @Post()
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @Permissions('faqs:create')
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({
    summary: '[Admin] Create FAQ',
    description: 'Create a new FAQ for a service type or general FAQ',
  })
  async create(@Body() createFaqDto: CreateFaqDto) {
    return this.faqsService.create(createFaqDto);
  }

  // 4. ADMIN: Get all FAQs (with filters)
  @Get()
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @Permissions('faqs:read')
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({
    summary: '[Admin] Get all FAQs',
    description: 'Get all FAQs for admin management',
  })
  async findAll() {
    return this.faqsService.findAll();
  }

  // 5. ADMIN: Update FAQ
  @Patch(':id')
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @Permissions('faqs:update')
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({
    summary: '[Admin] Update FAQ',
    description:
      'Update FAQ details including question, answer, order, status, etc.',
  })
  async update(@Param('id') id: string, @Body() updateFaqDto: UpdateFaqDto) {
    return this.faqsService.update(id, updateFaqDto);
  }

  // 6. ADMIN: Delete FAQ
  @Delete(':id')
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @Permissions('faqs:delete')
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({
    summary: '[Admin] Delete FAQ',
    description: 'Permanently delete a FAQ',
  })
  async remove(@Param('id') id: string) {
    return this.faqsService.remove(id);
  }
}
