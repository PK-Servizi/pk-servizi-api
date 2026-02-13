import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Patch,
  Param,
  Body,
  UseGuards,
  Query,
  UseInterceptors,
  UploadedFiles,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiBearerAuth,
  ApiQuery,
  ApiBody,
  ApiConsumes,
} from '@nestjs/swagger';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { ServiceRequestsService } from './service-requests.service';
import { CreateServiceRequestDto } from './dto/create-service-request.dto';
import { UpdateServiceRequestDto } from './dto/update-service-request.dto';
import { UpdateStatusDto } from './dto/update-status.dto';
import { AssignOperatorDto } from './dto/assign-operator.dto';
import { UpdatePriorityDto } from './dto/update-priority.dto';
import { ReuploadDocumentDto } from './dto/reupload-document.dto';
import { AddNoteDto, SubmitServiceRequestDto } from './dto/service-request.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { PermissionsGuard } from '../../common/guards/permissions.guard';
import { Permissions } from '../../common/decorators/permissions.decorator';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { UserRequest } from '../../common/interfaces/user-request.interface';
import { ServiceRequestFilters } from '../../common/interfaces/query-filters.interface';
import { AuditLog } from '../../common/decorators/audit-log.decorator';
import { AuditLogInterceptor } from '../../common/interceptors/audit-log.interceptor';

/**
 * Service Requests Controller - M3 Implementation
 * Handles creation and management of service requests for ISEE, 730/PF, and IMU
 */
@ApiTags('Service Requests - M3')
@Controller('service-requests')
@UseGuards(JwtAuthGuard)
@UseInterceptors(AuditLogInterceptor)
export class ServiceRequestsController {
  constructor(
    private readonly serviceRequestsService: ServiceRequestsService,
  ) {}

  // ========== CUSTOMER ROUTES ==========

