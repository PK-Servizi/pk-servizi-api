import {
  BadRequestException,
  Injectable,
  NotFoundException,
  Logger,
  ConflictException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Payment } from './entities/payment.entity';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { StripeService } from './stripe.service';
import { NotificationsService } from '../notifications/notifications.service';
import { User } from '../users/entities/user.entity';
import * as PDFDocument from 'pdfkit';

/**
 * PaymentsService
 * Handles payment management, Stripe integration, and payment processing
 * Extends BaseService for CRUD operations
 */
@Injectable()
export class PaymentsService {
  private readonly logger = new Logger(PaymentsService.name);

  constructor(
    @InjectRepository(Payment)
    protected readonly paymentRepository: Repository<Payment>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly stripeService: StripeService,
    private readonly notificationsService: NotificationsService,
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
  async processRefund(
    paymentId: string,
    userId: string,
    reason: string,
    partialAmount?: number,
  ): Promise<any> {
    // Check if user is admin
    const requestingUser = await this.userRepository.findOne({
      where: { id: userId },
      relations: ['role'],
    });

    if (!requestingUser) {
      throw new NotFoundException('User not found');
    }

    const isAdmin = requestingUser.role?.name === 'admin';

    // Find payment - admins can refund any payment, customers only their own
    const whereCondition = isAdmin
      ? { id: paymentId }
      : { id: paymentId, userId };
    const payment = await this.paymentRepository.findOne({
      where: whereCondition,
      relations: ['user', 'serviceRequest', 'serviceRequest.service'],
    });

    if (!payment) {
      throw new NotFoundException('Payment not found');
    }

    // Validate payment status
    if (payment.status !== 'completed') {
      throw new BadRequestException(
        `Can only refund completed payments. Current status: ${payment.status}`,
      );
    }

    // Validate refund amount
    const refundAmount = partialAmount || payment.amount;
    if (refundAmount > payment.amount) {
      throw new BadRequestException(
        'Refund amount cannot exceed payment amount',
      );
    }

    // Process refund with Stripe
    try {
      if (!payment.stripePaymentIntentId) {
        throw new BadRequestException(
          'No Stripe payment intent found for this payment',
        );
      }

      this.logger.log(
        `Processing refund for payment ${paymentId}, stripePaymentIntentId: ${payment.stripePaymentIntentId}`,
      );

      // Get the actual payment intent ID (in case we stored a checkout session ID)
      let paymentIntentId = payment.stripePaymentIntentId;

      // Check if this is a checkout session ID instead of payment intent
      if (paymentIntentId.startsWith('cs_')) {
        this.logger.log(
          `Detected checkout session ID, retrieving payment intent...`,
        );
        const checkoutSession =
          await this.stripeService.getCheckoutSession(paymentIntentId);
        if (checkoutSession && checkoutSession.payment_intent) {
          paymentIntentId = checkoutSession.payment_intent as string;
          // Update the stored payment intent ID
          payment.stripePaymentIntentId = paymentIntentId;
          await this.paymentRepository.save(payment);
          this.logger.log(`Updated payment intent ID to: ${paymentIntentId}`);
        } else {
          throw new BadRequestException(
            'Payment intent not found in checkout session. Payment may not have been completed.',
          );
        }
      }

      // Process Stripe refund
      let stripeRefund;
      try {
        stripeRefund = await this.stripeService.createRefund(
          paymentIntentId,
          partialAmount ? Math.round(partialAmount * 100) : undefined, // Convert to cents
        );
      } catch (stripeError) {
        this.logger.error(
          `Stripe refund failed for payment intent ${paymentIntentId}: ${stripeError.message}`,
          stripeError.stack,
        );
        
        // Provide clearer error messages based on Stripe error
        if (stripeError.message?.includes('has already been refunded')) {
          throw new BadRequestException(
            'This payment has already been refunded.',
          );
        } else if (stripeError.message?.includes('not found')) {
          throw new BadRequestException(
            'Payment not found in Stripe. It may have been cancelled or expired.',
          );
        } else if (stripeError.message?.includes('charge') || stripeError.message?.includes('captured')) {
          throw new BadRequestException(
            'Payment cannot be refunded because it was not successfully captured in Stripe. This can happen if the customer abandoned the checkout or the payment failed. Please check the payment status in your Stripe dashboard.',
          );
        } else {
          throw new BadRequestException(
            `Failed to process refund with Stripe: ${stripeError.message}`,
          );
        }
      }

      // Update payment status
      payment.status = 'refunded';
      if (payment.metadata) {
        payment.metadata.refundReason = reason;
        payment.metadata.refundedAt = new Date().toISOString();
        payment.metadata.refundedBy = isAdmin ? 'admin' : 'customer';
        payment.metadata.stripeRefundId = stripeRefund.id;
        if (partialAmount) {
          payment.metadata.refundAmount = partialAmount;
        }
      }
      await this.paymentRepository.save(payment);

      // Notify customer (the actual owner of the payment)
      await this.notificationsService.send({
        userId: payment.userId,
        title: '💰 Refund Processed',
        message: `Your refund of €${refundAmount.toFixed(2)} has been processed successfully.`,
        type: 'success',
        actionUrl: `/payments/${payment.id}`,
      });

      // Notify admins if refund was requested by customer
      if (!isAdmin) {
        const adminUsers = await this.userRepository.find({
          where: { role: { name: 'admin' } as any },
        });
        for (const admin of adminUsers) {
          await this.notificationsService.send({
            userId: admin.id,
            title: '💰 Refund Processed',
            message: `Refund of €${refundAmount.toFixed(2)} processed for ${payment.user?.email || 'customer'}${payment.serviceRequest?.service?.name ? ` - ${payment.serviceRequest.service.name}` : ''}`,
            type: 'info',
            actionUrl: `/admin/payments/${payment.id}`,
          });
        }
      }

      this.logger.log(
        `Refund processed successfully for payment ${paymentId}. Amount: €${refundAmount}. Processed by: ${isAdmin ? 'Admin' : 'Customer'}`,
      );

      return {
        success: true,
        message: 'Refund processed successfully',
        data: {
          paymentId: payment.id,
          refundAmount,
          stripeRefundId: stripeRefund.id,
          reason,
          processedAt: new Date(),
          processedBy: isAdmin ? 'admin' : 'customer',
        },
      };
    } catch (error) {
      this.logger.error(
        `Failed to process refund for payment ${paymentId}: ${error.message}`,
        error.stack,
      );
      // Re-throw the error if it's already a BadRequestException with a specific message
      if (
        error instanceof BadRequestException ||
        error instanceof NotFoundException ||
        error instanceof ConflictException
      ) {
        throw error;
      }
      // Otherwise throw a generic error
      throw new BadRequestException(
        `Failed to process refund: ${error.message || 'Unknown error'}`,
      );
    }
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
        doc
          .fontSize(24)
          .font('Helvetica-Bold')
          .text('PAYMENT RECEIPT', { align: 'center' });
        doc
          .fontSize(12)
          .font('Helvetica')
          .text('PK Servizi API', { align: 'center' });
        doc.moveDown(2);

        // Receipt details
        const leftMargin = 50;
        const rightMargin = 300;
        let yPosition = doc.y;

        doc.fontSize(10).font('Helvetica-Bold');
        doc.text('Receipt ID:', leftMargin, yPosition);
        doc
          .font('Helvetica')
          .text(payment.id, rightMargin, yPosition, { width: 250 });
        yPosition += 20;

        doc.font('Helvetica-Bold').text('Payment Date:', leftMargin, yPosition);
        doc.font('Helvetica').text(
          new Date(payment.createdAt).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
          }),
          rightMargin,
          yPosition,
        );
        yPosition += 20;

