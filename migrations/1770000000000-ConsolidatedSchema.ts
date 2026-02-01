import { MigrationInterface, QueryRunner } from 'typeorm';

export class ConsolidatedSchema1770000000000 implements MigrationInterface {
  name = 'ConsolidatedSchema1770000000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // Enable UUID extension
    await queryRunner.query(`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`);

    // Check if tables already exist
    const tablesExist = await queryRunner.hasTable('roles');
    if (tablesExist) {
      console.log('Tables already exist. Checking for column fixes...');
      
      // Fix request_status_history columns if needed
      const hasOldStatus = await queryRunner.query(`
        SELECT column_name 
        FROM information_schema.columns 
        WHERE table_name='request_status_history' 
        AND column_name='old_status'
      `);

      if (hasOldStatus.length > 0) {
        console.log('Fixing request_status_history columns...');
        await queryRunner.query(`
          ALTER TABLE "request_status_history" 
          RENAME COLUMN "old_status" TO "from_status"
        `);
        await queryRunner.query(`
          ALTER TABLE "request_status_history" 
          RENAME COLUMN "new_status" TO "to_status"
        `);
        console.log('Columns fixed successfully.');
      }
      
      return;
    }

    // Create Roles table
    await queryRunner.query(`
      CREATE TABLE "roles" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "name" character varying NOT NULL,
        "description" text,
        "permissions" text,
        "created_at" TIMESTAMP NOT NULL DEFAULT now(),
        "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
        CONSTRAINT "UQ_roles_name" UNIQUE ("name"),
        CONSTRAINT "PK_roles" PRIMARY KEY ("id")
      )
    `);

    // Create Users table
    await queryRunner.query(`
      CREATE TABLE "users" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "email" character varying NOT NULL,
        "password" character varying NOT NULL,
        "full_name" character varying NOT NULL,
        "phone" character varying(20),
        "role_id" uuid,
        "is_active" boolean NOT NULL DEFAULT true,
        "created_at" TIMESTAMP NOT NULL DEFAULT now(),
        "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
        CONSTRAINT "UQ_users_email" UNIQUE ("email"),
        CONSTRAINT "PK_users" PRIMARY KEY ("id")
      )
    `);

    // Create User Profiles table
    await queryRunner.query(`
      CREATE TABLE "user_profiles" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "user_id" uuid NOT NULL,
        "avatar_url" character varying(500),
        "bio" text,
        "fiscal_code" character varying(16),
        "address" text,
        "city" character varying(100),
        "postal_code" character varying(10),
        "province" character varying(2),
        "birth_date" date,
        "birth_place" character varying(100),
        "gdpr_consent" boolean NOT NULL DEFAULT false,
        "gdpr_consent_date" TIMESTAMP,
        "privacy_consent" boolean NOT NULL DEFAULT false,
        "privacy_consent_date" TIMESTAMP,
        "created_at" TIMESTAMP NOT NULL DEFAULT now(),
        "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
        CONSTRAINT "UQ_user_profiles_user_id" UNIQUE ("user_id"),
        CONSTRAINT "PK_user_profiles" PRIMARY KEY ("id")
      )
    `);

    // Create Service Types table
    await queryRunner.query(`
      CREATE TABLE "service_types" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "name" character varying NOT NULL,
        "description" text,
        "is_active" boolean NOT NULL DEFAULT true,
        "created_at" TIMESTAMP NOT NULL DEFAULT now(),
        "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
        CONSTRAINT "UQ_service_types_name" UNIQUE ("name"),
        CONSTRAINT "PK_service_types" PRIMARY KEY ("id")
      )
    `);

    // Create Services table
    await queryRunner.query(`
      CREATE TABLE "services" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "name" character varying(100) NOT NULL,
        "code" character varying(20) NOT NULL,
        "description" text,
        "category" character varying(50),
        "base_price" numeric(10,2),
        "service_type_id" uuid,
        "is_active" boolean NOT NULL DEFAULT true,
        "required_documents" jsonb,
        "document_requirements" jsonb,
        "form_schema" jsonb,
        "created_at" TIMESTAMP NOT NULL DEFAULT now(),
        "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
        CONSTRAINT "UQ_services_code" UNIQUE ("code"),
        CONSTRAINT "PK_services" PRIMARY KEY ("id")
      )
    `);

