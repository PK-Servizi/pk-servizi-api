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
import { CmsService } from './cms.service';
import { CreateCmsContentDto } from './dto/create-cms-content.dto';
import { UpdateCmsContentDto } from './dto/update-cms-content.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('cms')
@Controller('cms')
export class CmsController {
  constructor(private readonly cmsService: CmsService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create CMS content' })
  create(@Body() createCmsContentDto: CreateCmsContentDto) {
    return this.cmsService.create(createCmsContentDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all CMS content with pagination' })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  findAll(@Query('page') page?: number, @Query('limit') limit?: number) {
    return this.cmsService.findAll(page, limit);
  }

  @Get('type/:type')
  @ApiOperation({ summary: 'Get CMS content by type' })
  findByType(@Param('type') type: string) {
    return this.cmsService.findByType(type);
  }

  @Get('slug/:slug')
  @ApiOperation({ summary: 'Get CMS content by slug' })
  findBySlug(@Param('slug') slug: string) {
    return this.cmsService.findBySlug(slug);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get CMS content by ID' })
  findOne(@Param('id') id: string) {
    return this.cmsService.findOne(id);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update CMS content' })
  update(
    @Param('id') id: string,
    @Body() updateCmsContentDto: UpdateCmsContentDto,
  ) {
    return this.cmsService.update(id, updateCmsContentDto);
  }

  @Patch(':id/toggle')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Toggle CMS content active status' })
  toggleActive(@Param('id') id: string) {
    return this.cmsService.toggleActive(id);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete CMS content' })
  remove(@Param('id') id: string) {
    return this.cmsService.remove(id);
  }
}