        doc
          .font('Helvetica-Bold')
          .text('Payment Method:', leftMargin, yPosition);
        doc.font('Helvetica').text('Credit Card', rightMargin, yPosition);
        yPosition += 20;

        doc
          .font('Helvetica-Bold')
          .text('Transaction ID:', leftMargin, yPosition);
        doc
          .font('Helvetica')
          .text(
            payment.stripePaymentIntentId || 'N/A',
            rightMargin,
            yPosition,
            { width: 250 },
          );
        yPosition += 20;

        doc.font('Helvetica-Bold').text('Service:', leftMargin, yPosition);
        doc
          .font('Helvetica')
          .text(
            payment.serviceRequest?.service?.name || 'Service Request',
            rightMargin,
            yPosition,
            { width: 250 },
          );
        yPosition += 20;

        doc.font('Helvetica-Bold').text('Status:', leftMargin, yPosition);
        doc
          .font('Helvetica')
          .text(payment.status.toUpperCase(), rightMargin, yPosition);
        yPosition += 40;

        // Total section
        doc.rect(leftMargin - 10, yPosition - 10, 500, 60).fill('#ecf0f1');
        doc.fillColor('#000000');
        doc.fontSize(18).font('Helvetica-Bold');
        doc.text('Total Amount Paid:', leftMargin, yPosition + 10);
        doc.text(
          `€${(payment.amount / 100).toFixed(2)}`,
          rightMargin + 100,
          yPosition + 10,
          { align: 'right' },
        );
        yPosition += 80;

