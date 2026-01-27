import { MigrationInterface, QueryRunner } from 'typeorm';

export class ConsolidatedSchema1770000000000 implements MigrationInterface {
  name = 'ConsolidatedSchema1770000000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // Enable UUID extension
    await queryRunner.query(`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`);

    // Check if tables already exist
    const tablesExist = await queryRunner.hasTable('roles');
    if (tablesExist) {
      console.log('Tables already exist. Skipping schema creation.');
      return;
    }

    // Create Roles table
    await queryRunner.query(`
      CREATE TABLE "roles" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "name" character varying NOT NULL,
        "description" text,
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
        "first_name" character varying NOT NULL,
        "last_name" character varying NOT NULL,
        "phone_number" character varying,
        "role_id" uuid NOT NULL,
        "is_active" boolean NOT NULL DEFAULT true,
        "email_verified" boolean NOT NULL DEFAULT false,
        "verification_token" character varying,
        "reset_token" character varying,
        "reset_token_expiry" TIMESTAMP,
        "last_login" TIMESTAMP,
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
        "date_of_birth" date,
        "place_of_birth" character varying,
        "tax_code" character varying,
        "address" character varying,
        "city" character varying,
        "postal_code" character varying,
        "province" character varying,
        "country" character varying DEFAULT 'Italy',
        "created_at" TIMESTAMP NOT NULL DEFAULT now(),
        "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
        CONSTRAINT "UQ_user_profiles_user_id" UNIQUE ("user_id"),
        CONSTRAINT "UQ_user_profiles_tax_code" UNIQUE ("tax_code"),
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
        "name" character varying NOT NULL,
        "description" text,
        "price" numeric(10,2) NOT NULL,
        "service_type_id" uuid NOT NULL,
        "is_active" boolean NOT NULL DEFAULT true,
        "processing_time_days" integer,
        "required_documents" jsonb,
        "form_schema" jsonb,
        "created_at" TIMESTAMP NOT NULL DEFAULT now(),
        "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
        CONSTRAINT "PK_services" PRIMARY KEY ("id")
      )
    `);

    // Create Service Requests table
    await queryRunner.query(`
      CREATE TABLE "service_requests" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "user_id" uuid NOT NULL,
        "service_id" uuid NOT NULL,
        "status" character varying NOT NULL DEFAULT 'pending',
        "form_data" jsonb,
        "notes" text,
        "assigned_operator_id" uuid,
        "estimated_completion_date" TIMESTAMP,
        "completion_date" TIMESTAMP,
        "priority" character varying DEFAULT 'normal',
        "workflow_state" character varying,
        "current_stage" character varying,
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
        "old_status" character varying,
        "new_status" character varying NOT NULL,
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
        "file_name" character varying NOT NULL,
        "file_path" character varying NOT NULL,
        "file_size" integer NOT NULL,
        "mime_type" character varying NOT NULL,
        "document_type" character varying NOT NULL,
        "status" character varying NOT NULL DEFAULT 'pending',
        "upload_date" TIMESTAMP NOT NULL DEFAULT now(),
        "verified_at" TIMESTAMP,
        "verified_by_id" uuid,
        "rejection_reason" text,
        "metadata" jsonb,
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
        "service_request_id" uuid NOT NULL,
        "invoice_number" character varying NOT NULL,
        "amount" numeric(10,2) NOT NULL,
        "tax_amount" numeric(10,2) NOT NULL DEFAULT 0,
        "total_amount" numeric(10,2) NOT NULL,
        "issue_date" TIMESTAMP NOT NULL DEFAULT now(),
        "due_date" TIMESTAMP NOT NULL,
        "status" character varying NOT NULL DEFAULT 'pending',
        "payment_date" TIMESTAMP,
        "notes" text,
        "created_at" TIMESTAMP NOT NULL DEFAULT now(),
        "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
        CONSTRAINT "UQ_invoices_invoice_number" UNIQUE ("invoice_number"),
        CONSTRAINT "PK_invoices" PRIMARY KEY ("id")
      )
    `);

