import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common';
import { RolePermissionsService } from './role-permissions.service';
import { AssignRolePermissionsDto } from './dto/assign-role-permissions.dto';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('Role Permissions')
@Controller('role-permissions')
export class RolePermissionsController {
  constructor(
    private readonly rolePermissionsService: RolePermissionsService,
  ) {}

  @Post(':roleId')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Assign permissions to a role' })
  assignPermissions(
    @Param('roleId') roleId: string,
    @Body() dto: AssignRolePermissionsDto,
  ) {
    return this.rolePermissionsService.assignPermissions(roleId, dto);
  }

  @Get(':roleId')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Retrieve permissions for a role' })
  getPermissions(@Param('roleId') roleId: string) {
    return this.rolePermissionsService.getPermissionsByRole(roleId);
  }

  @Delete(':roleId/:permissionId')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Remove a permission from a role' })
  removePermission(
    @Param('roleId') roleId: string,
    @Param('permissionId') permissionId: string,
  ) {
    return this.rolePermissionsService.removePermission(roleId, permissionId);
  }
}
