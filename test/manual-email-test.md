# 📧 Email Notification System - Manual Testing Guide

## Prerequisites

### 1. Environment Variables (.env)
```env
# SMTP Configuration
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
EMAIL_FROM_NAME=PK SERVIZI
EMAIL_FROM_ADDRESS=noreply@pkservizi.com

# Application URLs
FRONTEND_URL=http://localhost:3001
BACKEND_URL=http://localhost:3000
ADMIN_EMAIL=admin@pkservizi.com

# Feature Flags
NOTIFICATION_ENABLED=true
```

### 2. Gmail App Password Setup
1. Go to Google Account → Security
2. Enable 2-Factor Authentication
3. Generate App Password for "Mail"
4. Use this password in `SMTP_PASS`

### 3. Database Setup
```bash
npm run migration:run
npm run seed
```

---

## 🧪 Manual Test Scenarios

### TEST 1: Authentication Flows ✅

#### 1.1 Registration Welcome Email
```bash
POST http://localhost:3000/api/v1/auth/register
Content-Type: application/json

{
  "email": "testuser@test.com",
  "password": "Test@12345",
  "fullName": "Test User",
  "phone": "+393331234567",
  "roleId": "00000000-0000-0000-0000-000000000003"
}
```

**Expected Results:**
- ✅ Email sent to testuser@test.com with welcome message
- ✅ Subject: "🎉 Benvenuto su PK SERVIZI"
- ✅ Database check:
```sql
SELECT * FROM notifications WHERE "userId" = (SELECT id FROM users WHERE email = 'testuser@test.com') ORDER BY "createdAt" DESC LIMIT 1;
-- Should show: title='🎉 Benvenuto', type='info'
```

#### 1.2 Password Reset Email
```bash
POST http://localhost:3000/api/v1/auth/forgot-password
Content-Type: application/json

{
  "email": "testuser@test.com"
}
```

**Expected Results:**
- ✅ Email with reset link
- ✅ Subject: "🔑 Reset Password - PK SERVIZI"
- ✅ Database notification saved

#### 1.3 Password Reset Confirmation
```bash
POST http://localhost:3000/api/v1/auth/reset-password
Content-Type: application/json

{
  "token": "RESET_TOKEN_FROM_EMAIL",
  "newPassword": "NewPass@123"
}
```

**Expected Results:**
- ✅ Confirmation email sent
- ✅ Subject: "✅ Password Modificata con Successo"

---

### TEST 2: Service Request Flows ✅

#### 2.1 Submit Service Request
```bash
# First, create a draft
POST http://localhost:3000/api/v1/service-requests
Authorization: Bearer {{customerToken}}
Content-Type: application/json

{
  "serviceTypeId": "ISEE_SERVICE_TYPE_ID",
  "title": "ISEE Application",
  "description": "Need help with ISEE"
}

# Then submit it
POST http://localhost:3000/api/v1/service-requests/{{requestId}}/submit
Authorization: Bearer {{customerToken}}

{
  "notes": "All documents ready"
}
```

**Expected Results:**
- ✅ Customer email: "🎉 Richiesta Inviata con Successo"
- ✅ Admin email: "🔔 Nuova Richiesta di Servizio"
- ✅ Database check:
```sql
SELECT * FROM notifications WHERE "userId" = (SELECT id FROM users WHERE email = 'testuser@test.com') AND title LIKE '%Richiesta Inviata%';
```

#### 2.2 Admin Updates Status
```bash
PATCH http://localhost:3000/api/v1/admin/service-requests/{{requestId}}/status
Authorization: Bearer {{adminToken}}

{
  "status": "in_review",
  "reason": "Request is being reviewed"
}
```

**Expected Results:**
- ✅ Customer email: "🔔 Aggiornamento Stato Richiesta"
- ✅ Email includes new status and reason

---

### TEST 3: Document Management ✅

#### 3.1 Upload Document (triggers admin email if missing_documents)
```bash
POST http://localhost:3000/api/v1/documents/upload-multiple
Authorization: Bearer {{customerToken}}
Content-Type: multipart/form-data

serviceRequestId: {{requestId}}
identityDocument: [FILE]
```

**Expected Results:**
- ✅ If request status is "missing_documents", admin receives notification

#### 3.2 Admin Approves Document
```bash
PATCH http://localhost:3000/api/v1/admin/documents/{{documentId}}/approve
Authorization: Bearer {{adminToken}}

{
  "notes": "Document approved"
}
```

**Expected Results:**
- ✅ Customer email: "✅ Documento Approvato"
- ✅ Database notification: type='success'

#### 3.3 Admin Rejects Document
```bash
PATCH http://localhost:3000/api/v1/admin/documents/{{documentId}}/reject
Authorization: Bearer {{adminToken}}

{
  "reason": "Document quality is poor, please reupload"
}
```

