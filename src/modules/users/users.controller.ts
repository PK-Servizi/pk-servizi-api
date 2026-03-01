import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Put,
  Delete,
  Patch,
  Query,
  UseGuards,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiBearerAuth,
  ApiConsumes,
  ApiBody,
  ApiQuery,
} from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';
import { UsersService } from './users.service';
import { UserRequest } from '../../common/interfaces/user-request.interface';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UpdateUserProfileDto } from './dto/update-user-profile.dto';
import { UpdateGdprConsentDto } from './dto/update-gdpr-consent.dto';
import { AccountDeletionRequestDto } from './dto/account-deletion-request.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { PermissionsGuard } from '../../common/guards/permissions.guard';
import { Permissions } from '../../common/decorators/permissions.decorator';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { AuditLog } from '../../common/decorators/audit-log.decorator';
import { AuditLogInterceptor } from '../../common/interceptors/audit-log.interceptor';

@ApiTags('Users')
@Controller('users')
@UseGuards(JwtAuthGuard, PermissionsGuard)
@UseInterceptors(AuditLogInterceptor)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  // Customer Routes
  @Get('profile')
  @Permissions('profiles:read')
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: '[Customer] Get own profile' })
  getProfile(@CurrentUser() user: UserRequest) {
    return this.usersService.getProfile(user.id);
  }

  @Put('profile')
  @Permissions('profiles:update')
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: '[Customer] Update own profile' })
  @ApiBody({ type: UpdateUserDto })
  @AuditLog({
    action: 'PROFILE_UPDATED',
    resourceType: 'user',
    captureOldValues: true,
  })
  updateProfile(@CurrentUser() user: UserRequest, @Body() dto: UpdateUserDto) {
    return this.usersService.updateProfile(user.id, dto);
  }

  @Get('profile/extended')
  @Permissions('profiles:read')
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: '[Customer] Get extended profile' })
  getExtendedProfile(@CurrentUser() user: UserRequest) {
    return this.usersService.getExtendedProfile(user.id);
  }

  @Put('profile/extended')
  @Permissions('profiles:update')
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: '[Customer] Update extended profile' })
  @ApiBody({ type: UpdateUserProfileDto })
  @AuditLog({
    action: 'EXTENDED_PROFILE_UPDATED',
    resourceType: 'user_profile',
    captureOldValues: true,
  })
  updateExtendedProfile(
    @CurrentUser() user: any,
    @Body() dto: UpdateUserProfileDto,
  ) {
    return this.usersService.updateExtendedProfile(user.id, dto);
  }

  @Post('avatar')
  @Permissions('profiles:update')
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: '[Customer] Upload avatar' })
  @AuditLog({ action: 'AVATAR_UPLOADED', resourceType: 'user_profile' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
          description: 'Avatar image file (JPEG, PNG, WebP)',
        },
      },
      required: ['file'],
    },
  })
  @UseInterceptors(FileInterceptor('file'))
  uploadAvatar(
    @CurrentUser() user: UserRequest,
    @UploadedFile() file: Express.Multer.File,
  ) {
    return this.usersService.uploadAvatar(user.id, file);
  }

  @Delete('avatar')
  @Permissions('profiles:update')
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: '[Customer] Delete avatar' })
  @AuditLog({ action: 'AVATAR_DELETED', resourceType: 'user_profile' })
  deleteAvatar(@CurrentUser() user: UserRequest) {
    return this.usersService.deleteAvatar(user.id);
  }

  // GDPR Compliance Routes
  @Post('gdpr/consent')
  @Permissions('profiles:update')
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: '[Customer] Update consent preferences' })
  @ApiBody({ type: UpdateGdprConsentDto })
  @AuditLog({
    action: 'GDPR_CONSENT_UPDATED',
    resourceType: 'user',
    captureOldValues: true,
  })
  updateGdprConsent(
    @CurrentUser() user: UserRequest,
    @Body() dto: UpdateGdprConsentDto,
  ) {
    return this.usersService.updateGdprConsent(user.id, dto);
  }

  @Get('gdpr/data-export')
  @Permissions('profiles:read')
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: '[Customer] Request user data export' })
  @AuditLog({ action: 'DATA_EXPORT_REQUESTED', resourceType: 'user' })
  requestDataExport(@CurrentUser() user: UserRequest) {
    return this.usersService.requestDataExport(user.id);
  }

  @Post('gdpr/deletion-request')
  @Permissions('profiles:update')
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: '[Customer] Request account deletion' })
  @ApiBody({ type: AccountDeletionRequestDto })
  @AuditLog({ action: 'ACCOUNT_DELETION_REQUESTED', resourceType: 'user' })
  requestAccountDeletion(
    @CurrentUser() user: UserRequest,
    @Body() dto: AccountDeletionRequestDto,
  ) {
    return this.usersService.requestAccountDeletion(user.id, dto);
  }

  @Get('gdpr/consent-history')
  @Permissions('profiles:read')
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: '[Customer] View consent history' })
  getConsentHistory(@CurrentUser() user: UserRequest) {
    return this.usersService.getConsentHistory(user.id);
  }

  // Admin Routes
  @Post()
  @Permissions('users:create')
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: '[Admin] Create new user' })
  @ApiBody({ type: CreateUserDto })
  @AuditLog({ action: 'USER_CREATED', resourceType: 'user' })
  create(@Body() dto: CreateUserDto) {
    return this.usersService.create(dto);
  }

  @Get()
  @Permissions('users:list')
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: '[Admin] List all users' })
  @ApiQuery({ name: 'page', required: false, example: 1 })
  @ApiQuery({ name: 'limit', required: false, example: 20 })
  @ApiQuery({ name: 'search', required: false })
  findAll(
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 20,
    @Query('search') search?: string,
  ) {
    return this.usersService.findAll(page, limit, search);
  }

  @Get(':id')
  @Permissions('users:read')
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: '[Admin] Get user by ID' })
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(id);
  }

  @Put(':id')
  @Permissions('users:update')
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: '[Admin] Update user' })
  @ApiBody({ type: UpdateUserDto })
  @AuditLog({
    action: 'USER_UPDATED',
    resourceType: 'user',
    captureOldValues: true,
  })
  update(@Param('id') id: string, @Body() dto: UpdateUserDto) {
    return this.usersService.update(id, dto);
  }

  @Delete(':id')
  @Permissions('users:delete')
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: '[Admin] Delete user' })
  @AuditLog({ action: 'USER_DELETED', resourceType: 'user' })
  remove(@Param('id') id: string) {
    return this.usersService.remove(id);
  }

  @Patch(':id/activate')
  @Permissions('users:activate')
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: '[Admin] Activate user' })
  @AuditLog({ action: 'USER_ACTIVATED', resourceType: 'user' })
  activate(@Param('id') id: string) {
    return this.usersService.activate(id);
  }

  @Patch(':id/deactivate')
  @Permissions('users:activate')
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: '[Admin] Deactivate user' })
  @AuditLog({ action: 'USER_DEACTIVATED', resourceType: 'user' })
  deactivate(@Param('id') id: string) {
    return this.usersService.deactivate(id);
  }

  @Get(':id/activity')
  @Permissions('users:read')
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: '[Admin] Get user activity' })
  getUserActivity(@Param('id') id: string) {
    return this.usersService.getUserActivity(id);
  }

  @Get(':id/subscriptions')
  @Permissions('subscriptions:read')
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: '[Admin] Get user subscriptions' })
  getUserSubscriptions(@Param('id') id: string) {
    return this.usersService.getUserSubscriptions(id);
  }
}
