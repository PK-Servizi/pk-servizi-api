# 🚀 PK SERVIZI - Implementation Tasks & Roadmap

**Project:** PK SERVIZI - CAF Services Platform  
**Backend:** NestJS + PostgreSQL + TypeORM  
**Frontend:** Flutter (Mobile) + React (Admin Portal)  
**Last Updated:** 2026-01-03

---

## 📊 Overall Project Status: **65% Complete**

### Completion by Milestone:
- ✅ **Milestone 1** (Architecture & Foundation): **95%** - Almost complete
- ✅ **Milestone 2** (Auth & Profiles): **90%** - Core features done
- ⚠️ **Milestone 3** (Service Requests): **40%** - Structure exists, needs implementation
- ⚠️ **Milestone 4** (Document Management): **35%** - Entity ready, no file handling
- ⚠️ **Milestone 5** (Appointments & Courses): **60%** - Courses done, appointments partial
- ❌ **Milestone 6** (Payments & Subscriptions): **20%** - Critical gap
- ⚠️ **Milestone 7** (Admin Operations): **30%** - Basic CRUD only
- ⚠️ **Milestone 8** (Security & QA): **50%** - Basic security done

---

## 🔴 CRITICAL PRIORITY TASKS (Week 1)

### TASK 1: Register Missing Modules in App Module
**Status:** Missing  
**Priority:** CRITICAL  
**Estimated Time:** 30 minutes  
**Dependencies:** None

**Current Issue:**
Several modules exist but are not imported in `src/app.module.ts`, making their endpoints inaccessible.

**Required Steps:**
1. Create module files for:
   - `src/modules/service-requests/service-requests.module.ts`
   - `src/modules/documents/documents.module.ts`
   - `src/modules/appointments/appointments.module.ts`
   - `src/modules/subscriptions/subscriptions.module.ts`

2. Import all modules in `src/app.module.ts`:
   ```typescript
   import { ServiceRequestsModule } from './modules/service-requests/service-requests.module';
   import { DocumentsModule } from './modules/documents/documents.module';
   import { AppointmentsModule } from './modules/appointments/appointments.module';
   import { SubscriptionsModule } from './modules/subscriptions/subscriptions.module';
   ```

3. Add to imports array in AppModule

**Environment Variables:** None

**Testing:**
- Run `npm run start:dev`
- Verify no errors
- Check Swagger docs at `/api/docs` for new endpoints

---

### TASK 2: Implement Stripe Payment Integration
**Status:** Missing (CRITICAL)  
**Priority:** CRITICAL  
**Estimated Time:** 2-3 days  
**Dependencies:** TASK 1, Stripe account setup

**Current Issue:**
- No Stripe SDK installed
- No payment processing
- No webhook handlers
- Users can submit service requests without active subscription

**Required Steps:**

#### Step 1: Install Stripe SDK
```bash
npm install stripe @types/stripe
```

#### Step 2: Create Stripe Configuration
**File:** `src/config/stripe.config.ts`
```typescript
import { ConfigService } from '@nestjs/config';

export const stripeConfig = (config: ConfigService) => ({
  apiKey: config.get<string>('STRIPE_SECRET_KEY'),
  apiVersion: '2023-10-16' as const,
  webhookSecret: config.get<string>('STRIPE_WEBHOOK_SECRET'),
});
```

#### Step 3: Create Stripe Service
**File:** `src/modules/payments/stripe.service.ts`

**Methods to implement:**
- `createCheckoutSession(userId, planId, billingCycle)` - Create payment session
- `createCustomer(user)` - Create Stripe customer
- `createSubscription(customerId, priceId)` - Create subscription
- `cancelSubscription(subscriptionId)` - Cancel subscription
- `handleWebhook(payload, signature)` - Process webhook events
- `createPaymentIntent(amount, currency, metadata)` - One-time payments
- `retrieveSubscription(subscriptionId)` - Get subscription details

#### Step 4: Create Webhook Controller
**File:** `src/modules/payments/stripe-webhook.controller.ts`

**Endpoint:** `POST /webhooks/stripe`

**Events to handle:**
- `checkout.session.completed` - Activate subscription
- `invoice.payment_succeeded` - Record payment
- `invoice.payment_failed` - Handle failed payment
- `customer.subscription.updated` - Update subscription status
- `customer.subscription.deleted` - Cancel subscription

#### Step 5: Create Subscription Guard
**File:** `src/common/guards/subscription.guard.ts`

**Logic:**
- Check if user has active subscription
- Verify plan entitlements for requested service
- Block service request creation if no active subscription
- Allow admin/operators to bypass