    // Create Service Requests table
    await queryRunner.query(`
      CREATE TABLE "service_requests" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "user_id" uuid NOT NULL,
        "service_id" uuid NOT NULL,
        "payment_id" uuid,
        "status" character varying(20) NOT NULL DEFAULT 'draft',
        "form_data" jsonb,
        "internal_notes" text,
        "user_notes" text,
        "assigned_operator_id" uuid,
        "priority" character varying(10) DEFAULT 'normal',
        "submitted_at" TIMESTAMP,
        "completed_at" TIMESTAMP,
        "form_completed_at" TIMESTAMP,
        "documents_uploaded_at" TIMESTAMP,
        "created_at" TIMESTAMP NOT NULL DEFAULT now(),
        "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
        CONSTRAINT "PK_service_requests" PRIMARY KEY ("id")
      )
    `);

    // Create Request Status History table
    await queryRunner.query(`
      CREATE TABLE "request_status_history" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "service_request_id" uuid NOT NULL,
        "from_status" character varying,
        "to_status" character varying NOT NULL,
        "changed_by_id" uuid NOT NULL,
        "notes" text,
        "created_at" TIMESTAMP NOT NULL DEFAULT now(),
        CONSTRAINT "PK_request_status_history" PRIMARY KEY ("id")
      )
    `);

    // Create Documents table
    await queryRunner.query(`
      CREATE TABLE "documents" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "user_id" uuid NOT NULL,
        "service_request_id" uuid,
        "category" character varying(100) NOT NULL DEFAULT 'GENERAL',
        "filename" character varying(255) NOT NULL,
        "original_filename" character varying(255) NOT NULL,
        "file_path" character varying(500) NOT NULL,
        "file_size" integer NOT NULL,
        "mime_type" character varying(100) NOT NULL,
        "status" character varying(20) NOT NULL DEFAULT 'pending',
        "is_required" boolean NOT NULL DEFAULT false,
        "admin_notes" text,
        "version" integer NOT NULL DEFAULT 1,
        "created_at" TIMESTAMP NOT NULL DEFAULT now(),
        "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
        CONSTRAINT "PK_documents" PRIMARY KEY ("id")
      )
    `);

    // Create Appointments table
    await queryRunner.query(`
      CREATE TABLE "appointments" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "user_id" uuid NOT NULL,
        "service_id" uuid NOT NULL,
        "operator_id" uuid,
        "date" TIMESTAMP NOT NULL,
        "end_time" TIMESTAMP,
        "status" character varying NOT NULL DEFAULT 'scheduled',
        "notes" text,
        "location" character varying,
        "meeting_link" character varying,
        "cancellation_reason" text,
        "reminder_sent" boolean NOT NULL DEFAULT false,
        "created_at" TIMESTAMP NOT NULL DEFAULT now(),
        "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
        CONSTRAINT "PK_appointments" PRIMARY KEY ("id")
      )
    `);

    // Create Invoices table
    await queryRunner.query(`
      CREATE TABLE "invoices" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "payment_id" uuid NOT NULL,
        "user_id" uuid NOT NULL,
        "stripe_invoice_id" character varying(255),
        "invoice_number" text,
        "amount" numeric(10,2) NOT NULL,
        "currency" character varying(3) NOT NULL DEFAULT 'EUR',
        "status" character varying(20) NOT NULL DEFAULT 'draft',
        "pdf_url" text,
        "pdf_path" text,
        "line_items" jsonb,
        "billing" jsonb,
        "notes" text,
        "issued_at" TIMESTAMP,
        "paid_at" TIMESTAMP,
        "sent_at" TIMESTAMP,
        "metadata" jsonb,
        "created_at" TIMESTAMP NOT NULL DEFAULT now(),
        "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
        CONSTRAINT "PK_invoices" PRIMARY KEY ("id")
      )
    `);

    // Create Payments table
    await queryRunner.query(`
      CREATE TABLE "payments" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "user_id" uuid NOT NULL,
        "subscription_id" uuid,
        "service_request_id" uuid,
        "amount" numeric(10,2) NOT NULL,
        "currency" character varying(3) NOT NULL DEFAULT 'EUR',
        "status" character varying(20) NOT NULL DEFAULT 'pending',
        "payment_method" character varying(50),
        "stripe_payment_intent_id" character varying(255),
        "stripe_charge_id" character varying(255),
        "description" text,
        "metadata" jsonb,
        "paid_at" TIMESTAMP,
        "created_at" TIMESTAMP NOT NULL DEFAULT now(),
        "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
        CONSTRAINT "PK_payments" PRIMARY KEY ("id")
      )
    `);

    // Create Notifications table
    await queryRunner.query(`
      CREATE TABLE "notifications" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "user_id" uuid NOT NULL,
        "type" character varying(50) NOT NULL DEFAULT 'info',
        "title" character varying(255) NOT NULL,
        "message" text NOT NULL,
        "action_url" character varying(500),
        "is_read" boolean NOT NULL DEFAULT false,
        "read_at" TIMESTAMP,
        "metadata" jsonb,
        "created_at" TIMESTAMP NOT NULL DEFAULT now(),
        CONSTRAINT "PK_notifications" PRIMARY KEY ("id")
      )
    `);