**Expected Results:**
- ✅ Customer email: "❌ Documento Rifiutato"
- ✅ Email includes rejection reason
- ✅ Database notification: type='error'

---

### TEST 4: Appointment Management ✅

#### 4.1 Book Appointment
```bash
POST http://localhost:3000/api/v1/appointments
Authorization: Bearer {{customerToken}}

{
  "title": "ISEE Consultation",
  "description": "Discuss application",
  "appointmentDate": "2026-01-25T10:00:00Z",
  "durationMinutes": 60,
  "location": "Office"
}
```

**Expected Results:**
- ✅ Customer email: "📅 Appuntamento Prenotato"
- ✅ Operator email: "🔔 Nuovo Appuntamento"
- ✅ Both emails show date, time, location

#### 4.2 Reschedule Appointment
```bash
PATCH http://localhost:3000/api/v1/appointments/{{appointmentId}}/reschedule
Authorization: Bearer {{customerToken}}

{
  "newDateTime": "2026-01-26T14:00:00Z",
  "reason": "Time conflict"
}
```

**Expected Results:**
- ✅ Customer email: "🔄 Appuntamento Riprogrammato"
- ✅ Shows old and new dates

#### 4.3 Cancel Appointment
```bash
PATCH http://localhost:3000/api/v1/appointments/{{appointmentId}}/cancel
Authorization: Bearer {{customerToken}}

{
  "reason": "No longer needed"
}
```

**Expected Results:**
- ✅ Customer email: "❌ Appuntamento Annullato"
- ✅ Operator email notification

---

### TEST 5: Course Enrollments ✅

#### 5.1 Enroll in Course
```bash
POST http://localhost:3000/api/v1/courses/{{courseId}}/enroll
Authorization: Bearer {{customerToken}}
```

**Expected Results:**
- ✅ Customer email: "🎓 Iscrizione al Corso"
- ✅ Database notification saved

#### 5.2 Unenroll from Course
```bash
DELETE http://localhost:3000/api/v1/courses/{{courseId}}/unenroll
Authorization: Bearer {{customerToken}}
```

**Expected Results:**
- ✅ Customer email: "❌ Disiscrizione dal Corso"

---

### TEST 6: Payments & Subscriptions (Webhook Simulation) ✅

#### 6.1 Subscription Activated (Checkout Completed)
```bash
POST http://localhost:3000/api/v1/webhooks/stripe
Content-Type: application/json
Stripe-Signature: {{webhookSignature}}

{
  "type": "checkout.session.completed",
  "data": {
    "object": {
      "id": "cs_test_123",
      "metadata": {
        "userId": "{{testUserId}}"
      },
      "subscription": "sub_123",
      "amount_total": 9900,
      "currency": "eur"
    }
  }
}
```

**Expected Results:**
- ✅ Customer email: "✅ Abbonamento Attivato"
- ✅ Shows plan name and end date

#### 6.2 Payment Succeeded
```bash
# Webhook event: payment_intent.succeeded
```

**Expected Results:**
- ✅ Customer email: "💰 Pagamento Ricevuto con Successo"

#### 6.3 Payment Failed
```bash
# Webhook event: payment_intent.failed
```

**Expected Results:**
- ✅ Customer email: "❌ Pagamento Fallito"
- ✅ Admin email: "⚠️ Pagamento Fallito - Azione Richiesta"

#### 6.4 Subscription Cancelled
```bash
# Webhook event: customer.subscription.deleted
```

**Expected Results:**
- ✅ Customer email: "❌ Abbonamento Cancellato"
- ✅ Admin email: "🔔 Abbonamento Cancellato"

---

### TEST 7: User Management (Admin Actions) ✅

#### 7.1 Admin Creates User
```bash
POST http://localhost:3000/api/v1/admin/users
Authorization: Bearer {{adminToken}}

{
  "email": "newuser@test.com",
  "password": "TempPass@123",
  "fullName": "New User",
  "phone": "+393339876543",
  "roleId": "00000000-0000-0000-0000-000000000003"
}
```

**Expected Results:**
- ✅ User email: "🔐 Account Creato - PK SERVIZI"
- ✅ Email includes temporary credentials
- ✅ Database notification for new user

#### 7.2 Admin Suspends User
```bash
PATCH http://localhost:3000/api/v1/admin/users/{{userId}}/deactivate
Authorization: Bearer {{adminToken}}
```

**Expected Results:**
- ✅ User email: "⚠️ Account Sospeso"
- ✅ Database notification: type='warning'

---

### TEST 8: GDPR & Data Export ✅

#### 8.1 Request Data Export
```bash
POST http://localhost:3000/api/v1/users/gdpr/export-request
Authorization: Bearer {{customerToken}}
```

**Expected Results:**
- ✅ Customer email: "📋 Richiesta Esportazione Dati Ricevuta"
- ✅ Database notification saved

