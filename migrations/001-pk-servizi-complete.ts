import { MigrationInterface, QueryRunner } from 'typeorm';

export class PKServiziComplete1704067500000 implements MigrationInterface {
  name = 'PKServiziComplete1704067500000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // Create roles table
    const rolesExists = await queryRunner.hasTable('roles');
    if (!rolesExists) {
      await queryRunner.query(`
        CREATE TABLE "roles" (
          "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
          "name" varchar(50) NOT NULL UNIQUE,
          "description" text,
          "created_at" timestamp DEFAULT now(),
          "updated_at" timestamp DEFAULT now()
        )
      `);
    }

    // Create permissions table
    const permissionsExists = await queryRunner.hasTable('permissions');
    if (!permissionsExists) {
      await queryRunner.query(`
        CREATE TABLE "permissions" (
          "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
          "name" varchar(100) NOT NULL UNIQUE,
          "resource" varchar(50) NOT NULL,
          "action" varchar(50) NOT NULL,
          "description" text,
          "created_at" timestamp DEFAULT now(),
          "updated_at" timestamp DEFAULT now()
        )
      `);
    }

    // Create users table
    const usersExists = await queryRunner.hasTable('users');
    if (!usersExists) {
      await queryRunner.query(`
        CREATE TABLE "users" (
          "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
          "email" varchar(255) NOT NULL UNIQUE,
          "password" varchar(255) NOT NULL,
          "full_name" varchar(255) NOT NULL,
          "fiscal_code" varchar(16),
          "phone" varchar(20),
          "address" text,
          "city" varchar(100),
          "postal_code" varchar(10),
          "province" varchar(2),
          "birth_date" date,
          "birth_place" varchar(100),
          "gdpr_consent" boolean DEFAULT false,
          "gdpr_consent_date" timestamp,
          "privacy_consent" boolean DEFAULT false,
          "privacy_consent_date" timestamp,
          "is_active" boolean DEFAULT true,
          "role_id" uuid,
          "created_at" timestamp DEFAULT now(),
          "updated_at" timestamp DEFAULT now(),
          FOREIGN KEY ("role_id") REFERENCES "roles"("id")
        )
      `);
    }

    // Create junction tables
    const rolePermissionsExists = await queryRunner.hasTable('role_permissions');
    if (!rolePermissionsExists) {
      await queryRunner.query(`
        CREATE TABLE "role_permissions" (
          "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
          "role_id" uuid NOT NULL,
          "permission_id" uuid NOT NULL,
          "created_at" timestamp DEFAULT now(),
          FOREIGN KEY ("role_id") REFERENCES "roles"("id") ON DELETE CASCADE,
          FOREIGN KEY ("permission_id") REFERENCES "permissions"("id") ON DELETE CASCADE,
          UNIQUE("role_id", "permission_id")
        )
      `);
    }

    const userPermissionsExists = await queryRunner.hasTable('user_permissions');
    if (!userPermissionsExists) {
      await queryRunner.query(`
        CREATE TABLE "user_permissions" (
          "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
          "user_id" uuid NOT NULL,
          "permission_id" uuid NOT NULL,
          "created_at" timestamp DEFAULT now(),
          FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE,
          FOREIGN KEY ("permission_id") REFERENCES "permissions"("id") ON DELETE CASCADE,
          UNIQUE("user_id", "permission_id")
        )
      `);
    }

    const refreshTokensExists = await queryRunner.hasTable('refresh_tokens');
    if (!refreshTokensExists) {
      await queryRunner.query(`
        CREATE TABLE "refresh_tokens" (
          "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
          "token" varchar(500) NOT NULL UNIQUE,
          "user_id" uuid NOT NULL,
          "expires_at" timestamp NOT NULL,
          "is_revoked" boolean DEFAULT false,
          "created_at" timestamp DEFAULT now(),
          FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE
        )
      `);
    }

    // Create subscription tables
    const subscriptionPlansExists = await queryRunner.hasTable('subscription_plans');
    if (!subscriptionPlansExists) {
      await queryRunner.query(`
        CREATE TABLE "subscription_plans" (
          "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
          "name" varchar(100) NOT NULL,
          "description" text,
          "price_monthly" decimal(10,2),
          "price_annual" decimal(10,2),
          "features" jsonb,
          "service_limits" jsonb,
          "is_active" boolean DEFAULT true,
          "created_at" timestamp DEFAULT now(),
          "updated_at" timestamp DEFAULT now()
        )
      `);
    }

