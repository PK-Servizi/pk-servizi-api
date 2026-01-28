import { MigrationInterface, QueryRunner } from 'typeorm';

export class FixFaqsForeignKey1738067200000 implements MigrationInterface {
  name = 'FixFaqsForeignKey1738067200000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // Drop the incorrect foreign key constraint that references service_types
    await queryRunner.query(`
      ALTER TABLE "faqs" 
      DROP CONSTRAINT IF EXISTS "FK_faqs_service_type_id"
    `);

    // Add the correct foreign key constraint that references services table
    await queryRunner.query(`
      ALTER TABLE "faqs" 
      ADD CONSTRAINT "FK_faqs_service_id" 
      FOREIGN KEY ("service_type_id") REFERENCES "services"("id") 
      ON DELETE SET NULL ON UPDATE NO ACTION
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Drop the new constraint
    await queryRunner.query(`
      ALTER TABLE "faqs" 
      DROP CONSTRAINT IF EXISTS "FK_faqs_service_id"
    `);

    // Restore the old constraint (pointing to service_types)
    await queryRunner.query(`
      ALTER TABLE "faqs" 
      ADD CONSTRAINT "FK_faqs_service_type_id" 
      FOREIGN KEY ("service_type_id") REFERENCES "service_types"("id") 
      ON DELETE SET NULL ON UPDATE NO ACTION
    `);
  }
}
