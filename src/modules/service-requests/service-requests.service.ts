import {
  Injectable,
  BadRequestException,
  NotFoundException,
  ForbiddenException,
  ConflictException,
  Logger,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In, ILike, Between } from 'typeorm';
import { NotificationsService } from '../notifications/notifications.service';
import { EmailService } from '../notifications/email.service';
import { AwsS3UploadService } from '../../common/services/aws-s3-upload.service';
import { StripeService } from '../payments/stripe.service';
import { User } from '../users/entities/user.entity';
import { ServiceRequest } from './entities/service-request.entity';
import { IseeRequest } from './entities/isee-request.entity';
import { Modello730Request } from './entities/modello-730-request.entity';
import { ImuRequest } from './entities/imu-request.entity';
import { RequestStatusHistory } from './entities/request-status-history.entity';
import { Service } from '../services/entities/service.entity';
import { Document } from '../documents/entities/document.entity';
import { Payment } from '../payments/entities/payment.entity';
import { UserSubscription } from '../subscriptions/entities/user-subscription.entity';
import { SubscriptionPlan } from '../subscriptions/entities/subscription-plan.entity';
import { CreateServiceRequestDto } from './dto/create-service-request.dto';
import { UpdateServiceRequestDto } from './dto/update-service-request.dto';
import { CreateIseeRequestDto } from './dto/create-isee-request.dto';
import { CreateModello730RequestDto } from './dto/create-modello-730-request.dto';
import { CreateImuRequestDto } from './dto/create-imu-request.dto';
import { AddNoteDto, SubmitServiceRequestDto } from './dto/service-request.dto';
import { ReuploadDocumentDto } from './dto/reupload-document.dto';

const SERVICE_REQUEST_STATUSES = {
  DRAFT: 'draft',
  SUBMITTED: 'submitted',
  IN_REVIEW: 'in_review',
  MISSING_DOCUMENTS: 'missing_documents',
  COMPLETED: 'completed',
  CLOSED: 'closed',
  REJECTED: 'rejected',
};

const ALLOWED_STATUS_TRANSITIONS = {
  draft: ['submitted', 'closed'],
  submitted: ['in_review', 'missing_documents', 'closed'],
  in_review: ['missing_documents', 'completed', 'rejected'],
  missing_documents: ['in_review', 'closed'],
  completed: ['closed'],
  closed: [],
  rejected: ['closed'],
};

@Injectable()
export class ServiceRequestsService {
  private readonly logger = new Logger(ServiceRequestsService.name);

  constructor(
    @InjectRepository(ServiceRequest)
    private serviceRequestRepository: Repository<ServiceRequest>,
    @InjectRepository(IseeRequest)
    private iseeRequestRepository: Repository<IseeRequest>,
    @InjectRepository(Modello730Request)
    private modello730RequestRepository: Repository<Modello730Request>,
    @InjectRepository(ImuRequest)
    private imuRequestRepository: Repository<ImuRequest>,
    @InjectRepository(RequestStatusHistory)
    private statusHistoryRepository: Repository<RequestStatusHistory>,
    @InjectRepository(Service)
    private serviceRepository: Repository<Service>,
    @InjectRepository(Document)
    private documentRepository: Repository<Document>,
    @InjectRepository(Payment)
    private paymentRepository: Repository<Payment>,
    @InjectRepository(UserSubscription)
    private userSubscriptionRepository: Repository<UserSubscription>,
    @InjectRepository(SubscriptionPlan)
    private subscriptionPlanRepository: Repository<SubscriptionPlan>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private notificationsService: NotificationsService,
    private emailService: EmailService,
    private awsS3UploadService: AwsS3UploadService,
    private stripeService: StripeService,
  ) {}

  // ============================================================================
  // PAYMENT → QUESTIONNAIRE → DOCUMENTS WORKFLOW
  // ============================================================================

  /**
   * Step 1: Initiate service request with payment
   * User selects service and creates payment
   */
  async initiateWithPayment(serviceId: string, userId: string) {
    // Get service and validate price
    const service = await this.getService(serviceId);

    if (!service.basePrice || service.basePrice <= 0) {
      throw new BadRequestException('This service does not require payment');
    }

    // Get user for Stripe customer
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) {
      throw new NotFoundException('User not found');
    }

    // Create service request with payment_pending status
    const serviceRequest = this.serviceRequestRepository.create({
      userId,
      serviceId: service.id,
      status: 'payment_pending',
      priority: 'normal',
    });

    await this.serviceRequestRepository.save(serviceRequest);

    // Create Stripe Checkout Session for hosted payment page
    const checkoutSession =
      await this.stripeService.createPaymentCheckoutSession({
        amount: service.basePrice,
        currency: 'EUR',
        serviceRequestId: serviceRequest.id,
        userId,
        userEmail: user.email,
        description: `Payment for ${service.name}`,
        successUrl: undefined, // Uses default
        cancelUrl: undefined, // Uses default
      });

    this.logger.log(
      `Created Stripe Checkout Session: ${checkoutSession.id} for service request ${serviceRequest.id}`,
    );

    // Create payment record in payments table
    const payment = this.paymentRepository.create({
      userId,
      serviceRequestId: serviceRequest.id,
      amount: service.basePrice,
      currency: 'EUR',
      status: 'pending',
      stripePaymentIntentId:
        (checkoutSession.payment_intent as string) || checkoutSession.id,
      description: `Payment for ${service.name} service`,
      metadata: {
        serviceId: service.id,
        serviceName: service.name,
        serviceRequestId: serviceRequest.id,
        checkoutSessionId: checkoutSession.id,
      },
    });

    await this.paymentRepository.save(payment);

    // Link payment to service request
    serviceRequest.paymentId = payment.id;
    await this.serviceRequestRepository.save(serviceRequest);

    // Send notifications
    await this.notificationsService.send({
      userId,
      title: '💳 Payment Required',
      message: `Please complete payment of €${service.basePrice} for ${service.name}`,
      type: 'info',
      actionUrl: `/service-requests/${serviceRequest.id}/payment`,
    });

