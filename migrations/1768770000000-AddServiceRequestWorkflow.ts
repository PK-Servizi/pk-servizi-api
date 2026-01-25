import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddServiceRequestWorkflow1768770000000
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    // Add service_request_id column to payments table
    await queryRunner.query(`
      ALTER TABLE "payments"
      ADD COLUMN IF NOT EXISTS "service_request_id" uuid;
    `);

    // Add workflow tracking columns to service_requests table
    await queryRunner.query(`
      ALTER TABLE "service_requests"
      ADD COLUMN IF NOT EXISTS "payment_id" uuid,
      ADD COLUMN IF NOT EXISTS "form_completed_at" timestamp,
      ADD COLUMN IF NOT EXISTS "documents_uploaded_at" timestamp;
    `);

    // Add foreign key from payments to service_requests
    await queryRunner.query(`
      ALTER TABLE "payments"
      ADD CONSTRAINT "fk_payments_service_request"
      FOREIGN KEY ("service_request_id") 
      REFERENCES "service_requests"("id") 
      ON DELETE SET NULL;
    `);

    // Add foreign key from service_requests to payments
    await queryRunner.query(`
      ALTER TABLE "service_requests"
      ADD CONSTRAINT "fk_service_requests_payment"
      FOREIGN KEY ("payment_id") 
      REFERENCES "payments"("id") 
      ON DELETE SET NULL;
    `);

    // Create indexes for performance
    await queryRunner.query(`
      CREATE INDEX IF NOT EXISTS "idx_payments_service_request_id" 
      ON "payments"("service_request_id");
    `);

    await queryRunner.query(`
      CREATE INDEX IF NOT EXISTS "idx_service_requests_payment_id" 
      ON "service_requests"("payment_id");
    `);

    // Add new status values (if using enum, otherwise they're just strings)
    await queryRunner.query(`
      COMMENT ON COLUMN "service_requests"."status" IS 
      'Possible values: payment_pending, awaiting_form, awaiting_documents, draft, submitted, in_review, in_progress, missing_documents, completed, rejected';
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      DROP INDEX IF EXISTS "idx_service_requests_payment_id";
    `);

    await queryRunner.query(`
      DROP INDEX IF EXISTS "idx_payments_service_request_id";
    `);

    await queryRunner.query(`
      ALTER TABLE "service_requests"
      DROP CONSTRAINT IF EXISTS "fk_service_requests_payment";
    `);

    await queryRunner.query(`
      ALTER TABLE "payments"
      DROP CONSTRAINT IF EXISTS "fk_payments_service_request";
    `);

    await queryRunner.query(`
      ALTER TABLE "service_requests"
      DROP COLUMN IF EXISTS "documents_uploaded_at",
      DROP COLUMN IF EXISTS "form_completed_at",
      DROP COLUMN IF EXISTS "payment_id";
    `);

    await queryRunner.query(`
      ALTER TABLE "payments"
      DROP COLUMN IF EXISTS "service_request_id";
    `);
  }
}
