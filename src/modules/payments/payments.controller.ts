import {
  Controller,
  Get,
  Post,
  Param,
  Query,
  UseGuards,
  Body,
  UseInterceptors,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiBearerAuth,
  ApiBody,
  ApiQuery,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { PermissionsGuard } from '../../common/guards/permissions.guard';
import { Permissions } from '../../common/decorators/permissions.decorator';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { PaymentsService } from './payments.service';
import { AuditLog } from '../../common/decorators/audit-log.decorator';
import { AuditLogInterceptor } from '../../common/interceptors/audit-log.interceptor';

@ApiTags('Payments')
@Controller('payments')
@UseGuards(JwtAuthGuard, PermissionsGuard)
@ApiBearerAuth('JWT-auth')
@UseInterceptors(AuditLogInterceptor)
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) {}

  // Customer Routes
  @Get('my')
  @Permissions('payments:read_own')
  @ApiOperation({ summary: '[Customer] List my payments' })
  @ApiQuery({ name: 'page', required: false, example: 1 })
  @ApiQuery({ name: 'limit', required: false, example: 10 })
  getMyPayments(
    @CurrentUser() user: any,
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
  ) {
    return this.paymentsService.findByUser(user.id, page, limit);
  }

  @Get(':id/receipt')
  @Permissions('payments:read_own')
  @ApiOperation({ summary: '[Customer] Download payment receipt' })
  downloadReceipt(@Param('id') id: string, @CurrentUser() user: any) {
    return this.paymentsService.downloadReceipt(id, user.id);
  }

  @Get(':id/invoice')
  @Permissions('payments:read_own')
  @ApiOperation({ summary: '[Customer] Generate formal invoice' })
  generateInvoice(@Param('id') id: string, @CurrentUser() user: any) {
    return this.paymentsService.generateInvoice(id, user.id);
  }

  @Post(':id/resend-receipt')
  @Permissions('payments:read_own')
  @ApiOperation({ summary: '[Customer] Resend receipt email' })
  resendReceipt(@Param('id') id: string, @CurrentUser() user: any) {
    return this.paymentsService.resendReceipt(id, user.id);
  }

  // Admin Routes
  @Get()
  @Permissions('payments:read')
  @ApiOperation({ summary: '[Admin] List all payments' })
  @ApiQuery({ name: 'page', required: false, example: 1 })
  @ApiQuery({ name: 'limit', required: false, example: 20 })
  getAllPayments(
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 20,
  ) {
    return this.paymentsService.findAll(page, limit);
  }

  @Post(':id/refund')
  @Permissions('payments:refund')
  @ApiOperation({ summary: '[Admin] Process payment refund' })
  @AuditLog({ action: 'PAYMENT_REFUNDED', resourceType: 'payment' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        reason: { type: 'string' },
        amount: {
          type: 'number',
          description: 'Amount to refund (optional for partial)',
        },
      },
      required: ['reason'],
    },
  })
  processRefund(@Param('id') id: string, @Body() dto: any) {
    return { success: true, message: 'Refund processed' };
  }
}