#### Step 6: Update Service Request Controller
Add `@UseGuards(SubscriptionGuard)` to service request creation endpoint

**Environment Variables Required:**
- `STRIPE_SECRET_KEY` - Stripe API secret key
- `STRIPE_PUBLISHABLE_KEY` - Stripe publishable key (for frontend)
- `STRIPE_WEBHOOK_SECRET` - Webhook signing secret
- `STRIPE_PRICE_ID_MONTHLY` - Monthly plan price ID
- `STRIPE_PRICE_ID_ANNUAL` - Annual plan price ID

**Testing:**
- Use Stripe test mode
- Test checkout flow
- Use Stripe CLI to test webhooks: `stripe listen --forward-to localhost:3001/webhooks/stripe`
- Test subscription enforcement

---

### TASK 3: Implement Document Upload/Download with Supabase
**Status:** Incomplete  
**Priority:** CRITICAL  
**Estimated Time:** 2 days  
**Dependencies:** TASK 1, Supabase project setup

**Current Issue:**
- Supabase client installed but not configured
- No file upload endpoints
- No signed URL generation
- No download endpoints

**Required Steps:**

#### Step 1: Configure Supabase Client
**File:** `src/config/supabase.config.ts`
```typescript
import { createClient } from '@supabase/supabase-js';
import { ConfigService } from '@nestjs/config';

export const createSupabaseClient = (config: ConfigService) => {
  return createClient(
    config.get<string>('SUPABASE_URL'),
    config.get<string>('SUPABASE_SERVICE_KEY')
  );
};
```

#### Step 2: Create Storage Service
**File:** `src/modules/documents/storage.service.ts`

**Methods to implement:**
- `uploadFile(file, bucket, path)` - Upload file to Supabase Storage
- `deleteFile(bucket, path)` - Delete file
- `getSignedUrl(bucket, path, expiresIn)` - Generate signed URL
- `listFiles(bucket, path)` - List files in folder
- `moveFile(bucket, fromPath, toPath)` - Move/rename file

#### Step 3: Create Documents Module
**File:** `src/modules/documents/documents.module.ts`

Import:
- TypeOrmModule.forFeature([Document])
- StorageService
- MulterModule configuration

#### Step 4: Update Documents Controller
**File:** `src/modules/documents/documents.controller.ts`

**Endpoints to implement:**
- `POST /documents/upload` - Upload document
  - Use `@UseInterceptors(FileInterceptor('file'))`
  - Validate file type (PDF, JPG, PNG)
  - Validate file size (max 10MB)
  - Generate unique filename
  - Upload to Supabase
  - Save metadata to database

- `GET /documents/:id/download` - Download document
  - Check permissions
  - Generate signed URL
  - Return URL or redirect

- `GET /documents/:id/preview` - Preview document
  - Generate short-lived signed URL
  - Return URL for embedding

- `DELETE /documents/:id` - Delete document
  - Check permissions
  - Delete from Supabase
  - Soft delete in database

- `PATCH /documents/:id/approve` - Approve document (Admin only)
- `PATCH /documents/:id/reject` - Reject document (Admin only)

#### Step 5: Configure Multer
**File:** `src/modules/documents/multer.config.ts`