    // Create Audit Logs table
    await queryRunner.query(`
      CREATE TABLE "audit_logs" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "user_id" uuid,
        "action" character varying NOT NULL,
        "entity_type" character varying NOT NULL,
        "entity_id" character varying NOT NULL,
        "old_values" jsonb,
        "new_values" jsonb,
        "ip_address" character varying,
        "user_agent" character varying,
        "created_at" TIMESTAMP NOT NULL DEFAULT now(),
        CONSTRAINT "PK_audit_logs" PRIMARY KEY ("id")
      )
    `);

    // Create Blacklisted Tokens table
    await queryRunner.query(`
      CREATE TABLE "blacklisted_tokens" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "token" text NOT NULL,
        "user_id" uuid NOT NULL,
        "expires_at" TIMESTAMP NOT NULL,
        "created_at" TIMESTAMP NOT NULL DEFAULT now(),
        CONSTRAINT "UQ_blacklisted_tokens_token" UNIQUE ("token"),
        CONSTRAINT "PK_blacklisted_tokens" PRIMARY KEY ("id")
      )
    `);

    // Create Refresh Tokens table
    await queryRunner.query(`
      CREATE TABLE "refresh_tokens" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "user_id" uuid NOT NULL,
        "token" text NOT NULL,
        "expires_at" TIMESTAMP NOT NULL,
        "is_revoked" boolean NOT NULL DEFAULT false,
        "created_at" TIMESTAMP NOT NULL DEFAULT now(),
        CONSTRAINT "UQ_refresh_tokens_token" UNIQUE ("token"),
        CONSTRAINT "PK_refresh_tokens" PRIMARY KEY ("id")
      )
    `);

    // Create Subscription Plans table
    await queryRunner.query(`
      CREATE TABLE "subscription_plans" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "name" character varying(100) NOT NULL,
        "description" text,
        "price_monthly" numeric(10,2),
        "price_annual" numeric(10,2),
        "features" jsonb,
        "service_limits" jsonb,
        "is_active" boolean NOT NULL DEFAULT true,
        "created_at" TIMESTAMP NOT NULL DEFAULT now(),
        "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
        CONSTRAINT "UQ_subscription_plans_name" UNIQUE ("name"),
        CONSTRAINT "PK_subscription_plans" PRIMARY KEY ("id")
      )
    `);

    // Create User Subscriptions table
    await queryRunner.query(`
      CREATE TABLE "user_subscriptions" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "user_id" uuid NOT NULL,
        "plan_id" uuid NOT NULL,
        "start_date" TIMESTAMP NOT NULL DEFAULT now(),
        "end_date" TIMESTAMP,
        "status" character varying(20) NOT NULL DEFAULT 'pending',
        "billing_cycle" character varying(10) NOT NULL DEFAULT 'monthly',
        "payment_id" uuid,
        "auto_renew" boolean NOT NULL DEFAULT true,
        "stripe_subscription_id" character varying(255),
        "created_at" TIMESTAMP NOT NULL DEFAULT now(),
        "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
        CONSTRAINT "PK_user_subscriptions" PRIMARY KEY ("id")
      )
    `);

    // Create Permissions table
    await queryRunner.query(`
      CREATE TABLE "permissions" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "name" character varying NOT NULL,
        "description" text,
        "resource" character varying NOT NULL,
        "action" character varying NOT NULL,
        "created_at" TIMESTAMP NOT NULL DEFAULT now(),
        "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
        CONSTRAINT "UQ_permissions_resource_action" UNIQUE ("resource", "action"),
        CONSTRAINT "PK_permissions" PRIMARY KEY ("id")
      )
    `);

    // Create Role Permissions table
    await queryRunner.query(`
      CREATE TABLE "role_permissions" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "role_id" uuid NOT NULL,
        "permission_id" uuid NOT NULL,
        "created_at" TIMESTAMP NOT NULL DEFAULT now(),
        CONSTRAINT "PK_role_permissions" PRIMARY KEY ("id")
      )
    `);

    // Create User Permissions table
    await queryRunner.query(`
      CREATE TABLE "user_permissions" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "user_id" uuid NOT NULL,
        "permission_id" uuid NOT NULL,
        "created_at" TIMESTAMP NOT NULL DEFAULT now(),
        CONSTRAINT "PK_user_permissions" PRIMARY KEY ("id")
      )
    `);

