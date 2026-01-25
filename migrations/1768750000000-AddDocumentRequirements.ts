import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

export class AddDocumentRequirements1768750000000
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    // Add document_requirements column to service_types table
    await queryRunner.addColumn(
      'service_types',
      new TableColumn({
        name: 'document_requirements',
        type: 'jsonb',
        isNullable: true,
        comment: 'Detailed document requirements with validation rules',
      }),
    );

    console.log(
      '✅ Added document_requirements column to service_types table',
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Remove document_requirements column
    await queryRunner.dropColumn('service_types', 'document_requirements');

    console.log(
      '✅ Removed document_requirements column from service_types table',
    );
  }
}