        // Footer
        doc.fontSize(10).font('Helvetica');
        doc.fillColor('#95a5a6');
        doc.text(
          'This is an automatically generated receipt.',
          leftMargin,
          yPosition,
          { align: 'center', width: 500 },
        );
        doc.text(
          `Generated on ${new Date().toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
          })}`,
          leftMargin,
          yPosition + 15,
          { align: 'center', width: 500 },
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
        doc
          .fontSize(10)
          .font('Helvetica')
          .text('Professional Services', 50, 75);
        doc
          .fontSize(32)
          .font('Helvetica-Bold')
          .fillColor('#e74c3c')
          .text('INVOICE', 400, 50, { align: 'right' });

        // Draw line under header
        doc
          .moveTo(50, 100)
          .lineTo(550, 100)
          .strokeColor('#2c3e50')
          .lineWidth(3)
          .stroke();
        doc.fillColor('#000000');
        doc.moveDown(3);

        // Invoice details section
        let yPos = 130;

        // Invoice to section
        doc
          .fontSize(10)
          .font('Helvetica-Bold')
          .fillColor('#7f8c8d')
          .text('INVOICE TO:', 50, yPos);
        yPos += 15;
        doc.fontSize(10).font('Helvetica').fillColor('#000000');
        doc.text(payment.user?.fullName || 'Customer', 50, yPos);
        yPos += 15;
        doc.text(payment.user?.email || '', 50, yPos);

        // Invoice details section (right side)
        let rightYPos = 130;
        doc
          .fontSize(10)
          .font('Helvetica-Bold')
          .fillColor('#7f8c8d')
          .text('INVOICE DETAILS:', 350, rightYPos);
        rightYPos += 15;
        doc
          .fontSize(10)
          .font('Helvetica-Bold')
          .fillColor('#000000')
          .text('Invoice #:', 350, rightYPos);
        doc
          .font('Helvetica')
          .text(
            `INV-${payment.id.substring(0, 8).toUpperCase()}`,
            430,
            rightYPos,
          );
        rightYPos += 15;
        doc.font('Helvetica-Bold').text('Date:', 350, rightYPos);
        doc.font('Helvetica').text(
          new Date(payment.createdAt).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
          }),
          430,
          rightYPos,
        );
        rightYPos += 15;
        doc.font('Helvetica-Bold').text('Payment ID:', 350, rightYPos);
        doc
          .font('Helvetica')
          .text(payment.id.substring(0, 20) + '...', 430, rightYPos);

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
        doc
          .fontSize(11)
          .font('Helvetica-Bold')
          .text(
            payment.serviceRequest?.service?.name || 'Service Request',
            60,
            yPos + 5,
            { width: 250 },
          );
        doc
          .fontSize(9)
          .font('Helvetica')
          .fillColor('#7f8c8d')
          .text(
            `Service ID: ${payment.serviceRequestId?.substring(0, 20) || 'N/A'}`,
            60,
            yPos + 20,
            { width: 250 },
          );
        doc.fillColor('#000000');
        doc
          .fontSize(10)
          .font('Helvetica')
          .text('1', 330, yPos + 10, { width: 50, align: 'center' });
        doc.text(`€${(payment.amount / 100).toFixed(2)}`, 390, yPos + 10, {
          width: 70,
          align: 'right',
        });
        doc
          .font('Helvetica-Bold')
          .text(`€${(payment.amount / 100).toFixed(2)}`, 470, yPos + 10, {
            width: 70,
            align: 'right',
          });

        yPos += 45;
        doc
          .moveTo(50, yPos)
          .lineTo(550, yPos)
          .strokeColor('#dee2e6')
          .lineWidth(1)
          .stroke();

        // Totals section
        yPos += 20;
        doc.fontSize(12).font('Helvetica');
        doc.text('Subtotal:', 350, yPos);
        doc.text(`€${(payment.amount / 100).toFixed(2)}`, 470, yPos, {
          width: 70,
          align: 'right',
        });
        yPos += 20;
        doc.text('Tax (0%):', 350, yPos);
        doc.text('€0.00', 470, yPos, { width: 70, align: 'right' });
        yPos += 30;

        // Grand total
        doc.rect(350, yPos - 10, 200, 40).fill('#ecf0f1');
        doc.fillColor('#000000');
        doc.fontSize(16).font('Helvetica-Bold');
        doc.text('TOTAL PAID:', 360, yPos);
        doc.text(`€${(payment.amount / 100).toFixed(2)}`, 470, yPos, {
          width: 70,
          align: 'right',
        });

        // Footer
        yPos += 60;
        doc.fontSize(10).font('Helvetica').fillColor('#000000');
        doc.text(
          `Payment Method: Credit Card | Transaction ID: ${payment.stripePaymentIntentId || 'N/A'}`,
          50,
          yPos,
          { align: 'center', width: 500 },
        );
        yPos += 15;
        const statusText = `Status: ${payment.status.toUpperCase()}${
          payment.status === 'refunded' ? ' - Amount has been refunded' : ''
        }`;
        doc.text(statusText, 50, yPos, { align: 'center', width: 500 });
        yPos += 30;
        doc.text('Thank you for your business!', 50, yPos, {
          align: 'center',
          width: 500,
        });
        yPos += 15;
        doc.fillColor('#95a5a6');
        doc.text(
          `Generated on ${new Date().toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
          })}`,
          50,
          yPos,
          { align: 'center', width: 500 },
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