    // Create Courses table
    await queryRunner.query(`
      CREATE TABLE "courses" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "title" character varying NOT NULL,
        "description" text,
        "instructor" character varying,
        "duration_hours" integer,
        "price" numeric(10,2) NOT NULL,
        "is_active" boolean NOT NULL DEFAULT true,
        "thumbnail_url" character varying,
        "created_at" TIMESTAMP NOT NULL DEFAULT now(),
        "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
        CONSTRAINT "PK_courses" PRIMARY KEY ("id")
      )
    `);

    // Create Course Enrollments table
    await queryRunner.query(`
      CREATE TABLE "course_enrollments" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "user_id" uuid NOT NULL,
        "course_id" uuid NOT NULL,
        "enrollment_date" TIMESTAMP NOT NULL DEFAULT now(),
        "completion_date" TIMESTAMP,
        "progress_percentage" integer NOT NULL DEFAULT 0,
        "status" character varying NOT NULL DEFAULT 'enrolled',
        "created_at" TIMESTAMP NOT NULL DEFAULT now(),
        "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
        CONSTRAINT "PK_course_enrollments" PRIMARY KEY ("id")
      )
    `);

    // Create Family Members table
    await queryRunner.query(`
      CREATE TABLE "family_members" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "user_id" uuid NOT NULL,
        "first_name" character varying NOT NULL,
        "last_name" character varying NOT NULL,
        "relationship" character varying NOT NULL,
        "tax_code" character varying,
        "date_of_birth" date,
        "created_at" TIMESTAMP NOT NULL DEFAULT now(),
        "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
        CONSTRAINT "PK_family_members" PRIMARY KEY ("id")
      )
    `);

    // Create IMU Requests table
    await queryRunner.query(`
      CREATE TABLE "imu_requests" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "service_request_id" uuid NOT NULL,
        "property_address" character varying NOT NULL,
        "cadastral_data" jsonb,
        "property_type" character varying,
        "created_at" TIMESTAMP NOT NULL DEFAULT now(),
        "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
        CONSTRAINT "UQ_imu_requests_service_request_id" UNIQUE ("service_request_id"),
        CONSTRAINT "PK_imu_requests" PRIMARY KEY ("id")
      )
    `);

    // Create ISEE Requests table
    await queryRunner.query(`
      CREATE TABLE "isee_requests" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "service_request_id" uuid NOT NULL,
        "family_members_count" integer NOT NULL,
        "household_income" numeric(10,2),
        "created_at" TIMESTAMP NOT NULL DEFAULT now(),
        "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
        CONSTRAINT "UQ_isee_requests_service_request_id" UNIQUE ("service_request_id"),
        CONSTRAINT "PK_isee_requests" PRIMARY KEY ("id")
      )
    `);

    // Create Modello 730 Requests table
    await queryRunner.query(`
      CREATE TABLE "modello_730_requests" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "service_request_id" uuid NOT NULL,
        "tax_year" integer NOT NULL,
        "income_data" jsonb,
        "deductions" jsonb,
        "created_at" TIMESTAMP NOT NULL DEFAULT now(),
        "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
        CONSTRAINT "UQ_modello_730_requests_service_request_id" UNIQUE ("service_request_id"),
        CONSTRAINT "PK_modello_730_requests" PRIMARY KEY ("id")
      )
    `);

    // Create FAQs table
    await queryRunner.query(`
      CREATE TABLE "faqs" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "question" text NOT NULL,
        "answer" text NOT NULL,
        "service_type_id" uuid,
        "category" varchar(100),
        "is_active" boolean NOT NULL DEFAULT true,
        "order" integer NOT NULL DEFAULT 0,
        "created_at" TIMESTAMP NOT NULL DEFAULT now(),
        "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
        CONSTRAINT "PK_faqs" PRIMARY KEY ("id")
      )
    `);