    const userSubscriptionsExists = await queryRunner.hasTable('user_subscriptions');
    if (!userSubscriptionsExists) {
      await queryRunner.query(`
        CREATE TABLE "user_subscriptions" (
          "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
          "user_id" uuid NOT NULL,
          "plan_id" uuid NOT NULL,
          "status" varchar(20) DEFAULT 'active',
          "billing_cycle" varchar(10) DEFAULT 'monthly',
          "start_date" timestamp NOT NULL,
          "end_date" timestamp,
          "auto_renew" boolean DEFAULT true,
          "stripe_subscription_id" varchar(255),
          "created_at" timestamp DEFAULT now(),
          "updated_at" timestamp DEFAULT now(),
          FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE,
          FOREIGN KEY ("plan_id") REFERENCES "subscription_plans"("id")
        )
      `);
    }

    // Create service tables
    const serviceTypesExists = await queryRunner.hasTable('service_types');
    if (!serviceTypesExists) {
      await queryRunner.query(`
        CREATE TABLE "service_types" (
          "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
          "name" varchar(100) NOT NULL,
          "code" varchar(20) NOT NULL UNIQUE,
          "description" text,
          "required_documents" jsonb,
          "form_schema" jsonb,
          "is_active" boolean DEFAULT true,
          "created_at" timestamp DEFAULT now(),
          "updated_at" timestamp DEFAULT now()
        )
      `);
    }

    const serviceRequestsExists = await queryRunner.hasTable('service_requests');
    if (!serviceRequestsExists) {
      await queryRunner.query(`
        CREATE TABLE "service_requests" (
          "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
          "user_id" uuid NOT NULL,
          "service_type_id" uuid NOT NULL,
          "status" varchar(20) DEFAULT 'draft',
          "form_data" jsonb,
          "internal_notes" text,
          "user_notes" text,
          "assigned_operator_id" uuid,
          "priority" varchar(10) DEFAULT 'normal',
          "submitted_at" timestamp,
          "completed_at" timestamp,
          "created_at" timestamp DEFAULT now(),
          "updated_at" timestamp DEFAULT now(),
          FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE,
          FOREIGN KEY ("service_type_id") REFERENCES "service_types"("id"),
          FOREIGN KEY ("assigned_operator_id") REFERENCES "users"("id")
        )
      `);
    }

    const documentsExists = await queryRunner.hasTable('documents');
    if (!documentsExists) {
      await queryRunner.query(`
        CREATE TABLE "documents" (
          "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
          "service_request_id" uuid NOT NULL,
          "category" varchar(100) NOT NULL,
          "filename" varchar(255) NOT NULL,
          "original_filename" varchar(255) NOT NULL,
          "file_path" varchar(500) NOT NULL,
          "file_size" integer NOT NULL,
          "mime_type" varchar(100) NOT NULL,
          "status" varchar(20) DEFAULT 'pending',
          "is_required" boolean DEFAULT false,
          "admin_notes" text,
          "version" integer DEFAULT 1,
          "created_at" timestamp DEFAULT now(),
          "updated_at" timestamp DEFAULT now(),
          FOREIGN KEY ("service_request_id") REFERENCES "service_requests"("id") ON DELETE CASCADE
        )
      `);
    }

    const requestStatusHistoryExists = await queryRunner.hasTable('request_status_history');
    if (!requestStatusHistoryExists) {
      await queryRunner.query(`
        CREATE TABLE "request_status_history" (
          "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
          "service_request_id" uuid NOT NULL,
          "from_status" varchar(20),
          "to_status" varchar(20) NOT NULL,
          "changed_by_id" uuid NOT NULL,
          "notes" text,
          "created_at" timestamp DEFAULT now(),
          FOREIGN KEY ("service_request_id") REFERENCES "service_requests"("id") ON DELETE CASCADE,
          FOREIGN KEY ("changed_by_id") REFERENCES "users"("id")
        )
      `);
    }

