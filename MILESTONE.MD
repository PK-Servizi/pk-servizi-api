�
�
PK SERVIZI 
Mobile App + Admin Portal + Backend 
�
�
OVERALL SYSTEM OVERVIEW 
Platforms 
● Mobile App (Flutter) – Client-facing app 
● Admin Portal (React) – Internal operations panel 
● Backend API (NestJS) – Central business logic & data layer 
Core Services 
● ISEE 
● Modello 730 / PF 
● IMU 
Core Modules 
● Authentication & Roles 
● Service Requests 
● Document Management 
● Appointments 
● Courses 
● Payments & Subscriptions 
● Notifications 
● Admin Operations & Reporting 
�
�
MILESTONE 1 — System Architecture & Foundation 
Objectives 
● Establish scalable architecture 
● Finalize roles, permissions, and data model 
● Prepare development environments 
Tasks 
Architecture & Setup 
● Monorepo or separated repos (Flutter / React / NestJS) 
● Environment setup (dev / staging / prod) 
● Configuration management 
● CI/CD baseline 
Backend (NestJS) 
● Project scaffolding 
● Modular architecture: 
o Auth 
o Users 
o Services 
o Requests 
o Documents 
o Payments 
o Subscriptions 
o Appointments 
o Courses 
o CMS-lite (FAQs, News) 
● PostgreSQL database + migrations 
● Global exception handling 
● Request validation & sanitization 
Security & Roles 
● JWT authentication + refresh tokens 
● Role-based access control (RBAC): 
o Customer 
o Admin 
o Operator / CAF Consultant 
o Finance (optional) 
● Audit logs for sensitive actions 
● GDPR consent tracking 
Deliverables 
● Technical architecture diagram 
● Database schema 
● Auth & RBAC implementation 
● Base API ready 
�
�
MILESTONE 2 — Authentication, Profiles & Core 
Navigation (App + Admin) 
Objectives 
● Allow secure access for users and staff 
● Establish base UI navigation 
Mobile App (Flutter) 
Features 
● Signup / Login / Forgot password 
● Profile management: 
o Personal info 
o Fiscal code 
o Address / residence 
● GDPR consent & privacy acknowledgment 
● App navigation (Dashboard / Services / Appointments / Profile) 
● Notification center (infrastructure-ready) 
Admin Portal (React) 
Features 
● Secure admin login 
● Role-based UI rendering 
● Admin profile & session management 
Backend 
● Auth APIs 
● User profile APIs 
● Token refresh & revocation 
Deliverables 
● Working login flows (App + Admin) 
● Secure profile management 
● Session handling 
�
�
MILESTONE 3 — Service Request Engine (ISEE, 
730/PF, IMU) 
Objectives 
● Digitize CAF service workflows 
● Handle complex document-heavy requests 
Common Features (All Services) 
● Create new service request 
● Save as draft 
● Submit for processing 
● Status lifecycle: 
o Draft 
o Submitted 
o In Review 
o Missing Documents 
o Completed 
o Closed / Rejected 
● Internal notes (Admin/Operator) 
● User-visible notes/messages 
● Full request history 
�
�
ISEE Module 
Request Data 
● Nucleo familiare 
● Abitazione 
● Redditi (2 anni precedenti) 
● Patrimonio mobiliare 
● Veicoli 
● Disabilità 
● Università 
● Minori / genitori non conviventi 
Document Handling 
● Structured upload categories 
● Mandatory/optional document enforcement 
● Missing-document prompts 
�
�
Modello 730 / PF Module 
Request Data 
● Dati anagrafici 
● Redditi (CU, INPS, altri) 
● Immobili 
● Altri redditi 
● Spese sanitarie 
● Spese istruzione 
● Mutui & bonus casa 
● Famiglia 
● Assicurazioni & previdenza 
�
�
IMU Module 
Request Data 
● Dati contribuente 
● Immobili (multi-property support) 
● Utilizzo immobile 
● Agevolazioni 
● Variazioni 
● Pagamenti IMU 
● Successione (se applicabile) 
Deliverables 
● Fully functional service request workflows 
● Secure document upload per service 
● Status-driven processing logic 
�
�
MILESTONE 4 — Document Management System 
Objectives 
● Secure handling of sensitive financial documents 
Features 
User App 
● Upload documents (camera/file) 
● Replace or remove documents 
● Document status visibility (approved/rejected) 
● Version tracking 
Admin Portal 
● Document preview/download 
● Approve / reject documents 
● Leave internal notes 
● Request re-upload 
Backend 
● Secure storage (S3-compatible) 
● Signed URLs 
● Access control by role & request 
Deliverables 
● Compliant document vault 
● Admin verification workflow 
�
�
MILESTONE 5 — Appointments & Courses 
Objectives 
● Enable scheduling and training management 
Appointments 
Features 
● User appointment booking 
● Service-based appointment types 
● Calendar availability 
● Confirmation / reschedule / cancel 
● Email/app notifications 
Admin 
● Slot management 
● Calendar view 
● Operator assignment 
Courses 
Features 
● Course listing 
● Course details 
● Enrollment via app 
● Enrollment tracking 
Admin 
● Course CRUD 
● Enrollment management 
Deliverables 
● Appointment booking system 
● Course publishing & enrollment system 
�
�
MILESTONE 6 — Payments & Subscriptions 
(CRITICAL) 
Objectives 
● Monetize services 
● Control access via subscription status 
Subscription Features 
Plans 
● Monthly / Annual plans 
● Plan entitlements: 
o Enabled services 
o Usage limits (optional) 
o Priority handling (optional) 
User App 
● Subscription selection 
● Secure checkout 
● View subscription status 
● Upgrade / downgrade / cancel 
● Payment history 
Backend 
● Payment gateway integration (Stripe) 
● Webhook handling: 
o Payment success/failure 
o Renewal 
o Cancellation 
● Service gating: 
o Prevent submission without active plan 
● Invoice / receipt storage (optional) 
Admin Portal 
● View subscriptions 
● View payments 
● Refund / override controls 
● Manual plan assignment (optional) 
Deliverables 
● End-to-end billing system 
● Subscription enforcement logic 
�
�
MILESTONE 7 — Admin Operations & Reporting 
Objectives 
● Full operational control for PK SERVIZI staff 
Features 
Admin Dashboard 
● Pending requests 
● Active subscriptions 
● Upcoming appointments 
● Workload overview 
Request Management 
● Filters by service/status/date 
● Assign operator 
● Change status 
● Request additional documents 
User Management 
● View users 
● View family members 
● Account status control 
Reporting 
● Requests per service 
● Processing time 
● Subscription metrics 
Deliverables 
● Operational admin panel 
● Management-ready reports 
�
�
MILESTONE 8 — Security, QA & Deployment 
Objectives 
● Prepare system for production 
Tasks 
● Security hardening 
● GDPR compliance review 
● Rate limiting 
● Penetration testing (basic) 
● End-to-end testing (App + Admin) 
● Deployment & monitoring 
● Backup & recovery strategy 
Deliverables 
● Production-ready system 
● Deployment documentation 
● Admin & operator onboarding guide 
✅
FINAL SYSTEM STACK 
Layer 
Mobile App 
Admin Portal 
Backend 
Database 
Technology 
Flutter 
React 
NestJS 
PostgreSQL 
Storage 
Auth 
Payments 
S3-compatible 
JWT 
Stripe