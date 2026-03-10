import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateContactsTable1770000000001 implements MigrationInterface {
  name = 'CreateContactsTable1770000000001';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`);

    await queryRunner.query(`
      CREATE TABLE "contacts" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "name" character varying(200) NOT NULL,
        "email" character varying(255) NOT NULL,
        "phone" character varying(30),
        "subject" character varying(300) NOT NULL,
        "message" text NOT NULL,
        "status" character varying(20) NOT NULL DEFAULT 'new',
        "admin_notes" text,
        "created_at" TIMESTAMP NOT NULL DEFAULT now(),
        "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
        CONSTRAINT "PK_contacts" PRIMARY KEY ("id")
      )
    `);

    await queryRunner.query(
      `CREATE INDEX "IDX_contacts_status" ON "contacts" ("status")`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_contacts_email" ON "contacts" ("email")`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_contacts_created_at" ON "contacts" ("created_at")`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP INDEX "IDX_contacts_created_at"`);
    await queryRunner.query(`DROP INDEX "IDX_contacts_email"`);
    await queryRunner.query(`DROP INDEX "IDX_contacts_status"`);
    await queryRunner.query(`DROP TABLE "contacts"`);
  }
}