    // Create appointment and course tables
    const appointmentsExists = await queryRunner.hasTable('appointments');
    if (!appointmentsExists) {
      await queryRunner.query(`
        CREATE TABLE "appointments" (
          "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
          "user_id" uuid NOT NULL,
          "service_type_id" uuid,
          "operator_id" uuid,
          "title" varchar(255) NOT NULL,
          "description" text,
          "appointment_date" timestamp NOT NULL,
          "duration_minutes" integer DEFAULT 60,
          "status" varchar(20) DEFAULT 'scheduled',
          "location" varchar(255),
          "notes" text,
          "created_at" timestamp DEFAULT now(),
          "updated_at" timestamp DEFAULT now(),
          FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE,
          FOREIGN KEY ("service_type_id") REFERENCES "service_types"("id"),
          FOREIGN KEY ("operator_id") REFERENCES "users"("id")
        )
      `);
    }

    const coursesExists = await queryRunner.hasTable('courses');
    if (!coursesExists) {
      await queryRunner.query(`
        CREATE TABLE "courses" (
          "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
          "title" varchar(255) NOT NULL,
          "description" text,
          "content" text,
          "instructor_id" uuid,
          "max_participants" integer,
          "start_date" timestamp,
          "end_date" timestamp,
          "location" varchar(255),
          "price" decimal(10,2),
          "status" varchar(20) DEFAULT 'draft',
          "created_at" timestamp DEFAULT now(),
          "updated_at" timestamp DEFAULT now(),
          FOREIGN KEY ("instructor_id") REFERENCES "users"("id")
        )
      `);
    }

    const courseEnrollmentsExists = await queryRunner.hasTable('course_enrollments');
    if (!courseEnrollmentsExists) {
      await queryRunner.query(`
        CREATE TABLE "course_enrollments" (
          "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
          "course_id" uuid NOT NULL,
          "user_id" uuid NOT NULL,
          "enrollment_date" timestamp DEFAULT now(),
          "status" varchar(20) DEFAULT 'enrolled',
          "completion_date" timestamp,
          "certificate_issued" boolean DEFAULT false,
          "created_at" timestamp DEFAULT now(),
          "updated_at" timestamp DEFAULT now(),
          FOREIGN KEY ("course_id") REFERENCES "courses"("id") ON DELETE CASCADE,
          FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE,
          UNIQUE("course_id", "user_id")
        )
      `);
    }

    // Create payment and notification tables
    const paymentsExists = await queryRunner.hasTable('payments');
    if (!paymentsExists) {
      await queryRunner.query(`
        CREATE TABLE "payments" (
          "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
          "user_id" uuid NOT NULL,
          "subscription_id" uuid,
          "amount" decimal(10,2) NOT NULL,
          "currency" varchar(3) DEFAULT 'EUR',
          "status" varchar(20) DEFAULT 'pending',
          "payment_method" varchar(50),
          "stripe_payment_intent_id" varchar(255),
          "stripe_charge_id" varchar(255),
          "description" text,
          "metadata" jsonb,
          "paid_at" timestamp,
          "created_at" timestamp DEFAULT now(),
          "updated_at" timestamp DEFAULT now(),
          FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE,
          FOREIGN KEY ("subscription_id") REFERENCES "user_subscriptions"("id")
        )
      `);
    }

    const notificationsExists = await queryRunner.hasTable('notifications');
    if (!notificationsExists) {
      await queryRunner.query(`
        CREATE TABLE "notifications" (
          "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
          "user_id" uuid NOT NULL,
          "title" varchar(255) NOT NULL,
          "message" text NOT NULL,
          "type" varchar(50) DEFAULT 'info',
          "is_read" boolean DEFAULT false,
          "action_url" varchar(500),
          "metadata" jsonb,
          "created_at" timestamp DEFAULT now(),
          "read_at" timestamp,
          FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE
        )
      `);
    }

    const auditLogsExists = await queryRunner.hasTable('audit_logs');
    if (!auditLogsExists) {
      await queryRunner.query(`
        CREATE TABLE "audit_logs" (
          "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
          "user_id" uuid,
          "action" varchar(100) NOT NULL,
          "resource_type" varchar(50) NOT NULL,
          "resource_id" uuid,
          "old_values" jsonb,
          "new_values" jsonb,
          "ip_address" varchar(45),
          "user_agent" text,
          "created_at" timestamp DEFAULT now(),
          FOREIGN KEY ("user_id") REFERENCES "users"("id")
        )
      `);
    }

