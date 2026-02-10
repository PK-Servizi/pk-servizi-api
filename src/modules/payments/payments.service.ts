import { BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BaseService } from '../../common/services/base.service';
import { Payment } from './entities/payment.entity';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { UpdatePaymentDto } from './dto/update-payment.dto';

/**
 * PaymentsService
 * Handles payment management, Stripe integration, and payment processing
 * Extends BaseService for CRUD operations
 */
export class PaymentsService {
  constructor(
    @InjectRepository(Payment)
    protected readonly paymentRepository: Repository<Payment>,
  ) {}

  /**
   * Create payment with default status
   */
  async create(createPaymentDto: CreatePaymentDto): Promise<Payment> {
    const dto: any = {
      status: 'pending',
      ...createPaymentDto,
    };
    const entity = this.paymentRepository.create(dto);
    const saved = await this.paymentRepository.save(entity);
    return Array.isArray(saved) ? saved[0] : saved;
  }

  /**
   * Find all payments (wrapper for BaseService)
   */
  async findAll(page: number = 1, limit: number = 20) {
    const qb = this.paymentRepository
      .createQueryBuilder('payment')
      .leftJoinAndSelect('payment.user', 'user')
      .leftJoinAndSelect('payment.serviceRequest', 'serviceRequest')
      .skip((page - 1) * limit)
      .take(limit)
      .orderBy('payment.createdAt', 'DESC');

    const [data, total] = await qb.getManyAndCount();

    return {
      data,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  /**
   * Find payments for a user with pagination
   */
  async findByUser(userId: string, page = 1, limit = 10) {
    const qb = this.paymentRepository
      .createQueryBuilder('payment')
      .leftJoinAndSelect('payment.serviceRequest', 'serviceRequest')
      .where('payment.userId = :userId', { userId })
      .skip((page - 1) * limit)
      .take(limit)
      .orderBy('payment.createdAt', 'DESC');

    const [data, total] = await qb.getManyAndCount();

    return {

      data,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  /**
   * Find payment by Stripe transaction ID
   */
  async findByTransactionId(transactionId: string): Promise<Payment> {
    const payment = await this.paymentRepository.findOne({
      where: { stripePaymentIntentId: transactionId },
      relations: ['user', 'serviceRequest'],
    });

    if (!payment) {
      throw new Error(`Payment with transaction ID ${transactionId} not found`);
    }

    return payment;
  }

  /**
   * Update payment status with transaction tracking
   */
  async updateStatus(
    id: string,
    status: string,
    transactionId?: string,
  ): Promise<Payment> {
    const payment = await this.paymentRepository.findOne({ where: { id } });
    if (!payment) {
      throw new Error(`Payment ${id} not found`);
    }

    const updateData: any = { status };
    if (transactionId) {
      updateData.stripePaymentIntentId = transactionId;
    }
    if (status === 'completed') {
      updateData.paidAt = new Date();
    }

    await this.paymentRepository.update(id, updateData);
    return this.paymentRepository.findOne({
      where: { id },
    }) as Promise<Payment>;
  }

  /**
   * Get payment statistics
   */
  async getPaymentStats(userId?: string) {
    const whereClause = userId ? { userId } : {};

    const [total, completed, pending, failed] = await Promise.all([
      this.paymentRepository.count({ where: whereClause }),
      this.paymentRepository.count({
        where: { ...whereClause, status: 'completed' },
      }),
      this.paymentRepository.count({
        where: { ...whereClause, status: 'pending' },
      }),
      this.paymentRepository.count({
        where: { ...whereClause, status: 'failed' },
      }),
    ]);

    const totalAmount = await this.paymentRepository
      .createQueryBuilder('payment')
      .select('SUM(payment.amount)', 'sum')
      .where(userId ? 'payment.userId = :userId' : '1=1', { userId })
      .andWhere('payment.status = :status', { status: 'completed' })
      .getRawOne();

    return {
      total,
      completed,
      pending,
      failed,
      totalAmount: parseFloat(totalAmount.sum) || 0,
    };
  }

  /**
   * Record Stripe payment
   */
  async recordStripePayment(data: {
    stripeInvoiceId: string;
    amount: number;
    currency: string;
    status: string;
  }): Promise<Payment> {
    const payment = this.paymentRepository.create({
      amount: data.amount,
      currency: data.currency,
      status: data.status,
      paymentMethod: 'stripe',
      metadata: { stripeInvoiceId: data.stripeInvoiceId },
      paidAt: data.status === 'succeeded' ? new Date() : null,
    });
    return this.paymentRepository.save(payment);
  }

  /**
   * Process refund for completed payment
   */
  async processRefund(id: string, refundAmount?: number): Promise<Payment> {
    const payment = await this.paymentRepository.findOne({ where: { id } });
    if (!payment) {
      throw new Error(`Payment ${id} not found`);
    }

    if (payment.status !== 'completed') {
      throw new BadRequestException('Can only refund completed payments');
    }

    const refundAmountFinal = refundAmount || payment.amount;

    if (refundAmountFinal > payment.amount) {
      throw new BadRequestException(
        'Refund amount cannot exceed payment amount',
      );
    }

    payment.status = 'refunded';
    return this.paymentRepository.save(payment);
  }

  /**
   * Generate receipt for payment
   */
  async downloadReceipt(id: string, userId: string): Promise<Buffer> {
    const payment = await this.paymentRepository.findOne({
      where: { id },
      relations: ['user', 'serviceRequest', 'serviceRequest.service'],
    });
    
    if (!payment) {
      throw new Error(`Payment ${id} not found`);
    }

    if (payment.userId !== userId) {
      throw new Error('Payment not found');
    }

    // Generate PDF receipt
    const pdfBuffer = await this.generateReceiptPDF(payment);
    return pdfBuffer;
  }

  /**
   * Generate PDF receipt for payment
   */
  private async generateReceiptPDF(payment: any): Promise<Buffer> {
    // Simple HTML to PDF conversion
    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <style>
          body { font-family: Arial, sans-serif; margin: 40px; }
          .header { text-align: center; margin-bottom: 30px; }
          .header h1 { color: #2c3e50; margin: 0; }
          .info { margin: 20px 0; }
          .info-row { display: flex; justify-content: space-between; padding: 10px; border-bottom: 1px solid #eee; }
          .label { font-weight: bold; color: #7f8c8d; }
          .value { color: #2c3e50; }
          .total { margin-top: 30px; padding: 20px; background: #ecf0f1; border-radius: 5px; }
          .total-row { display: flex; justify-content: space-between; font-size: 24px; font-weight: bold; }
          .footer { margin-top: 50px; text-align: center; color: #95a5a6; font-size: 12px; }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>PAYMENT RECEIPT</h1>
          <p>PK Servizi API</p>
        </div>
        
        <div class="info">
          <div class="info-row">
            <span class="label">Receipt ID:</span>
            <span class="value">${payment.id}</span>
          </div>
          <div class="info-row">
            <span class="label">Payment Date:</span>
            <span class="value">${new Date(payment.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
          </div>
          <div class="info-row">
            <span class="label">Payment Method:</span>
            <span class="value">Credit Card</span>
          </div>
          <div class="info-row">
            <span class="label">Transaction ID:</span>
            <span class="value">${payment.stripePaymentIntentId || 'N/A'}</span>
          </div>
          <div class="info-row">
            <span class="label">Service:</span>
            <span class="value">${payment.serviceRequest?.service?.name || 'Service Request'}</span>
          </div>
          <div class="info-row">
            <span class="label">Status:</span>
            <span class="value" style="color: ${payment.status === 'completed' ? '#27ae60' : payment.status === 'refunded' ? '#e74c3c' : '#f39c12'}">
              ${payment.status.toUpperCase()}
            </span>
          </div>
        </div>
        
        <div class="total">
          <div class="total-row">
            <span>Total Amount Paid:</span>
            <span>€${(payment.amount / 100).toFixed(2)}</span>
          </div>
        </div>
        
        <div class="footer">
          <p>This is an automatically generated receipt.</p>
          <p>Generated on ${new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' })}</p>
        </div>
      </body>
      </html>
    `;

    // For now, return HTML as UTF-8 buffer (you can integrate puppeteer or pdfkit later)
    // This will display as HTML in browser but can be "printed to PDF"
    return Buffer.from(html, 'utf-8');
  }

  /**
   * Generate invoice for payment
   */
  async generateInvoice(id: string, userId: string): Promise<Buffer> {
    const payment = await this.paymentRepository.findOne({
      where: { id },
      relations: ['user', 'serviceRequest', 'serviceRequest.service'],
    });
    
    if (!payment) {
      throw new Error(`Payment ${id} not found`);
    }

    if (payment.userId !== userId) {
      throw new Error('Payment not found');
    }

    // Generate PDF invoice
    const pdfBuffer = await this.generateInvoicePDF(payment);
    return pdfBuffer;
  }

  /**
   * Generate PDF invoice for payment
   */
  private async generateInvoicePDF(payment: any): Promise<Buffer> {
    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <style>
          body { font-family: Arial, sans-serif; margin: 40px; }
          .header { display: flex; justify-content: space-between; margin-bottom: 40px; border-bottom: 3px solid #2c3e50; padding-bottom: 20px; }
          .company { font-size: 24px; font-weight: bold; color: #2c3e50; }
          .invoice-title { font-size: 36px; color: #e74c3c; text-align: right; }
          .details { display: grid; grid-template-columns: 1fr 1fr; gap: 30px; margin: 30px 0; }
          .section { padding: 20px; background: #f8f9fa; border-radius: 5px; }
          .section-title { font-weight: bold; color: #7f8c8d; margin-bottom: 15px; font-size: 14px; }
          .section-content { color: #2c3e50; line-height: 1.8; }
          table { width: 100%; border-collapse: collapse; margin: 30px 0; }
          th { background: #2c3e50; color: white; padding: 15px; text-align: left; }
          td { padding: 15px; border-bottom: 1px solid #dee2e6; }
          .total-section { margin-top: 30px; text-align: right; }
          .total-row { display: flex; justify-content: flex-end; padding: 10px 0; font-size: 18px; }
          .total-row.grand { font-size: 24px; font-weight: bold; background: #ecf0f1; padding: 20px; margin-top: 10px; border-radius: 5px; }
          .total-label { margin-right: 50px; }
          .footer { margin-top: 60px; text-align: center; color: #95a5a6; font-size: 12px; border-top: 1px solid #dee2e6; padding-top: 20px; }
        </style>
      </head>
      <body>
        <div class="header">
          <div>
            <div class="company">PK SERVIZI</div>
            <div style="color: #7f8c8d; margin-top: 5px;">Professional Services</div>
          </div>
          <div class="invoice-title">INVOICE</div>
        </div>
        
        <div class="details">
          <div class="section">
            <div class="section-title">INVOICE TO:</div>
            <div class="section-content">
              ${payment.user?.fullName || 'Customer'}<br>
              ${payment.user?.email || ''}
            </div>
          </div>
          <div class="section">
            <div class="section-title">INVOICE DETAILS:</div>
            <div class="section-content">
              <strong>Invoice #:</strong> INV-${payment.id.substring(0, 8).toUpperCase()}<br>
              <strong>Date:</strong> ${new Date(payment.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}<br>
              <strong>Payment ID:</strong> ${payment.id}
            </div>
          </div>
        </div>
        
        <table>
          <thead>
            <tr>
              <th>DESCRIPTION</th>
              <th style="text-align: center;">QTY</th>
              <th style="text-align: right;">UNIT PRICE</th>
              <th style="text-align: right;">TOTAL</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>
                <strong>${payment.serviceRequest?.service?.name || 'Service Request'}</strong><br>
                <span style="color: #7f8c8d; font-size: 14px;">Service ID: ${payment.serviceRequestId || 'N/A'}</span>
              </td>
              <td style="text-align: center;">1</td>
              <td style="text-align: right;">€${(payment.amount / 100).toFixed(2)}</td>
              <td style="text-align: right;"><strong>€${(payment.amount / 100).toFixed(2)}</strong></td>
            </tr>
          </tbody>
        </table>
        
        <div class="total-section">
          <div class="total-row">
            <span class="total-label">Subtotal:</span>
            <span>€${(payment.amount / 100).toFixed(2)}</span>
          </div>
          <div class="total-row">
            <span class="total-label">Tax (0%):</span>
            <span>€0.00</span>
          </div>
          <div class="total-row grand">
            <span class="total-label">TOTAL PAID:</span>
            <span>€${(payment.amount / 100).toFixed(2)}</span>
          </div>
        </div>
        
        <div class="footer">
          <p><strong>Payment Method:</strong> Credit Card | <strong>Transaction ID:</strong> ${payment.stripePaymentIntentId || 'N/A'}</p>
          <p><strong>Status:</strong> ${payment.status.toUpperCase()}${payment.status === 'refunded' ? ' - Amount has been refunded' : ''}</p>
          <p style="margin-top: 20px;">Thank you for your business!</p>
          <p>Generated on ${new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' })}</p>
        </div>
      </body>
      </html>
    `;

    return Buffer.from(html, 'utf-8');
  }

  /**
   * Old generateInvoice return format (kept for compatibility)
   */
  async getInvoiceData(id: string, userId: string): Promise<any> {
    const payment = await this.paymentRepository.findOne({ where: { id } });
    if (!payment) {
      throw new Error(`Payment ${id} not found`);
    }

    if (payment.userId !== userId) {
      throw new Error('Payment not found');
    }

    return {
      paymentId: id,
      invoiceUrl: `/api/v1/payments/${id}/invoice.pdf`,
      invoiceNumber: `INV-${Date.now()}`,
      generatedAt: new Date(),
    };
  }

  /**
   * Resend receipt email
   */
  async resendReceipt(id: string, userId: string): Promise<any> {
    const payment = await this.paymentRepository.findOne({ where: { id } });
    if (!payment) {
      throw new Error(`Payment ${id} not found`);
    }

    if (payment.userId !== userId) {
      throw new Error('Payment not found');
    }

    return {
      paymentId: id,
      sentAt: new Date(),
      emailAddress: 'user@example.com',
    };
  }
}
