import 'reflect-metadata';
import { AppDataSource } from '../src/config/data-source';
import { Role } from '../src/modules/roles/entities/role.entity';
import { User } from '../src/modules/users/entities/user.entity';
import * as bcrypt from 'bcryptjs';
import { RoleEnum } from '../src/modules/roles/role.enum';
import { seedRolePermissions } from './role-permission-seed';
import { seedPermissions } from './permissions-seed';
import { seedAllServices } from './seed-final-complete';
import { seedSubscriptionPlans } from './subscription-plans-seed';

async function runAllSeeds() {
  console.log('🚀 Starting all seed operations...\n');

  try {
    await AppDataSource.initialize();
    console.log('✅ Database connection established\n');

    // ── 1. CLEAN DATABASE ──────────────────────────────────────────
    console.log('🧹 Cleaning up ALL tables (CASCADE)...');
    // Order matters: dependent tables first, then parent tables
    const tablesToTruncate = [
      'audit_logs',
      'request_status_history',
      'isee_requests',
      'modello_730_requests',
      'imu_requests',
      'documents',
      'service_requests',
      'invoices',
      'payments',
      'course_enrollments',
      'courses',
      'notifications',
      'appointments',
      'faqs',
      'refresh_tokens',
      'blacklisted_tokens',
      'user_subscriptions',
      'subscription_plans',
      'user_permissions',
      'user_profiles',
      'family_members',
      'services',
      'service_types',
      'role_permissions',
      'permissions',
      'users',
      'roles',
    ];

    for (const table of tablesToTruncate) {
      try {
        await AppDataSource.query(`TRUNCATE TABLE "${table}" CASCADE;`);
      } catch {
        // Table may not exist yet — skip silently
      }
    }
    console.log('✅ All tables truncated\n');

    // ── 2. SEED ROLES ──────────────────────────────────────────────
    console.log('📦 Seeding roles...');
    const roleRepo = AppDataSource.getRepository(Role);
    const userRepo = AppDataSource.getRepository(User);

    const rolesToSeed = [
      { name: RoleEnum.ADMIN, description: 'Administrator with full system access' },
      { name: RoleEnum.CUSTOMER, description: 'End user/Customer of the platform' },
      { name: RoleEnum.OPERATOR, description: 'CAF Consultant/Operator handling requests' },
      { name: RoleEnum.FINANCE, description: 'Finance manager handling payments and subscriptions' },
    ];

    for (const roleData of rolesToSeed) {
      const role = roleRepo.create(roleData);
      await roleRepo.save(role);
      console.log(`   ✅ Role "${roleData.name}" created`);
    }

    // ── 3. SEED ADMIN USER ─────────────────────────────────────────
    console.log('\n📦 Seeding admin user...');
    const adminRole = await roleRepo.findOne({ where: { name: RoleEnum.ADMIN } });
    const password = await bcrypt.hash('Admin@123', 10);
    const adminUser = userRepo.create({
      email: 'admin@tuocaf.com',
      password,
      fullName: 'Super Admin',
      roleId: adminRole.id,
    });
    await userRepo.save(adminUser);
    console.log('   ✅ Admin user "admin@tuocaf.com" created (password: Admin@123)');

    // ── 4. SEED ROLE PERMISSIONS ───────────────────────────────────
    console.log('\n📦 Seeding role permissions...');
    await seedRolePermissions(AppDataSource);

    // ── 5. SEED PERMISSIONS ────────────────────────────────────────
    console.log('\n📦 Seeding permissions...');
    await seedPermissions(AppDataSource);

    // ── 6. SEED ALL SERVICES (service types + services + FAQs + form schemas)
    console.log('\n📦 Seeding all service types, services, FAQs, and form schemas...');
    await seedAllServices();

    // ── 7. SEED SUBSCRIPTION PLANS ─────────────────────────────────
    console.log('\n📦 Seeding subscription plans...');
    await seedSubscriptionPlans();

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
