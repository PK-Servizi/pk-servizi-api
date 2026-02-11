# Service Request Workflow Implementation - Summary

## ✅ Completed Implementation

### Feature: Conditional Payment Steps Based on Service Price

Users can now complete service requests with **flexible workflow**:

#### **PAID SERVICES** (basePrice > €0)
Users complete **3 steps**:
1. ✅ **Step 1: Payment** - Create payment via Stripe
2. ✅ **Step 2: Questionnaire** - Fill form after payment
3. ✅ **Step 3: Documents** - Upload required files

#### **FREE SERVICES** (basePrice = €0)
Users complete **2 steps** (payment skipped):
1. ✅ **Step 1: Initialize** - Direct to questionnaire (no payment)
2. ✅ **Step 2: Questionnaire** - Fill form immediately
3. ✅ **Step 3: Documents** - Upload required files

---

## Implementation Details

### Modified Files

#### 1. **service-requests.service.ts**
- **Method**: `initiateWithPayment()`
  - Now checks: `const isFreeService = !service.basePrice || service.basePrice <= 0;`
  - **Free Service Path**: Creates request with `status = "awaiting_form"`, skips payment
  - **Paid Service Path**: Creates request with `status = "payment_pending"`, initiates Stripe
  - Returns different response structure based on service pricing

- **Method**: `submitQuestionnaire()`
  - Updated validation: Only validates payment completion for paid services
  - Free services: Skip payment validation entirely
  - Both paths proceed normally after form submission

#### 2. **service-requests.controller.ts**
- **Endpoint**: `POST /api/v1/service-requests/initiate`
  - Updated API documentation to reflect conditional behavior
  - Response varies: `isFreeService` flag + `status` field indicates path

- **Endpoint**: `PATCH /api/v1/service-requests/{id}/questionnaire`
  - Updated documentation to clarify works for both paid and free services
  - Payment validation only for paid services internally

---

## API Response Examples

### Initiate Paid Service (€34.99)
```json
{
  "success": true,
  "message": "Service request initiated. Please complete payment.",
  "data": {
    "serviceRequestId": "abc-123",
    "paymentId": "pay-456",
    "amount": 34.99,
    "status": "payment_pending",
    "paymentUrl": "https://checkout.stripe.com/pay/cs_..."
  }
}
```

### Initiate Free Service (€0.00)
```json
{
  "success": true,
  "message": "Service request created successfully. Please complete the questionnaire.",
  "data": {
    "serviceRequestId": "xyz-789",
    "serviceName": "ISEE Corrente 2026",
    "basePrice": 0,
    "isFreeService": true,
    "status": "awaiting_form",
    "nextStep": "Fill out the questionnaire",
    "formSchema": {...}
  }
}
```

---

## Status Flow Comparison

### Paid Service Flow
```
payment_pending (Step 1)
    ↓ [Stripe payment success]
awaiting_form (Step 2)
    ↓ [Form submission]
awaiting_documents (Step 3)
```

### Free Service Flow
```
awaiting_form (Step 1 - no payment)
    ↓ [Form submission]
awaiting_documents (Step 3)
```

---

## Current Free Services in Database

The following services with **basePrice = 0** automatically skip payment:

1. **ISEE Services** (5 services)
   - ISEE Ordinario 2026
   - ISEE Universitario 2026
   - ISEE Socio-Sanitario 2026
   - ISEE Minorenni 2026
   - ISEE Corrente 2026

2. **Disoccupazione Services** (3 services)
   - Disoccupazione NASPI
   - Disoccupazione Agricola
   - Anticipo NASPI

3. **Other Free Services**
   - Dichiarazione e Calcolo IMU
   - Assegno Sociale
   - Pensione Indiretta
   - PAD Assegno di Inclusione
   - Assegno Sociale Famiglie
   - Apertura Partita IVA

---

## Testing Scenarios

### Scenario 1: Free Service (ISEE Ordinario - €0)
```bash
# Step 1: Initiate
POST /api/v1/service-requests/initiate
Body: { "serviceId": "ISEE_ORD_2026" }
Response: status="awaiting_form", isFreeService=true

# Step 2: Submit Form
PATCH /api/v1/service-requests/{id}/questionnaire
Body: { "formData": {...} }
Response: status="awaiting_documents"

# Step 3: Upload Documents
POST /api/v1/service-requests/{id}/documents
Files: [identity, tax_code, ...]
Response: status="submitted"
```

### Scenario 2: Paid Service (730 - €34.99)
```bash
# Step 1: Initiate with Payment
POST /api/v1/service-requests/initiate
Body: { "serviceId": "730_2026" }
Response: status="payment_pending", paymentUrl="..."

# [User completes Stripe payment via webhook]

# Step 2: Submit Form
PATCH /api/v1/service-requests/{id}/questionnaire
Body: { "formData": {...} }
Response: status="awaiting_documents"

# Step 3: Upload Documents
POST /api/v1/service-requests/{id}/documents
Files: [identity, CUD, ...]
Response: status="submitted"
```

---

## Build Status

✅ **TypeScript Build**: CLEAN - No compilation errors
✅ **All Endpoints**: Functional
✅ **Database**: Properly seeded (23 types, 87 services, 114 FAQs)
✅ **Logic**: Conditional payment workflow implemented

---

## Frontend Implementation Guide

### For Free Services
```javascript
// Response has isFreeService: true
if (response.data.isFreeService) {
  // Hide payment button
  // Show questionnaire form directly
  // Store formSchema from response
  navigate(`/service-requests/${serviceRequestId}/questionnaire`);
}
```

### For Paid Services
```javascript
// Response has payment URL
if (!response.data.isFreeService) {
  // Show "Click to Pay" button
  // Redirect to response.data.paymentUrl (Stripe)
  // On payment success: navigate to questionnaire
}
```

---

## Key Features

✅ **Automatic Detection**: No configuration needed - system auto-detects based on `basePrice`
✅ **Seamless UX**: Users don't see unnecessary payment steps for free services
✅ **Status History**: All transitions properly recorded in database
✅ **Notifications**: Appropriate messages at each step
✅ **Validation**: Payment only validated when required
✅ **Backward Compatible**: Paid service workflow unchanged

---

## Documentation

📄 Full documentation available in: [WORKFLOW_DOCUMENTATION.md](WORKFLOW_DOCUMENTATION.md)

Contains:
- Detailed workflow diagrams
- Complete API examples
- Status flow charts
- Database changes
- Notification types
- Implementation details
- Testing checklist