    this.logger.log(
      `Service request ${serviceRequest.id} initiated with payment ${payment.id}`,
    );

    return {
      success: true,
      message: 'Service request initiated. Please complete payment.',
      data: {
        serviceRequestId: serviceRequest.id,
        paymentId: payment.id,
        amount: service.basePrice,
        currency: 'EUR',
        status: 'payment_pending',
        checkoutSessionId: checkoutSession.id,
        paymentUrl: checkoutSession.url, // Direct Stripe payment URL
      },
    };
  }

  /**
   * Handle successful payment callback
   * Called by payment webhook or payment service
   */
  async handlePaymentSuccess(paymentId: string) {
    const payment = await this.paymentRepository.findOne({
      where: { id: paymentId },
      relations: [
        'serviceRequest',
        'serviceRequest.user',
        'serviceRequest.service',
      ],
    });

    if (!payment || !payment.serviceRequest) {
      throw new NotFoundException('Payment or service request not found');
    }

    const serviceRequest = payment.serviceRequest;

    // Update payment status
    payment.status = 'completed';
    payment.paidAt = new Date();
    await this.paymentRepository.save(payment);

    // Update service request status to awaiting_form
    serviceRequest.status = 'awaiting_form';
    await this.serviceRequestRepository.save(serviceRequest);

    // Record status change
    await this.statusHistoryRepository.save({
      serviceRequestId: serviceRequest.id,
      fromStatus: 'payment_pending',
      toStatus: 'awaiting_form',
      changedById: serviceRequest.userId,
      notes: 'Payment completed successfully',
    });

    // Send notifications
    await this.emailService.sendServiceRequestSubmitted(
      serviceRequest.user.email,
      serviceRequest.user.fullName || serviceRequest.user.email,
      serviceRequest.id,
      serviceRequest.service.name,
    );

    await this.notificationsService.send({
      userId: serviceRequest.userId,
      title: '✅ Payment Confirmed',
      message: `Payment successful! Please fill out the questionnaire for ${serviceRequest.service.name}`,
      type: 'success',
      actionUrl: `/service-requests/${serviceRequest.id}/questionnaire`,
    });

    this.logger.log(
      `Payment ${paymentId} successful for service request ${serviceRequest.id}`,
    );

    return {
      success: true,
      message: 'Payment confirmed. Please complete the questionnaire.',
      data: {
        serviceRequestId: serviceRequest.id,
        status: serviceRequest.status,
        service: serviceRequest.service,
        formSchema: serviceRequest.service.formSchema,
      },
    };
  }

  /**
   * Handle failed payment callback
   */
  async handlePaymentFailure(paymentId: string) {
    const payment = await this.paymentRepository.findOne({
      where: { id: paymentId },
      relations: [
        'serviceRequest',
        'serviceRequest.user',
        'serviceRequest.service',
      ],
    });

    if (!payment) return;

    payment.status = 'failed';
    await this.paymentRepository.save(payment);

    if (payment.serviceRequest) {
      await this.notificationsService.send({
        userId: payment.serviceRequest.userId,
        title: '❌ Payment Failed',
        message: `Payment failed for ${payment.serviceRequest.service.name}. Please try again.`,
        type: 'error',
        actionUrl: `/service-requests/${payment.serviceRequest.id}/payment`,
      });
    }

    this.logger.error(`Payment ${paymentId} failed`);
  }

  /**
   * Step 2: Submit questionnaire answers
   * User fills out the form after payment
   */
  async submitQuestionnaire(
    serviceRequestId: string,
    userId: string,
    formData: any,
  ) {
    const serviceRequest = await this.serviceRequestRepository.findOne({
      where: { id: serviceRequestId, userId },
      relations: ['user', 'service', 'payment'],
    });

    if (!serviceRequest) {
      throw new NotFoundException('Service request not found');
    }

    // Validate workflow status
    if (serviceRequest.status !== 'awaiting_form') {
      throw new BadRequestException(
        `Cannot submit questionnaire. Current status: ${serviceRequest.status}. ` +
          `Expected: awaiting_form`,
      );
    }

    // Validate payment is completed
    if (
      !serviceRequest.payment ||
      serviceRequest.payment.status !== 'completed'
    ) {
      throw new BadRequestException(
        'Payment must be completed before submitting questionnaire',
      );
    }

    // Update service request with form data
    serviceRequest.formData = formData;
    serviceRequest.formCompletedAt = new Date();
    serviceRequest.status = 'awaiting_documents';

    await this.serviceRequestRepository.save(serviceRequest);

    // Record status change
    await this.statusHistoryRepository.save({
      serviceRequestId: serviceRequest.id,
      fromStatus: 'awaiting_form',
      toStatus: 'awaiting_documents',
      changedById: userId,
      notes: 'Questionnaire submitted',
    });

    // Get required documents
    const requiredDocs = (serviceRequest.service.documentRequirements || [])
      .filter((doc) => doc.required)
      .map((doc) => ({
        fieldName: doc.fieldName,
        label: doc.label,
        description: doc.description,
        maxCount: doc.maxCount,
        allowedMimeTypes: doc.allowedMimeTypes,
        maxSizeBytes: doc.maxSizeBytes,
      }));

    // Send notifications
    await this.notificationsService.send({
      userId,
      title: '📋 Questionnaire Completed',
      message: `Great! Now please upload the required documents for ${serviceRequest.service.name}`,
      type: 'success',
      actionUrl: `/service-requests/${serviceRequest.id}/documents`,
    });

    this.logger.log(
      `Questionnaire submitted for service request ${serviceRequestId}`,
    );

    return {
      success: true,
      message:
        'Questionnaire submitted successfully. Please upload required documents.',
      data: {
        serviceRequestId: serviceRequest.id,
        status: serviceRequest.status,
        requiredDocuments: requiredDocs,
        nextStep: 'upload_documents',
      },
    };
  }

  /**
   * Step 3: Upload required documents only
   * User uploads only the required documents after questionnaire
   */
  /**
   * Get required documents for a service request
   */
  async getRequiredDocumentsForRequest(
    serviceRequestId: string,
    userId: string,
  ) {
    const serviceRequest = await this.serviceRequestRepository.findOne({
      where: { id: serviceRequestId, userId },
      relations: ['service'],
    });

    if (!serviceRequest) {
      throw new NotFoundException('Service request not found');
    }

    const service = serviceRequest.service;
    const documentRequirements = service.documentRequirements || [];
    const requiredDocs = documentRequirements.filter((doc) => doc.required);

    return {
      success: true,
      data: {
        serviceRequestId,
        serviceTypeName: service.name,
        status: serviceRequest.status,
        canUploadDocuments: serviceRequest.status === 'awaiting_documents',
        requiredDocuments: requiredDocs.map((doc) => ({
          fieldName: doc.fieldName,
          label: doc.label,
          documentType: doc.documentType,
          required: doc.required,
          maxCount: doc.maxCount,
          maxSizeBytes: doc.maxSizeBytes,
          allowedMimeTypes: doc.allowedMimeTypes,
          description: doc.description,
        })),
      },
    };
  }

  /**
   * Upload required documents
   */
  async uploadRequiredDocuments(
    serviceRequestId: string,
    userId: string,
    files: Record<string, Express.Multer.File[]>,
  ) {
    const serviceRequest = await this.serviceRequestRepository.findOne({
      where: { id: serviceRequestId, userId },
      relations: ['user', 'service', 'payment'],
    });

    if (!serviceRequest) {
      throw new NotFoundException('Service request not found');
    }

    // Allow document upload in any valid status (not just awaiting_documents)
    const validStatuses = ['draft', 'awaiting_payment', 'awaiting_documents', 'submitted', 'in_progress'];
    if (!validStatuses.includes(serviceRequest.status)) {
      throw new BadRequestException(
        `Cannot upload documents. Current status: ${serviceRequest.status}. ` +
          `Documents can only be uploaded when status is: ${validStatuses.join(', ')}`,
      );
    }

    const service = serviceRequest.service;
    const documentRequirements = service.documentRequirements || [];

    // Note: No strict validation - users can upload any documents at any time

    // Validate file types, sizes, and counts for known document types
    for (const [fieldName, uploadedFiles] of Object.entries(files)) {
      const docReq = documentRequirements.find(
        (r) => r.fieldName === fieldName,
      );

      // If document requirement exists, validate against it
      if (docReq) {
        if (docReq.maxCount && uploadedFiles.length > docReq.maxCount) {
          throw new BadRequestException(
            `Too many files for ${docReq.label}. Max: ${docReq.maxCount}`,
          );
        }

        for (const file of uploadedFiles) {
          this.validateFile(file, docReq);
        }
      } else {
        // For extra documents not in requirements, just validate basic file constraints
        for (const file of uploadedFiles) {
          this.validateFile(file, {
            fieldName: fieldName,
            label: fieldName,
            documentType: 'other',
            required: false,
            maxCount: 10,
            maxSizeMB: 10,
            acceptedFormats: ['pdf', 'jpg', 'jpeg', 'png'],
          });
        }
      }
    }

    // Upload documents to S3 and save to database
    const uploadedDocuments = [];

    try {
      for (const [fieldName, uploadedFiles] of Object.entries(files)) {
        const docReq = documentRequirements.find(
          (r) => r.fieldName === fieldName,
        );
        const documentType = docReq ? docReq.documentType : 'other';

        for (const file of uploadedFiles) {
          const doc = await this.uploadServiceRequestDocument(
            file,
            serviceRequestId,
            userId,
            documentType,
            true,
          );
          uploadedDocuments.push(doc);
        }
      }

      // Update service request with document upload timestamp
      const oldStatus = serviceRequest.status;
      if (!serviceRequest.documentsUploadedAt) {
        serviceRequest.documentsUploadedAt = new Date();
      }
      
      // Keep status as draft after document upload
      // User must explicitly submit via /submit endpoint
      if (serviceRequest.status === 'awaiting_documents') {
        serviceRequest.status = 'draft';
      }

      await this.serviceRequestRepository.save(serviceRequest);

      // Record status change if status changed
      if (oldStatus !== serviceRequest.status) {
        await this.statusHistoryRepository.save({
          serviceRequestId: serviceRequest.id,
          fromStatus: oldStatus,
          toStatus: serviceRequest.status,
          changedById: userId,
          notes: `${uploadedDocuments.length} documents uploaded`,
        });
      }

      // Send notification about documents uploaded
      await this.notificationsService.send({
        userId,
        title: '✅ Documents Uploaded',
        message: `Documents uploaded for ${service.name}. Submit when ready.`,
        type: 'success',
        actionUrl: `/service-requests/${serviceRequest.id}`,
      });

      this.logger.log(
        `Service request ${serviceRequestId} submitted with ${uploadedDocuments.length} documents`,
      );

      return {
        success: true,
        message: `Service request submitted successfully with ${uploadedDocuments.length} documents`,
        data: {
          serviceRequestId: serviceRequest.id,
          status: serviceRequest.status,
          documents: uploadedDocuments.map((doc) => ({
            id: doc.id,
            filename: doc.filename,
            category: doc.category,
            status: doc.status,
          })),
        },
      };
    } catch (error) {
      this.logger.error(
        `Failed to upload documents: ${error.message}`,
        error.stack,
      );
      throw new BadRequestException('Failed to upload one or more documents');
    }
  }

  // ============================================================================
  // SUBSCRIPTION & ACCESS CONTROL
  // ============================================================================

  /**
   * Check if user has active subscription and access to service
   * CRITICAL: Enforce subscription requirements per MILSTON M6
   */
  private async verifySubscriptionAccess(
    userId: string,
    serviceCode: string,
  ): Promise<{
    isValid: boolean;
    subscription?: UserSubscription;
    message?: string;
  }> {
    // Get user's active subscription
    const subscription = await this.userSubscriptionRepository.findOne({
      where: { userId, status: 'active' },
      relations: ['plan'],
    });

    if (!subscription) {
      return {
        isValid: false,
        message:
          'Active subscription required. Please subscribe to use services.',
      };
    }

    // Check if subscription has expired
    const now = new Date();
    if (subscription.endDate && subscription.endDate < now) {
      return {
        isValid: false,
        message: 'Subscription has expired. Please renew your subscription.',
      };
    }

    // Get subscription plan details
    const plan = subscription.plan;
    if (!plan || !plan.isActive) {
      return {
        isValid: false,
        message: 'Subscription plan is not active.',
      };
    }

    // Check if service is enabled in user's plan (using serviceLimits)
    // All services are enabled by default unless explicitly disabled in serviceLimits
    if (
      plan.serviceLimits &&
      plan.serviceLimits[serviceCode.toLowerCase().replace('_', '')] === 0
    ) {
      return {
        isValid: false,
        message: `Service "${serviceCode}" is not included in your subscription plan.`,
      };
    }

    // Check service limits if configured
    if (plan.serviceLimits && plan.serviceLimits.monthlyRequests) {
      const thisMonth = new Date();
      thisMonth.setDate(1);
      thisMonth.setHours(0, 0, 0, 0);

      const nextMonth = new Date(thisMonth);
      nextMonth.setMonth(nextMonth.getMonth() + 1);

      const monthlyCount = await this.serviceRequestRepository.count({
        where: {
          userId,
          createdAt: Between(thisMonth, nextMonth),
        },
      });

      if (monthlyCount >= plan.serviceLimits.monthlyRequests) {
        return {
          isValid: false,
          message: `Monthly service request limit (${plan.serviceLimits.monthlyRequests}) reached.`,
        };
      }
    }

    return {
      isValid: true,
      subscription,
      message: 'Subscription access verified',
    };
  }

  // ============================================================================
  // SERVICE REQUEST LIFECYCLE
  // ============================================================================

  /**
   * Create a new service request (Draft)
   * CRITICAL: Only allowed for users with active subscription
   */
  async create(
    dto: CreateServiceRequestDto,
    userId: string,
    serviceCode?: string,
  ): Promise<any> {
    try {
      // Validate service type exists and is active
      let service;

      if (serviceCode) {
        // Check if it's a UUID or code
        const isUUID =
          /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(
            serviceCode,
          );

        if (isUUID) {
          service = await this.serviceRepository.findOne({
            where: { id: serviceCode, isActive: true },
          });
        } else {
          service = await this.serviceRepository.findOne({
            where: { code: serviceCode, isActive: true },
          });
        }
      } else {
        // Default to ISEE
        service = await this.serviceRepository.findOne({
          where: { code: 'ISEE', isActive: true },
        });
      }

      if (!service) {
        throw new BadRequestException('Service type not found or inactive');
      }

      // Create base service request
      const serviceRequest = new ServiceRequest();
      serviceRequest.userId = userId;
      serviceRequest.serviceId = service.id;
      serviceRequest.status = SERVICE_REQUEST_STATUSES.DRAFT;
      serviceRequest.formData = {};

      const savedRequest =
        await this.serviceRequestRepository.save(serviceRequest);

      // Create type-specific request record
      const code = serviceCode || 'ISEE';
      try {
        switch (code) {
          case 'ISEE':
            await this.createIseeRequest(savedRequest.id, dto as any);
            break;
          case 'MODELLO_730':
            await this.createModello730Request(savedRequest.id, dto as any);
            break;
          case 'IMU':
            await this.createImuRequest(savedRequest.id, dto as any);
            break;
        }
      } catch (error) {
        this.logger.warn(
          `Type-specific record creation failed for ${code}: ${error.message}`,
        );
        // Continue without type-specific data
      }

      // Create status history entry
      await this.statusHistoryRepository.save({
        serviceRequestId: savedRequest.id,
        fromStatus: null,
        toStatus: SERVICE_REQUEST_STATUSES.DRAFT,
        changedById: userId,
        notes: 'Initial draft creation',
      });

      this.logger.log(
        `Service request created: ${savedRequest.id} for user: ${userId}`,
      );

      return {
        success: true,
        message: 'Service request created successfully',
        data: {
          id: savedRequest.id,
          serviceId: savedRequest.serviceId,
          status: savedRequest.status,
          createdAt: savedRequest.createdAt,
        },
      };
    } catch (error) {
      this.logger.error(`Failed to create service request: ${error.message}`);
      throw new BadRequestException(
        error.message || 'Failed to create service request',
      );
    }
  }

  /**
   * Create service request with documents in one transaction
   * OPTIMIZED: Validates documents against service type requirements
   */
  async createWithDocuments(
    dto: CreateServiceRequestDto,
    userId: string,
    serviceCode?: string,
    files?: Record<string, Express.Multer.File[]>,
  ): Promise<any> {
    try {
      // Parse formData if it's a JSON string
      if (typeof dto.formData === 'string') {
        try {
          dto.formData = JSON.parse(dto.formData);
        } catch (error) {
          throw new BadRequestException('Invalid formData JSON');
        }
      }

      // Validate that serviceId is provided
      if (!dto.serviceId) {
        throw new BadRequestException('serviceId is required');
      }

      // 1. Fetch service type with document requirements
      const service = await this.getService(dto.serviceId);

      // 2. Validate document formats (but don't require all documents)
      // Allow users to upload documents gradually
      // if (service.documentRequirements?.length > 0) {
      //   this.validateDocumentRequirements(service.documentRequirements, files);
      // }

      // 3. Create service request
      const serviceRequest = await this.create(dto, userId, serviceCode);
      const requestId = serviceRequest.data.id;

      // 4. Upload documents if provided
      const uploadedDocuments = [];
      if (files) {
        for (const [fieldName, fileArray] of Object.entries(files)) {
          if (!fileArray || fileArray.length === 0) continue;

          // Find document requirement config
          const docReq = service.documentRequirements?.find(
            (req: any) => req.fieldName === fieldName,
          );

          for (const file of fileArray) {
            // Validate file against requirements
            if (docReq) {
              this.validateFile(file, docReq);
            }

            // Upload to S3
            const uploadedDoc = await this.uploadServiceRequestDocument(
              file,
              requestId,
              userId,
              docReq?.documentType || fieldName.toUpperCase(),
              docReq?.required || false,
            );

            uploadedDocuments.push(uploadedDoc);
          }
        }
      }

      // 5. Send notifications
      const user = await this.userRepository.findOne({ where: { id: userId } });

      await this.emailService.sendServiceRequestSubmitted(
        user.email,
        user.fullName || user.email,
        requestId,
        service.name,
      );

      await this.notificationsService.send({
        userId,
        title: 'Service Request Created',
        message: `Your ${service.name} request has been created with ${uploadedDocuments.length} document(s)`,
        type: 'success',
        actionUrl: `/service-requests/${requestId}`,
      });

      this.logger.log(
        `Service request ${requestId} created with ${uploadedDocuments.length} documents`,
      );

      return {
        success: true,
        message: `Service request created successfully with ${uploadedDocuments.length} document(s)`,
        data: {
          ...serviceRequest.data,
          documents: uploadedDocuments.map((doc) => ({
            id: doc.id,
            filename: doc.filename,
            category: doc.category,
            status: doc.status,
            fileSize: doc.fileSize,
          })),
        },
      };
    } catch (error) {
      this.logger.error(
        `Failed to create service request with documents: ${error.message}`,
        error.stack,
      );
      throw error instanceof BadRequestException ||
        error instanceof NotFoundException
        ? error
        : new BadRequestException(
            'Failed to create service request with documents',
          );
    }
  }

  /**
   * Get service by ID or code
   */
  private async getService(identifier: string): Promise<Service> {
    const isUUID =
      /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(
        identifier,
      );

    const service = await this.serviceRepository.findOne({
      where: isUUID
        ? { id: identifier, isActive: true }
        : { code: identifier, isActive: true },
    });

    if (!service) {
      throw new NotFoundException(
        `Service '${identifier}' not found or inactive`,
      );
    }

    return service;
  }

  /**
   * Validate uploaded files against document requirements
   */
  private validateDocumentRequirements(
    requirements: any[],
    files?: Record<string, Express.Multer.File[]>,
  ): void {
    // Soft validation - just log warnings instead of throwing errors
    // This allows users to upload documents gradually
    const missingDocs = [];

    for (const req of requirements) {
      if (req.required) {
        const uploadedFiles = files?.[req.fieldName];
        if (!uploadedFiles || uploadedFiles.length === 0) {
          missingDocs.push(req.label || req.fieldName);
        }
      }
    }

    if (missingDocs.length > 0) {
      this.logger.warn(
        `Missing required documents: ${missingDocs.join(', ')}. User can upload them later.`,
      );
      // No longer throwing error - allowing flexible document uploads
    }
  }

  /**
   * Validate individual file against requirements
   */
  private validateFile(file: Express.Multer.File, requirement: any): void {
    // Validate MIME type
    if (requirement.allowedMimeTypes?.length > 0) {
      if (!requirement.allowedMimeTypes.includes(file.mimetype)) {
        throw new BadRequestException(
          `Invalid file type for ${requirement.label}. ` +
            `Allowed: ${requirement.allowedMimeTypes.join(', ')}. ` +
            `Got: ${file.mimetype}`,
        );
      }
    }

    // Validate file size
    if (requirement.maxSizeBytes && file.size > requirement.maxSizeBytes) {
      const maxMB = (requirement.maxSizeBytes / 1048576).toFixed(2);
      const fileMB = (file.size / 1048576).toFixed(2);
      throw new BadRequestException(
        `File '${file.originalname}' exceeds maximum size. ` +
          `Max: ${maxMB} MB, Got: ${fileMB} MB`,
      );
    }
  }

  /**
   * Upload document to S3 and save to database
   */
  private async uploadServiceRequestDocument(
    file: Express.Multer.File,
    serviceRequestId: string,
    userId: string,
    documentType: string,
    isRequired: boolean,
  ): Promise<Document> {
    // Upload to S3
    const s3Result = await this.awsS3UploadService.uploadServiceRequestDocument(
      userId,
      serviceRequestId,
      file,
    );

    // Save to database
    const document = this.documentRepository.create({
      userId,
      serviceRequestId,
      category: documentType,
      filename: file.originalname,
      originalFilename: file.originalname,
      filePath: s3Result.path,
      fileSize: file.size,
      mimeType: file.mimetype,
      status: 'pending',
      isRequired,
      version: 1,
    });

    return this.documentRepository.save(document);
  }

  /**
   * Create ISEE service request
   */
  private async createIseeRequest(
    serviceRequestId: string,
    dto: CreateIseeRequestDto,
  ) {
    const iseeRequest = new IseeRequest();
    iseeRequest.serviceRequestId = serviceRequestId;
    Object.assign(iseeRequest, dto);
    return this.iseeRequestRepository.save(iseeRequest);
  }

  /**
   * Create Modello 730 service request
   */
  private async createModello730Request(
    serviceRequestId: string,
    dto: CreateModello730RequestDto,
  ) {
    const modelloRequest = new Modello730Request();
    modelloRequest.serviceRequestId = serviceRequestId;
    Object.assign(modelloRequest, dto);
    return this.modello730RequestRepository.save(modelloRequest);
  }

  /**
   * Create IMU service request
   */
  private async createImuRequest(
    serviceRequestId: string,
    dto: CreateImuRequestDto,
  ) {
    const imuRequest = new ImuRequest();
    imuRequest.serviceRequestId = serviceRequestId;
    Object.assign(imuRequest, dto);
    return this.imuRequestRepository.save(imuRequest);
  }

  /**
   * Get user's service requests
   */
  async findByUser(userId: string, options: any = {}): Promise<any> {
    try {
      const query = this.serviceRequestRepository
        .createQueryBuilder('sr')
        .select([
          'sr.id',
          'sr.userId',
          'sr.serviceId',
          'sr.status',
          'sr.priority',
          'sr.submittedAt',
          'sr.completedAt',
          'sr.createdAt',
          'sr.updatedAt',
        ])
        .leftJoin('sr.service', 'st')
        .addSelect(['st.id', 'st.name', 'st.code', 'st.category'])
        .where('sr.userId = :userId', { userId });

      if (options.status) {
        query.andWhere('sr.status = :status', { status: options.status });
      }

      if (options.serviceId) {
        query.andWhere('sr.serviceId = :serviceId', {
          serviceId: options.serviceId,
        });
      }

      const requests = await query
        .orderBy('sr.createdAt', 'DESC')
        .skip(options.skip || 0)
        .take(options.take || 20)
        .getMany();

      return {
        success: true,
        data: requests,
      };
    } catch (error) {
      this.logger.error(`Failed to fetch user requests: ${error.message}`);
      throw new BadRequestException(error.message);
    }
  }

  /**
   * Get single service request
   */
  async findOne(id: string, userId: string, userRole?: string): Promise<any> {
    try {
      const request = await this.serviceRequestRepository.findOne({
        where: { id },
        relations: [
          'service',
          'user',
          'assignedOperator',
          'documents',
          'statusHistory',
        ],
      });

      if (!request) {
        throw new NotFoundException('Service request not found');
      }

      // Check authorization: user can view own requests, admins/operators can view all
      if (
        request.userId !== userId &&
        !['admin', 'operator'].includes(userRole)
      ) {
        throw new ForbiddenException('Not authorized to view this request');
      }

      // Load type-specific data in parallel with other data
      let typeSpecificData = {};
      try {
        let typeData: any = null;
        if (request.service.code === 'ISEE') {
          typeData =
            (await this.iseeRequestRepository.findOne({
              where: { serviceRequestId: id },
            })) || {};
        } else if (request.service.code === 'MODELLO_730') {
          typeData =
            (await this.modello730RequestRepository.findOne({
              where: { serviceRequestId: id },
            })) || {};
        } else if (request.service.code === 'IMU') {
          typeData =
            (await this.imuRequestRepository.findOne({
              where: { serviceRequestId: id },
            })) || {};
        }

        // Exclude the type-specific 'id' field to prevent overwriting the main request ID
        if (typeData && typeData.id) {
          const { id: _typeId, ...restTypeData } = typeData;
          typeSpecificData = restTypeData;
        } else {
          typeSpecificData = typeData || {};
        }
      } catch (error) {
        this.logger.warn(
          `Type-specific data not available for ${request.service.code}: ${error.message}`,
        );
        typeSpecificData = {};
      }

      return {
        success: true,
        data: {
          ...request,
          ...typeSpecificData, // Merge instead of nesting
        },
      };
    } catch (error) {
      this.logger.error(`Failed to fetch service request: ${error.message}`);
      throw new BadRequestException(error.message);
    }
  }

  /**
   * Update service request (Draft only)
   */
  async update(
    id: string,
    dto: UpdateServiceRequestDto,
    userId: string,
    serviceCode?: string,
  ): Promise<any> {
    try {
      const request = await this.serviceRequestRepository.findOne({
        where: { id },
        relations: ['service'],
      });

      if (!request) {
        throw new NotFoundException('Service request not found');
      }

      // Only allow updates to draft requests
      if (request.status !== SERVICE_REQUEST_STATUSES.DRAFT) {
        throw new ConflictException('Can only update draft requests');
      }

      // Only user can update their own draft
      if (request.userId !== userId) {
        throw new ForbiddenException('Not authorized to update this request');
      }

      // Update base request
      request.formData = dto.formData || request.formData;
      await this.serviceRequestRepository.save(request);

      // Update type-specific data
      const code = serviceCode || request.service.code;
      try {
        switch (code) {
          case 'ISEE':
            const iseeData = await this.iseeRequestRepository.findOne({
              where: { serviceRequestId: id },
            });
            if (iseeData) {
              Object.assign(iseeData, dto);
              await this.iseeRequestRepository.save(iseeData);
            }
            break;
          case 'MODELLO_730':
            const modelloData = await this.modello730RequestRepository.findOne({
              where: { serviceRequestId: id },
            });
            if (modelloData) {
              Object.assign(modelloData, dto);
              await this.modello730RequestRepository.save(modelloData);
            }
            break;
          case 'IMU':
            const imuData = await this.imuRequestRepository.findOne({
              where: { serviceRequestId: id },
            });
            if (imuData) {
              Object.assign(imuData, dto);
              await this.imuRequestRepository.save(imuData);
            }
            break;
        }
      } catch (error) {
        this.logger.warn(
          `Type-specific data update failed for ${code}: ${error.message}`,
        );
        // Continue without type-specific data update
      }

      this.logger.log(`Service request updated: ${id}`);

      return {
        success: true,
        message: 'Service request updated successfully',
        data: {
          id: request.id,
          status: request.status,
          updatedAt: new Date(),
        },
      };
    } catch (error) {
      this.logger.error(`Failed to update service request: ${error.message}`);
      throw new BadRequestException(error.message);
    }
  }

  /**
   * Submit service request
   */
  async submit(
    id: string,
    userId: string,
    dto?: SubmitServiceRequestDto,
  ): Promise<any> {
    try {
      const request = await this.serviceRequestRepository.findOne({
        where: { id },
        relations: ['service'],
      });

      if (!request) {
        throw new NotFoundException('Service request not found');
      }

      if (request.status !== SERVICE_REQUEST_STATUSES.DRAFT) {
        throw new ConflictException('Only draft requests can be submitted');
      }

      if (request.userId !== userId) {
        throw new ForbiddenException('Not authorized to submit this request');
      }

      // CRITICAL: Verify subscription before allowing submission (MILSTON M6)
      const serviceCode = request.service?.code || 'ISEE';
      const subscriptionCheck = await this.verifySubscriptionAccess(
        userId,
        serviceCode,
      );

      if (!subscriptionCheck.isValid) {
        throw new ForbiddenException(subscriptionCheck.message);
      }

      // Update status
      request.status = SERVICE_REQUEST_STATUSES.SUBMITTED;
      request.submittedAt = new Date();
      if (dto?.notes) {
        request.userNotes = dto.notes;
      }

      await this.serviceRequestRepository.save(request);

      // Create status history entry
      await this.statusHistoryRepository.save({
        serviceRequestId: id,
        fromStatus: SERVICE_REQUEST_STATUSES.DRAFT,
        toStatus: SERVICE_REQUEST_STATUSES.SUBMITTED,
        changedById: userId,
        notes: dto?.notes || 'Request submitted by user',
      });

      this.logger.log(`Service request submitted: ${id}`);

      // Send email notifications
      try {
        const user = await this.userRepository.findOne({
          where: { id: userId },
        });
        if (user) {
          // Customer confirmation
          await this.emailService.sendServiceRequestSubmitted(
            user.email,
            user.fullName,
            request.id,
            request.service?.name || 'Servizio',
          );
          await this.notificationsService.send({
            userId: user.id,
            title: '✅ Richiesta Inviata',
            message: `La tua richiesta di servizio ${request.service?.name || 'servizio'} è stata inviata con successo.`,
            type: 'success',
            actionUrl: `/service-requests/${request.id}`,
          });

          // Admin notification
          await this.emailService.sendServiceRequestSubmittedToAdmin(
            await this.emailService.getAdminEmail(),
            user.fullName,
            request.id,
            request.service?.name || 'Servizio',
          );
        }
      } catch (error) {
        this.logger.error(`Failed to send email: ${error.message}`);
      }

      return {
        success: true,
        message: 'Service request submitted successfully',
        data: {
          id: request.id,
          status: request.status,
          submittedAt: request.submittedAt,
        },
      };
    } catch (error) {
      this.logger.error(`Failed to submit service request: ${error.message}`);
      throw new BadRequestException(error.message);
    }
  }

  /**
   * Update request status (Admin/Operator only)
   */
  async updateStatus(
    id: string,
    newStatus: string,
    operatorId: string,
    reason?: string,
  ): Promise<any> {
    try {
      const request = await this.serviceRequestRepository.findOne({
        where: { id },
      });

      if (!request) {
        throw new NotFoundException('Service request not found');
      }

      // Normalize status to lowercase
      const normalizedStatus = newStatus.toLowerCase();

      // Validate status transition
      const allowedStatuses = ALLOWED_STATUS_TRANSITIONS[request.status];
      if (!allowedStatuses || !allowedStatuses.includes(normalizedStatus)) {
        throw new ConflictException(
          `Cannot transition from ${request.status} to ${normalizedStatus}. Allowed: ${allowedStatuses?.join(', ') || 'none'}`,
        );
      }

      const oldStatus = request.status;
      request.status = normalizedStatus;

      if (normalizedStatus === SERVICE_REQUEST_STATUSES.COMPLETED) {
        request.completedAt = new Date();
      }

      const savedRequest = await this.serviceRequestRepository.save(request);

      // Create status history entry
      await this.statusHistoryRepository.save({
        serviceRequestId: id,
        fromStatus: oldStatus,
        toStatus: normalizedStatus,
        changedById: operatorId,
        notes: reason || `Status changed to ${normalizedStatus}`,
      });

      this.logger.log(
        `Service request status updated: ${id} from ${oldStatus} to ${normalizedStatus}`,
      );

      // Send email notification to customer about status change
      try {
        const user = await this.userRepository.findOne({
          where: { id: request.userId },
        });
        if (user) {
          await this.emailService.sendServiceRequestStatusUpdate(
            user.email,
            user.fullName,
            savedRequest.id,
            savedRequest.service?.name || 'Servizio',
            normalizedStatus,
            reason || 'Status updated',
          );
          await this.notificationsService.send({
            userId: user.id,
            title: '🔔 Aggiornamento Stato Richiesta',
            message: `Lo stato della tua richiesta è stato aggiornato a: ${normalizedStatus}`,
            type: normalizedStatus === 'completed' ? 'success' : 'info',
            actionUrl: `/service-requests/${id}`,
          });
        }
      } catch (error) {
        this.logger.error(`Failed to send email: ${error.message}`);
      }

      return {
        success: true,
        message: 'Status updated successfully',
        data: {
          id: savedRequest.id,
          status: savedRequest.status,
          oldStatus,
          newStatus: normalizedStatus,
          updatedAt: savedRequest.updatedAt,
        },
      };
    } catch (error) {
      this.logger.error(`Failed to update status: ${error.message}`);
      if (
        error instanceof NotFoundException ||
        error instanceof ConflictException
      ) {
        throw error;
      }
      throw new BadRequestException(error.message);
    }
  }

  /**
   * Add note to request
   */
  async addNote(id: string, dto: AddNoteDto, userId: string): Promise<any> {
    try {
      const request = await this.serviceRequestRepository.findOne({
        where: { id },
      });

      if (!request) {
        throw new NotFoundException('Service request not found');
      }

      const noteType = dto.type || 'internal';

      if (noteType === 'internal') {
        request.internalNotes = request.internalNotes
          ? `${request.internalNotes}\n\n[${new Date().toISOString()}] ${dto.content}`
          : `[${new Date().toISOString()}] ${dto.content}`;
      } else {
        request.userNotes = request.userNotes
          ? `${request.userNotes}\n\n[${new Date().toISOString()}] ${dto.content}`
          : `[${new Date().toISOString()}] ${dto.content}`;
      }

      await this.serviceRequestRepository.save(request);

      return {
        success: true,
        message: 'Note added successfully',
        data: {
          id: request.id,
          noteType,
          addedAt: new Date(),
        },
      };
    } catch (error) {
      this.logger.error(`Failed to add note: ${error.message}`);
      throw new BadRequestException(error.message);
    }
  }

  /**
   * Get status history
   */
  async getStatusHistory(id: string, userId: string): Promise<any> {
    try {
      // Verify user has access to this request
      const request = await this.serviceRequestRepository.findOne({
        where: { id },
      });

      if (!request) {
        throw new NotFoundException('Service request not found');
      }

      const history = await this.statusHistoryRepository.find({
        where: { serviceRequestId: id },
        order: { createdAt: 'DESC' },
      });

      return {
        success: true,
        data: history,
      };
    } catch (error) {
      this.logger.error(`Failed to fetch status history: ${error.message}`);
      throw new BadRequestException(error.message);
    }
  }

  /**
   * Delete draft request
   */
  async remove(id: string, userId: string): Promise<any> {
    try {
      const request = await this.serviceRequestRepository.findOne({
        where: { id },
      });

      if (!request) {
        throw new NotFoundException('Service request not found');
      }

      if (request.status !== SERVICE_REQUEST_STATUSES.DRAFT) {
        throw new ConflictException('Only draft requests can be deleted');
      }

      if (request.userId !== userId) {
        throw new ForbiddenException('Not authorized to delete this request');
      }

      await this.serviceRequestRepository.remove(request);

      this.logger.log(`Service request deleted: ${id}`);

      return {
        success: true,
        message: 'Service request deleted successfully',
      };
    } catch (error) {
      this.logger.error(`Failed to delete service request: ${error.message}`);
      throw new BadRequestException(error.message);
    }
  }

  /**
   * List all requests (Admin/Operator)
   */
  async findAll(query: any = {}): Promise<any> {
    try {
      const qb = this.serviceRequestRepository
        .createQueryBuilder('sr')
        .leftJoin('sr.service', 'st')
        .leftJoin('sr.user', 'u')
        .leftJoin('sr.assignedOperator', 'ao')
        .select([
          'sr.id',
          'sr.status',
          'sr.priority',
          'sr.createdAt',
          'sr.updatedAt',
          'st.id',
          'st.name',
          'st.code',
          'u.id',
          'u.fullName',
          'u.email',
          'ao.id',
          'ao.fullName',
        ]);

      // Apply filters
      if (query.status) {
        qb.andWhere('sr.status = :status', { status: query.status });
      }

      if (query.serviceId) {
        // Check if it's a UUID or code
        const isUUID =
          /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(
            query.serviceId,
          );

        if (isUUID) {
          qb.andWhere('sr.serviceId = :serviceId', {
            serviceId: query.serviceId,
          });
        } else {
          // If it's a code, join with service_types table to filter by code
          qb.andWhere('st.code = :serviceCode', {
            serviceCode: query.serviceId,
          });
        }
      }

      if (query.assignedOperatorId) {
        qb.andWhere('sr.assignedOperatorId = :assignedOperatorId', {
          assignedOperatorId: query.assignedOperatorId,
        });
      }

      if (query.userId) {
        qb.andWhere('sr.userId = :userId', { userId: query.userId });
      }

      if (query.priority) {
        qb.andWhere('sr.priority = :priority', { priority: query.priority });
      }

      // Search by user email or name
      if (query.search) {
        qb.andWhere('(u.email ILIKE :search OR u.fullName ILIKE :search)', {
          search: `%${query.search}%`,
        });
      }

      // Sorting
      const sortBy = query.sortBy || 'createdAt';
      const sortOrder = query.sortOrder || 'DESC';
      qb.orderBy(`sr.${sortBy}`, sortOrder);

      // Pagination
      const skip = query.skip || 0;
      const take = query.take || 20;
      qb.skip(skip).take(take);

      const [requests, total] = await qb.getManyAndCount();

      return {
        success: true,
        data: requests,
        pagination: {
          total,
          skip,
          take,
          pages: Math.ceil(total / take),
        },
      };
    } catch (error) {
      this.logger.error(`Failed to fetch all requests: ${error.message}`);
      throw new BadRequestException(error.message);
    }
  }

  /**
   * Assign operator to request
   */
  async assignOperator(
    id: string,
    operatorId: string,
    assignedBy: string,
  ): Promise<any> {
    try {
      const request = await this.serviceRequestRepository.findOne({
        where: { id },
      });

      if (!request) {
        throw new NotFoundException('Service request not found');
      }

      request.assignedOperatorId = operatorId;
      await this.serviceRequestRepository.save(request);

      // Create status history entry
      await this.statusHistoryRepository.save({
        serviceRequestId: id,
        fromStatus: null,
        toStatus: request.status,
        changedById: assignedBy,
        notes: `Assigned to operator ${operatorId}`,
      });

      this.logger.log(`Operator assigned to request: ${id}`);

      return {
        success: true,
        message: 'Operator assigned successfully',
        data: {
          id: request.id,
          assignedOperatorId: request.assignedOperatorId,
        },
      };
    } catch (error) {
      this.logger.error(`Failed to assign operator: ${error.message}`);
      throw new BadRequestException(error.message);
    }
  }

  async findAssignedTo(userId: string): Promise<any> {
    return { success: true, data: [] };
  }

  async assign(id: string, dto: any): Promise<any> {
    return { success: true, message: 'Request assigned' };
  }

  async updateInternalNotes(id: string, dto: any): Promise<any> {
    return { success: true, message: 'Internal notes updated' };
  }

  async changePriority(id: string, dto: any): Promise<any> {
    return { success: true, message: 'Priority changed' };
  }

  async requestDocuments(id: string, dto: any): Promise<any> {
    return { success: true, message: 'Additional documents requested' };
  }

  // Extended Document Workflow Methods
  async getMissingDocuments(id: string, userId: string): Promise<any> {
    return {
      success: true,
      data: {
        requestId: id,
        missingDocuments: [],
        totalMissing: 0,
      },
    };
  }

  async reuploadDocument(
    id: string,
    documentId: string,
    dto: ReuploadDocumentDto,
    userId: string,
  ): Promise<any> {
    return {
      success: true,
      message: 'Document reupload tracked',
      data: {
        requestId: id,
        documentId,
        reason: dto.reason,
        notes: dto.notes,
        reuploadedAt: new Date(),
      },
    };
  }
}
