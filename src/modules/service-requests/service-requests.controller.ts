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
import { ServiceTypesService } from './service-types.service';
import { CreateServiceRequestDto } from './dto/create-service-request.dto';
import { UpdateServiceRequestDto } from './dto/update-service-request.dto';
import { CreateServiceTypeDto } from './dto/create-service-type.dto';
import { UpdateServiceTypeDto } from './dto/update-service-type.dto';
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

/**
 * Service Types Controller
 * Manages available service types (ISEE, Modello 730, IMU)
 */
@ApiTags('Service Types')
@Controller('service-types')
export class ServiceTypesController {
  constructor(private readonly serviceTypesService: ServiceTypesService) {}

  // Public Routes
  @Get()
  @ApiOperation({ summary: '[Public] List active service types' })
  findActive() {
    return this.serviceTypesService.findActive();
  }

  @Get(':id')
  @ApiOperation({ summary: '[Public] Get service type details' })
  findOne(@Param('id') id: string) {
    return this.serviceTypesService.findOne(id);
  }

  @Get(':id/schema')
  @ApiOperation({ summary: '[Public] Get form schema for service type' })
  getSchema(@Param('id') id: string) {
    return this.serviceTypesService.getSchema(id);
  }

  @Get(':id/required-documents')
  @ApiOperation({ summary: '[Public] Get required document list' })
  getRequiredDocuments(@Param('id') id: string) {
    return this.serviceTypesService.getRequiredDocuments(id);
  }

  // Admin Routes
  @Post()
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @Permissions('service-types:create')
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: '[Admin] Create new service type' })
  @ApiBody({ type: CreateServiceTypeDto })
  create(@Body() dto: CreateServiceTypeDto) {
    return this.serviceTypesService.create(dto);
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @Permissions('service-types:update')
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: '[Admin] Update service type' })
  @ApiBody({ type: UpdateServiceTypeDto })
  update(@Param('id') id: string, @Body() dto: UpdateServiceTypeDto) {
    return this.serviceTypesService.update(id, dto);
  }

  @Put(':id/schema')
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @Permissions('service-types:update')
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: '[Admin] Update form schema' })
  @ApiBody({
    schema: { type: 'object', example: { type: 'object', properties: {} } },
  })
  updateSchema(
    @Param('id') id: string,
    @Body() schema: Record<string, unknown>,
  ) {
    return this.serviceTypesService.updateSchema(id, schema);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @Permissions('service-types:delete')
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: '[Admin] Delete service type' })
  remove(@Param('id') id: string) {
    return this.serviceTypesService.remove(id);
  }

  @Patch(':id/activate')
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @Permissions('service-types:update')
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: '[Admin] Activate/deactivate service type' })
  activate(@Param('id') id: string) {
    return this.serviceTypesService.activate(id);
  }
}

/**
 * Service Requests Controller - M3 Implementation
 * Handles creation and management of service requests for ISEE, 730/PF, and IMU
 */