    const cmsContentExists = await queryRunner.hasTable('cms_content');
    if (!cmsContentExists) {
      await queryRunner.query(`
        CREATE TABLE "cms_content" (
          "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
          "type" varchar(50) NOT NULL,
          "title" varchar(255) NOT NULL,
          "content" text,
          "slug" varchar(255) UNIQUE,
          "status" varchar(20) DEFAULT 'draft',
          "author_id" uuid,
          "published_at" timestamp,
          "created_at" timestamp DEFAULT now(),
          "updated_at" timestamp DEFAULT now(),
          FOREIGN KEY ("author_id") REFERENCES "users"("id")
        )
      `);
    }

    // Create indexes
    await queryRunner.query(`CREATE INDEX IF NOT EXISTS "idx_users_email" ON "users"("email")`);
    await queryRunner.query(`CREATE INDEX IF NOT EXISTS "idx_users_role_id" ON "users"("role_id")`);
    await queryRunner.query(`CREATE INDEX IF NOT EXISTS "idx_service_requests_user_id" ON "service_requests"("user_id")`);
    await queryRunner.query(`CREATE INDEX IF NOT EXISTS "idx_service_requests_status" ON "service_requests"("status")`);
    await queryRunner.query(`CREATE INDEX IF NOT EXISTS "idx_documents_service_request_id" ON "documents"("service_request_id")`);
    await queryRunner.query(`CREATE INDEX IF NOT EXISTS "idx_appointments_user_id" ON "appointments"("user_id")`);
    await queryRunner.query(`CREATE INDEX IF NOT EXISTS "idx_appointments_date" ON "appointments"("appointment_date")`);
    await queryRunner.query(`CREATE INDEX IF NOT EXISTS "idx_notifications_user_id" ON "notifications"("user_id")`);
    await queryRunner.query(`CREATE INDEX IF NOT EXISTS "idx_notifications_is_read" ON "notifications"("is_read")`);
    await queryRunner.query(`CREATE INDEX IF NOT EXISTS "idx_audit_logs_user_id" ON "audit_logs"("user_id")`);
    await queryRunner.query(`CREATE INDEX IF NOT EXISTS "idx_audit_logs_created_at" ON "audit_logs"("created_at")`);

    // Insert seed data
    const rolesCount = await queryRunner.query(`SELECT COUNT(*) FROM "roles"`);
    if (rolesCount[0].count === '0') {
      await queryRunner.query(`
        INSERT INTO "roles" ("name", "description") VALUES
        ('client', 'Regular client with access to services'),
        ('customer', 'Regular customer with access to services'),
        ('admin', 'System administrator with full access'),
        ('operator', 'CAF consultant/operator'),
        ('finance', 'Finance team member')
      `);
    }

