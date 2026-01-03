# 📚 PK SERVIZI - Quick Reference Guide

## 🎯 Project Overview

**PK SERVIZI** is a comprehensive CAF (Centro di Assistenza Fiscale) services platform consisting of:
- **Mobile App** (Flutter) - Customer-facing application
- **Admin Portal** (React) - Internal operations management
- **Backend API** (NestJS) - Central business logic and data layer

---

## 📁 Key Documentation Files

| File | Purpose | When to Use |
|------|---------|-------------|
| `IMPLEMENTATION_TASKS.md` | Complete task catalog with priorities and steps | Planning development, tracking progress |
| `.env.example` | Environment configuration template | Setting up new environments, onboarding developers |
| `README.md` (this file) | Quick reference and navigation | Getting started, finding information |
| `test/README.md` | Testing documentation | Writing and running tests |
| `insomnia-collection.json` | API endpoint collection | Testing API endpoints manually |

---

## 🚀 Quick Start

### 1. Initial Setup

```bash
# Clone repository
git clone <repository-url>
cd "PK SERVIZI"

# Install dependencies
npm install

# Setup environment
cp .env.example .env
# Edit .env with your actual values
```

### 2. Database Setup

```bash
# Run migrations
npm run migration:run

# Seed initial data (roles, admin user, permissions)
npm run seed:all
```

### 3. Start Development Server

```bash
# Start in watch mode
npm run start:dev

# Application runs on http://localhost:3001
# Swagger docs available at http://localhost:3001/api/docs
```

---

## 📊 Current Project Status

**Overall Completion:** 65%

### ✅ Completed Modules
- Authentication & Authorization (90%)
- User Management (90%)
- Roles & Permissions (85%)
- Audit Logging (100%)
- CMS Content (100%)
- Courses Management (100%)
- Notifications (80%)

### ⚠️ Partially Complete Modules
- Service Requests (40%)
- Documents (35%)
- Appointments (60%)
- Subscriptions (20%)
- Payments (20%)

### ❌ Missing Modules
- Stripe Integration
- Document Upload/Download
- Appointment Booking Flow
- Service Type Configurations (ISEE, 730, IMU)
- Admin Dashboard Aggregations
- Email Notifications

---

## 🔴 Critical Tasks (Start Here)

Before the app can be used in production, complete these tasks in order:

1. **TASK 1:** Register Missing Modules (30 min)
   - See: `IMPLEMENTATION_TASKS.md` → TASK 1
   - Creates module files and imports them

2. **TASK 2:** Implement Stripe Integration (2-3 days)
   - See: `IMPLEMENTATION_TASKS.md` → TASK 2
   - Required env vars: `STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET`
   - Enables payment processing and subscription management

3. **TASK 3:** Implement Document Upload/Download (2 days)
   - See: `IMPLEMENTATION_TASKS.md` → TASK 3
   - Required env vars: `SUPABASE_URL`, `SUPABASE_SERVICE_KEY`
   - Enables document management for service requests

4. **TASK 4:** Update Role System (4 hours)
   - See: `IMPLEMENTATION_TASKS.md` → TASK 4
   - Aligns roles with PK SERVIZI requirements

5. **TASK 5:** Create Service Type Configurations (1 day)
   - See: `IMPLEMENTATION_TASKS.md` → TASK 5
   - Configures ISEE, 730/PF, and IMU service types

---

## 🔧 Environment Configuration

### Required Variables (Minimum to Run)

```bash
# Database
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=your_password
DB_DATABASE=pk_servizi

# JWT
JWT_SECRET=your_jwt_secret_minimum_32_chars
JWT_REFRESH_SECRET=your_refresh_secret_minimum_32_chars

# Application
PORT=3001
NODE_ENV=development
```

### Critical for Production

```bash
# Stripe (TASK 2)
STRIPE_SECRET_KEY=sk_live_...
STRIPE_WEBHOOK_SECRET=whsec_...

# Supabase (TASK 3)
SUPABASE_URL=https://...
SUPABASE_SERVICE_KEY=...

# Email (TASK 8)
SENDGRID_API_KEY=SG...
EMAIL_FROM_ADDRESS=noreply@pkservizi.it
```

