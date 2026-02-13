import 'reflect-metadata';
import { AppDataSource } from '../src/config/data-source';
import { Role } from '../src/modules/roles/entities/role.entity';
import { User } from '../src/modules/users/entities/user.entity';
import * as bcrypt from 'bcryptjs';
import { RoleEnum } from '../src/modules/roles/role.enum';
import { seedServiceTypes } from './service-types-seed';
import { seedRolePermissions } from './role-permission-seed';
import { seedServicesWithDocuments } from './services-with-documents-seed';
import { seedPermissions } from './permissions-seed';
import { seedAllServices } from './seed-final-complete';
import { seedSubscriptionPlans } from './subscription-plans-seed';

async function runAllSeeds() {
  console.log('🚀 Starting all seed operations...\n');

  try {
    await AppDataSource.initialize();
    console.log('✅ Database connection established\n');

    const roleRepo = AppDataSource.getRepository(Role);
    const userRepo = AppDataSource.getRepository(User);

    // 1. Clean up existing data
    console.log('🧹 Cleaning up database...');
    await userRepo.query('TRUNCATE TABLE users CASCADE;');
    await roleRepo.query('TRUNCATE TABLE roles CASCADE;');

    // 2. Seed roles
    console.log('📦 Seeding roles...');
    const rolesToSeed = [
      { name: RoleEnum.ADMIN, description: 'Administrator with full system access' },
      { name: RoleEnum.CUSTOMER, description: 'End user/Customer of the platform' },
      { name: RoleEnum.OPERATOR, description: 'CAF Consultant/Operator handling requests' },
      { name: RoleEnum.FINANCE, description: 'Finance manager handling payments and subscriptions' },
    ];
    
    for (const roleData of rolesToSeed) {
      let role = await roleRepo.findOne({ where: { name: roleData.name } });
      if (!role) {
        role = roleRepo.create(roleData);
        await roleRepo.save(role);
        console.log(`✅ Role "${roleData.name}" created.`);
      }
    }

    // 3. Seed admin user
    console.log('\n📦 Seeding admin user...');
    const adminEmail = 'admin@pkservizi.com';
    let adminUser = await userRepo.findOne({ where: { email: adminEmail } });
    if (!adminUser) {
      const adminRole = await roleRepo.findOne({ where: { name: RoleEnum.ADMIN } });
      const password = await bcrypt.hash('Admin@123', 10);
      adminUser = userRepo.create({
        email: adminEmail,
        password,
        fullName: 'Super Admin',
        roleId: adminRole.id,
      });
      await userRepo.save(adminUser);
      console.log(`✅ Admin user "${adminEmail}" created with password: Admin@123`);
    }

    // 4. Seed role permissions
    console.log('\n📦 Seeding role permissions...');
    await seedRolePermissions(AppDataSource);

    // 5. Seed permissions
    console.log('\n📦 Seeding permissions...');
    await seedPermissions(AppDataSource);

    // 6. Seed service types
    console.log('\n📦 Seeding service types...');
    await seedServiceTypes();

    // 7. Seed services with documents
    console.log('\n📦 Seeding services with documents...');
    await seedServicesWithDocuments();

    // 8. Seed all services with FAQs
    console.log('\n📦 Seeding all services with FAQs...');
    await seedAllServices();

    // 9. Seed subscription plans
    console.log('\n📦 Seeding subscription plans...');
    await seedSubscriptionPlans();

    // 10. Update required documents
    console.log('\n📦 Updating required documents...');
    try {
      const { updateRequiredDocuments } = await import('./update-required-documents');
      await updateRequiredDocuments();
    } catch (error) {
      console.log('⚠️  Required documents update skipped:', error.message);
    }

    console.log('\n✅ All seed operations completed successfully!');
  } catch (error) {
    console.error('\n❌ Error during seeding:', error);
    process.exit(1);
  } finally {
    if (AppDataSource.isInitialized) {
      await AppDataSource.destroy();
      console.log('🔌 Database connection closed');
    }
  }

  process.exit(0);
}

runAllSeeds();
