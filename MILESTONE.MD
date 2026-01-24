# PK SERVIZI - Backend API Milestones

## OVERVIEW

**Backend API (NestJS)** – Central business logic & data layer

### Core Services
● ISEE 
● Modello 730 / PF 
● IMU 

### Core Modules
● Authentication & Roles 
● Service Requests 
● Document Management 
● Appointments 
● Courses 
● Payments & Subscriptions 
● Notifications 
● Admin Operations & Reporting 

---

---

## MILESTONE 1 — System Architecture & Foundation 

**Objectives**
● Establish scalable backend architecture 
● Finalize roles, permissions, and data model 
● Setup development environments 

**Backend Tasks**

Architecture & Setup 
● Environment setup (dev / staging / prod) 
● Configuration management 
● CI/CD pipeline 

Backend (NestJS) 
● Project scaffolding 
● Modular architecture: 
  - Auth 
  - Users 
  - Services 
  - Requests 
  - Documents 
  - Payments 
  - Subscriptions 
  - Appointments 
  - Courses 
  - CMS (FAQs, News) 
● PostgreSQL database + migrations 
● Global exception handling 
● Request validation & sanitization 

Security & Roles 
● JWT authentication + refresh tokens 
● Role-based access control (RBAC): 
  - Customer 
  - Admin 
  - Operator / CAF Consultant 
● Audit logs for sensitive actions 
● GDPR consent tracking 

**Deliverables**
● Database schema 
● Auth & RBAC implementation 
● Base API ready 

---

---

## MILESTONE 2 — Authentication & User Management APIs 

**Objectives**
● Secure access for users and staff 
● Complete user profile management 

**Backend APIs**

Authentication 
● POST /auth/register 
● POST /auth/login 
● POST /auth/forgot-password 
● POST /auth/reset-password 
● POST /auth/refresh 
● POST /auth/logout 

User Profile 
● GET /users/me 
● PATCH /users/me 
● GET /users/:id (admin) 
● PATCH /users/:id (admin) 
● User fields: 
  - Personal info 
  - Fiscal code 
  - Address / residence 
  - GDPR consent 

**Deliverables**
● Auth APIs with JWT 
● User profile CRUD APIs 
● Token refresh & revocation 

---

---

## MILESTONE 3 — Service Request Engine (ISEE, 730/PF, IMU) 

**Objectives**
● Digitize CAF service workflows 
● Handle complex document-heavy requests 

**Backend APIs**

Service Request Endpoints 
● POST /service-requests (create draft) 
● GET /service-requests (list with filters) 
● GET /service-requests/:id 
● PATCH /service-requests/:id 
● POST /service-requests/:id/submit 
● PATCH /service-requests/:id/status (admin) 

Status Lifecycle 
● Draft 
● Submitted 
● In Review 
● Missing Documents 
● Completed 
● Closed / Rejected 

Common Features 
● Internal notes (Admin/Operator) 
● User-visible messages 
● Full request history 
● Status change webhooks 

● Full request history 
● Status change webhooks

### ISEE Module (Backend Schema)

Database Fields 
● Nucleo familiare (JSONB) 
● Abitazione (JSONB) 
● Redditi - 2 anni precedenti (JSONB) 
● Patrimonio mobiliare (JSONB) 
● Veicoli (JSONB) 
● Disabilità (JSONB) 
● Università (JSONB) 
● Minori / genitori non conviventi (JSONB) 

Document Categories 
● Structured upload metadata 
● Mandatory/optional flags 
● Missing-document tracking 

### Modello 730 / PF Module (Backend Schema)

Database Fields 
● Dati anagrafici (JSONB) 
● Redditi - CU, INPS, altri (JSONB) 
● Immobili (JSONB) 
● Altri redditi (JSONB) 
● Spese sanitarie (JSONB) 
● Spese istruzione (JSONB) 
● Mutui & bonus casa (JSONB) 
● Famiglia (JSONB) 
● Assicurazioni & previdenza (JSONB) 

### IMU Module (Backend Schema)

Database Fields 
● Dati contribuente (JSONB) 
● Immobili - multi-property (JSONB array) 
● Utilizzo immobile (JSONB) 
● Agevolazioni (JSONB) 
● Variazioni (JSONB) 
● Pagamenti IMU (JSONB) 
● Successione (JSONB, nullable) 

**Deliverables**
● Service request CRUD APIs 
● ISEE/730/IMU data schemas 
● Document upload integration 
● Status workflow logic 

---

---

## MILESTONE 4 — Document Management System 

**Objectives**
● Secure handling of sensitive financial documents 

**Backend APIs**