    const serviceTypesCount = await queryRunner.query(`SELECT COUNT(*) FROM "service_types"`);
    if (serviceTypesCount[0].count === '0') {
      await queryRunner.query(`
        INSERT INTO "service_types" ("name", "code", "description", "required_documents", "form_schema") VALUES
        ('ISEE', 'ISEE', 'Indicatore della Situazione Economica Equivalente', 
         '["documento_identita", "codice_fiscale", "certificazione_unica", "dichiarazione_redditi", "estratto_conto", "certificato_residenza"]',
         '{"sections": [{"name": "nucleo_familiare", "fields": ["componenti", "stato_civile"]}, {"name": "abitazione", "fields": ["tipo_abitazione", "valore_immobile"]}, {"name": "redditi", "fields": ["reddito_lavoro", "pensioni", "altri_redditi"]}, {"name": "patrimonio", "fields": ["conti_correnti", "investimenti", "immobili"]}, {"name": "veicoli", "fields": ["auto", "moto", "imbarcazioni"]}, {"name": "disabilita", "fields": ["presenza_disabili", "grado_disabilita"]}, {"name": "universita", "fields": ["studenti_universitari", "sede_studio"]}, {"name": "minori", "fields": ["genitori_non_conviventi", "assegni_mantenimento"]}]}'),
        ('Modello 730', '730', 'Dichiarazione dei redditi per dipendenti e pensionati',
         '["documento_identita", "codice_fiscale", "certificazione_unica", "spese_sanitarie", "spese_istruzione", "mutui"]',
         '{"sections": [{"name": "dati_anagrafici", "fields": ["nome", "cognome", "codice_fiscale", "residenza"]}, {"name": "redditi", "fields": ["certificazione_unica", "redditi_inps", "altri_redditi"]}, {"name": "immobili", "fields": ["prima_casa", "altri_immobili", "cedolare_secca"]}, {"name": "spese_detraibili", "fields": ["spese_sanitarie", "spese_istruzione", "ristrutturazioni"]}, {"name": "famiglia", "fields": ["coniuge", "figli_carico", "altri_familiari"]}, {"name": "previdenza", "fields": ["contributi_volontari", "fondi_pensione"]}]}'),
        ('IMU', 'IMU', 'Imposta Municipale Unica',
         '["documento_identita", "codice_fiscale", "visura_catastale", "atto_proprieta"]',
         '{"sections": [{"name": "contribuente", "fields": ["dati_anagrafici", "codice_fiscale"]}, {"name": "immobili", "fields": ["codice_catastale", "categoria", "rendita", "quota_possesso"]}, {"name": "utilizzo", "fields": ["prima_casa", "affitto", "uso_proprio"]}, {"name": "agevolazioni", "fields": ["prima_casa", "rurali", "storici"]}, {"name": "variazioni", "fields": ["acquisto", "vendita", "successione"]}, {"name": "pagamenti", "fields": ["acconto", "saldo", "ravvedimento"]}]}')
      `);
    }

    const plansCount = await queryRunner.query(`SELECT COUNT(*) FROM "subscription_plans"`);
    if (plansCount[0].count === '0') {
      await queryRunner.query(`
        INSERT INTO "subscription_plans" ("name", "description", "price_monthly", "price_annual", "features", "service_limits") VALUES
        ('Basic', 'Piano base per servizi essenziali', 9.99, 99.99, 
         '["isee", "730_basic", "supporto_email"]', 
         '{"max_requests_per_month": 3, "max_documents": 10}'),
        ('Premium', 'Piano completo con tutti i servizi', 19.99, 199.99,
         '["isee", "730_complete", "imu", "supporto_prioritario", "consulenza_telefonica"]',
         '{"max_requests_per_month": 10, "max_documents": 50}'),
        ('Professional', 'Piano per professionisti e aziende', 39.99, 399.99,
         '["tutti_servizi", "supporto_dedicato", "consulenza_illimitata", "priorita_massima"]',
         '{"max_requests_per_month": -1, "max_documents": -1}')
      `);
    }
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE IF EXISTS "cms_content"`);
    await queryRunner.query(`DROP TABLE IF EXISTS "audit_logs"`);
    await queryRunner.query(`DROP TABLE IF EXISTS "notifications"`);
    await queryRunner.query(`DROP TABLE IF EXISTS "payments"`);
    await queryRunner.query(`DROP TABLE IF EXISTS "course_enrollments"`);
    await queryRunner.query(`DROP TABLE IF EXISTS "courses"`);
    await queryRunner.query(`DROP TABLE IF EXISTS "appointments"`);
    await queryRunner.query(`DROP TABLE IF EXISTS "request_status_history"`);
    await queryRunner.query(`DROP TABLE IF EXISTS "documents"`);
    await queryRunner.query(`DROP TABLE IF EXISTS "service_requests"`);
    await queryRunner.query(`DROP TABLE IF EXISTS "service_types"`);
    await queryRunner.query(`DROP TABLE IF EXISTS "user_subscriptions"`);
    await queryRunner.query(`DROP TABLE IF EXISTS "subscription_plans"`);
    await queryRunner.query(`DROP TABLE IF EXISTS "refresh_tokens"`);
    await queryRunner.query(`DROP TABLE IF EXISTS "user_permissions"`);
    await queryRunner.query(`DROP TABLE IF EXISTS "role_permissions"`);
    await queryRunner.query(`DROP TABLE IF EXISTS "users"`);
    await queryRunner.query(`DROP TABLE IF EXISTS "permissions"`);
    await queryRunner.query(`DROP TABLE IF EXISTS "roles"`);
  }
}