    // Add Foreign Keys
    await queryRunner.query(
      `ALTER TABLE "users" ADD CONSTRAINT "FK_users_role_id" FOREIGN KEY ("role_id") REFERENCES "roles"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_profiles" ADD CONSTRAINT "FK_user_profiles_user_id" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "services" ADD CONSTRAINT "FK_services_service_type_id" FOREIGN KEY ("service_type_id") REFERENCES "service_types"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "service_requests" ADD CONSTRAINT "FK_service_requests_user_id" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "service_requests" ADD CONSTRAINT "FK_service_requests_service_id" FOREIGN KEY ("service_id") REFERENCES "services"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "service_requests" ADD CONSTRAINT "FK_service_requests_assigned_operator_id" FOREIGN KEY ("assigned_operator_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "service_requests" ADD CONSTRAINT "FK_service_requests_payment_id" FOREIGN KEY ("payment_id") REFERENCES "payments"("id") ON DELETE SET NULL ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "request_status_history" ADD CONSTRAINT "FK_request_status_history_service_request_id" FOREIGN KEY ("service_request_id") REFERENCES "service_requests"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "request_status_history" ADD CONSTRAINT "FK_request_status_history_changed_by_id" FOREIGN KEY ("changed_by_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "documents" ADD CONSTRAINT "FK_documents_user_id" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "documents" ADD CONSTRAINT "FK_documents_service_request_id" FOREIGN KEY ("service_request_id") REFERENCES "service_requests"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "appointments" ADD CONSTRAINT "FK_appointments_user_id" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "appointments" ADD CONSTRAINT "FK_appointments_service_id" FOREIGN KEY ("service_id") REFERENCES "services"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "appointments" ADD CONSTRAINT "FK_appointments_operator_id" FOREIGN KEY ("operator_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "invoices" ADD CONSTRAINT "FK_invoices_payment_id" FOREIGN KEY ("payment_id") REFERENCES "payments"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "invoices" ADD CONSTRAINT "FK_invoices_user_id" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "payments" ADD CONSTRAINT "FK_payments_user_id" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "payments" ADD CONSTRAINT "FK_payments_subscription_id" FOREIGN KEY ("subscription_id") REFERENCES "user_subscriptions"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "payments" ADD CONSTRAINT "FK_payments_service_request_id" FOREIGN KEY ("service_request_id") REFERENCES "service_requests"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "notifications" ADD CONSTRAINT "FK_notifications_user_id" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "audit_logs" ADD CONSTRAINT "FK_audit_logs_user_id" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "blacklisted_tokens" ADD CONSTRAINT "FK_blacklisted_tokens_user_id" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "refresh_tokens" ADD CONSTRAINT "FK_refresh_tokens_user_id" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_subscriptions" ADD CONSTRAINT "FK_user_subscriptions_user_id" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_subscriptions" ADD CONSTRAINT "FK_user_subscriptions_plan_id" FOREIGN KEY ("plan_id") REFERENCES "subscription_plans"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_subscriptions" ADD CONSTRAINT "FK_user_subscriptions_payment_id" FOREIGN KEY ("payment_id") REFERENCES "payments"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "role_permissions" ADD CONSTRAINT "FK_role_permissions_role_id" FOREIGN KEY ("role_id") REFERENCES "roles"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "role_permissions" ADD CONSTRAINT "FK_role_permissions_permission_id" FOREIGN KEY ("permission_id") REFERENCES "permissions"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_permissions" ADD CONSTRAINT "FK_user_permissions_user_id" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_permissions" ADD CONSTRAINT "FK_user_permissions_permission_id" FOREIGN KEY ("permission_id") REFERENCES "permissions"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "course_enrollments" ADD CONSTRAINT "FK_course_enrollments_user_id" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "course_enrollments" ADD CONSTRAINT "FK_course_enrollments_course_id" FOREIGN KEY ("course_id") REFERENCES "courses"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "family_members" ADD CONSTRAINT "FK_family_members_user_id" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "imu_requests" ADD CONSTRAINT "FK_imu_requests_service_request_id" FOREIGN KEY ("service_request_id") REFERENCES "service_requests"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "isee_requests" ADD CONSTRAINT "FK_isee_requests_service_request_id" FOREIGN KEY ("service_request_id") REFERENCES "service_requests"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "modello_730_requests" ADD CONSTRAINT "FK_modello_730_requests_service_request_id" FOREIGN KEY ("service_request_id") REFERENCES "service_requests"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "faqs" ADD CONSTRAINT "FK_faqs_service_id" FOREIGN KEY ("service_type_id") REFERENCES "services"("id") ON DELETE SET NULL ON UPDATE NO ACTION`,
    );

    // Create Performance Indexes
    // Service Requests indexes
    await queryRunner.query(
      `CREATE INDEX "IDX_service_requests_user_id" ON "service_requests" ("user_id")`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_service_requests_status" ON "service_requests" ("status")`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_service_requests_service_id" ON "service_requests" ("service_id")`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_service_requests_user_status" ON "service_requests" ("user_id", "status")`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_service_requests_assigned_operator_id" ON "service_requests" ("assigned_operator_id")`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_service_requests_payment_id" ON "service_requests" ("payment_id")`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_service_requests_submitted_at" ON "service_requests" ("submitted_at")`,
    );