    // Create Payments table
    await queryRunner.query(`
      CREATE TABLE "payments" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "user_id" uuid NOT NULL,
        "service_request_id" uuid,
        "invoice_id" uuid,
        "amount" numeric(10,2) NOT NULL,
        "currency" character varying NOT NULL DEFAULT 'EUR',
        "status" character varying NOT NULL DEFAULT 'pending',
        "payment_method" character varying,
        "transaction_id" character varying,
        "stripe_payment_intent_id" character varying,
        "payment_date" TIMESTAMP,
        "metadata" jsonb,
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
        "type" character varying NOT NULL,
        "title" character varying NOT NULL,
        "message" text NOT NULL,
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
        "name" character varying NOT NULL,
        "description" text,
        "price" numeric(10,2) NOT NULL,
        "duration_months" integer NOT NULL,
        "features" jsonb,
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
        "end_date" TIMESTAMP NOT NULL,
        "status" character varying NOT NULL DEFAULT 'active',
        "payment_id" uuid,
        "auto_renew" boolean NOT NULL DEFAULT false,
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
      `ALTER TABLE "documents" ADD CONSTRAINT "FK_documents_verified_by_id" FOREIGN KEY ("verified_by_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
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
      `ALTER TABLE "invoices" ADD CONSTRAINT "FK_invoices_service_request_id" FOREIGN KEY ("service_request_id") REFERENCES "service_requests"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "payments" ADD CONSTRAINT "FK_payments_user_id" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "payments" ADD CONSTRAINT "FK_payments_service_request_id" FOREIGN KEY ("service_request_id") REFERENCES "service_requests"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "payments" ADD CONSTRAINT "FK_payments_invoice_id" FOREIGN KEY ("invoice_id") REFERENCES "invoices"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
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
      `ALTER TABLE "faqs" ADD CONSTRAINT "FK_faqs_service_type_id" FOREIGN KEY ("service_type_id") REFERENCES "service_types"("id") ON DELETE SET NULL ON UPDATE NO ACTION`,
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
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Drop all indexes first
    await queryRunner.query(`DROP INDEX "public"."IDX_faqs_is_active"`);
    await queryRunner.query(`DROP INDEX "public"."IDX_faqs_service_type_id"`);
    await queryRunner.query(
      `DROP INDEX "public"."IDX_service_types_is_active"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_services_is_active_service_type_id"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_services_service_type_id"`,
    );
    await queryRunner.query(`DROP INDEX "public"."IDX_services_is_active"`);
    await queryRunner.query(
      `DROP INDEX "public"."IDX_payments_service_request_id"`,
    );
    await queryRunner.query(`DROP INDEX "public"."IDX_payments_status"`);
    await queryRunner.query(`DROP INDEX "public"."IDX_payments_user_id"`);
    await queryRunner.query(`DROP INDEX "public"."IDX_documents_status"`);
    await queryRunner.query(
      `DROP INDEX "public"."IDX_documents_service_request_id"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_appointments_user_status"`,
    );
    await queryRunner.query(`DROP INDEX "public"."IDX_appointments_date"`);
    await queryRunner.query(`DROP INDEX "public"."IDX_appointments_status"`);
    await queryRunner.query(
      `DROP INDEX "public"."IDX_appointments_operator_id"`,
    );
    await queryRunner.query(`DROP INDEX "public"."IDX_appointments_user_id"`);
    await queryRunner.query(`DROP INDEX "public"."IDX_users_is_active"`);
    await queryRunner.query(`DROP INDEX "public"."IDX_users_role_id"`);
    await queryRunner.query(`DROP INDEX "public"."IDX_users_email"`);
    await queryRunner.query(
      `DROP INDEX "public"."IDX_service_requests_assigned_operator_id"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_service_requests_user_status"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_service_requests_service_id"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_service_requests_status"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_service_requests_user_id"`,
    );

    // Drop all foreign keys
    await queryRunner.query(
      `ALTER TABLE "faqs" DROP CONSTRAINT "FK_faqs_service_type_id"`,
    );
    await queryRunner.query(
      `ALTER TABLE "modello_730_requests" DROP CONSTRAINT "FK_modello_730_requests_service_request_id"`,
    );
    await queryRunner.query(
      `ALTER TABLE "isee_requests" DROP CONSTRAINT "FK_isee_requests_service_request_id"`,
    );
    await queryRunner.query(
      `ALTER TABLE "imu_requests" DROP CONSTRAINT "FK_imu_requests_service_request_id"`,
    );
    await queryRunner.query(
      `ALTER TABLE "family_members" DROP CONSTRAINT "FK_family_members_user_id"`,
    );
    await queryRunner.query(
      `ALTER TABLE "course_enrollments" DROP CONSTRAINT "FK_course_enrollments_course_id"`,
    );
    await queryRunner.query(
      `ALTER TABLE "course_enrollments" DROP CONSTRAINT "FK_course_enrollments_user_id"`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_permissions" DROP CONSTRAINT "FK_user_permissions_permission_id"`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_permissions" DROP CONSTRAINT "FK_user_permissions_user_id"`,
    );
    await queryRunner.query(
      `ALTER TABLE "role_permissions" DROP CONSTRAINT "FK_role_permissions_permission_id"`,
    );
    await queryRunner.query(
      `ALTER TABLE "role_permissions" DROP CONSTRAINT "FK_role_permissions_role_id"`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_subscriptions" DROP CONSTRAINT "FK_user_subscriptions_payment_id"`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_subscriptions" DROP CONSTRAINT "FK_user_subscriptions_plan_id"`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_subscriptions" DROP CONSTRAINT "FK_user_subscriptions_user_id"`,
    );
    await queryRunner.query(
      `ALTER TABLE "refresh_tokens" DROP CONSTRAINT "FK_refresh_tokens_user_id"`,
    );
    await queryRunner.query(
      `ALTER TABLE "blacklisted_tokens" DROP CONSTRAINT "FK_blacklisted_tokens_user_id"`,
    );
    await queryRunner.query(
      `ALTER TABLE "audit_logs" DROP CONSTRAINT "FK_audit_logs_user_id"`,
    );
    await queryRunner.query(
      `ALTER TABLE "notifications" DROP CONSTRAINT "FK_notifications_user_id"`,
    );
    await queryRunner.query(
      `ALTER TABLE "payments" DROP CONSTRAINT "FK_payments_invoice_id"`,
    );
    await queryRunner.query(
      `ALTER TABLE "payments" DROP CONSTRAINT "FK_payments_service_request_id"`,
    );
    await queryRunner.query(
      `ALTER TABLE "payments" DROP CONSTRAINT "FK_payments_user_id"`,
    );
    await queryRunner.query(
      `ALTER TABLE "invoices" DROP CONSTRAINT "FK_invoices_service_request_id"`,
    );
    await queryRunner.query(
      `ALTER TABLE "appointments" DROP CONSTRAINT "FK_appointments_operator_id"`,
    );
    await queryRunner.query(
      `ALTER TABLE "appointments" DROP CONSTRAINT "FK_appointments_service_id"`,
    );
    await queryRunner.query(
      `ALTER TABLE "appointments" DROP CONSTRAINT "FK_appointments_user_id"`,
    );
    await queryRunner.query(
      `ALTER TABLE "documents" DROP CONSTRAINT "FK_documents_verified_by_id"`,
    );
    await queryRunner.query(
      `ALTER TABLE "documents" DROP CONSTRAINT "FK_documents_service_request_id"`,
    );
    await queryRunner.query(
      `ALTER TABLE "documents" DROP CONSTRAINT "FK_documents_user_id"`,
    );
    await queryRunner.query(
      `ALTER TABLE "request_status_history" DROP CONSTRAINT "FK_request_status_history_changed_by_id"`,
    );
    await queryRunner.query(
      `ALTER TABLE "request_status_history" DROP CONSTRAINT "FK_request_status_history_service_request_id"`,
    );
    await queryRunner.query(
      `ALTER TABLE "service_requests" DROP CONSTRAINT "FK_service_requests_assigned_operator_id"`,
    );
    await queryRunner.query(
      `ALTER TABLE "service_requests" DROP CONSTRAINT "FK_service_requests_service_id"`,
    );
    await queryRunner.query(
      `ALTER TABLE "service_requests" DROP CONSTRAINT "FK_service_requests_user_id"`,
    );
    await queryRunner.query(
      `ALTER TABLE "services" DROP CONSTRAINT "FK_services_service_type_id"`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_profiles" DROP CONSTRAINT "FK_user_profiles_user_id"`,
    );
    await queryRunner.query(
      `ALTER TABLE "users" DROP CONSTRAINT "FK_users_role_id"`,
    );

    // Drop all tables
    await queryRunner.query(`DROP TABLE "faqs"`);
    await queryRunner.query(`DROP TABLE "modello_730_requests"`);
    await queryRunner.query(`DROP TABLE "isee_requests"`);
    await queryRunner.query(`DROP TABLE "imu_requests"`);
    await queryRunner.query(`DROP TABLE "family_members"`);
    await queryRunner.query(`DROP TABLE "course_enrollments"`);
    await queryRunner.query(`DROP TABLE "courses"`);
    await queryRunner.query(`DROP TABLE "user_permissions"`);
    await queryRunner.query(`DROP TABLE "role_permissions"`);
    await queryRunner.query(`DROP TABLE "permissions"`);
    await queryRunner.query(`DROP TABLE "user_subscriptions"`);    await queryRunner.query(`DROP TABLE "subscription_plans"`);
    await queryRunner.query(`DROP TABLE "refresh_tokens"`);
    await queryRunner.query(`DROP TABLE "blacklisted_tokens"`);
    await queryRunner.query(`DROP TABLE "audit_logs"`);
    await queryRunner.query(`DROP TABLE "notifications"`);
    await queryRunner.query(`DROP TABLE "payments"`);
    await queryRunner.query(`DROP TABLE "invoices"`);
    await queryRunner.query(`DROP TABLE "appointments"`);
    await queryRunner.query(`DROP TABLE "documents"`);
    await queryRunner.query(`DROP TABLE "request_status_history"`);
    await queryRunner.query(`DROP TABLE "service_requests"`);
    await queryRunner.query(`DROP TABLE "services"`);
    await queryRunner.query(`DROP TABLE "service_types"`);
    await queryRunner.query(`DROP TABLE "user_profiles"`);
    await queryRunner.query(`DROP TABLE "users"`);
    await queryRunner.query(`DROP TABLE "roles"`);

    // Drop extension
    await queryRunner.query(`DROP EXTENSION IF EXISTS "uuid-ossp"`);
  }
}
