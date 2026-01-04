import { DataSource } from 'typeorm';
import { Role } from '../src/modules/roles/entities/role.entity';

export async function seedPermissions(dataSource: DataSource) {
  const roleRepository = dataSource.getRepository(Role);

  // Create default roles
  const roles = [
    { name: 'super_admin', description: 'Super Administrator' },
    { name: 'admin', description: 'Administrator' },
    { name: 'operator', description: 'Operator' },
    { name: 'customer', description: 'Customer' },
  ];

  for (const roleData of roles) {
    const existingRole = await roleRepository.findOne({
      where: { name: roleData.name },
    });

    if (!existingRole) {
      const role = roleRepository.create(roleData);
      await roleRepository.save(role);
      console.log(`Created role: ${roleData.name}`);
    }
  }
}

// Run if called directly
if (require.main === module) {
  import('../src/config/data-source').then(async ({ AppDataSource }) => {
    await AppDataSource.initialize();
    await seedPermissions(AppDataSource);
    await AppDataSource.destroy();
    console.log('Permissions seeding completed');
  });
}