  /**
   * List user's own service requests
   */
  @Get('my')
  @UseGuards(PermissionsGuard)
  @Permissions('service-requests:read')
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: '[Customer] Get my service requests' })
  @ApiQuery({
    name: 'status',
    required: false,
    description: 'Filter by status',
  })
  @ApiQuery({
    name: 'serviceId',
    required: false,
    description: 'Filter by service type',
  })
  findMy(
    @CurrentUser() user: UserRequest,
    @Query('status') status?: string,
    @Query('serviceId') serviceId?: string,
  ) {
    return this.serviceRequestsService.findByUser(user.id, {
      status,
      serviceId,
    });
  }

  // ========== PAYMENT → QUESTIONNAIRE → DOCUMENTS WORKFLOW ==========

  /**
   * Step 1: Initiate service request
   * - If service price > 0: Creates payment workflow (payment_pending status) → User completes payment → Step 2
   * - If service price = 0: Skips payment entirely, goes directly to questionnaire (awaiting_form status) → Step 2
   *
   * FREE SERVICES (price = 0): Only 2 steps total
   *   1. Initiate (this endpoint) → awaiting_form status
   *   2. Submit questionnaire → awaiting_documents status
   *   3. Upload documents → submitted status
   *
   * PAID SERVICES (price > 0): 3 steps total
   *   1. Initiate (this endpoint) → payment_pending status → Complete payment → awaiting_form status
   *   2. Submit questionnaire → awaiting_documents status
   *   3. Upload documents → submitted status
   */
  @Post('initiate')
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @Permissions('service-requests:create')
  @ApiBearerAuth('JWT-auth')
  @AuditLog({
    action: 'SERVICE_REQUEST_INITIATED',
    resourceType: 'service_request',
  })
  @ApiOperation({
    summary:
      '[Customer] Step 1: Initiate service request - Payment for paid services (price > 0) OR direct to questionnaire for free services (price = 0)',
    description:
      'FREE SERVICES (price=0): Skip payment, go directly to Step 2 (questionnaire). PAID SERVICES (price>0): Create payment, complete payment, then proceed to Step 2 (questionnaire).',
  })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        serviceId: {
          type: 'string',
          description: 'Service type ID (UUID) or code',
          example: 'ISEE_ORD_2026',
        },
      },
      required: ['serviceId'],
    },
  })
  initiateWithPayment(
    @Body('serviceId') serviceId: string,
    @CurrentUser() user: UserRequest,
  ) {
    return this.serviceRequestsService.initiateWithPayment(serviceId, user.id);
  }

  /**
   * Step 2: Submit questionnaire
   * - For PAID services: Submit after payment is completed
   * - For FREE services: Submit immediately after Step 1 (no payment required)
   *
   * This is Step 2 for both free and paid services
   */
  @Patch(':id/questionnaire')
  @UseGuards(PermissionsGuard)
  @Permissions('service-requests:update')
  @ApiBearerAuth('JWT-auth')
  @AuditLog({
    action: 'QUESTIONNAIRE_SUBMITTED',
    resourceType: 'service_request',
  })
  @ApiOperation({
    summary:
      '[Customer] Step 2: Submit questionnaire (for both free and paid services)',
    description:
      'FREE SERVICES: Submit immediately after initiation. PAID SERVICES: Submit after payment completed. Status: awaiting_form → awaiting_documents',
  })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        formData: {
          type: 'object',
          description: 'Questionnaire answers as JSON object',
          example: {
            familyMembers: 4,
            hasDisabledMembers: true,
            income: 25000,
          },
        },
      },
      required: ['formData'],
    },
  })
  submitQuestionnaire(
    @Param('id') id: string,
    @Body('formData') formData: any,
    @CurrentUser() user: UserRequest,
  ) {
    return this.serviceRequestsService.submitQuestionnaire(
      id,
      user.id,
      formData,
    );
  }

  /**
   * Step 3: Upload required documents
   * Automatically validates which documents are required based on service type
   * This is Step 3 for both free and paid services
   */
  @Post(':id/documents')
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @Permissions('service-requests:update')
  @ApiBearerAuth('JWT-auth')
  @AuditLog({ action: 'DOCUMENTS_UPLOADED', resourceType: 'service_request' })
  @UseInterceptors(
    FileFieldsInterceptor([
      { name: 'identityDocument', maxCount: 1 },
      { name: 'fiscalCode', maxCount: 1 },
      { name: 'incomeCertificate', maxCount: 1 },
      { name: 'bankStatement', maxCount: 1 },
      { name: 'propertyDocument', maxCount: 1 },
      { name: 'visuraCatastale', maxCount: 1 },
      { name: 'cuCertificate', maxCount: 1 },
      { name: 'propertyDeed', maxCount: 1 },
      { name: 'medicalReceipts', maxCount: 5 },
      { name: 'expenseReceipts', maxCount: 5 },
      { name: 'incomeDocuments', maxCount: 5 },
      { name: 'familyDocuments', maxCount: 5 },
      { name: 'otherDocument', maxCount: 10 },
    ]),
  )
  @ApiConsumes('multipart/form-data')
  @ApiOperation({
    summary: '[Customer] Step 3: Upload required documents',
    description:
      'Upload documents after completing questionnaire. System automatically validates which documents are required for the service type. Status flow: awaiting_documents → submitted',
  })
  @ApiBody({
    description:
      'Upload required documents. Only upload the documents needed for your specific service type.',
    schema: {
      type: 'object',
      properties: {
        identityDocument: {
          type: 'string',
          format: 'binary',
          description: 'Identity Document',
        },
        fiscalCode: {
          type: 'string',
          format: 'binary',
          description: 'Fiscal Code',
        },
        incomeCertificate: {
          type: 'string',
          format: 'binary',
          description: 'Income Certificate',
        },
        bankStatement: {
          type: 'string',
          format: 'binary',
          description: 'Bank Statement',
        },
        propertyDocument: {
          type: 'string',
          format: 'binary',
          description: 'Property Document',
        },
        visuraCatastale: {
          type: 'string',
          format: 'binary',
          description: 'Visura Catastale',
        },
        cuCertificate: {
          type: 'string',
          format: 'binary',
          description: 'CU Certificate',
        },
        propertyDeed: {
          type: 'string',
          format: 'binary',
          description: 'Property Deed',
        },
        medicalReceipts: {
          type: 'array',
          items: {
            type: 'string',
            format: 'binary',
          },
          description: 'Medical Receipts (up to 5 files)',
        },
        expenseReceipts: {
          type: 'array',
          items: {
            type: 'string',
            format: 'binary',
          },
          description: 'Expense Receipts (up to 5 files)',
        },
        incomeDocuments: {
          type: 'array',
          items: {
            type: 'string',
            format: 'binary',
          },
          description: 'Income Documents (up to 5 files)',
        },
        familyDocuments: {
          type: 'array',
          items: {
            type: 'string',
            format: 'binary',
          },
          description: 'Family Documents (up to 5 files)',
        },
        otherDocument: {
          type: 'array',
          items: {
            type: 'string',
            format: 'binary',
          },
          description: 'Other Documents (up to 10 files)',
        },
      },
    },
  })
  uploadRequiredDocuments(
    @Param('id') id: string,
    @CurrentUser() user: UserRequest,
    @UploadedFiles()
    files?: {
      identityDocument?: Express.Multer.File[];
      fiscalCode?: Express.Multer.File[];
      incomeCertificate?: Express.Multer.File[];
      bankStatement?: Express.Multer.File[];
      propertyDocument?: Express.Multer.File[];
      visuraCatastale?: Express.Multer.File[];
      cuCertificate?: Express.Multer.File[];
      propertyDeed?: Express.Multer.File[];
      medicalReceipts?: Express.Multer.File[];
      expenseReceipts?: Express.Multer.File[];
      incomeDocuments?: Express.Multer.File[];
      familyDocuments?: Express.Multer.File[];
      otherDocument?: Express.Multer.File[];
    },
  ) {
    return this.serviceRequestsService.uploadRequiredDocuments(
      id,
      user.id,
      files || {},
    );
  }

  // ========== LEGACY ENDPOINT (For backward compatibility) ==========

  /**
   * Create new service request (Draft)
   * Supports ISEE, MODELLO_730, and IMU service types
   * Accepts multipart/form-data for documents upload
   */
  @Post()
  @UseGuards(PermissionsGuard)
  @Permissions('service-requests:create')
  @ApiBearerAuth('JWT-auth')
  @AuditLog({
    action: 'SERVICE_REQUEST_CREATED',
    resourceType: 'service_request',
  })
  @UseInterceptors(
    FileFieldsInterceptor([
      { name: 'identityDocument', maxCount: 1 },
      { name: 'fiscalCode', maxCount: 1 },
      { name: 'incomeDocuments', maxCount: 5 },
      { name: 'propertyDocuments', maxCount: 3 },
      { name: 'disabilityCertificates', maxCount: 2 },
      { name: 'familyDocuments', maxCount: 5 },
      { name: 'otherDocuments', maxCount: 10 },
    ]),
  )
  @ApiConsumes('multipart/form-data')
  @ApiOperation({
    summary: '[Customer] Create new service request with documents',
  })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        serviceId: {
          type: 'string',
          description:
            'Service type ID (UUID) or service type code (ISEE, MODELLO_730, IMU)',
          example: 'dae8b64-57f7-4562-b3fc-2c96f368afa8',
        },
        formData: {
          type: 'string',
          description: 'JSON string of form data',
          example: '{\"familyMembers\":4,\"hasDisabledMembers\":true}',
        },
        userNotes: { type: 'string', description: 'User notes' },
        status: {
          type: 'string',
          enum: ['draft', 'submitted'],
          description: 'Initial status (default: draft)',
        },
        identityDocument: {
          type: 'string',
          format: 'binary',
          description: 'Identity card or passport',
        },
        fiscalCode: {
          type: 'string',
          format: 'binary',
          description: 'Codice Fiscale document',
        },
        incomeDocuments: {
          type: 'array',
          items: { type: 'string', format: 'binary' },
          description: 'CU, 730, income statements (max 5)',
        },
        propertyDocuments: {
          type: 'array',
          items: { type: 'string', format: 'binary' },
          description: 'Property deeds, IMU receipts (max 3)',
        },
        disabilityCertificates: {
          type: 'array',
          items: { type: 'string', format: 'binary' },
          description: 'Disability certificates (max 2)',
        },
        familyDocuments: {
          type: 'array',
          items: { type: 'string', format: 'binary' },
          description: 'Family certificates, marriage, etc (max 5)',
        },
        otherDocuments: {
          type: 'array',
          items: { type: 'string', format: 'binary' },
          description: 'Additional documents (max 10)',
        },
      },
      required: ['serviceId'],
    },
  })
  create(
    @Body() dto: CreateServiceRequestDto,
    @CurrentUser() user: UserRequest,
    @UploadedFiles()
    files?: {
      identityDocument?: Express.Multer.File[];
      fiscalCode?: Express.Multer.File[];
      incomeDocuments?: Express.Multer.File[];
      propertyDocuments?: Express.Multer.File[];
      disabilityCertificates?: Express.Multer.File[];
      familyDocuments?: Express.Multer.File[];
      otherDocuments?: Express.Multer.File[];
    },
  ) {
    return this.serviceRequestsService.createWithDocuments(
      dto,
      user.id,
      undefined,
      files,
    );
  }

  /**
   * Submit service request for processing
   * Transitions from DRAFT → SUBMITTED
   */
  @Post(':id/submit')
  @UseGuards(PermissionsGuard)
  @Permissions('service-requests:submit')
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: '[Customer] Submit request for processing' })
  @ApiBody({ type: SubmitServiceRequestDto })
  @AuditLog({
    action: 'SERVICE_REQUEST_SUBMITTED',
    resourceType: 'service_request',
  })
  submit(
    @Param('id') id: string,
    @Body() dto: SubmitServiceRequestDto,
    @CurrentUser() user: UserRequest,
  ) {
    return this.serviceRequestsService.submit(id, user.id, dto);
  }

  /**
   * Get status history for a request
   */
  @Get(':id/status-history')
  @UseGuards(PermissionsGuard)
  @Permissions('service-requests:read')
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: '[Customer] Get status history' })
  getStatusHistory(@Param('id') id: string, @CurrentUser() user: UserRequest) {
    return this.serviceRequestsService.getStatusHistory(id, user.id);
  }

  /**
   * Add note to request
   * Can be internal (admin/operator) or user-visible
   */
  @Post(':id/notes')
  @UseGuards(PermissionsGuard)
  @Permissions('service_requests:write_own')
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: '[Customer] Add note to request' })
  @ApiBody({ type: AddNoteDto })
  addNote(
    @Param('id') id: string,
    @Body() dto: AddNoteDto,
    @CurrentUser() user: UserRequest,
  ) {
    return this.serviceRequestsService.addNote(id, dto, user.id);
  }

  /**
   * Request refund (before submission)
   * Customer can appeal for refund at any time before submission
   */
  @Post(':id/refund')
  @UseGuards(PermissionsGuard)
  @Permissions('service-requests:update')
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({
    summary: '[Customer] Request refund and cancel service request',
    description:
      'Request refund for paid service before submission. Refund will be processed immediately.',
  })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        reason: {
          type: 'string',
          description: 'Reason for refund request',
          example: 'Changed my mind / Service no longer needed',
        },
      },
      required: ['reason'],
    },
  })
  @AuditLog({ action: 'REFUND_REQUESTED', resourceType: 'service_request' })
  requestRefund(
    @Param('id') id: string,
    @Body('reason') reason: string,
    @CurrentUser() user: UserRequest,
  ) {
    return this.serviceRequestsService.requestRefund(id, user.id, reason);
  }

  /**
   * Get service request details
   */
  @Get(':id')
  @UseGuards(PermissionsGuard)
  @Permissions('service-requests:read')
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: '[Customer] Get service request details' })
  findOne(@Param('id') id: string, @CurrentUser() user: UserRequest) {
    return this.serviceRequestsService.findOne(id, user.id, user.role);
  }

  /**
   * Update service request (before submission)
   */
  @Patch(':id')
  @UseGuards(PermissionsGuard)
  @Permissions('service-requests:update')
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: '[Customer] Update request (before submission)' })
  @ApiQuery({ name: 'serviceType', required: false })
  @ApiBody({ type: UpdateServiceRequestDto })
  @AuditLog({
    action: 'SERVICE_REQUEST_UPDATED',
    resourceType: 'service_request',
    captureOldValues: true,
  })
  update(
    @Param('id') id: string,
    @Body() dto: UpdateServiceRequestDto,
    @CurrentUser() user: UserRequest,
    @Query('serviceType') serviceType?: string,
  ) {
    return this.serviceRequestsService.update(id, dto, user.id, serviceType);
  }

  /**
   * Delete service request (before submission)
   */
  @Delete(':id')
  @UseGuards(PermissionsGuard)
  @Permissions('service-requests:update')
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: '[Customer] Delete request (before submission)' })
  @AuditLog({
    action: 'SERVICE_REQUEST_DELETED',
    resourceType: 'service_request',
  })
  remove(@Param('id') id: string, @CurrentUser() user: UserRequest) {
    return this.serviceRequestsService.remove(id, user.id);
  }

  // ========== ADMIN/OPERATOR ROUTES ==========

  /**
   * List all service requests with filtering
   * Requires admin or operator role
   */
  @Get()
  @UseGuards(PermissionsGuard)
  @Permissions('service_requests:read')
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: '[Admin] List all service requests' })
  @ApiQuery({ name: 'status', required: false })
  @ApiQuery({
    name: 'serviceType',
    required: false,
    description: 'Filter by service type ID or code',
  })
  @ApiQuery({ name: 'userId', required: false })
  @ApiQuery({ name: 'assignedOperatorId', required: false })
  @ApiQuery({ name: 'priority', required: false })
  @ApiQuery({
    name: 'search',
    required: false,
    description: 'Search by user email/name',
  })
  @ApiQuery({ name: 'skip', required: false, type: Number })
  @ApiQuery({ name: 'take', required: false, type: Number })
  @ApiQuery({ name: 'sortBy', required: false })
  @ApiQuery({ name: 'sortOrder', required: false, enum: ['ASC', 'DESC'] })
  findAll(@Query() query: ServiceRequestFilters) {
    // Map serviceType to serviceId for backward compatibility
    if ((query as any).serviceType) {
      query.serviceId = (query as any).serviceType;
    }
    return this.serviceRequestsService.findAll(query);
  }

  /**
   * Update request status
   * Enforces proper state transitions
   */
  @Patch(':id/status')
  @UseGuards(PermissionsGuard)
  @Permissions('service_requests:write')
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: '[Admin] Update request status' })
  @ApiBody({ type: UpdateStatusDto })
  @AuditLog({
    action: 'SERVICE_REQUEST_STATUS_UPDATED',
    resourceType: 'service_request',
    captureOldValues: true,
  })
  updateStatus(
    @Param('id') id: string,
    @Body() dto: UpdateStatusDto,
    @CurrentUser() user: UserRequest,
  ) {
    return this.serviceRequestsService.updateStatus(
      id,
      dto.status,
      user.id,
      dto.reason,
    );
  }

  /**
   * Assign request to operator
   */
  @Post(':id/assign')
  @UseGuards(PermissionsGuard)
  @Permissions('service_requests:assign')
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: '[Admin] Assign to operator' })
  @ApiBody({ type: AssignOperatorDto })
  @AuditLog({
    action: 'SERVICE_REQUEST_ASSIGNED',
    resourceType: 'service_request',
  })
  assign(
    @Param('id') id: string,
    @Body() dto: AssignOperatorDto,
    @CurrentUser() user: UserRequest,
  ) {
    return this.serviceRequestsService.assignOperator(
      id,
      dto.operatorId,
      user.id,
    );
  }

  /**
   * Add internal note (admin/operator only)
   */
  @Post(':id/internal-notes')
  @UseGuards(PermissionsGuard)
  @Permissions('service_requests:write')
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: '[Admin] Add internal note' })
  @ApiBody({ type: AddNoteDto })
  addInternalNote(
    @Param('id') id: string,
    @Body() dto: AddNoteDto,
    @CurrentUser() user: UserRequest,
  ) {
    return this.serviceRequestsService.addNote(
      id,
      { ...dto, type: 'internal' },
      user.id,
    );
  }

  /**
   * Change request priority
   */
  @Patch(':id/priority')
  @UseGuards(PermissionsGuard)
  @Permissions('service_requests:write')
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: '[Admin] Change request priority' })
  @ApiBody({ type: UpdatePriorityDto })
  changePriority(@Param('id') id: string, @Body() dto: UpdatePriorityDto) {
    // Implement priority update
    return { success: true, message: 'Priority updated' };
  }

  /**
   * Request additional documents from user
   */
  @Post(':id/request-documents')
  @UseGuards(PermissionsGuard)
  @Permissions('service_requests:write')
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: '[Admin] Request additional documents' })
  @ApiBody({ type: ReuploadDocumentDto })
  requestDocuments(
    @Param('id') id: string,
    @Body() dto: ReuploadDocumentDto,
    @CurrentUser() user: UserRequest,
  ) {
    // Implement document request
    return { success: true, message: 'Document request sent' };
  }
}