    // Users indexes
    await queryRunner.query(
      `CREATE INDEX "IDX_users_email" ON "users" ("email")`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_users_role_id" ON "users" ("role_id")`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_users_is_active" ON "users" ("is_active")`,
    );

    // Appointments indexes
    await queryRunner.query(
      `CREATE INDEX "IDX_appointments_user_id" ON "appointments" ("user_id")`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_appointments_operator_id" ON "appointments" ("operator_id")`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_appointments_status" ON "appointments" ("status")`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_appointments_date" ON "appointments" ("date")`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_appointments_user_status" ON "appointments" ("user_id", "status")`,
    );

    // Documents indexes
    await queryRunner.query(
      `CREATE INDEX "IDX_documents_service_request_id" ON "documents" ("service_request_id")`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_documents_status" ON "documents" ("status")`,
    );

    // Payments indexes
    await queryRunner.query(
      `CREATE INDEX "IDX_payments_user_id" ON "payments" ("user_id")`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_payments_status" ON "payments" ("status")`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_payments_service_request_id" ON "payments" ("service_request_id")`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_payments_subscription_id" ON "payments" ("subscription_id")`,
    );

    // Invoices indexes
    await queryRunner.query(
      `CREATE INDEX "IDX_invoices_user_id" ON "invoices" ("user_id")`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_invoices_payment_id" ON "invoices" ("payment_id")`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_invoices_stripe_invoice_id" ON "invoices" ("stripe_invoice_id")`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_invoices_status" ON "invoices" ("status")`,
    );

