import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddServiceRequestColumns1738067100000 implements MigrationInterface {
  name = 'AddServiceRequestColumns1738067100000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // Add payment_id column
    await queryRunner.query(`
      ALTER TABLE "service_requests" 
      ADD COLUMN IF NOT EXISTS "payment_id" uuid NULL
    `);

    // Add submitted_at column
    await queryRunner.query(`
      ALTER TABLE "service_requests" 
      ADD COLUMN IF NOT EXISTS "submitted_at" TIMESTAMP NULL
    `);

    // Add completed_at column
    await queryRunner.query(`
      ALTER TABLE "service_requests" 
      ADD COLUMN IF NOT EXISTS "completed_at" TIMESTAMP NULL
    `);

    // Add form_completed_at column
    await queryRunner.query(`
      ALTER TABLE "service_requests" 
      ADD COLUMN IF NOT EXISTS "form_completed_at" TIMESTAMP NULL
    `);

    // Add documents_uploaded_at column
    await queryRunner.query(`
      ALTER TABLE "service_requests" 
      ADD COLUMN IF NOT EXISTS "documents_uploaded_at" TIMESTAMP NULL
    `);

    // Rename notes to internal_notes if it exists
    const notesColumnExists = await queryRunner.query(`
      SELECT column_name FROM information_schema.columns 
      WHERE table_name = 'service_requests' AND column_name = 'notes'
    `);
    
    if (notesColumnExists.length > 0) {
      await queryRunner.query(`
        ALTER TABLE "service_requests" 
        RENAME COLUMN "notes" TO "internal_notes"
      `);
    } else {
      // Add internal_notes column if notes doesn't exist
      await queryRunner.query(`
        ALTER TABLE "service_requests" 
        ADD COLUMN IF NOT EXISTS "internal_notes" text NULL
      `);
    }

    // Add user_notes column
    await queryRunner.query(`
      ALTER TABLE "service_requests" 
      ADD COLUMN IF NOT EXISTS "user_notes" text NULL
    `);

    // Add foreign key constraint for payment_id
    await queryRunner.query(`
      ALTER TABLE "service_requests" 
      ADD CONSTRAINT "FK_service_requests_payment_id" 
      FOREIGN KEY ("payment_id") REFERENCES "payments"("id") 
      ON DELETE SET NULL ON UPDATE NO ACTION
    `);

    // Create indexes for commonly queried columns
    await queryRunner.query(`
      CREATE INDEX IF NOT EXISTS "IDX_service_requests_payment_id" 
      ON "service_requests" ("payment_id")
    `);

    await queryRunner.query(`
      CREATE INDEX IF NOT EXISTS "IDX_service_requests_submitted_at" 
      ON "service_requests" ("submitted_at")
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Drop indexes
    await queryRunner.query(`
      DROP INDEX IF EXISTS "IDX_service_requests_submitted_at"
    `);

    await queryRunner.query(`
      DROP INDEX IF EXISTS "IDX_service_requests_payment_id"
    `);

    // Drop foreign key
    await queryRunner.query(`
      ALTER TABLE "service_requests" 
      DROP CONSTRAINT IF EXISTS "FK_service_requests_payment_id"
    `);

    // Drop columns
    await queryRunner.query(`
      ALTER TABLE "service_requests" DROP COLUMN IF EXISTS "user_notes"
    `);

    await queryRunner.query(`
      ALTER TABLE "service_requests" DROP COLUMN IF EXISTS "documents_uploaded_at"
    `);

    await queryRunner.query(`
      ALTER TABLE "service_requests" DROP COLUMN IF EXISTS "form_completed_at"
    `);

    await queryRunner.query(`
      ALTER TABLE "service_requests" DROP COLUMN IF EXISTS "completed_at"
    `);

    await queryRunner.query(`
      ALTER TABLE "service_requests" DROP COLUMN IF EXISTS "submitted_at"
    `);

    await queryRunner.query(`
      ALTER TABLE "service_requests" DROP COLUMN IF EXISTS "payment_id"
    `);

    // Rename internal_notes back to notes
    const internalNotesExists = await queryRunner.query(`
      SELECT column_name FROM information_schema.columns 
      WHERE table_name = 'service_requests' AND column_name = 'internal_notes'
    `);
    
    if (internalNotesExists.length > 0) {
      await queryRunner.query(`
        ALTER TABLE "service_requests" 
        RENAME COLUMN "internal_notes" TO "notes"
      `);
    }
  }
}
