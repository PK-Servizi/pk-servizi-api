import { MigrationInterface, QueryRunner } from 'typeorm';

export class OptimizeDatabase1704196800001 implements MigrationInterface {
  name = 'OptimizeDatabase1704196800001';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // Add indexes for frequently queried fields
    
    // Service Requests - Status and User queries
    await queryRunner.query(`CREATE INDEX IF NOT EXISTS "idx_service_requests_status" ON "service_requests" ("status")`);
    await queryRunner.query(`CREATE INDEX IF NOT EXISTS "idx_service_requests_user_id" ON "service_requests" ("user_id")`);
    await queryRunner.query(`CREATE INDEX IF NOT EXISTS "idx_service_requests_operator_id" ON "service_requests" ("assigned_operator_id")`);
    await queryRunner.query(`CREATE INDEX IF NOT EXISTS "idx_service_requests_created_at" ON "service_requests" ("created_at")`);
    
    // Documents - Service Request and Category queries
    await queryRunner.query(`CREATE INDEX IF NOT EXISTS "idx_documents_service_request_id" ON "documents" ("service_request_id")`);
    await queryRunner.query(`CREATE INDEX IF NOT EXISTS "idx_documents_category" ON "documents" ("category")`);
    await queryRunner.query(`CREATE INDEX IF NOT EXISTS "idx_documents_status" ON "documents" ("status")`);
    
    // Appointments - Date and User queries
    await queryRunner.query(`CREATE INDEX IF NOT EXISTS "idx_appointments_date" ON "appointments" ("appointment_date")`);
    await queryRunner.query(`CREATE INDEX IF NOT EXISTS "idx_appointments_user_id" ON "appointments" ("user_id")`);
    await queryRunner.query(`CREATE INDEX IF NOT EXISTS "idx_appointments_operator_id" ON "appointments" ("operator_id")`);
    await queryRunner.query(`CREATE INDEX IF NOT EXISTS "idx_appointments_status" ON "appointments" ("status")`);
    
    // Payments - User and Status queries
    await queryRunner.query(`CREATE INDEX IF NOT EXISTS "idx_payments_user_id" ON "payments" ("user_id")`);
    await queryRunner.query(`CREATE INDEX IF NOT EXISTS "idx_payments_status" ON "payments" ("status")`);
    await queryRunner.query(`CREATE INDEX IF NOT EXISTS "idx_payments_created_at" ON "payments" ("created_at")`);
    
    // Notifications - User and Read status
    await queryRunner.query(`CREATE INDEX IF NOT EXISTS "idx_notifications_user_id" ON "notifications" ("user_id")`);
    await queryRunner.query(`CREATE INDEX IF NOT EXISTS "idx_notifications_is_read" ON "notifications" ("is_read")`);
    
    // Users - Email and Fiscal Code (unique but add for performance)
    await queryRunner.query(`CREATE INDEX IF NOT EXISTS "idx_users_fiscal_code" ON "users" ("fiscal_code")`);
    await queryRunner.query(`CREATE INDEX IF NOT EXISTS "idx_users_role_id" ON "users" ("role_id")`);
    
    // Audit Logs - User and Action queries
    await queryRunner.query(`CREATE INDEX IF NOT EXISTS "idx_audit_logs_user_id" ON "audit_logs" ("user_id")`);
    await queryRunner.query(`CREATE INDEX IF NOT EXISTS "idx_audit_logs_action" ON "audit_logs" ("action")`);
    await queryRunner.query(`CREATE INDEX IF NOT EXISTS "idx_audit_logs_created_at" ON "audit_logs" ("created_at")`);
    
    // Composite indexes for common query patterns
    await queryRunner.query(`CREATE INDEX IF NOT EXISTS "idx_service_requests_user_status" ON "service_requests" ("user_id", "status")`);
    await queryRunner.query(`CREATE INDEX IF NOT EXISTS "idx_documents_service_category" ON "documents" ("service_request_id", "category")`);
    await queryRunner.query(`CREATE INDEX IF NOT EXISTS "idx_appointments_user_date" ON "appointments" ("user_id", "appointment_date")`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Drop all indexes
    await queryRunner.query(`DROP INDEX IF EXISTS "idx_service_requests_status"`);
    await queryRunner.query(`DROP INDEX IF EXISTS "idx_service_requests_user_id"`);
    await queryRunner.query(`DROP INDEX IF EXISTS "idx_service_requests_operator_id"`);
    await queryRunner.query(`DROP INDEX IF EXISTS "idx_service_requests_created_at"`);
    
    await queryRunner.query(`DROP INDEX IF EXISTS "idx_documents_service_request_id"`);
    await queryRunner.query(`DROP INDEX IF EXISTS "idx_documents_category"`);
    await queryRunner.query(`DROP INDEX IF EXISTS "idx_documents_status"`);
    
    await queryRunner.query(`DROP INDEX IF EXISTS "idx_appointments_date"`);
    await queryRunner.query(`DROP INDEX IF EXISTS "idx_appointments_user_id"`);
    await queryRunner.query(`DROP INDEX IF EXISTS "idx_appointments_operator_id"`);
    await queryRunner.query(`DROP INDEX IF EXISTS "idx_appointments_status"`);
    
    await queryRunner.query(`DROP INDEX IF EXISTS "idx_payments_user_id"`);
    await queryRunner.query(`DROP INDEX IF EXISTS "idx_payments_status"`);
    await queryRunner.query(`DROP INDEX IF EXISTS "idx_payments_created_at"`);
    
    await queryRunner.query(`DROP INDEX IF EXISTS "idx_notifications_user_id"`);
    await queryRunner.query(`DROP INDEX IF EXISTS "idx_notifications_is_read"`);
    
    await queryRunner.query(`DROP INDEX IF EXISTS "idx_users_fiscal_code"`);
    await queryRunner.query(`DROP INDEX IF EXISTS "idx_users_role_id"`);
    
    await queryRunner.query(`DROP INDEX IF EXISTS "idx_audit_logs_user_id"`);
    await queryRunner.query(`DROP INDEX IF EXISTS "idx_audit_logs_action"`);
    await queryRunner.query(`DROP INDEX IF EXISTS "idx_audit_logs_created_at"`);
    
    await queryRunner.query(`DROP INDEX IF EXISTS "idx_service_requests_user_status"`);
    await queryRunner.query(`DROP INDEX IF EXISTS "idx_documents_service_category"`);
    await queryRunner.query(`DROP INDEX IF EXISTS "idx_appointments_user_date"`);
  }
}
