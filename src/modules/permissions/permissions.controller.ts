import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Query,
} from '@nestjs/common';
import { PermissionsService } from './permissions.service';
import { CreatePermissionDto } from './dto/create-permission.dto';
import { UpdatePermissionDto } from './dto/update-permission.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { PermissionsGuard } from '../../common/guards/permissions.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { Permissions } from '../../common/decorators/permissions.decorator';
import { RoleEnum } from '../roles/role.enum';
import { SecurityUtil } from '../../common/utils/security.util';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';

@UseGuards(JwtAuthGuard, RolesGuard, PermissionsGuard)
@ApiTags('permissions')
@Controller('permissions')
export class PermissionsController {
  constructor(private readonly permissionsService: PermissionsService) {}

  @Post()
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Create a new permission' })
  @Roles(RoleEnum.ADMIN)
  @Permissions('permissions.create')
  create(@Body() dto: CreatePermissionDto) {
    return this.permissionsService.create(dto);
  }

  @Get()
  @ApiBearerAuth('JWT-auth')
  @Permissions('permissions.read')
  @ApiOperation({ summary: 'Retrieve all permissions' })
  findAll() {
    return this.permissionsService.findAll();
  }

  @Get('resources')
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Retrieve all resources' })
  @Permissions('permissions.read')
  getAllResources() {
    return this.permissionsService.getAllResources();
  }

  @Get('actions')
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Retrieve all actions' })
  @Permissions('permissions.read')
  getAllActions() {
    return this.permissionsService.getAllActions();
  }

  @Get('by-resource')
  @ApiBearerAuth('JWT-auth')
  @Permissions('permissions.read')
  @ApiOperation({ summary: 'Retrieve all permissions by resource' })
  findByResource(@Query('resource') resource: string) {
    return this.permissionsService.findByResource(resource);
  }

  @Get(':id')
  @ApiBearerAuth('JWT-auth')
  @Permissions('permissions.read')
  @ApiOperation({ summary: 'Retrieve a specific permission' })
  findOne(@Param('id') id: string) {
    const validId = SecurityUtil.validateId(id);
    return this.permissionsService.findOne(validId);
  }

  @Patch(':id')
  @ApiBearerAuth('JWT-auth')
  @Permissions('permission.update')
  @ApiOperation({ summary: 'Update a specific permission' })
  @Roles(RoleEnum.ADMIN)
  update(@Param('id') id: string, @Body() dto: UpdatePermissionDto) {
    const validId = SecurityUtil.validateId(id);
    return this.permissionsService.update(validId, dto);
  }

  @Delete(':id')
  @ApiBearerAuth('JWT-auth')
  @Permissions('permissions.delete')
  @ApiOperation({ summary: 'Delete a specific permission' })
  @Roles(RoleEnum.ADMIN)
  remove(@Param('id') id: string) {
    const validId = SecurityUtil.validateId(id);
    return this.permissionsService.remove(validId);
  }
}
