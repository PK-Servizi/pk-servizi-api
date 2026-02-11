# Service Request Workflow - Conditional Payment Steps

## Overview

The service request workflow now dynamically adjusts based on service pricing:
- **Paid Services (basePrice > 0)**: User completes 3 steps (Payment → Questionnaire → Documents)
- **Free Services (basePrice = 0)**: User completes 2 steps, skipping payment (Questionnaire → Documents)

## Workflow Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                   User Initiates Service Request                │
│                        (POST /initiate)                          │
└────────────────────────────────┬────────────────────────────────┘
                                 │
                    ┌────────────┴─────────────┐
                    │                          │
         ┌──────────▼─────────┐      ┌────────▼──────────┐
         │  PAID SERVICE      │      │  FREE SERVICE     │
         │  (basePrice > 0)   │      │  (basePrice = 0)  │
         │                    │      │                   │
         └────────────────────┘      └───────────────────┘
                    │                          │
         ┌──────────▼─────────┐               │
         │  STEP 1: PAYMENT   │               │
         │  Status:           │               │
         │  payment_pending   │               │
         │  ↓                 │               │
         │  [Stripe Checkout] │               │
         └────────────────────┘               │
                    │                         │
         ┌──────────▼──────────────────────────▼─────┐
         │  STEP 2: QUESTIONNAIRE                    │
         │  Status: awaiting_form                    │
         │  (PATCH /:id/questionnaire)               │
         │  ↓                                         │
         │  [Form Submission with formData]          │
         └────────────────────────────────────────┬──┘
                    │                             │
         ┌──────────▼─────────────────────────────▼──┐
         │  STEP 3: DOCUMENTS UPLOAD                 │
         │  Status: awaiting_documents               │
         │  (POST /:id/documents)                    │
         │  ↓                                        │
         │  [Upload Required Files]                 │
         │  ↓                                        │
         │  Status: submitted                       │
         └──────────────────────────────────────────┘
                    │
         ┌──────────▼──────────────────┐
         │  Operator Review            │
         │  Status: in_review          │
         └─────────────────────────────┘
```

## API Endpoints

### Step 1: Initiate Service Request

**Endpoint:** `POST /api/v1/service-requests/initiate`

**Request Body:**
```json
{
  "serviceId": "ISEE_ORD_2026"
}
```

**Response for PAID SERVICE (€34.99):**
```json
{
  "success": true,
  "message": "Service request initiated. Please complete payment.",
  "data": {
    "serviceRequestId": "uuid-xxx",
    "paymentId": "uuid-yyy",
    "amount": 34.99,
    "currency": "EUR",
    "status": "payment_pending",
    "checkoutSessionId": "cs_xxx",
    "paymentUrl": "https://checkout.stripe.com/..."
  }
}
```

**Response for FREE SERVICE (€0.00):**
```json
{
  "success": true,
  "message": "Service request created successfully. Please complete the questionnaire.",
  "data": {
    "serviceRequestId": "uuid-xxx",
    "serviceName": "ISEE Ordinario 2026",
    "basePrice": 0,
    "isFreeService": true,
    "status": "awaiting_form",
    "nextStep": "Fill out the questionnaire",
    "formSchema": {...}
  }
}
```

**Status Logic:**
- **Paid Services**: `status = "payment_pending"` → User must complete Stripe payment
- **Free Services**: `status = "awaiting_form"` → User can immediately proceed to Step 2

---

### Step 2: Submit Questionnaire

**Endpoint:** `PATCH /api/v1/service-requests/{id}/questionnaire`

**Request Body:**
```json
{
  "formData": {
    "familyMembers": 4,
    "hasDisabledMembers": false,
    "income": 45000,
    "residenceProvince": "Milano",
    "propertyValue": 250000
  }
}
```

**Validation:**
- **Paid Services**: Validates that `payment.status === "completed"`
- **Free Services**: Skips payment validation
- Both paths require `status === "awaiting_form"`

**Response:**
```json
{
  "success": true,
  "message": "Questionnaire submitted successfully",
  "data": {
    "serviceRequestId": "uuid-xxx",
    "status": "awaiting_documents",
    "requiredDocuments": [
      {
        "fieldName": "identityDocument",
        "label": "Identity Document",
        "description": "ID card, driver's license, or passport",
        "required": true
      },
      ...
    ]
  }
}
```

---

### Step 3: Upload Documents

**Endpoint:** `POST /api/v1/service-requests/{id}/documents`

**Multipart Form Data:**
```
identityDocument: [file]
fiscalCode: [file]
bankStatement: [file]
propertyDocument: [file]
```

**Response:**
```json
{
  "success": true,
  "message": "Documents uploaded successfully",
  "data": {
    "serviceRequestId": "uuid-xxx",
    "status": "submitted",
    "uploadedDocuments": [
      {
        "fieldName": "identityDocument",
        "fileName": "passport.pdf",
        "size": 245600,
        "url": "s3://bucket/documents/..."
      },
      ...
    ]
  }
}
```

---

## Service Status Flow

### Paid Services
```
draft
  ↓
