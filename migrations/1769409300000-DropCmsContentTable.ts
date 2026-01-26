import { MigrationInterface, QueryRunner } from 'typeorm';

export class DropCmsContentTable1769409300000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // Drop cms_content table
    await queryRunner.query(`DROP TABLE IF EXISTS "cms_content" CASCADE`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Recreate cms_content table if needed to rollback
    await queryRunner.query(`
      CREATE TABLE "cms_content" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "type" character varying NOT NULL,
        "title" character varying NOT NULL,
        "slug" character varying NOT NULL,
        "content" text NOT NULL,
        "author" uuid,
        "publish" boolean NOT NULL DEFAULT false,
        "status" character varying NOT NULL DEFAULT 'draft',
        "views" integer NOT NULL DEFAULT 0,
        "created" TIMESTAMP NOT NULL DEFAULT now(),
        "updated" TIMESTAMP NOT NULL DEFAULT now(),
        CONSTRAINT "PK_cms_content" PRIMARY KEY ("id"),
        CONSTRAINT "UQ_cms_content_slug" UNIQUE ("slug")
      )
    `);

    // Create index on slug
    await queryRunner.query(
      `CREATE INDEX "IDX_cms_content_slug" ON "cms_content" ("slug")`,
    );

    // Create index on type
    await queryRunner.query(
      `CREATE INDEX "IDX_cms_content_type" ON "cms_content" ("type")`,
    );

    // Create index on status
    await queryRunner.query(
      `CREATE INDEX "IDX_cms_content_status" ON "cms_content" ("status")`,
    );
  }
}