    // Services indexes
    await queryRunner.query(
      `CREATE INDEX "IDX_services_is_active" ON "services" ("is_active")`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_services_service_type_id" ON "services" ("service_type_id")`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_services_is_active_service_type_id" ON "services" ("is_active", "service_type_id")`,
    );

    // Service Types index
    await queryRunner.query(
      `CREATE INDEX "IDX_service_types_is_active" ON "service_types" ("is_active")`,
    );

    // FAQs indexes
    await queryRunner.query(
      `CREATE INDEX "IDX_faqs_service_type_id" ON "faqs" ("service_type_id")`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_faqs_is_active" ON "faqs" ("is_active")`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_faqs_category" ON "faqs" ("category")`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Drop all indexes first (with IF EXISTS to avoid errors)
    await queryRunner.query(
      `DROP INDEX IF EXISTS "public"."IDX_faqs_category"`,
    );
    await queryRunner.query(
      `DROP INDEX IF EXISTS "public"."IDX_faqs_is_active"`,
    );
    await queryRunner.query(
      `DROP INDEX IF EXISTS "public"."IDX_faqs_service_type_id"`,
    );
    await queryRunner.query(
      `DROP INDEX IF EXISTS "public"."IDX_service_types_is_active"`,
    );
    await queryRunner.query(
      `DROP INDEX IF EXISTS "public"."IDX_services_is_active_service_type_id"`,
    );
    await queryRunner.query(
      `DROP INDEX IF EXISTS "public"."IDX_services_service_type_id"`,
    );
    await queryRunner.query(
      `DROP INDEX IF EXISTS "public"."IDX_services_is_active"`,
    );
    await queryRunner.query(
      `DROP INDEX IF EXISTS "public"."IDX_payments_service_request_id"`,
    );
    await queryRunner.query(
      `DROP INDEX IF EXISTS "public"."IDX_payments_status"`,
    );
    await queryRunner.query(
      `DROP INDEX IF EXISTS "public"."IDX_payments_user_id"`,
    );
    await queryRunner.query(
      `DROP INDEX IF EXISTS "public"."IDX_documents_status"`,
    );
    await queryRunner.query(
      `DROP INDEX IF EXISTS "public"."IDX_documents_service_request_id"`,
    );
    await queryRunner.query(
      `DROP INDEX IF EXISTS "public"."IDX_appointments_user_status"`,
    );
    await queryRunner.query(
      `DROP INDEX IF EXISTS "public"."IDX_appointments_date"`,
    );
    await queryRunner.query(
      `DROP INDEX IF EXISTS "public"."IDX_appointments_status"`,
    );
    await queryRunner.query(
      `DROP INDEX IF EXISTS "public"."IDX_appointments_operator_id"`,
    );
    await queryRunner.query(
      `DROP INDEX IF EXISTS "public"."IDX_appointments_user_id"`,
    );
    await queryRunner.query(
      `DROP INDEX IF EXISTS "public"."IDX_users_is_active"`,
    );
    await queryRunner.query(
      `DROP INDEX IF EXISTS "public"."IDX_users_role_id"`,
    );
    await queryRunner.query(`DROP INDEX IF EXISTS "public"."IDX_users_email"`);
    await queryRunner.query(
      `DROP INDEX IF EXISTS "public"."IDX_service_requests_assigned_operator_id"`,
    );
    await queryRunner.query(
      `DROP INDEX IF EXISTS "public"."IDX_service_requests_user_status"`,
    );
    await queryRunner.query(
      `DROP INDEX IF EXISTS "public"."IDX_service_requests_service_id"`,
    );
    await queryRunner.query(
      `DROP INDEX IF EXISTS "public"."IDX_service_requests_status"`,
    );
    await queryRunner.query(
      `DROP INDEX IF EXISTS "public"."IDX_service_requests_user_id"`,
    );

    // Drop all foreign keys (with IF EXISTS to avoid errors)
    await queryRunner.query(
      `ALTER TABLE "faqs" DROP CONSTRAINT IF EXISTS "FK_faqs_service_id"`,
    );
    await queryRunner.query(
      `ALTER TABLE "modello_730_requests" DROP CONSTRAINT IF EXISTS "FK_modello_730_requests_service_request_id"`,
    );
    await queryRunner.query(
      `ALTER TABLE "isee_requests" DROP CONSTRAINT IF EXISTS "FK_isee_requests_service_request_id"`,
    );
    await queryRunner.query(
      `ALTER TABLE "imu_requests" DROP CONSTRAINT IF EXISTS "FK_imu_requests_service_request_id"`,
    );
    await queryRunner.query(
      `ALTER TABLE "family_members" DROP CONSTRAINT IF EXISTS "FK_family_members_user_id"`,
    );
    await queryRunner.query(
      `ALTER TABLE "course_enrollments" DROP CONSTRAINT IF EXISTS "FK_course_enrollments_course_id"`,
    );
    await queryRunner.query(
      `ALTER TABLE "course_enrollments" DROP CONSTRAINT IF EXISTS "FK_course_enrollments_user_id"`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_permissions" DROP CONSTRAINT IF EXISTS "FK_user_permissions_permission_id"`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_permissions" DROP CONSTRAINT IF EXISTS "FK_user_permissions_user_id"`,
    );
    await queryRunner.query(
      `ALTER TABLE "role_permissions" DROP CONSTRAINT IF EXISTS "FK_role_permissions_permission_id"`,
    );
    await queryRunner.query(
      `ALTER TABLE "role_permissions" DROP CONSTRAINT IF EXISTS "FK_role_permissions_role_id"`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_subscriptions" DROP CONSTRAINT IF EXISTS "FK_user_subscriptions_payment_id"`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_subscriptions" DROP CONSTRAINT IF EXISTS "FK_user_subscriptions_plan_id"`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_subscriptions" DROP CONSTRAINT IF EXISTS "FK_user_subscriptions_user_id"`,
    );
    await queryRunner.query(
      `ALTER TABLE "refresh_tokens" DROP CONSTRAINT IF EXISTS "FK_refresh_tokens_user_id"`,
    );
    await queryRunner.query(
      `ALTER TABLE "blacklisted_tokens" DROP CONSTRAINT IF EXISTS "FK_blacklisted_tokens_user_id"`,
    );
    await queryRunner.query(
      `ALTER TABLE "audit_logs" DROP CONSTRAINT IF EXISTS "FK_audit_logs_user_id"`,
    );
    await queryRunner.query(
      `ALTER TABLE "notifications" DROP CONSTRAINT IF EXISTS "FK_notifications_user_id"`,
    );
    await queryRunner.query(
      `ALTER TABLE "payments" DROP CONSTRAINT IF EXISTS "FK_payments_invoice_id"`,
    );
    await queryRunner.query(
      `ALTER TABLE "payments" DROP CONSTRAINT IF EXISTS "FK_payments_service_request_id"`,
    );
    await queryRunner.query(
      `ALTER TABLE "payments" DROP CONSTRAINT IF EXISTS "FK_payments_user_id"`,
    );
    await queryRunner.query(
      `ALTER TABLE "invoices" DROP CONSTRAINT IF EXISTS "FK_invoices_service_request_id"`,
    );
    await queryRunner.query(
      `ALTER TABLE "appointments" DROP CONSTRAINT IF EXISTS "FK_appointments_operator_id"`,
    );
    await queryRunner.query(
      `ALTER TABLE "appointments" DROP CONSTRAINT IF EXISTS "FK_appointments_service_id"`,
    );
    await queryRunner.query(
      `ALTER TABLE "appointments" DROP CONSTRAINT IF EXISTS "FK_appointments_user_id"`,
    );
    await queryRunner.query(
      `ALTER TABLE "documents" DROP CONSTRAINT IF EXISTS "FK_documents_user_id"`,
    );
    await queryRunner.query(
      `ALTER TABLE "documents" DROP CONSTRAINT IF EXISTS "FK_documents_service_request_id"`,
    );
    await queryRunner.query(
      `ALTER TABLE "request_status_history" DROP CONSTRAINT IF EXISTS "FK_request_status_history_changed_by_id"`,
    );
    await queryRunner.query(
      `ALTER TABLE "request_status_history" DROP CONSTRAINT IF EXISTS "FK_request_status_history_service_request_id"`,
    );
    await queryRunner.query(
      `ALTER TABLE "service_requests" DROP CONSTRAINT IF EXISTS "FK_service_requests_assigned_operator_id"`,
    );
    await queryRunner.query(
      `ALTER TABLE "service_requests" DROP CONSTRAINT IF EXISTS "FK_service_requests_service_id"`,
    );
    await queryRunner.query(
      `ALTER TABLE "service_requests" DROP CONSTRAINT IF EXISTS "FK_service_requests_user_id"`,
    );
    await queryRunner.query(
      `ALTER TABLE "services" DROP CONSTRAINT IF EXISTS "FK_services_service_type_id"`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_profiles" DROP CONSTRAINT IF EXISTS "FK_user_profiles_user_id"`,
    );
    await queryRunner.query(
      `ALTER TABLE "users" DROP CONSTRAINT IF EXISTS "FK_users_role_id"`,
    );

    // Drop all tables (with CASCADE to handle any remaining dependencies)
    await queryRunner.query(`DROP TABLE IF EXISTS "faqs" CASCADE`);
    await queryRunner.query(
      `DROP TABLE IF EXISTS "modello_730_requests" CASCADE`,
    );
    await queryRunner.query(`DROP TABLE IF EXISTS "isee_requests" CASCADE`);
    await queryRunner.query(`DROP TABLE IF EXISTS "imu_requests" CASCADE`);
    await queryRunner.query(`DROP TABLE IF EXISTS "family_members" CASCADE`);
    await queryRunner.query(
      `DROP TABLE IF EXISTS "course_enrollments" CASCADE`,
    );
    await queryRunner.query(`DROP TABLE IF EXISTS "courses" CASCADE`);
    await queryRunner.query(`DROP TABLE IF EXISTS "user_permissions" CASCADE`);
    await queryRunner.query(`DROP TABLE IF EXISTS "role_permissions" CASCADE`);
    await queryRunner.query(`DROP TABLE IF EXISTS "permissions" CASCADE`);
    await queryRunner.query(
      `DROP TABLE IF EXISTS "user_subscriptions" CASCADE`,
    );
    await queryRunner.query(
      `DROP TABLE IF EXISTS "subscription_plans" CASCADE`,
    );
    await queryRunner.query(`DROP TABLE IF EXISTS "refresh_tokens" CASCADE`);
    await queryRunner.query(
      `DROP TABLE IF EXISTS "blacklisted_tokens" CASCADE`,
    );
    await queryRunner.query(`DROP TABLE IF EXISTS "audit_logs" CASCADE`);
    await queryRunner.query(`DROP TABLE IF EXISTS "notifications" CASCADE`);
    await queryRunner.query(`DROP TABLE IF EXISTS "payments" CASCADE`);
    await queryRunner.query(`DROP TABLE IF EXISTS "invoices" CASCADE`);
    await queryRunner.query(`DROP TABLE IF EXISTS "appointments" CASCADE`);
    await queryRunner.query(`DROP TABLE IF EXISTS "documents" CASCADE`);
    await queryRunner.query(
      `DROP TABLE IF EXISTS "request_status_history" CASCADE`,
    );
    await queryRunner.query(`DROP TABLE IF EXISTS "service_requests" CASCADE`);
    await queryRunner.query(`DROP TABLE IF EXISTS "services" CASCADE`);
    await queryRunner.query(`DROP TABLE IF EXISTS "service_types" CASCADE`);
    await queryRunner.query(`DROP TABLE IF EXISTS "user_profiles" CASCADE`);
    await queryRunner.query(`DROP TABLE IF EXISTS "users" CASCADE`);
    await queryRunner.query(`DROP TABLE IF EXISTS "roles" CASCADE`);

    // Drop TypeORM metadata table
    await queryRunner.query(`DROP TABLE IF EXISTS "typeorm_metadata" CASCADE`);

    // Drop extension
    await queryRunner.query(`DROP EXTENSION IF EXISTS "uuid-ossp"`);

    // Note: migrations table is managed by TypeORM and will be cleaned up automatically
  }
}