payment_pending (Step 1: Payment)
  ↓ [Payment Success]
awaiting_form (Step 2: Questionnaire)
  ↓
awaiting_documents (Step 3: Documents)
  ↓
submitted (Operator Review)
  ↓
in_review (Operator Working)
  ↓
completed (or missing_documents/rejected)
  ↓
closed
```

### Free Services
```
draft
  ↓
awaiting_form (Step 1: Initiate → Skip Payment)
  ↓
awaiting_documents (Step 2: Questionnaire)
  ↓
submitted (Step 3: Documents)
  ↓
in_review (Operator Review)
  ↓
completed (or missing_documents/rejected)
  ↓
closed
```

---

## Database Changes

### Status History Recording

Each step transition is automatically recorded in `request_status_history`:

**For Free Services (Step 1):**
```
fromStatus: "draft"
toStatus: "awaiting_form"
notes: "Free service - skipped payment step"
```

**For Questionnaire Submission (Step 2):**
```
fromStatus: "awaiting_form"
toStatus: "awaiting_documents"
notes: "Questionnaire submitted"
```

---

## Notifications Sent

### Free Service Initiation:
- **Title**: ✅ Service Request Created
- **Message**: Your request for [Service Name] is ready. Please fill out the questionnaire to continue.
- **Action**: Go to questionnaire form

### Paid Service Payment Pending:
- **Title**: 💳 Payment Required
- **Message**: Please complete payment of €[Amount] for [Service Name]
- **Action**: Go to payment page

### Payment Completed:
- **Title**: ✅ Payment Confirmed
- **Message**: Payment successful! Please fill out the questionnaire for [Service Name]
- **Action**: Go to questionnaire form

---

## Implementation Details

### Free Service Detection

```typescript
const isFreeService = !service.basePrice || service.basePrice <= 0;
```

### Conditional Validation in Questionnaire

```typescript
const isPaidService = serviceRequest.service && 
                      serviceRequest.service.basePrice > 0;

if (isPaidService) {
  // Validate payment completed
  if (!serviceRequest.payment || serviceRequest.payment.status !== 'completed') {
    throw new BadRequestException('Payment must be completed');
  }
}
// For free services: no payment validation
```

---

## Frontend Integration

### Step-Based Navigation

**For Paid Services:**
```javascript
// Step 1: Show payment button
POST /service-requests/initiate
// Redirect to Stripe checkout

// Payment callback → Step 2
// Step 2: Show questionnaire form
PATCH /service-requests/{id}/questionnaire

// Step 3: Show document uploader
POST /service-requests/{id}/documents
```

**For Free Services:**
```javascript
// Step 1: Immediate to Step 2 (no payment)
POST /service-requests/initiate
// Response: status = "awaiting_form" + formSchema

// Step 2 URL directly available
PATCH /service-requests/{id}/questionnaire

// Step 3: Show document uploader
POST /service-requests/{id}/documents
```

---

## Examples

### Example: Free ISEE Service (€0)

**1. Initiate (skips payment):**
```bash
POST /api/v1/service-requests/initiate
{
  "serviceId": "ISEE_COR_2026"
}

Response: status = "awaiting_form"
```

**2. Submit Questionnaire:**
```bash
PATCH /api/v1/service-requests/abc123/questionnaire
{
  "formData": {
    "familySize": 3,
    "income": 30000
  }
}
```

**3. Upload Documents:**
```bash
POST /api/v1/service-requests/abc123/documents
[Multipart: identity + tax code files]
```

### Example: Paid 730 Service (€34.99)

**1. Initiate (requires payment):**
```bash
POST /api/v1/service-requests/initiate
{
  "serviceId": "730_2026"
}

Response: status = "payment_pending" + checkoutSessionId
```

**2. [User completes Stripe payment]**

**3. Submit Questionnaire:**
```bash
PATCH /api/v1/service-requests/xyz789/questionnaire
{
  "formData": {
    "workIncome": 45000,
    "capitalGains": 2000
  }
}
```

**4. Upload Documents:**
```bash
POST /api/v1/service-requests/xyz789/documents
[Multipart: identity + CUD + bank statements]
```

---

## Configuration

All free services (basePrice = 0) automatically skip the payment step:
- ISEE Corrente (€0.00)
- Disoccupazione NASPI (€0.00)
- Pensione Indiretta (€0.00)
- And any other service with basePrice = 0

No additional configuration needed - the logic automatically detects and handles free services.

---

## Testing Checklist

- [ ] Free service: Step 1 returns `isFreeService: true` and `status: "awaiting_form"`
- [ ] Free service: Can immediately call Step 2 without payment
- [ ] Paid service: Step 1 returns Stripe checkout URL
- [ ] Paid service: Step 2 fails if payment not completed
- [ ] Paid service: Step 2 succeeds after payment webhook
- [ ] Status history correctly records all transitions
- [ ] Notifications sent at appropriate times
- [ ] Database state transitions are correct for both paths
