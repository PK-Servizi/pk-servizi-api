# Swagger Authentication Guide

## How to Use Swagger API Documentation with JWT Authentication

### Step 1: Login to Get JWT Token

1. Open Swagger at: `http://localhost:3000/api/docs`
2. Find the **Authentication** section
3. Expand `POST /api/v1/auth/admin/login`
4. Click "Try it out"
5. Enter credentials:
   ```json
   {
     "email": "admin@pkservizi.com",
     "password": "Admin@123"
   }
   ```
6. Click "Execute"
7. Copy the `accessToken` from the response

### Step 2: Authorize Swagger

1. Look for the **Authorize** button at the top right of Swagger UI (🔓 icon)
2. Click on it
3. In the "JWT-auth" field, paste your access token (just the token, NOT "Bearer token")
4. Click "Authorize"
5. Click "Close"

### Step 3: Use Protected Endpoints

Now you can test any protected endpoint:

1. Go to **FAQs** section
2. Expand `POST /api/v1/faqs`
3. Click "Try it out"
4. Enter the request body:
   ```json
   {
     "serviceId": "1b7e244b-6092-4236-afc9-9d66fba5b2a7",
     "question": "What documents do I need for ISEE calculation?",
     "answer": "You will need: identity documents, fiscal code, income documents...",
     "order": 1,
     "category": "Documents",
     "isActive": true
   }
   ```
5. Click "Execute"

The endpoint should now work correctly! The 🔒 icon next to the endpoint indicates it requires authentication.

## Troubleshooting

### 401 Unauthorized Error
- Make sure you clicked "Authorize" and entered your token
- Check if your token is still valid (tokens expire after a certain time)
- If expired, login again to get a new token

### 403 Forbidden Error
- Your user doesn't have the required permissions
- Admin users should have full access to all endpoints

### Token Expiration
- Tokens typically expire after 1 hour (check JWT_EXPIRATION in .env)
- Login again to get a fresh token
- Swagger will persist your authorization even after page refresh

## Notes

- Swagger's "persistAuthorization" is enabled, so your token will be saved in browser storage
- You only need to authorize once per session
- The token is automatically added to the Authorization header as: `Bearer YOUR_TOKEN`