**Configuration:**
- Memory storage (don't save to disk)
- File size limit: 10MB
- File filter: PDF, JPG, PNG, JPEG only
- Filename sanitization

**Environment Variables Required:**
- `SUPABASE_URL` - Supabase project URL
- `SUPABASE_SERVICE_KEY` - Supabase service role key (backend only)
- `SUPABASE_ANON_KEY` - Supabase anon key (for frontend)
- `SUPABASE_BUCKET_NAME` - Storage bucket name (default: 'documents')
- `MAX_FILE_SIZE_MB` - Maximum file size in MB (default: 10)

**Testing:**
- Test file upload with valid files
- Test file size validation
- Test file type validation
- Test signed URL generation
- Test download with permissions
- Test admin approval/rejection

---

### TASK 4: Update Role System for PK SERVIZI
**Status:** Incomplete  
**Priority:** HIGH  
**Estimated Time:** 4 hours  
**Dependencies:** None

**Current Issue:**
Roles are generic (admin, client, employee, project_manager, support) and don't match PK SERVIZI requirements.

**Required Roles:**
1. **Customer** - End users requesting CAF services
2. **Admin** - System administrators with full access
3. **Operator** (CAF Consultant) - Process service requests
4. **Finance** - Handle payments and subscriptions (optional)

**Required Steps:**

#### Step 1: Update Role Enum
**File:** `src/modules/roles/role.enum.ts`
```typescript
export enum RoleEnum {
  ADMIN = 'admin',
  CUSTOMER = 'customer',
  OPERATOR = 'operator',
  FINANCE = 'finance',
}
```

#### Step 2: Update Seed File
**File:** `seeds/seed.ts`

Replace rolesToSeed array:
```typescript
const rolesToSeed = [
  { name: RoleEnum.ADMIN, description: 'System administrator with full access' },
  { name: RoleEnum.CUSTOMER, description: 'Customer requesting CAF services' },
  { name: RoleEnum.OPERATOR, description: 'CAF consultant processing requests' },
  { name: RoleEnum.FINANCE, description: 'Finance team managing payments' },
];
```

#### Step 3: Update Permissions Seed
**File:** `seeds/permissions-seed.ts`

Add role-specific permissions:
- **Customer:** service-requests.create, service-requests.read (own), documents.upload, appointments.create
- **Operator:** service-requests.read (all), service-requests.update, service-requests.assign, documents.approve
- **Finance:** payments.read, payments.update, subscriptions.read, subscriptions.update
- **Admin:** All permissions

#### Step 4: Reset Database and Re-seed
```bash
npm run migration:revert
npm run migration:run
npm run seed:all
```

**Environment Variables:** None

**Testing:**
- Verify roles created correctly
- Test permission enforcement
- Test role-based UI rendering (frontend)

---

### TASK 5: Create Service Type Configurations (ISEE, 730/PF, IMU)
**Status:** Missing  
**Priority:** HIGH  
**Estimated Time:** 1 day  
**Dependencies:** TASK 1

**Current Issue:**
No pre-configured service types for ISEE, 730/PF, and IMU services.

**Required Steps:**

#### Step 1: Create Service Type Seed
**File:** `seeds/service-types-seed.ts`

**Service Types to Create:**

##### 1. ISEE Service Type
```typescript
{
  name: 'ISEE',
  code: 'ISEE',
  description: 'Indicatore della Situazione Economica Equivalente',
  formSchema: {
    sections: [
      {
        title: 'Nucleo Familiare',
        fields: [
          { name: 'numeroComponenti', type: 'number', required: true },
          { name: 'componenti', type: 'array', required: true }
        ]
      },
      {
        title: 'Abitazione',
        fields: [
          { name: 'tipoAbitazione', type: 'select', options: ['Proprietà', 'Affitto', 'Altro'] },
          { name: 'indirizzo', type: 'text', required: true }
        ]
      },
      {
        title: 'Redditi',
        fields: [
          { name: 'redditoAnno1', type: 'number', required: true },
          { name: 'redditoAnno2', type: 'number', required: true }
        ]
      },
      {
        title: 'Patrimonio Mobiliare',
        fields: [
          { name: 'contiCorrenti', type: 'number' },
          { name: 'titoli', type: 'number' }
        ]
      },
      {
        title: 'Veicoli',
        fields: [
          { name: 'veicoli', type: 'array' }
        ]
      },
      {
        title: 'Disabilità',
        fields: [
          { name: 'presenzaDisabilita', type: 'boolean' },
          { name: 'dettagliDisabilita', type: 'text' }
        ]
      }
    ]
  },
  requiredDocuments: [
    { category: 'Documento Identità', required: true, description: 'Carta d\'identità o passaporto' },
    { category: 'Codice Fiscale', required: true, description: 'Tessera sanitaria o codice fiscale' },
    { category: 'CU Redditi', required: true, description: 'Certificazione Unica ultimi 2 anni' },
    { category: 'Estratti Conto', required: true, description: 'Ultimi 12 mesi' },
    { category: 'Visure Catastali', required: false, description: 'Se proprietari immobili' },
    { category: 'Contratto Affitto', required: false, description: 'Se in affitto' }
  ]
}
```

##### 2. Modello 730/PF Service Type
```typescript
{
  name: 'Modello 730 / Persone Fisiche',
  code: '730_PF',
  description: 'Dichiarazione dei redditi per persone fisiche',
  formSchema: {
    sections: [
      {
        title: 'Dati Anagrafici',
        fields: [
          { name: 'codiceFiscale', type: 'text', required: true },
          { name: 'nome', type: 'text', required: true },
          { name: 'cognome', type: 'text', required: true },
          { name: 'dataNascita', type: 'date', required: true }
        ]
      },
      {
        title: 'Redditi',
        fields: [
          { name: 'redditiLavoro', type: 'number' },
          { name: 'redditiPensione', type: 'number' },
          { name: 'altriRedditi', type: 'number' }
        ]
      },
      {
        title: 'Immobili',
        fields: [
          { name: 'immobili', type: 'array' }
        ]
      },
      {
        title: 'Spese Detraibili',
        fields: [
          { name: 'speseSanitarie', type: 'number' },
          { name: 'speseIstruzione', type: 'number' },
          { name: 'interessiMutuo', type: 'number' },
          { name: 'speseRistrutturazione', type: 'number' }
        ]
      },
      {
        title: 'Famiglia',
        fields: [
          { name: 'coniuge', type: 'object' },
          { name: 'figliCarico', type: 'array' }
        ]
      }
    ]
  },
  requiredDocuments: [
    { category: 'CU', required: true, description: 'Certificazione Unica' },
    { category: 'Spese Sanitarie', required: false, description: 'Ricevute e fatture' },
    { category: 'Spese Istruzione', required: false, description: 'Ricevute scolastiche' },
    { category: 'Mutui', required: false, description: 'Certificazione interessi' },
    { category: 'Ristrutturazioni', required: false, description: 'Fatture e bonifici' }
  ]
}
```

##### 3. IMU Service Type
```typescript
{
  name: 'IMU',
  code: 'IMU',
  description: 'Imposta Municipale Unica',
  formSchema: {
    sections: [
      {
        title: 'Dati Contribuente',
        fields: [
          { name: 'codiceFiscale', type: 'text', required: true },
          { name: 'nome', type: 'text', required: true },
          { name: 'cognome', type: 'text', required: true }
        ]
      },
      {
        title: 'Immobili',
        fields: [
          { name: 'immobili', type: 'array', required: true }
        ]
      },
      {
        title: 'Agevolazioni',
        fields: [
          { name: 'primaCasa', type: 'boolean' },
          { name: 'altreAgevolazioni', type: 'text' }
        ]
      },
      {
        title: 'Pagamenti',
        fields: [
          { name: 'accontoVersato', type: 'number' },
          { name: 'saldoVersato', type: 'number' }
        ]
      }
    ]
  },
  requiredDocuments: [
    { category: 'Visura Catastale', required: true, description: 'Visura catastale immobile' },
    { category: 'Atto Proprietà', required: true, description: 'Atto di acquisto o successione' },
    { category: 'F24 Precedenti', required: false, description: 'Pagamenti anni precedenti' }
  ]
}
```

#### Step 2: Create Seed Script
```bash
npm run seed:service-types
```

#### Step 3: Update Service Request Service
Add validation for form data against service type schema

**Environment Variables:** None

**Testing:**
- Verify service types created
- Test form schema validation
- Test required documents enforcement

---

## 🟡 HIGH PRIORITY TASKS (Week 2)

### TASK 6: Implement Appointment Booking System
**Status:** Incomplete  
**Priority:** HIGH  
**Estimated Time:** 2 days  
**Dependencies:** TASK 1

**Current Issue:**
Appointment entity exists but no booking flow, calendar availability, or slot management.

**Required Steps:**

#### Step 1: Create Appointment Slots Service
**File:** `src/modules/appointments/appointment-slots.service.ts`

**Methods:**
- `getAvailableSlots(serviceTypeId, date)` - Get available time slots
- `createSlots(operatorId, date, slots)` - Admin creates availability
- `blockSlot(slotId)` - Block slot for booking
- `releaseSlot(slotId)` - Release blocked slot

#### Step 2: Create Appointments Module
**File:** `src/modules/appointments/appointments.module.ts`

#### Step 3: Update Appointments Controller
**File:** `src/modules/appointments/appointments.controller.ts`

**Endpoints:**
- `GET /appointments/available` - Get available slots
  - Query params: serviceTypeId, date, operatorId (optional)
  
- `POST /appointments` - Book appointment
  - Body: { serviceTypeId, operatorId, date, time, notes }
  - Validate slot availability
  - Create appointment
  - Send notification

- `PATCH /appointments/:id/reschedule` - Reschedule appointment
  - Check new slot availability
  - Update appointment
  - Send notification

- `PATCH /appointments/:id/cancel` - Cancel appointment
  - Update status
  - Release slot
  - Send notification

- `GET /appointments/my` - Get user's appointments

- `GET /appointments` - Get all appointments (Admin/Operator)
  - Filters: status, date, operatorId, serviceTypeId

#### Step 4: Create Calendar View Service
**File:** `src/modules/appointments/calendar.service.ts`

**Methods:**
- `getCalendarView(operatorId, startDate, endDate)` - Get calendar data
- `getOperatorWorkload(operatorId, date)` - Get operator's schedule

#### Step 5: Admin Slot Management Endpoints
- `POST /appointments/slots` - Create availability slots (Admin)
- `GET /appointments/slots` - Get all slots (Admin)
- `DELETE /appointments/slots/:id` - Delete slot (Admin)

**Environment Variables:**
- `APPOINTMENT_SLOT_DURATION` - Default slot duration in minutes (default: 60)
- `APPOINTMENT_BOOKING_ADVANCE_DAYS` - How many days in advance can book (default: 30)
- `APPOINTMENT_CANCELLATION_HOURS` - Minimum hours before appointment to cancel (default: 24)

**Testing:**
- Test slot availability calculation
- Test booking flow
- Test double-booking prevention
- Test reschedule logic
- Test cancellation

---

### TASK 7: Implement Admin Dashboard Aggregation Endpoints
**Status:** Missing  
**Priority:** HIGH  
**Estimated Time:** 1 day  
**Dependencies:** TASK 1

**Current Issue:**
No dashboard endpoints for admin portal overview.

**Required Steps:**

#### Step 1: Create Dashboard Service
**File:** `src/modules/admin/dashboard.service.ts`

**Methods:**
- `getDashboardStats()` - Get overview statistics
- `getPendingRequests()` - Get pending service requests count
- `getActiveSubscriptions()` - Get active subscriptions count
- `getUpcomingAppointments()` - Get upcoming appointments
- `getOperatorWorkload()` - Get workload per operator
- `getRevenueStats(startDate, endDate)` - Get revenue statistics

#### Step 2: Create Dashboard Controller
**File:** `src/modules/admin/dashboard.controller.ts`

**Endpoints:**
- `GET /admin/dashboard` - Get dashboard overview
  - Returns: {
      pendingRequests: number,
      activeSubscriptions: number,
      upcomingAppointments: number,
      totalRevenue: number,
      recentActivity: []
    }

- `GET /admin/dashboard/requests` - Get requests overview
  - Group by: service type, status
  - Returns counts and percentages

- `GET /admin/dashboard/operators` - Get operator workload
  - Returns: operator name, assigned requests, completed requests, pending requests

- `GET /admin/dashboard/revenue` - Get revenue analytics
  - Query params: startDate, endDate, groupBy (day/week/month)

#### Step 3: Create Reports Service
**File:** `src/modules/admin/reports.service.ts`

**Methods:**
- `generateServiceRequestReport(filters)` - Service requests report
- `generateSubscriptionReport(filters)` - Subscriptions report
- `generatePaymentReport(filters)` - Payments report
- `generateOperatorPerformanceReport(operatorId, period)` - Operator performance

#### Step 4: Create Reports Controller
**File:** `src/modules/admin/reports.controller.ts`

**Endpoints:**
- `GET /admin/reports/service-requests` - Service requests report
  - Filters: dateRange, serviceType, status, operatorId
  - Export: CSV, PDF

- `GET /admin/reports/subscriptions` - Subscriptions report
  - Filters: dateRange, planId, status

- `GET /admin/reports/payments` - Payments report
  - Filters: dateRange, status, paymentMethod

- `GET /admin/reports/operator-performance` - Operator performance
  - Filters: operatorId, dateRange

**Environment Variables:** None

**Testing:**
- Test dashboard data accuracy
- Test report generation
- Test export functionality
- Test date range filtering

---

### TASK 8: Implement Notification System Integration
**Status:** Incomplete  
**Priority:** HIGH  
**Estimated Time:** 1.5 days  
**Dependencies:** Email service provider setup

**Current Issue:**
Notification entity exists but no actual email/SMS sending, no templates, no event triggers.

**Required Steps:**

#### Step 1: Choose and Configure Email Provider
**Options:**
- SendGrid
- AWS SES
- Mailgun
- Resend

**Recommended:** SendGrid (easy setup, good free tier)

Install:
```bash
npm install @sendgrid/mail
```

#### Step 2: Create Email Service
**File:** `src/modules/notifications/email.service.ts`

**Methods:**
- `sendEmail(to, subject, html, text)` - Send email
- `sendTemplateEmail(to, templateId, dynamicData)` - Send template email
- `sendBulkEmail(recipients, subject, html)` - Send bulk emails

#### Step 3: Create Email Templates
**Directory:** `src/modules/notifications/templates/`

**Templates to create:**
- `welcome.template.ts` - Welcome email
- `service-request-submitted.template.ts` - Request submitted confirmation
- `service-request-status-update.template.ts` - Status change notification
- `appointment-confirmation.template.ts` - Appointment booked
- `appointment-reminder.template.ts` - Appointment reminder (24h before)
- `document-required.template.ts` - Missing documents notification
- `payment-success.template.ts` - Payment successful
- `payment-failed.template.ts` - Payment failed
- `subscription-expiring.template.ts` - Subscription expiring soon

#### Step 4: Create Notification Events
**File:** `src/modules/notifications/notification-events.service.ts`

**Event Handlers:**
- `onUserRegistered(user)` - Send welcome email
- `onServiceRequestSubmitted(request)` - Notify user and admin
- `onServiceRequestStatusChanged(request, oldStatus, newStatus)` - Notify user
- `onAppointmentBooked(appointment)` - Send confirmation
- `onAppointmentReminder(appointment)` - Send reminder
- `onDocumentApproved(document)` - Notify user
- `onDocumentRejected(document, reason)` - Notify user with reason
- `onPaymentSuccess(payment)` - Send receipt
- `onPaymentFailed(payment)` - Notify user
- `onSubscriptionExpiring(subscription)` - Send renewal reminder

#### Step 5: Create Notification Scheduler
**File:** `src/modules/notifications/notification-scheduler.service.ts`

Use `@nestjs/schedule`:
```bash
npm install @nestjs/schedule
```

**Scheduled Tasks:**
- Daily: Send appointment reminders for next day
- Daily: Check expiring subscriptions (7 days before)
- Weekly: Send operator workload summary to admin

#### Step 6: Update Notifications Controller
**File:** `src/modules/notifications/notifications.controller.ts`

**Endpoints:**
- `GET /notifications` - Get user notifications
- `PATCH /notifications/:id/read` - Mark as read
- `PATCH /notifications/read-all` - Mark all as read
- `DELETE /notifications/:id` - Delete notification

**Environment Variables:**
- `SENDGRID_API_KEY` - SendGrid API key
- `EMAIL_FROM_ADDRESS` - From email address
- `EMAIL_FROM_NAME` - From name
- `NOTIFICATION_ENABLED` - Enable/disable notifications (default: true)
- `APPOINTMENT_REMINDER_HOURS` - Hours before appointment to send reminder (default: 24)

**Testing:**
- Test email sending
- Test template rendering
- Test event triggers
- Test scheduled tasks
- Test notification CRUD

---

## 🟢 MEDIUM PRIORITY TASKS (Week 3)

### TASK 9: Implement Advanced Service Request Features
**Status:** Incomplete  
**Priority:** MEDIUM  
**Estimated Time:** 2 days  
**Dependencies:** TASK 1, TASK 5

**Features to Implement:**

#### Step 1: Service Request Filtering & Search
**File:** `src/modules/service-requests/service-requests.service.ts`

**Update `findAll` method:**
- Filter by: status, serviceType, assignedOperator, dateRange, priority
- Search by: user name, fiscal code, request ID
- Sort by: createdAt, updatedAt, priority, status
- Pagination: page, limit

#### Step 2: Bulk Operations
**File:** `src/modules/service-requests/service-requests.controller.ts`

**New Endpoints:**
- `PATCH /service-requests/bulk/assign` - Bulk assign to operator
- `PATCH /service-requests/bulk/status` - Bulk status update
- `POST /service-requests/bulk/export` - Export to CSV/Excel

#### Step 3: Request Templates
**File:** `src/modules/service-requests/request-templates.service.ts`

**Features:**
- Save request as template
- Load template for new request
- User-specific templates

#### Step 4: Request History & Audit Trail
**Enhancement:** Integrate with AuditModule
- Track all changes to service requests
- Show timeline in admin panel
- Export audit trail

**Environment Variables:** None

**Testing:**
- Test filtering combinations
- Test search functionality
- Test bulk operations
- Test template save/load

---

### TASK 10: Implement Document Approval Workflow
**Status:** Missing  
**Priority:** MEDIUM  
**Estimated Time:** 1 day  
**Dependencies:** TASK 3

**Required Steps:**

#### Step 1: Create Approval Service
**File:** `src/modules/documents/document-approval.service.ts`

**Methods:**
- `approveDocument(documentId, adminId, notes)` - Approve document
- `rejectDocument(documentId, adminId, reason)` - Reject document
- `requestReupload(documentId, adminId, reason)` - Request re-upload
- `getDocumentsForReview()` - Get pending documents

#### Step 2: Update Documents Controller
**New Endpoints:**
- `PATCH /documents/:id/approve` - Approve document
- `PATCH /documents/:id/reject` - Reject document
- `PATCH /documents/:id/request-reupload` - Request re-upload
- `GET /documents/pending-review` - Get documents needing review

#### Step 3: Document Status Workflow
**States:**
- `pending` → `approved` (by admin)
- `pending` → `rejected` (by admin, with reason)
- `pending` → `reupload_required` (by admin, with reason)
- `reupload_required` → `pending` (by user, new version)

#### Step 4: Version Control
- Track document versions
- Keep history of all uploads
- Link to service request

**Environment Variables:** None

**Testing:**
- Test approval flow
- Test rejection with reason
- Test re-upload request
- Test version tracking

---

### TASK 11: Implement User Family Management
**Status:** Missing  
**Priority:** MEDIUM  
**Estimated Time:** 1 day  
**Dependencies:** None

**Current Issue:**
ISEE requires family member information, but no family management system exists.

**Required Steps:**

#### Step 1: Create Family Member Entity
**File:** `src/modules/users/entities/family-member.entity.ts`

**Fields:**
- id (UUID)
- userId (UUID) - Reference to main user
- fullName (string)
- fiscalCode (string)
- relationship (string) - coniuge, figlio, genitore, etc.
- birthDate (date)
- isDependent (boolean)
- disability (boolean)
- disabilityType (string)
- createdAt, updatedAt

#### Step 2: Create Family Members Service
**File:** `src/modules/users/family-members.service.ts`

**Methods:**
- `create(userId, memberData)` - Add family member
- `findByUser(userId)` - Get user's family members
- `update(id, memberData)` - Update family member
- `delete(id)` - Remove family member

#### Step 3: Create Family Members Controller
**File:** `src/modules/users/family-members.controller.ts`

**Endpoints:**
- `POST /users/me/family-members` - Add family member
- `GET /users/me/family-members` - Get my family members
- `PATCH /users/me/family-members/:id` - Update family member
- `DELETE /users/me/family-members/:id` - Remove family member

**Environment Variables:** None

**Testing:**
- Test CRUD operations
- Test relationship validation
- Test fiscal code validation

---

### TASK 12: Implement Subscription Plan Management
**Status:** Incomplete  
**Priority:** MEDIUM  
**Estimated Time:** 1 day  
**Dependencies:** TASK 2

**Required Steps:**

#### Step 1: Create Subscription Plans Admin Controller
**File:** `src/modules/subscriptions/subscription-plans-admin.controller.ts`

**Endpoints:**
- `POST /admin/subscription-plans` - Create plan
- `PATCH /admin/subscription-plans/:id` - Update plan
- `DELETE /admin/subscription-plans/:id` - Deactivate plan
- `GET /admin/subscription-plans` - Get all plans

#### Step 2: Plan Features Configuration
**Features to configure:**
- Enabled services (ISEE, 730, IMU)
- Request limits per month
- Priority support
- Document storage limit
- Appointment booking priority

#### Step 3: Plan Comparison Endpoint
**File:** `src/modules/subscriptions/subscription-plans.controller.ts`

**Endpoint:**
- `GET /subscription-plans/compare` - Compare all active plans
  - Returns feature matrix for frontend

#### Step 4: Manual Subscription Management
**File:** `src/modules/subscriptions/user-subscriptions-admin.controller.ts`

**Endpoints:**
- `POST /admin/subscriptions/manual` - Manually create subscription
- `PATCH /admin/subscriptions/:id/extend` - Extend subscription
- `PATCH /admin/subscriptions/:id/cancel` - Cancel subscription
- `POST /admin/subscriptions/:id/refund` - Process refund

**Environment Variables:** None

**Testing:**
- Test plan CRUD
- Test feature configuration
- Test manual subscription management

---

## 🔵 LOW PRIORITY TASKS (Week 4+)

### TASK 13: Implement Advanced Reporting
**Status:** Missing  
**Priority:** LOW  
**Estimated Time:** 2 days  
**Dependencies:** TASK 7

**Features:**
- Export reports to PDF
- Export reports to Excel
- Scheduled reports (email weekly summary)
- Custom report builder
- Data visualization endpoints

---

### TASK 14: Implement Real-time Features with WebSockets
**Status:** Missing  
**Priority:** LOW  
**Estimated Time:** 2 days  
**Dependencies:** None

**Features:**
- Real-time notification delivery
- Live dashboard updates
- Real-time request status updates
- Operator presence indicators

---

### TASK 15: Implement Multi-language Support
**Status:** Missing  
**Priority:** LOW  
**Estimated Time:** 1 day  
**Dependencies:** None

**Features:**
- i18n for API responses
- Multi-language email templates
- Language preference per user

---

### TASK 16: Implement Advanced Security Features
**Status:** Incomplete  
**Priority:** LOW  
**Estimated Time:** 2 days  
**Dependencies:** None

**Features:**
- Two-factor authentication (2FA)
- Session management
- IP whitelisting for admin
- Failed login attempt tracking
- Account lockout after failed attempts

---

## 📋 TESTING & QUALITY ASSURANCE TASKS

### TASK 17: Write Integration Tests
**Priority:** MEDIUM  
**Estimated Time:** 3 days

**Tests to write:**
- Auth flow tests
- Service request lifecycle tests
- Payment flow tests
- Document upload/approval tests
- Appointment booking tests

---

### TASK 18: Write E2E Tests
**Priority:** LOW  
**Estimated Time:** 2 days

**Tests to write:**
- Complete user journey tests
- Admin workflow tests
- Error handling tests

---

### TASK 19: Performance Testing
**Priority:** LOW  
**Estimated Time:** 1 day

**Tests:**
- Load testing
- Database query optimization
- API response time benchmarks

---

## 🔐 SECURITY & COMPLIANCE TASKS

### TASK 20: GDPR Compliance Review
**Priority:** HIGH  
**Estimated Time:** 2 days

**Tasks:**
- Data retention policy implementation
- Right to be forgotten implementation
- Data export functionality
- Privacy policy updates
- Cookie consent management

---

### TASK 21: Security Audit
**Priority:** MEDIUM  
**Estimated Time:** 2 days

**Tasks:**
- Penetration testing
- Dependency vulnerability scanning
- SQL injection testing
- XSS prevention verification
- CSRF protection verification

---

## 📊 DEPLOYMENT & DEVOPS TASKS

### TASK 22: Setup CI/CD Pipeline
**Priority:** MEDIUM  
**Estimated Time:** 1 day

**Tasks:**
- GitHub Actions or GitLab CI setup
- Automated testing on PR
- Automated deployment to staging
- Production deployment workflow

---

### TASK 23: Setup Monitoring & Logging
**Priority:** MEDIUM  
**Estimated Time:** 1 day

**Tools:**
- Sentry for error tracking
- LogRocket or similar for session replay
- Database query monitoring
- API performance monitoring

---

### TASK 24: Setup Backup & Recovery
**Priority:** HIGH  
**Estimated Time:** 1 day

**Tasks:**
- Automated database backups
- Backup retention policy
- Disaster recovery plan
- Backup restoration testing

---

## 📈 ESTIMATED TIMELINE

### Week 1 (Critical Tasks)
- Day 1-2: TASK 1, TASK 4 (Module registration, Role system)
- Day 3-5: TASK 2 (Stripe integration)

### Week 2 (High Priority)
- Day 1-2: TASK 3 (Document upload/download)
- Day 3: TASK 5 (Service type configurations)
- Day 4-5: TASK 6 (Appointment booking)

### Week 3 (High Priority Continued)
- Day 1: TASK 7 (Admin dashboard)
- Day 2-3: TASK 8 (Notification system)
- Day 4-5: TASK 9 (Advanced service request features)

### Week 4 (Medium Priority)
- Day 1: TASK 10 (Document approval)
- Day 2: TASK 11 (Family management)
- Day 3: TASK 12 (Subscription management)
- Day 4-5: TASK 17 (Integration tests)

### Week 5+ (Remaining Tasks)
- Security & compliance tasks
- Low priority features
- Performance optimization
- Documentation

---

## 🎯 SUCCESS CRITERIA

### For Mobile App Launch:
- ✅ All CRITICAL tasks completed
- ✅ All HIGH priority tasks completed
- ✅ Integration tests passing
- ✅ Security audit completed

### For Admin Portal Launch:
- ✅ All CRITICAL tasks completed
- ✅ All HIGH priority tasks completed
- ✅ Dashboard and reporting functional
- ✅ Document approval workflow complete

### For Production Launch:
- ✅ All tasks except LOW priority completed
- ✅ GDPR compliance verified
- ✅ Backup & recovery tested
- ✅ Monitoring & logging active
- ✅ CI/CD pipeline operational

---

## 📝 NOTES

1. **Environment Variables:** See `.env.example` for all required configuration
2. **Database Migrations:** Run migrations after each entity change
3. **Testing:** Write tests alongside implementation
4. **Documentation:** Update API docs (Swagger) for each new endpoint
5. **Code Review:** All critical tasks should be peer-reviewed

---

**Last Updated:** 2026-01-03  
**Next Review:** After Week 1 completion
