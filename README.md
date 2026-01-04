# 🚀 PK SERVIZI Backend API

A clean, optimized NestJS backend API for the PK SERVIZI service management system.

## 📋 Features

- **Authentication & Authorization** - JWT-based auth with role-based permissions
- **User Management** - Complete user and family member management
- **Service Requests** - ISEE, 730, IMU service request processing
- **Document Management** - Secure file upload and processing
- **Appointments** - Booking and scheduling system
- **Courses** - Course enrollment and certificate management
- **Subscriptions** - Stripe-powered subscription management
- **Notifications** - Real-time notification system
- **CMS** - Content management for pages, news, and FAQs
- **Reports & Analytics** - Comprehensive reporting system
- **Audit Logs** - Complete audit trail

## 🛠️ Tech Stack

- **Framework**: NestJS
- **Database**: PostgreSQL with TypeORM
- **Authentication**: JWT (Access + Refresh tokens)
- **Payments**: Stripe
- **File Storage**: AWS S3
- **Email**: Nodemailer
- **Documentation**: Swagger/OpenAPI
- **Security**: Helmet, Rate limiting, CORS

## 🚀 Quick Start

### Prerequisites

- Node.js 18+
- PostgreSQL 14+
- npm or yarn

### Installation

1. **Clone and install dependencies**
   ```bash
   git clone <repository-url>
   cd pk-servizi-backend
   npm install
   ```

2. **Environment setup**
   ```bash
   cp .env.example .env
   # Edit .env with your configuration
   ```

3. **Database setup**
   ```bash
   # Run migrations
   npm run migration:run
   
   # Seed initial data
   npm run seed:all
   ```

4. **Start development server**
   ```bash
   npm run start:dev
   ```

The API will be available at `http://localhost:3000`
Swagger documentation at `http://localhost:3000/api/docs`

## 📁 Project Structure

```
src/
├── common/                 # Shared utilities
│   ├── decorators/        # Custom decorators
│   ├── filters/           # Exception filters
│   ├── guards/            # Auth guards
│   ├── interceptors/      # Response interceptors
│   └── pipes/             # Validation pipes
├── config/                # Configuration files
├── modules/               # Feature modules
│   ├── auth/             # Authentication
│   ├── users/            # User management
│   ├── roles/            # Roles & permissions
│   ├── service-requests/ # Service requests
│   ├── documents/        # Document management
│   ├── appointments/     # Appointments
│   ├── courses/          # Courses
│   ├── subscriptions/    # Subscriptions & payments
│   ├── notifications/    # Notifications
│   ├── cms/              # Content management
│   ├── reports/          # Reports & analytics
│   ├── audit/            # Audit logs
│   └── webhooks/         # Webhook handlers
├── app.module.ts         # Root module
└── main.ts               # Application entry point
```

## 🔐 Authentication

The API uses JWT-based authentication with role-based access control (RBAC).

### Roles
- **SUPER_ADMIN** - Full system access
- **ADMIN** - Administrative access
- **OPERATOR** - Assigned requests management
- **CUSTOMER** - Own data access

### Usage
```bash
# Login
POST /api/v1/auth/login
{
  "email": "user@example.com",
  "password": "password"
}

# Use the returned access_token in Authorization header
Authorization: Bearer <access_token>
```

## 📚 API Documentation

### Base URL
```
http://localhost:3000/api/v1
```

### Key Endpoints

#### Authentication
- `POST /auth/register` - Register new user
- `POST /auth/login` - User login
- `POST /auth/refresh` - Refresh token
- `GET /auth/me` - Get current user

#### Users
- `GET /users/profile` - Get own profile
- `PUT /users/profile` - Update profile
- `GET /users` - List all users (Admin)

#### Service Requests
- `GET /service-requests/my` - My requests
- `POST /service-requests` - Create request
- `POST /service-requests/:id/submit` - Submit request

#### Documents
- `POST /documents/upload` - Upload document
- `GET /documents/request/:id` - List request documents

#### Appointments
- `GET /appointments/available-slots` - Available slots
- `POST /appointments` - Book appointment

For complete API documentation, visit `/api/docs` when the server is running.

## 🗄️ Database

### Migrations
```bash
# Generate migration
npm run migration:generate

# Run migrations
npm run migration:run

# Revert migration
npm run migration:revert
```

### Seeding
```bash
# Seed all data
npm run seed:all

# Reset database
npm run db:reset
```

## 🔧 Configuration

Key environment variables:

```env
# Database
DB_HOST=localhost
DB_PORT=5432
DB_NAME=pk_servizi
DB_USER=postgres
DB_PASSWORD=your_password

# JWT
JWT_SECRET=your_jwt_secret
JWT_EXPIRES_IN=15m

# Stripe
STRIPE_API_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...

# AWS S3
AWS_ACCESS_KEY_ID=your_key
AWS_SECRET_ACCESS_KEY=your_secret
AWS_S3_BUCKET=pk-servizi-documents
```

## 🧪 Testing

```bash
# Unit tests
npm run test

# E2E tests
npm run test:e2e

# Test coverage
npm run test:cov
```

## 📦 Deployment

### Production Build
```bash
npm run build
npm run start:prod
```

### Docker (Optional)
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY dist ./dist
EXPOSE 3000
CMD ["node", "dist/main"]
```

## 🔒 Security Features

- **Helmet** - Security headers
- **Rate Limiting** - Request throttling
- **CORS** - Cross-origin protection
- **Input Validation** - Request validation
- **JWT Security** - Secure token handling
- **File Upload Security** - Safe file handling

## 📊 Monitoring

- **Health Checks** - `/health` endpoint
- **Metrics** - Performance monitoring
- **Logging** - Structured logging
- **Error Tracking** - Exception monitoring

## 🤝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open Pull Request

## 📄 License

Proprietary - © 2024 PK SERVIZI. All rights reserved.

## 📞 Support

- **Email**: dev@pkservizi.com
- **Documentation**: https://docs.pkservizi.com
- **Issues**: Create an issue in this repository