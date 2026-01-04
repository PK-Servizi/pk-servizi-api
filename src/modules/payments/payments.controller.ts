import {
  Controller,
  Get,
  Post,
  Param,
  UseGuards,
  Body,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { PermissionsGuard } from '../../common/guards/permissions.guard';
import { Permissions } from '../../common/decorators/permissions.decorator';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { PaymentsService } from './payments.service';

@ApiTags('Payments')
@Controller('payments')
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) {}

  // Customer Routes
  @Get('my')
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @Permissions('payments:read_own')
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'List my payments' })
  getMyPayments(@CurrentUser() user: any) {
    return this.paymentsService.findByUser(user.id);
  }

  @Get(':id/receipt')
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @Permissions('payments:read_own')
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Download receipt' })
  downloadReceipt(@Param('id') id: string, @CurrentUser() user: any) {
    return { success: true, message: 'Receipt downloaded' };
  }

  // Admin Routes
  @Get()
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @Permissions('payments:read')
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'List all payments' })
  getAllPayments() {
    return this.paymentsService.findAll();
  }

  @Post(':id/refund')
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @Permissions('payments:refund')
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Process refund' })
  processRefund(@Param('id') id: string, @Body() dto: any) {
    return { success: true, message: 'Refund processed' };
  }
}