@ApiTags('Service Requests - M3')
@Controller('service-requests')
@UseGuards(JwtAuthGuard)
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
    name: 'serviceTypeId',
    required: false,
    description: 'Filter by service type',
  })
  findMy(
    @CurrentUser() user: UserRequest,
    @Query('status') status?: string,
    @Query('serviceTypeId') serviceTypeId?: string,
  ) {
    return this.serviceRequestsService.findByUser(user.id, {
      status,
      serviceTypeId,
    });
  }

  // ========== PAYMENT → QUESTIONNAIRE → DOCUMENTS WORKFLOW ==========

  /**
   * Step 1: Initiate service request with payment
   * Creates service request and payment record
   */
  @Post('initiate')
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @Permissions('service-requests:create')
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ 
    summary: '[Customer] Step 1: Initiate service request with payment',
    description: 'User selects service type and creates payment. Status: payment_pending'
  })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        serviceTypeId: { 
          type: 'string',
          description: 'Service type ID (UUID) or code',
          example: 'ISEE'
        }
      },
      required: ['serviceTypeId']
    }
  })
  initiateWithPayment(
    @Body('serviceTypeId') serviceTypeId: string,
    @CurrentUser() user: UserRequest,
  ) {
    return this.serviceRequestsService.initiateWithPayment(serviceTypeId, user.id);
  }

  /**
   * Step 2: Submit questionnaire after payment
   * Submits form answers after successful payment
   */
  @Patch(':id/questionnaire')
  @UseGuards(PermissionsGuard)
  @Permissions('service-requests:update')
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ 
    summary: '[Customer] Step 2: Submit questionnaire',
    description: 'Submit form answers after payment is completed. Status: awaiting_form → awaiting_documents'
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
            income: 25000
          }
        }
      },
      required: ['formData']
    }
  })
  submitQuestionnaire(
    @Param('id') id: string,
    @Body('formData') formData: any,
    @CurrentUser() user: UserRequest,
  ) {
    return this.serviceRequestsService.submitQuestionnaire(id, user.id, formData);
  }

  /**
   * Get required documents for this service request
   * Returns only the documents needed for this specific service type
   */
  @Get(':id/required-documents')
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @Permissions('service-requests:read')
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ 
    summary: '[Customer] Get required documents for service request',
    description: 'Returns the list of required document fields for this service request based on its service type'
  })
  getRequiredDocuments(
    @Param('id') id: string,
    @CurrentUser() user: UserRequest,
  ) {
    return this.serviceRequestsService.getRequiredDocumentsForRequest(id, user.id);
  }

  /**
   * Step 3: Upload required documents only
   * Uploads ONLY required documents after questionnaire completion
   */
  @Post(':id/documents')
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @Permissions('service-requests:update')
  @ApiBearerAuth('JWT-auth')
  @UseInterceptors(
    FileFieldsInterceptor([
      { name: 'identityDocument', maxCount: 1 },
      { name: 'fiscalCode', maxCount: 1 },
      { name: 'incomeDocuments', maxCount: 5 },
      { name: 'propertyDocuments', maxCount: 3 },
      { name: 'disabilityCertificates', maxCount: 2 },
      { name: 'familyDocuments', maxCount: 5 },
      { name: 'otherDocuments', maxCount: 10 },
    ])
  )
  @ApiConsumes('multipart/form-data')
  @ApiOperation({ 
    summary: '[Customer] Step 3: Upload required documents',
    description: `
      ⚠️ IMPORTANT: Document fields are DYNAMIC based on service type!
      
      Steps:
      1. First call: GET /service-requests/{id}/required-documents
      2. That response tells you which fields to upload
      3. Only upload those specific fields (e.g., for ISEE: identityDocument, fiscalCode, incomeDocuments, familyDocuments)
      4. Different services require different fields!
      
      Status flow: awaiting_documents → submitted
    `
  })
  @ApiBody({
    description: `
      ⚠️ DYNAMIC FIELDS: The required fields vary by service type.
      
      Call GET /service-requests/{id}/required-documents first to see which fields you need!
      
      Possible field names (depends on service):
      - identityDocument (binary file)
      - fiscalCode (binary file)  
      - incomeDocuments (array of binary files)
      - familyDocuments (array of binary files)
      - propertyDocuments (array of binary files)
      - disabilityCertificates (array of binary files)
      - otherDocuments (array of binary files)
      
      Only upload the fields returned by the required-documents endpoint!
    `,
    schema: {
      type: 'object',
      description: 'Upload only the required fields for your specific service type',
      example: {
        identityDocument: '(binary file)',
        fiscalCode: '(binary file)',
        incomeDocuments: ['(binary file)'],
        familyDocuments: ['(binary file)']
      }
    }
  })
  uploadRequiredDocuments(
    @Param('id') id: string,
    @CurrentUser() user: UserRequest,
    @UploadedFiles() files?: {
      identityDocument?: Express.Multer.File[];
      fiscalCode?: Express.Multer.File[];
      incomeDocuments?: Express.Multer.File[];
      propertyDocuments?: Express.Multer.File[];
      disabilityCertificates?: Express.Multer.File[];
      familyDocuments?: Express.Multer.File[];
      otherDocuments?: Express.Multer.File[];
    },
  ) {
    return this.serviceRequestsService.uploadRequiredDocuments(id, user.id, files || {});
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
  @UseInterceptors(
    FileFieldsInterceptor([
      { name: 'identityDocument', maxCount: 1 },
      { name: 'fiscalCode', maxCount: 1 },
      { name: 'incomeDocuments', maxCount: 5 },
      { name: 'propertyDocuments', maxCount: 3 },
      { name: 'disabilityCertificates', maxCount: 2 },
      { name: 'familyDocuments', maxCount: 5 },
      { name: 'otherDocuments', maxCount: 10 },
    ])
  )
  @ApiConsumes('multipart/form-data')
  @ApiOperation({ summary: '[Customer] Create new service request with documents' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        serviceTypeId: { 
          type: 'string',
          description: 'Service type ID (UUID) or service type code (ISEE, MODELLO_730, IMU)',
          example: 'dae8b64-57f7-4562-b3fc-2c96f368afa8'
        },
        formData: { 
          type: 'string',
          description: 'JSON string of form data',
          example: '{\"familyMembers\":4,\"hasDisabledMembers\":true}'
        },
        userNotes: { type: 'string', description: 'User notes' },
        status: { 
          type: 'string', 
          enum: ['draft', 'submitted'],
          description: 'Initial status (default: draft)' 
        },
        identityDocument: { 
          type: 'string', 
          format: 'binary',
          description: 'Identity card or passport' 
        },
        fiscalCode: { 
          type: 'string', 
          format: 'binary',
          description: 'Codice Fiscale document' 
        },
        incomeDocuments: { 
          type: 'array',
          items: { type: 'string', format: 'binary' },
          description: 'CU, 730, income statements (max 5)'
        },
        propertyDocuments: { 
          type: 'array',
          items: { type: 'string', format: 'binary' },
          description: 'Property deeds, IMU receipts (max 3)'
        },
        disabilityCertificates: { 
          type: 'array',
          items: { type: 'string', format: 'binary' },
          description: 'Disability certificates (max 2)'
        },
        familyDocuments: { 
          type: 'array',
          items: { type: 'string', format: 'binary' },
          description: 'Family certificates, marriage, etc (max 5)'
        },
        otherDocuments: { 
          type: 'array',
          items: { type: 'string', format: 'binary' },
          description: 'Additional documents (max 10)'
        },
      },
      required: ['serviceTypeId']
    }
  })
  create(
    @Body() dto: CreateServiceRequestDto,
    @CurrentUser() user: UserRequest,
    @UploadedFiles() files?: {
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
      files
    );
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
   * Update draft service request
   */
  @Put(':id')
  @UseGuards(PermissionsGuard)
  @Permissions('service-requests:update')
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: '[Customer] Update draft request' })
  @ApiQuery({ name: 'serviceType', required: false })
  @ApiBody({ type: UpdateServiceRequestDto })
  update(
    @Param('id') id: string,
    @Body() dto: UpdateServiceRequestDto,
    @CurrentUser() user: UserRequest,
    @Query('serviceType') serviceType?: string,
  ) {
    return this.serviceRequestsService.update(id, dto, user.id, serviceType);
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
  submit(
    @Param('id') id: string,
    @Body() dto: SubmitServiceRequestDto,
    @CurrentUser() user: UserRequest,
  ) {
    return this.serviceRequestsService.submit(id, user.id, dto);
  }

  /**
   * Delete draft service request
   */
  @Delete(':id')
  @UseGuards(PermissionsGuard)
  @Permissions('service-requests:update')
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: '[Customer] Delete draft request' })
  remove(@Param('id') id: string, @CurrentUser() user: UserRequest) {
    return this.serviceRequestsService.remove(id, user.id);
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
    // Map serviceType to serviceTypeId for backward compatibility
    if ((query as any).serviceType) {
      query.serviceTypeId = (query as any).serviceType;
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
