import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Query,
  UseGuards,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiBearerAuth,
  ApiQuery,
} from '@nestjs/swagger';
import { PaymentsService } from './payments.service';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { UpdatePaymentDto } from './dto/update-payment.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';

@ApiTags('payments')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('payments')
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) {}

  @Post()
  @ApiOperation({ summary: 'Create payment' })
  create(@Body() createPaymentDto: CreatePaymentDto) {
    return this.paymentsService.create(createPaymentDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all payments with pagination' })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  findAll(@Query('page') page?: number, @Query('limit') limit?: number) {
    return this.paymentsService.findAll(page, limit);
  }

  @Get('my-payments')
  @ApiOperation({ summary: 'Get current user payments' })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  findMyPayments(
    @CurrentUser() user: any,
    @Query('page') page?: number,
    @Query('limit') limit?: number,
  ) {
    return this.paymentsService.findByUser(user.id, page, limit);
  }

  @Get('stats')
  @ApiOperation({ summary: 'Get payment statistics' })
  getStats() {
    return this.paymentsService.getPaymentStats();
  }

  @Get('my-stats')
  @ApiOperation({ summary: 'Get current user payment statistics' })
  getMyStats(@CurrentUser() user: any) {
    return this.paymentsService.getPaymentStats(user.id);
  }

  @Get('transaction/:transactionId')
  @ApiOperation({ summary: 'Get payment by transaction ID' })
  findByTransactionId(@Param('transactionId') transactionId: string) {
    return this.paymentsService.findByTransactionId(transactionId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get payment by ID' })
  findOne(@Param('id') id: string) {
    return this.paymentsService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update payment' })
  update(@Param('id') id: string, @Body() updatePaymentDto: UpdatePaymentDto) {
    return this.paymentsService.update(id, updatePaymentDto);
  }

  @Patch(':id/status')
  @ApiOperation({ summary: 'Update payment status' })
  updateStatus(
    @Param('id') id: string,
    @Body('status') status: string,
    @Body('transactionId') transactionId?: string,
  ) {
    return this.paymentsService.updateStatus(id, status, transactionId);
  }

  @Post(':id/refund')
  @ApiOperation({ summary: 'Process payment refund' })
  processRefund(
    @Param('id') id: string,
    @Body('refundAmount') refundAmount?: number,
  ) {
    return this.paymentsService.processRefund(id, refundAmount);
  }
}
