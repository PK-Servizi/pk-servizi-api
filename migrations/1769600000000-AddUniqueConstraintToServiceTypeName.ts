import { MigrationInterface, QueryRunner, TableUnique } from 'typeorm';

export class AddUniqueConstraintToServiceTypeName1769600000000
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    // First, remove duplicate service types, keeping only the first occurrence
    await queryRunner.query(`
      DELETE FROM service_types a USING (
        SELECT MIN(created_at) as created_at, name
        FROM service_types
        GROUP BY name
        HAVING COUNT(*) > 1
      ) b
      WHERE a.name = b.name 
      AND a.created_at > b.created_at
    `);

    // Add unique constraint to the name column
    await queryRunner.createUniqueConstraint(
      'service_types',
      new TableUnique({
        name: 'UQ_service_types_name',
        columnNames: ['name'],
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Drop the unique constraint
    await queryRunner.dropUniqueConstraint(
      'service_types',
      'UQ_service_types_name',
    );
  }
}
