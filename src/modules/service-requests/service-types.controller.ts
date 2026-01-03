import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { ServiceTypesService } from './service-types.service';
import { CreateServiceTypeDto } from './dto/create-service-type.dto';
import { UpdateServiceTypeDto } from './dto/update-service-type.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('service-types')
@Controller('service-types')
export class ServiceTypesController {
  constructor(private readonly serviceTypesService: ServiceTypesService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create service type' })
  create(@Body() createServiceTypeDto: CreateServiceTypeDto) {
    return this.serviceTypesService.create(createServiceTypeDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all service types' })
  findAll() {
    return this.serviceTypesService.findAll();
  }

  @Get('active')
  @ApiOperation({ summary: 'Get active service types' })
  findActive() {
    return this.serviceTypesService.findAll();
  }

  @Get('category/:category')
  @ApiOperation({ summary: 'Get service types by category' })
  findByCategory() {
    return { message: 'Feature not implemented yet' };
  }

  @Get('stats')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get service type statistics' })
  getStats() {
    return { message: 'Feature not implemented yet' };
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get service type by ID' })
  findOne(@Param('id') id: string) {
    return this.serviceTypesService.findOne(id);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update service type' })
  update(
    @Param('id') id: string,
    @Body() updateServiceTypeDto: UpdateServiceTypeDto,
  ) {
    return this.serviceTypesService.update(id, updateServiceTypeDto);
  }

  @Patch(':id/toggle')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Toggle service type active status' })
  toggleActive() {
    return { message: 'Feature not implemented yet' };
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete service type' })
  remove(@Param('id') id: string) {
    return this.serviceTypesService.remove(id);
  }
}