#### 8.2 Export Ready (Manual Trigger)
```typescript
// In users.service.ts or GDPR service
await this.emailService.sendGdprExportReady(
  user.email,
  user.fullName,
  'https://pkservizi.com/downloads/export-123.zip'
);
```

**Expected Results:**
- ✅ Customer email: "✅ I Tuoi Dati Sono Pronti"
- ✅ Download link included

---

## 📊 Database Verification Queries

### Check All Notifications for a User
```sql
SELECT 
  id,
  title,
  message,
  type,
  "isRead",
  "createdAt"
FROM notifications 
WHERE "userId" = 'USER_ID_HERE'
ORDER BY "createdAt" DESC;
```

### Count Notifications by Type
```sql
SELECT 
  type,
  COUNT(*) as count
FROM notifications 
WHERE "userId" = 'USER_ID_HERE'
GROUP BY type;
```

### Check Recent Email Notifications
```sql
SELECT 
  u.email,
  u."fullName",
  n.title,
  n.message,
  n.type,
  n."createdAt"
FROM notifications n
JOIN users u ON n."userId" = u.id
WHERE n."createdAt" >= NOW() - INTERVAL '1 day'
ORDER BY n."createdAt" DESC
LIMIT 20;
```

### Verify Notification Structure
```sql
SELECT 
  column_name,
  data_type,
  is_nullable
FROM information_schema.columns
WHERE table_name = 'notifications'
ORDER BY ordinal_position;
```

---

## ✅ Checklist: Universal Template Verification

### Email Template Features
- [ ] ✅ Single HTML template used for all emails
- [ ] ✅ Gradient header (#2563eb to #1d4ed8)
- [ ] ✅ Responsive design (mobile + desktop)
- [ ] ✅ Italian language throughout
- [ ] ✅ Professional typography and spacing
- [ ] ✅ Action buttons with hover effects
- [ ] ✅ Details section for structured data
- [ ] ✅ Footer with company info

### Email Content Changes Only
- [ ] ✅ Title changes per email type
- [ ] ✅ Message changes per email type
- [ ] ✅ Details (optional) change per type
- [ ] ✅ Action URL (optional) changes per type
- [ ] ✅ Action button text (optional) changes

### Database Persistence
- [ ] ✅ All emails trigger notification save
- [ ] ✅ Real user data used (email, fullName)
- [ ] ✅ Correct notification type (info/success/warning/error)
- [ ] ✅ Action URLs saved for dashboard links

---

## 🎯 Success Criteria

### ✅ System is Working Correctly When:

1. **Emails Sent**
   - All 40+ email types send successfully
   - Correct recipients (customer/admin)
   - Subject lines in Italian
   - Professional HTML rendering

2. **Database Persistence**
   - Every email creates notification record
   - Notifications have correct userId
   - All required fields populated
   - Timestamps accurate

3. **Real User Data**
   - Emails personalized with user's fullName
   - Sent to user's actual email address
   - User-specific data in message content

4. **Single Template**
   - Same HTML structure for all emails
   - Only title, message, details, and actions change
   - Consistent branding and styling

5. **Error Handling**
   - Email failures don't break core operations
   - Errors logged for monitoring
   - User experience unaffected by email issues

---

## 🐛 Troubleshooting

### Issue: Emails Not Sending

**Check:**
1. SMTP credentials in .env
2. Gmail App Password (not regular password)
3. Less secure app access enabled
4. Firewall not blocking port 587

```bash
# Test SMTP connection
npm run test:smtp
```

### Issue: Notifications Not Saved

**Check:**
1. Database connection
2. Migrations run
3. NotificationsService injected

```sql
-- Verify table exists
SELECT * FROM information_schema.tables WHERE table_name = 'notifications';
```

### Issue: Wrong Email Content

**Check:**
1. Method signature matches call
2. Parameters in correct order
3. User data fetched before email send

---

## 📝 Test Execution Log

Use this checklist during testing:

```
Date: _____________
Tester: ___________

[ ] Authentication (3 tests)
[ ] Service Requests (2 tests)
[ ] Documents (3 tests)
[ ] Appointments (3 tests)
[ ] Courses (2 tests)
[ ] Payments/Subscriptions (4 tests)
[ ] User Management (2 tests)
[ ] GDPR (1 test)
[ ] Database Verification (4 queries)

Total Tests: 24
Passed: ____
Failed: ____
Notes: _____________________________________________
```

---

## 🚀 Production Deployment Checklist

Before deploying to production:

- [ ] Update SMTP credentials to production email service
- [ ] Set FRONTEND_URL to production domain
- [ ] Set ADMIN_EMAIL to real admin address
- [ ] Test with production database
- [ ] Monitor email delivery rates
- [ ] Set up email bounce handling
- [ ] Configure email rate limiting
- [ ] Add email templates to version control
- [ ] Document email sending limits
- [ ] Set up email analytics/tracking

---

**🎉 Happy Testing! All 40+ email notifications ready for production!**
