import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableForeignKey,
} from 'typeorm';

export class RestructureServicesAndServiceTypes1769500000000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // Step 1: Rename existing service_types table to services
    await queryRunner.renameTable('service_types', 'services');

    // Step 2: Add service_type_id column to services table
    await queryRunner.query(`
      ALTER TABLE services 
      ADD COLUMN service_type_id uuid NULL
    `);

    // Step 3: Create new service_types table (simple one with just id and name)
    await queryRunner.createTable(
      new Table({
        name: 'service_types',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            generationStrategy: 'uuid',
            default: 'uuid_generate_v4()',
          },
          {
            name: 'name',
            type: 'varchar',
            length: '100',
          },
          {
            name: 'is_active',
            type: 'boolean',
            default: true,
          },
          {
            name: 'created_at',
            type: 'timestamp',
            default: 'CURRENT_TIMESTAMP',
          },
          {
            name: 'updated_at',
            type: 'timestamp',
            default: 'CURRENT_TIMESTAMP',
          },
        ],
      }),
      true,
    );

    // Step 4: Insert default service types
    await queryRunner.query(`
      INSERT INTO service_types (name, is_active) VALUES 
      ('Tax Services', true),
      ('Legal Services', true),
      ('Administrative Services', true)
    `);

    // Step 5: Get the first service type ID and set it for all existing services
    const [defaultServiceType] = await queryRunner.query(
      `SELECT id FROM service_types WHERE name = 'Tax Services' LIMIT 1`,
    );

    if (defaultServiceType) {
      await queryRunner.query(`
        UPDATE services 
        SET service_type_id = '${defaultServiceType.id}'
        WHERE service_type_id IS NULL
      `);
    }

    // Step 6: Add foreign key constraint
    await queryRunner.createForeignKey(
      'services',
      new TableForeignKey({
        columnNames: ['service_type_id'],
        referencedTableName: 'service_types',
        referencedColumnNames: ['id'],
        onDelete: 'SET NULL',
        onUpdate: 'CASCADE',
      }),
    );

    // Step 7: Update appointments table foreign key if it references the old table
    // First, drop old constraint
    const appointmentsTable = await queryRunner.getTable('appointments');
    if (appointmentsTable) {
      const oldForeignKey = appointmentsTable.foreignKeys.find(
        (fk) => fk.columnNames.indexOf('service_type_id') !== -1,
      );
      if (oldForeignKey) {
        await queryRunner.dropForeignKey('appointments', oldForeignKey);
      }

      // Rename the column to service_id
      await queryRunner.query(`
        ALTER TABLE appointments 
        RENAME COLUMN service_type_id TO service_id
      `);

      // Add new foreign key
      await queryRunner.createForeignKey(
        'appointments',
        new TableForeignKey({
          columnNames: ['service_id'],
          referencedTableName: 'services',
          referencedColumnNames: ['id'],
          onDelete: 'SET NULL',
          onUpdate: 'CASCADE',
        }),
      );
    }

    // Step 8: Update service_requests table foreign key
    const serviceRequestsTable = await queryRunner.getTable('service_requests');
    if (serviceRequestsTable) {
      const oldForeignKey = serviceRequestsTable.foreignKeys.find(
        (fk) => fk.columnNames.indexOf('service_type_id') !== -1,
      );
      if (oldForeignKey) {
        await queryRunner.dropForeignKey('service_requests', oldForeignKey);
      }

      // Rename the column to service_id
      await queryRunner.query(`
        ALTER TABLE service_requests 
        RENAME COLUMN service_type_id TO service_id
      `);

      // Add new foreign key
      await queryRunner.createForeignKey(
        'service_requests',
        new TableForeignKey({
          columnNames: ['service_id'],
          referencedTableName: 'services',
          referencedColumnNames: ['id'],
          onDelete: 'SET NULL',
          onUpdate: 'CASCADE',
        }),
      );
    }
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Reverse the migration

    // Step 1: Drop foreign keys
    const serviceRequestsTable = await queryRunner.getTable('service_requests');
    if (serviceRequestsTable) {
      const fk = serviceRequestsTable.foreignKeys.find(
        (fk) => fk.columnNames.indexOf('service_id') !== -1,
      );
      if (fk) {
        await queryRunner.dropForeignKey('service_requests', fk);
      }
      await queryRunner.query(`
        ALTER TABLE service_requests 
        RENAME COLUMN service_id TO service_type_id
      `);
    }

    const appointmentsTable = await queryRunner.getTable('appointments');
    if (appointmentsTable) {
      const fk = appointmentsTable.foreignKeys.find(
        (fk) => fk.columnNames.indexOf('service_id') !== -1,
      );
      if (fk) {
        await queryRunner.dropForeignKey('appointments', fk);
      }
      await queryRunner.query(`
        ALTER TABLE appointments 
        RENAME COLUMN service_id TO service_type_id
      `);
    }

    const servicesTable = await queryRunner.getTable('services');
    if (servicesTable) {
      const fk = servicesTable.foreignKeys.find(
        (fk) => fk.columnNames.indexOf('service_type_id') !== -1,
      );
      if (fk) {
        await queryRunner.dropForeignKey('services', fk);
      }
    }

    // Step 2: Remove service_type_id column from services
    await queryRunner.query(`
      ALTER TABLE services 
      DROP COLUMN service_type_id
    `);

    // Step 3: Rename services back to service_types
    await queryRunner.renameTable('services', 'service_types');

    // Step 4: Drop the new service_types table (the simple one)
    // First we need to temporarily handle the name conflict
    await queryRunner.query(`DROP TABLE IF EXISTS service_types_new`);

    // Step 5: Recreate foreign keys on the original tables
    if (serviceRequestsTable) {
      await queryRunner.createForeignKey(
        'service_requests',
        new TableForeignKey({
          columnNames: ['service_type_id'],
          referencedTableName: 'service_types',
          referencedColumnNames: ['id'],
          onDelete: 'SET NULL',
          onUpdate: 'CASCADE',
        }),
      );
    }

    if (appointmentsTable) {
      await queryRunner.createForeignKey(
        'appointments',
        new TableForeignKey({
          columnNames: ['service_type_id'],
          referencedTableName: 'service_types',
          referencedColumnNames: ['id'],
          onDelete: 'SET NULL',
          onUpdate: 'CASCADE',
        }),
      );
    }
  }
}
