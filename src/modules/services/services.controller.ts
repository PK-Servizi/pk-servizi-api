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
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiBody } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { PermissionsGuard } from '../../common/guards/permissions.guard';
import { Permissions } from '../../common/decorators/permissions.decorator';
import { ServicesService } from './services.service';
import { CreateServiceDto } from './dto/create-service.dto';
import { UpdateServiceDto } from './dto/update-service.dto';
import { HttpCacheInterceptor } from '../../common/interceptors/http-cache.interceptor';

@ApiTags('Services')
@Controller('services')
@UseInterceptors(HttpCacheInterceptor)
export class ServicesController {
  constructor(private readonly servicesService: ServicesService) {}

  // Public/Customer Routes
  @Get()
  @ApiOperation({ summary: '[Public] List active services' })
  findActive() {
    return this.servicesService.findActive();
  }

  @Get(':id')
  @ApiOperation({ summary: '[Public] Get service details' })
  findOne(@Param('id') id: string) {
    return this.servicesService.findOne(id);
  }

  @Get(':id/schema')
  @ApiOperation({ summary: '[Public] Get form schema' })
  getSchema(@Param('id') id: string) {
    return this.servicesService.getSchema(id);
  }

  @Get(':id/required-documents')
  @ApiOperation({ summary: '[Public] Get required document list' })
  getRequiredDocuments(@Param('id') id: string) {
    return this.servicesService.getRequiredDocuments(id);
  }

  // Admin Routes
  @Post()
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @Permissions('services:write')
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: '[Admin] Create service' })
  create(@Body() dto: CreateServiceDto) {
    return this.servicesService.create(dto);
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @Permissions('services:write')
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: '[Admin] Update service' })
  update(@Param('id') id: string, @Body() dto: UpdateServiceDto) {
    return this.servicesService.update(id, dto);
  }

  @Put(':id/schema')
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @Permissions('services:write')
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: '[Admin] Update form schema' })
  @ApiBody({
    schema: { type: 'object', example: { type: 'object', properties: {} } },
  })
  updateSchema(
    @Param('id') id: string,
    @Body() schema: Record<string, unknown>,
  ) {
    return this.servicesService.updateSchema(id, schema);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @Permissions('services:delete')
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: '[Admin] Delete service' })
  remove(@Param('id') id: string) {
    return this.servicesService.remove(id);
  }

  @Patch(':id/activate')
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @Permissions('services:write')
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: '[Admin] Activate service' })
  activate(@Param('id') id: string) {
    return this.servicesService.activate(id);
  }
}
