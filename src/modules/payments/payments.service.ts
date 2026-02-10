import { BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Payment } from './entities/payment.entity';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { UpdatePaymentDto } from './dto/update-payment.dto';
import * as PDFDocument from 'pdfkit';

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
    return new Promise((resolve, reject) => {
      try {
        const doc = new PDFDocument({ margin: 50 });
        const chunks: Buffer[] = [];

        doc.on('data', (chunk) => chunks.push(chunk));
        doc.on('end', () => resolve(Buffer.concat(chunks)));
        doc.on('error', reject);

        // Header
        doc.fontSize(24).font('Helvetica-Bold').text('PAYMENT RECEIPT', { align: 'center' });
        doc.fontSize(12).font('Helvetica').text('PK Servizi API', { align: 'center' });
        doc.moveDown(2);

        // Receipt details
        const leftMargin = 50;
        const rightMargin = 300;
        let yPosition = doc.y;

        doc.fontSize(10).font('Helvetica-Bold');
        doc.text('Receipt ID:', leftMargin, yPosition);
        doc.font('Helvetica').text(payment.id, rightMargin, yPosition, { width: 250 });
        yPosition += 20;

        doc.font('Helvetica-Bold').text('Payment Date:', leftMargin, yPosition);
        doc.font('Helvetica').text(
          new Date(payment.createdAt).toLocaleDateString('en-US', { 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
          }), 
          rightMargin, 
          yPosition
        );
        yPosition += 20;

        doc.font('Helvetica-Bold').text('Payment Method:', leftMargin, yPosition);
        doc.font('Helvetica').text('Credit Card', rightMargin, yPosition);
        yPosition += 20;

        doc.font('Helvetica-Bold').text('Transaction ID:', leftMargin, yPosition);
        doc.font('Helvetica').text(payment.stripePaymentIntentId || 'N/A', rightMargin, yPosition, { width: 250 });
        yPosition += 20;

        doc.font('Helvetica-Bold').text('Service:', leftMargin, yPosition);
        doc.font('Helvetica').text(
          payment.serviceRequest?.service?.name || 'Service Request', 
          rightMargin, 
          yPosition,
          { width: 250 }
        );
        yPosition += 20;

        doc.font('Helvetica-Bold').text('Status:', leftMargin, yPosition);
        doc.font('Helvetica').text(payment.status.toUpperCase(), rightMargin, yPosition);
        yPosition += 40;

        // Total section
        doc.rect(leftMargin - 10, yPosition - 10, 500, 60).fill('#ecf0f1');
        doc.fillColor('#000000');
        doc.fontSize(18).font('Helvetica-Bold');
        doc.text('Total Amount Paid:', leftMargin, yPosition + 10);
        doc.text(`€${(payment.amount / 100).toFixed(2)}`, rightMargin + 100, yPosition + 10, { align: 'right' });
        yPosition += 80;

        // Footer
        doc.fontSize(10).font('Helvetica');
        doc.fillColor('#95a5a6');
        doc.text('This is an automatically generated receipt.', leftMargin, yPosition, { align: 'center', width: 500 });
        doc.text(
          `Generated on ${new Date().toLocaleDateString('en-US', { 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
          })}`,
          leftMargin,
          yPosition + 15,
          { align: 'center', width: 500 }
        );

        doc.end();
      } catch (error) {
        reject(error);
      }
    });
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
    return new Promise((resolve, reject) => {
      try {
        const doc = new PDFDocument({ margin: 50 });
        const chunks: Buffer[] = [];

        doc.on('data', (chunk) => chunks.push(chunk));
        doc.on('end', () => resolve(Buffer.concat(chunks)));
        doc.on('error', reject);

        // Header
        doc.fontSize(20).font('Helvetica-Bold').text('PK SERVIZI', 50, 50);
        doc.fontSize(10).font('Helvetica').text('Professional Services', 50, 75);
        doc.fontSize(32).font('Helvetica-Bold').fillColor('#e74c3c').text('INVOICE', 400, 50, { align: 'right' });
        
        // Draw line under header
        doc.moveTo(50, 100).lineTo(550, 100).strokeColor('#2c3e50').lineWidth(3).stroke();
        doc.fillColor('#000000');
        doc.moveDown(3);

        // Invoice details section
        let yPos = 130;
        
        // Invoice to section
        doc.fontSize(10).font('Helvetica-Bold').fillColor('#7f8c8d').text('INVOICE TO:', 50, yPos);
        yPos += 15;
        doc.fontSize(10).font('Helvetica').fillColor('#000000');
        doc.text(payment.user?.fullName || 'Customer', 50, yPos);
        yPos += 15;
        doc.text(payment.user?.email || '', 50, yPos);

        // Invoice details section (right side)
        let rightYPos = 130;
        doc.fontSize(10).font('Helvetica-Bold').fillColor('#7f8c8d').text('INVOICE DETAILS:', 350, rightYPos);
        rightYPos += 15;
        doc.fontSize(10).font('Helvetica-Bold').fillColor('#000000').text('Invoice #:', 350, rightYPos);
        doc.font('Helvetica').text(`INV-${payment.id.substring(0, 8).toUpperCase()}`, 430, rightYPos);
        rightYPos += 15;
        doc.font('Helvetica-Bold').text('Date:', 350, rightYPos);
        doc.font('Helvetica').text(
          new Date(payment.createdAt).toLocaleDateString('en-US', { 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
          }), 
          430, 
          rightYPos
        );
        rightYPos += 15;
        doc.font('Helvetica-Bold').text('Payment ID:', 350, rightYPos);
        doc.font('Helvetica').text(payment.id.substring(0, 20) + '...', 430, rightYPos);

        // Table header
        yPos = 230;
        doc.rect(50, yPos, 500, 25).fillAndStroke('#2c3e50', '#2c3e50');
        doc.fontSize(10).font('Helvetica-Bold').fillColor('#ffffff');
        doc.text('DESCRIPTION', 60, yPos + 8);
        doc.text('QTY', 330, yPos + 8, { width: 50, align: 'center' });
        doc.text('UNIT PRICE', 390, yPos + 8, { width: 70, align: 'right' });
        doc.text('TOTAL', 470, yPos + 8, { width: 70, align: 'right' });

        // Table content
        yPos += 25;
        doc.fillColor('#000000');
        doc.fontSize(11).font('Helvetica-Bold').text(
          payment.serviceRequest?.service?.name || 'Service Request',
          60,
          yPos + 5,
          { width: 250 }
        );
        doc.fontSize(9).font('Helvetica').fillColor('#7f8c8d').text(
          `Service ID: ${payment.serviceRequestId?.substring(0, 20) || 'N/A'}`,
          60,
          yPos + 20,
          { width: 250 }
        );
        doc.fillColor('#000000');
        doc.fontSize(10).font('Helvetica').text('1', 330, yPos + 10, { width: 50, align: 'center' });
        doc.text(`€${(payment.amount / 100).toFixed(2)}`, 390, yPos + 10, { width: 70, align: 'right' });
        doc.font('Helvetica-Bold').text(`€${(payment.amount / 100).toFixed(2)}`, 470, yPos + 10, { width: 70, align: 'right' });
        
        yPos += 45;
        doc.moveTo(50, yPos).lineTo(550, yPos).strokeColor('#dee2e6').lineWidth(1).stroke();

        // Totals section
        yPos += 20;
        doc.fontSize(12).font('Helvetica');
        doc.text('Subtotal:', 350, yPos);
        doc.text(`€${(payment.amount / 100).toFixed(2)}`, 470, yPos, { width: 70, align: 'right' });
        yPos += 20;
        doc.text('Tax (0%):', 350, yPos);
        doc.text('€0.00', 470, yPos, { width: 70, align: 'right' });
        yPos += 30;

        // Grand total
        doc.rect(350, yPos - 10, 200, 40).fill('#ecf0f1');
        doc.fillColor('#000000');
        doc.fontSize(16).font('Helvetica-Bold');
        doc.text('TOTAL PAID:', 360, yPos);
        doc.text(`€${(payment.amount / 100).toFixed(2)}`, 470, yPos, { width: 70, align: 'right' });

        // Footer
        yPos += 60;
        doc.fontSize(10).font('Helvetica').fillColor('#000000');
        doc.text(
          `Payment Method: Credit Card | Transaction ID: ${payment.stripePaymentIntentId || 'N/A'}`,
          50,
          yPos,
          { align: 'center', width: 500 }
        );
        yPos += 15;
        const statusText = `Status: ${payment.status.toUpperCase()}${
          payment.status === 'refunded' ? ' - Amount has been refunded' : ''
        }`;
        doc.text(statusText, 50, yPos, { align: 'center', width: 500 });
        yPos += 30;
        doc.text('Thank you for your business!', 50, yPos, { align: 'center', width: 500 });
        yPos += 15;
        doc.fillColor('#95a5a6');
        doc.text(
          `Generated on ${new Date().toLocaleDateString('en-US', { 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
          })}`,
          50,
          yPos,
          { align: 'center', width: 500 }
        );

        doc.end();
      } catch (error) {
        reject(error);
      }
    });
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
