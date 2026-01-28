import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddFaqsCategoryColumn1738067000000 implements MigrationInterface {
  name = 'AddFaqsCategoryColumn1738067000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // Add category column to faqs table
    await queryRunner.query(`
      ALTER TABLE "faqs" 
      ADD COLUMN IF NOT EXISTS "category" varchar(100) NULL
    `);

    // Create index on category for filtering
    await queryRunner.query(`
      CREATE INDEX IF NOT EXISTS "IDX_faqs_category" ON "faqs" ("category")
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Drop category index
    await queryRunner.query(`
      DROP INDEX IF EXISTS "IDX_faqs_category"
    `);

    // Remove category column
    await queryRunner.query(`
      ALTER TABLE "faqs" DROP COLUMN IF EXISTS "category"
    `);
  }
}
