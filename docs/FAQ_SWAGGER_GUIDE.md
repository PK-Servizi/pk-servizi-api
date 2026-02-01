# FAQ Creation - Complete Guide

## Issues Fixed

### 1. Swagger Authentication (401 Error)
✅ **FIXED**: Updated all FAQ endpoints to use `@ApiBearerAuth('JWT-auth')`

### 2. Service Type Not Found (400 Error)
✅ **FIXED**: Made `serviceId` truly optional with better documentation

---

## How to Use Swagger to Create FAQs

### Step 1: Restart Your Server
```bash
npm run start:dev
```
Wait for: `🚀 PK SERVIZI API running on: http://localhost:3000`

### Step 2: Login as Admin
1. Open Swagger: `http://localhost:3000/api/docs`
2. Go to **Authentication** section
3. Expand `POST /api/v1/auth/admin/login`
4. Click **"Try it out"**
5. Use this body:
```json
{
  "email": "admin@pkservizi.com",
  "password": "Admin@123"
}
```
6. Click **"Execute"**
7. **Copy the `accessToken`** from the response

### Step 3: Authorize Swagger
1. Click the **"Authorize"** button (🔓 lock icon at the top right)
2. In the "Value" field under **JWT-auth**, paste your token
3. Click **"Authorize"**
4. Click **"Close"**
5. You should now see 🔒 (locked) icon - you're authenticated!

### Step 4: Create a General FAQ (No Service)

Go to **FAQs** section, expand `POST /api/v1/faqs`, click "Try it out"

**Option A: General FAQ (No specific service)**
```json
{
  "question": "What are your business hours?",
  "answer": "We are open Monday to Friday, 9:00 AM to 6:00 PM",
  "order": 1,
  "category": "General",
  "isActive": true
}
```

**Option B: Service-Specific FAQ**
First, get a valid service ID:
1. Go to Services section
2. Use `GET /api/v1/services` to list all services
3. Copy a service `id` from the response

Then create FAQ:
```json
{
  "serviceId": "PASTE_VALID_SERVICE_ID_HERE",
  "question": "What documents do I need for ISEE?",
  "answer": "You will need: Identity documents, Fiscal code, Income documents, Property documents",
  "order": 1,
  "category": "Documents",
  "isActive": true
}
```

### Step 5: Verify Creation
Use `GET /api/v1/faqs` to see all FAQs (requires authentication)
Or use `GET /api/v1/faqs/public` to see active FAQs (no authentication needed)

---

## Common Errors and Solutions

### ❌ Error: 401 Unauthorized
**Cause**: No token or invalid token
**Solution**: 
- Click "Authorize" button and add your token
- If token expired, login again to get a new token
- Make sure you clicked "Authorize" after pasting the token

### ❌ Error: 400 Service type not found
**Cause**: Invalid `serviceId` provided
**Solution**: 
- **Option 1**: Omit `serviceId` completely for general FAQs
- **Option 2**: Get a valid service ID from `GET /api/v1/services` first
- **Option 3**: Use Insomnia/Postman where you have working examples

### ❌ Error: 403 Forbidden
**Cause**: User doesn't have `faqs:create` permission
**Solution**: Make sure you're logged in as admin

---

## Quick Test Script

If Swagger isn't working, use this Node.js script:

```bash
node test-faq-creation.js
```

This will:
1. Login as admin
2. Create a FAQ
3. Fetch all FAQs
4. Show results

---

## Swagger vs Insomnia Differences

**Why Insomnia works but Swagger doesn't:**

| Issue | Insomnia | Swagger (Before Fix) |
|-------|----------|---------------------|
| Auth Header | Manually added `Bearer token` | Didn't know which auth scheme to use |
| Example Values | You provided valid data | Auto-filled with example UUID that doesn't exist |
| Token Storage | Saved in environment | Not authorized properly |

**After our fixes:**
- ✅ Swagger now knows to use `JWT-auth` scheme
- ✅ Swagger example doesn't include invalid serviceId
- ✅ Both should work identically

---

## Testing Checklist

- [ ] Server is running (`npm run start:dev`)
- [ ] No compilation errors in terminal
- [ ] Opened Swagger UI (`http://localhost:3000/api/docs`)
- [ ] Logged in as admin
- [ ] Copied access token
- [ ] Clicked "Authorize" button
- [ ] Pasted token in JWT-auth field
- [ ] Clicked "Authorize" then "Close"
- [ ] Lock icon changed to 🔒
- [ ] Tried creating FAQ without serviceId
- [ ] Got 201 success response

If all steps pass, Swagger FAQ creation is working! 🎉