See `.env.example` for complete list with descriptions.

---

## 📋 Development Workflow

### Daily Development

```bash
# Start development server
npm run start:dev

# Run linter
npm run lint

# Run tests
npm run test

# Run specific module tests
npm run test:modules -- --testPathPattern=auth
```

### Database Changes

```bash
# Generate migration after entity changes
npm run migration:generate

# Run migrations
npm run migration:run

# Revert last migration
npm run migration:revert

# Reset database (careful!)
npm run db:reset
```

### Code Quality

```bash
# Check all (lint + test + build)
npm run check:all

# Format code
npm run format
```

---

## 🗂️ Project Structure

```
PK SERVIZI/
├── src/
│   ├── modules/              # Feature modules
│   │   ├── auth/            # ✅ Authentication
│   │   ├── users/           # ✅ User management
│   │   ├── roles/           # ✅ Role management
│   │   ├── permissions/     # ✅ Permission management
│   │   ├── service-requests/ # ⚠️ Service requests (needs module file)
│   │   ├── documents/       # ⚠️ Documents (needs implementation)
│   │   ├── appointments/    # ⚠️ Appointments (needs module file)
│   │   ├── subscriptions/   # ⚠️ Subscriptions (needs module file)
│   │   ├── payments/        # ⚠️ Payments (needs implementation)
│   │   ├── courses/         # ✅ Courses
│   │   ├── notifications/   # ✅ Notifications
│   │   ├── cms/             # ✅ CMS content
│   │   └── audit/           # ✅ Audit logs
│   ├── common/              # Shared utilities
│   │   ├── guards/          # Auth guards
│   │   ├── decorators/      # Custom decorators
│   │   ├── filters/         # Exception filters
│   │   ├── interceptors/    # Response interceptors
│   │   └── utils/           # Utility functions
│   ├── config/              # Configuration files
│   └── main.ts              # Application entry point
├── migrations/              # Database migrations
├── seeds/                   # Database seed files
├── test/                    # Test files
├── IMPLEMENTATION_TASKS.md  # 📋 Complete task list
├── .env.example             # 🔧 Environment template
└── package.json             # Dependencies
```

---

## 🔍 Finding Information

### "How do I...?"

| Question | Answer |
|----------|--------|
| Add a new feature? | Check `IMPLEMENTATION_TASKS.md` for similar tasks |
| Configure environment? | See `.env.example` for all variables |
| Test an endpoint? | Import `insomnia-collection.json` into Insomnia/Postman |
| Understand the database? | Check entity files in `src/modules/*/entities/` |
| See what's missing? | Read the analysis at the top of `IMPLEMENTATION_TASKS.md` |
| Run tests? | See `test/README.md` |

### "What needs to be done?"

1. **Critical Priority:** See `IMPLEMENTATION_TASKS.md` → "CRITICAL PRIORITY TASKS"
2. **High Priority:** See `IMPLEMENTATION_TASKS.md` → "HIGH PRIORITY TASKS"
3. **Medium/Low Priority:** See `IMPLEMENTATION_TASKS.md` → Later sections

---

## 🎯 Module Status Reference

### Legend
- ✅ **Complete** - Fully implemented and tested
- ⚠️ **Partial** - Basic structure exists, needs completion
- ❌ **Missing** - Not implemented yet
- 🔴 **Critical** - Blocks production launch

| Module | Status | Priority | Task Reference |
|--------|--------|----------|----------------|
| Authentication | ✅ Complete | - | - |
| Users | ✅ Complete | - | - |
| Roles | ⚠️ Partial | 🔴 High | TASK 4 |
| Permissions | ✅ Complete | - | - |
| Service Requests | ⚠️ Partial | 🔴 Critical | TASK 1, 5, 9 |
| Documents | ⚠️ Partial | 🔴 Critical | TASK 1, 3, 10 |
| Appointments | ⚠️ Partial | 🔴 High | TASK 1, 6 |
| Subscriptions | ⚠️ Partial | 🔴 Critical | TASK 1, 2, 12 |
| Payments | ⚠️ Partial | 🔴 Critical | TASK 2 |
| Courses | ✅ Complete | - | - |
| Notifications | ⚠️ Partial | High | TASK 8 |
| CMS | ✅ Complete | - | - |
| Audit | ✅ Complete | - | - |