Document Endpoints 
● POST /documents (upload) 
● GET /documents 
● GET /documents/:id 
● DELETE /documents/:id 
● PATCH /documents/:id/approve (admin) 
● PATCH /documents/:id/reject (admin) 
● GET /documents/:id/download (signed URL) 

Storage Features 
● S3-compatible storage integration 
● Pre-signed URLs for secure access 
● Document versioning 
● Access control by role & request 
● File type validation 
● Size limits 
● Virus scanning (optional) 

Document Metadata 
● Service request ID 
● Document type/category 
● Upload timestamp 
● Status (pending/approved/rejected) 
● Admin notes 
● File metadata (size, mime type) 

**Deliverables**
● Document CRUD APIs 
● S3 storage integration 
● Signed URL generation 
● Admin approval workflow 

---

## MILESTONE 5 — Appointments & Courses APIs 

**Objectives**
● Enable scheduling and training management 

**Backend APIs**

Appointments 
● POST /appointments (book) 
● GET /appointments (user's appointments) 
● GET /appointments/:id 
● PATCH /appointments/:id/reschedule 
● DELETE /appointments/:id/cancel 
● GET /appointments/availability (available slots) 
● GET /admin/appointments (all appointments) 
● PATCH /admin/appointments/:id/assign (operator) 

Appointment Features 
● Service-based appointment types 
● Calendar availability logic 
● Conflict detection 
● Email/notification triggers 
● Operator assignment 

Courses 
● GET /courses (list) 
● GET /courses/:id 
● POST /courses/:id/enroll 
● DELETE /courses/:id/unenroll 
● POST /admin/courses (create - admin) 
● PATCH /admin/courses/:id (update - admin) 
● DELETE /admin/courses/:id (delete - admin) 
● GET /admin/courses/:id/enrollments 

**Deliverables**
● Appointment booking APIs 
● Course CRUD APIs 
● Enrollment management 
● Notification integration 

---

---

## MILESTONE 6 — Payments & Subscriptions (CRITICAL) 

**Objectives**
● Monetize services 
● Control access via subscription status 

**Backend APIs**

Subscription Plans 
● GET /subscription-plans (list available plans) 
● GET /subscription-plans/:id 
● POST /admin/subscription-plans (create - admin) 
● PATCH /admin/subscription-plans/:id (update - admin) 

Plan Features 
● Monthly / Annual billing 
● Plan entitlements: 
  - Enabled services 
  - Usage limits (optional) 
  - Priority handling (optional) 

User Subscriptions 
● GET /subscriptions/me (current subscription) 
● POST /subscriptions/checkout (create Stripe session) 
● POST /subscriptions/cancel 
● POST /subscriptions/upgrade 
● GET /subscriptions/history 

Payment Integration 
● Stripe integration: 
  - Checkout sessions 
  - Customer portal 
  - Webhook handling 
● POST /webhooks/stripe (webhook endpoint) 

Webhook Events 
● payment_intent.succeeded 
● payment_intent.failed 
● customer.subscription.created 
● customer.subscription.updated 
● customer.subscription.deleted 
● invoice.paid 
● invoice.payment_failed 

Service Gating Logic 
● Middleware to check active subscription 
● Prevent service request submission without plan 
● Grace period handling 
● Trial period support 

Invoice Management 
● GET /invoices (user's invoices) 
● GET /invoices/:id 
● GET /admin/payments (all payments) 
● POST /admin/payments/:id/refund 

**Deliverables**
● Stripe integration complete 
● Subscription CRUD APIs 
● Webhook handling 
● Service gating middleware 
● Invoice generation 

---

---

## MILESTONE 7 — Admin Operations & Reporting 

**Objectives**
● Full operational control for PK SERVIZI staff 

**Backend APIs**

Admin Dashboard 
● GET /admin/dashboard/stats 
  - Pending requests count 
  - Active subscriptions count 
  - Upcoming appointments count 
  - Workload metrics 

Request Management 
● GET /admin/service-requests (with filters) 
  - Filter by service/status/date/user/operator 
  - Pagination & sorting 
● PATCH /admin/service-requests/:id/assign 
● PATCH /admin/service-requests/:id/status 
● POST /admin/service-requests/:id/notes 
● POST /admin/service-requests/:id/request-documents 

User Management 
● GET /admin/users (list all users) 
● GET /admin/users/:id (user details) 
● PATCH /admin/users/:id/activate 
● PATCH /admin/users/:id/deactivate 
● GET /admin/users/:id/family-members 
● GET /admin/users/:id/activity-log 

Reporting APIs 
● GET /admin/reports/service-requests 
  - Requests per service type 
  - Status distribution 
  - Processing time metrics 
● GET /admin/reports/subscriptions 
  - Revenue by plan 
  - Churn rate 
  - Active vs expired 
● GET /admin/reports/performance 
  - Average resolution time 
  - SLA compliance 
  - Operator workload 
● POST /admin/reports/export (CSV/PDF export) 

Audit Logs 
● GET /admin/audit-logs 
  - User actions 
  - Admin actions 
  - System events 
  - GDPR compliance tracking 

**Deliverables**
● Admin dashboard APIs 
● User management APIs 
● Reporting & analytics APIs 
● Audit logging system 

---

---

## MILESTONE 8 — Security, QA & Deployment 

**Objectives**
● Prepare backend for production 

**Security Tasks**

Hardening 
● Input validation on all endpoints 
● SQL injection prevention (TypeORM) 
● XSS protection 
● CSRF protection 
● Rate limiting per endpoint 
● IP-based throttling 
● Request size limits 
● File upload restrictions 

GDPR Compliance 
● Data export API (GET /users/me/export) 
● Data deletion API (DELETE /users/me/account) 
● Consent tracking 
● Privacy policy acknowledgment 
● Cookie policy 
● Data retention policies 

Authentication Security 
● JWT expiration (15 min access, 7 days refresh) 
● Refresh token rotation 
● Token blacklisting on logout 
● Failed login attempt limiting 
● Password strength requirements 
● 2FA support (optional) 

**QA Tasks**

Testing 
● Unit tests (services) 
● Integration tests (APIs) 
● E2E tests (critical flows) 
● Load testing 
● Security testing (OWASP Top 10) 

Performance 
● Database query optimization 
● Index creation 
● Response caching 
● CDN for static assets (S3) 
● Compression middleware 

**Deployment**

Infrastructure 
● Docker containerization 
● CI/CD pipeline (GitHub Actions) 
● Environment management (dev/staging/prod) 
● Database migrations 
● Backup strategy 
● Monitoring & logging 
● Health check endpoints 
● Error tracking (Sentry) 

**Deliverables**
● Production-ready API 
● Security audit report 
● Deployment documentation 
● API documentation (Swagger) 
● Monitoring dashboard 

---

## BACKEND TECH STACK

| Component | Technology |
|-----------|-----------|
| **Framework** | NestJS 11 |
| **Language** | TypeScript 5.9 |
| **Database** | PostgreSQL 15+ |
| **ORM** | TypeORM |
| **Authentication** | JWT + Refresh Tokens |
| **Storage** | AWS S3 / MinIO |
| **Payments** | Stripe |
| **Email** | Nodemailer / SendGrid |
| **Caching** | Redis (optional) |
| **Queue** | Bull/BullMQ (optional) |
| **Testing** | Jest |
| **API Docs** | Swagger/OpenAPI |
| **Logging** | Winston / NestJS Logger |
| **Monitoring** | Prometheus + Grafana |
| **Deployment** | Docker + PM2 |

---

## API ENDPOINTS SUMMARY

### Authentication
- POST /auth/register
- POST /auth/login
- POST /auth/refresh
- POST /auth/logout
- POST /auth/forgot-password
- POST /auth/reset-password

### Users
- GET /users/me
- PATCH /users/me
- GET /users/me/export (GDPR)
- DELETE /users/me/account (GDPR)

### Service Requests
- POST /service-requests
- GET /service-requests
- GET /service-requests/:id
- PATCH /service-requests/:id
- POST /service-requests/:id/submit

### Documents
- POST /documents
- GET /documents
- GET /documents/:id
- DELETE /documents/:id
- GET /documents/:id/download

### Appointments
- POST /appointments
- GET /appointments
- PATCH /appointments/:id/reschedule
- DELETE /appointments/:id/cancel
- GET /appointments/availability

### Courses
- GET /courses
- GET /courses/:id
- POST /courses/:id/enroll
- DELETE /courses/:id/unenroll

### Subscriptions
- GET /subscriptions/me
- POST /subscriptions/checkout
- POST /subscriptions/cancel
- GET /subscription-plans

### Payments
- GET /invoices
- POST /webhooks/stripe

### Admin
- GET /admin/dashboard/stats
- GET /admin/service-requests
- GET /admin/users
- GET /admin/reports/*
- GET /admin/audit-logs

### Notifications
- GET /notifications
- PATCH /notifications/:id/read
- GET /notifications/unread-count

### CMS
- GET /cms/pages
- GET /cms/faqs
- GET /cms/news

---

**Total Estimated Backend APIs**: 50+ endpoints