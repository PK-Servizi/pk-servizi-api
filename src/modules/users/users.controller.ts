import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Put,
  Delete,
  Patch,
  UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { UsersService } from './users.service';
import { FamilyMembersService } from './family-members.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { CreateFamilyMemberDto } from './dto/create-family-member.dto';
import { UpdateFamilyMemberDto } from './dto/update-family-member.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { PermissionsGuard } from '../../common/guards/permissions.guard';
import { Permissions } from '../../common/decorators/permissions.decorator';
import { CurrentUser } from '../auth/decorators/current-user.decorator';

@ApiTags('Users')
@Controller('users')
@UseGuards(JwtAuthGuard, PermissionsGuard)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  // Customer Routes
  @Get('profile')
  @Permissions('users:read_own')
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Get own profile' })
  getProfile(@CurrentUser() user: any) {
    return this.usersService.getProfile(user.id);
  }

  @Put('profile')
  @Permissions('users:write_own')
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Update own profile' })
  updateProfile(@CurrentUser() user: any, @Body() dto: UpdateUserDto) {
    return this.usersService.updateProfile(user.id, dto);
  }

  @Get('profile/extended')
  @Permissions('users:read_own')
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Get extended profile' })
  getExtendedProfile(@CurrentUser() user: any) {
    return this.usersService.getExtendedProfile(user.id);
  }

  @Put('profile/extended')
  @Permissions('users:write_own')
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Update extended profile' })
  updateExtendedProfile(@CurrentUser() user: any, @Body() dto: any) {
    return this.usersService.updateExtendedProfile(user.id, dto);
  }

  @Post('avatar')
  @Permissions('users:write_own')
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Upload avatar' })
  uploadAvatar(@CurrentUser() user: any, @Body() dto: any) {
    return this.usersService.uploadAvatar(user.id, dto);
  }

  @Delete('avatar')
  @Permissions('users:write_own')
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Delete avatar' })
  deleteAvatar(@CurrentUser() user: any) {
    return this.usersService.deleteAvatar(user.id);
  }

  // Admin Routes
  @Get()
  @Permissions('users:read')
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'List all users' })
  findAll() {
    return this.usersService.findAll();
  }

  @Get(':id')
  @Permissions('users:read')
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Get user by ID' })
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(id);
  }

  @Put(':id')
  @Permissions('users:write')
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Update user' })
  update(@Param('id') id: string, @Body() dto: UpdateUserDto) {
    return this.usersService.update(id, dto);
  }

  @Delete(':id')
  @Permissions('users:delete')
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Delete user' })
  remove(@Param('id') id: string) {
    return this.usersService.remove(id);
  }

  @Patch(':id/activate')
  @Permissions('users:write')
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Activate user' })
  activate(@Param('id') id: string) {
    return this.usersService.activate(id);
  }

  @Patch(':id/deactivate')
  @Permissions('users:write')
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Deactivate user' })
  deactivate(@Param('id') id: string) {
    return this.usersService.deactivate(id);
  }

  @Get(':id/activity')
  @Permissions('users:read')
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Get user activity' })
  getUserActivity(@Param('id') id: string) {
    return this.usersService.getUserActivity(id);
  }

  @Get(':id/subscriptions')
  @Permissions('subscriptions:read')
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Get user subscriptions' })
  getUserSubscriptions(@Param('id') id: string) {
    return this.usersService.getUserSubscriptions(id);
  }
}

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
    return this.familyMembersService.findOne(id, user.id);
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

  // Admin Routes
  @Get('user/:userId')
  @Permissions('family_members:read')
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'List user\'s family members' })
  findByUser(@Param('userId') userId: string) {
    return this.familyMembersService.findByUser(userId);
  }
}