---

## 🔐 Security Checklist

Before deploying to production:

- [ ] All JWT secrets are strong and unique
- [ ] Database credentials are secure
- [ ] Stripe keys are production keys (not test)
- [ ] CORS is configured for production domains only
- [ ] Rate limiting is enabled
- [ ] Helmet security headers are active
- [ ] HTTPS is enforced
- [ ] Environment variables are not committed to git
- [ ] Sensitive data is encrypted at rest
- [ ] GDPR compliance features are enabled
- [ ] Backup strategy is implemented
- [ ] Error tracking (Sentry) is configured
- [ ] Logs don't contain sensitive information

---

## 📞 Support & Resources

### Documentation
- **NestJS:** https://docs.nestjs.com/
- **TypeORM:** https://typeorm.io/
- **Stripe:** https://stripe.com/docs/api
- **Supabase:** https://supabase.com/docs

### Tools
- **Swagger UI:** http://localhost:3001/api/docs (when running)
- **Database Client:** pgAdmin, DBeaver, or TablePlus
- **API Testing:** Insomnia or Postman

### Common Commands

```bash
# Development
npm run start:dev          # Start dev server
npm run build              # Build for production
npm run start:prod         # Run production build

# Database
npm run migration:run      # Run migrations
npm run seed:all          # Seed database
npm run db:reset          # Reset database

# Testing
npm run test              # Run unit tests
npm run test:modules      # Run module tests
npm run test:e2e          # Run E2E tests
npm run test:cov          # Run with coverage

# Code Quality
npm run lint              # Check code
npm run lint:fix          # Fix linting issues
npm run format            # Format code
npm run check:all         # Lint + test + build
```

---

## 🎓 Learning Path for New Developers

### Week 1: Understanding the Codebase
1. Read this README
2. Review `IMPLEMENTATION_TASKS.md` overview
3. Set up local environment using `.env.example`
4. Run the application and explore Swagger docs
5. Review entity files to understand data model

### Week 2: First Contributions
1. Pick a MEDIUM priority task from `IMPLEMENTATION_TASKS.md`
2. Read the task's step-by-step guide
3. Implement the feature
4. Write tests
5. Submit PR

### Week 3: Critical Features
1. Work on HIGH or CRITICAL priority tasks
2. Collaborate with team on complex features
3. Review others' code

---

## 📈 Roadmap

### Phase 1: Foundation (Week 1) - CURRENT
- Complete critical module registration
- Implement Stripe integration
- Implement document management
- Update role system

### Phase 2: Core Features (Week 2-3)
- Service type configurations
- Appointment booking
- Email notifications
- Admin dashboard

### Phase 3: Polish (Week 4)
- Advanced features
- Testing
- Documentation
- Performance optimization

### Phase 4: Launch Prep (Week 5)
- Security audit
- GDPR compliance
- Backup & recovery
- Monitoring setup

---

## 🐛 Troubleshooting

### Common Issues

**Problem:** Database connection fails  
**Solution:** Check DB credentials in `.env`, ensure PostgreSQL is running

**Problem:** Migrations fail  
**Solution:** Run `npm run migration:revert` then `npm run migration:run`

**Problem:** Module not found errors  
**Solution:** Run `npm install`, check imports in `app.module.ts`

**Problem:** Swagger docs not loading  
**Solution:** Check `SWAGGER_ENABLED=true` in `.env`

**Problem:** Tests failing  
**Solution:** Check test database configuration, run `npm run test:modules -- --verbose`

---

## 📝 Notes

- **Default Admin User:** 
  - Email: `admin_labverse@gmail.com`
  - Password: `Admin@12345`
  - (Created by seed script)

- **API Documentation:** Available at `/api/docs` when server is running

- **Database Naming:** Uses snake_case (handled by SnakeNamingStrategy)

- **Time Zone:** Europe/Rome (configurable in `.env`)

---

**Last Updated:** 2026-01-03  
**Version:** 1.0.0  
**Maintainer:** PK SERVIZI Development Team
