import { MigrationInterface, QueryRunner } from "typeorm";

export class AddAppointmentColumns1767879100000 implements MigrationInterface {
    name = 'AddAppointmentColumns1767879100000'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "appointments" ADD COLUMN IF NOT EXISTS "user_confirmed" boolean NOT NULL DEFAULT false`);
        await queryRunner.query(`ALTER TABLE "appointments" ADD COLUMN IF NOT EXISTS "user_confirmed_at" TIMESTAMP`);
        await queryRunner.query(`ALTER TABLE "appointments" ADD COLUMN IF NOT EXISTS "operator_confirmed" boolean NOT NULL DEFAULT false`);
        await queryRunner.query(`ALTER TABLE "appointments" ADD COLUMN IF NOT EXISTS "operator_confirmed_at" TIMESTAMP`);
        await queryRunner.query(`ALTER TABLE "appointments" ADD COLUMN IF NOT EXISTS "cancelled_at" TIMESTAMP`);
        await queryRunner.query(`ALTER TABLE "appointments" ADD COLUMN IF NOT EXISTS "completed_at" TIMESTAMP`);
        await queryRunner.query(`ALTER TABLE "appointments" ADD COLUMN IF NOT EXISTS "rescheduled_count" integer NOT NULL DEFAULT 0`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "appointments" DROP COLUMN IF EXISTS "rescheduled_count"`);
        await queryRunner.query(`ALTER TABLE "appointments" DROP COLUMN IF EXISTS "completed_at"`);
        await queryRunner.query(`ALTER TABLE "appointments" DROP COLUMN IF EXISTS "cancelled_at"`);
        await queryRunner.query(`ALTER TABLE "appointments" DROP COLUMN IF EXISTS "operator_confirmed_at"`);
        await queryRunner.query(`ALTER TABLE "appointments" DROP COLUMN IF EXISTS "operator_confirmed"`);
        await queryRunner.query(`ALTER TABLE "appointments" DROP COLUMN IF EXISTS "user_confirmed_at"`);
        await queryRunner.query(`ALTER TABLE "appointments" DROP COLUMN IF EXISTS "user_confirmed"`);
    }
}