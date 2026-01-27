import 'reflect-metadata';
import { AppDataSource } from './src/config/data-source';

async function checkDatabase() {
  await AppDataSource.initialize();

  try {
    console.log('\n📊 Checking database contents...\n');

    // Check roles
    const roleCount = await AppDataSource.query('SELECT COUNT(*) FROM roles');
    console.log(`✅ Roles: ${roleCount[0].count}`);

    if (roleCount[0].count > 0) {
      const roles = await AppDataSource.query('SELECT name FROM roles');
      console.log('   Roles:', roles.map(r => r.name).join(', '));
    }

    // Check users
    const userCount = await AppDataSource.query('SELECT COUNT(*) FROM users');
    console.log(`✅ Users: ${userCount[0].count}`);

    if (userCount[0].count > 0) {
      const users = await AppDataSource.query('SELECT email FROM users');
      console.log('   Users:', users.map(u => u.email).join(', '));
    }

    // Check services
    const serviceCount = await AppDataSource.query('SELECT COUNT(*) FROM services');
    console.log(`✅ Services: ${serviceCount[0].count}`);

    if (serviceCount[0].count > 0) {
      const services = await AppDataSource.query('SELECT name, code FROM services');
      console.log('   Services:', services.map(s => `${s.name} (${s.code})`).join(', '));
    }

    // Check subscription plans
    const planCount = await AppDataSource.query('SELECT COUNT(*) FROM subscription_plans');
    console.log(`✅ Subscription Plans: ${planCount[0].count}`);

    if (planCount[0].count > 0) {
      const plans = await AppDataSource.query('SELECT name FROM subscription_plans');
      console.log('   Plans:', plans.map(p => p.name).join(', '));
    }

    // Check permissions
    const permCount = await AppDataSource.query('SELECT COUNT(*) FROM permissions');
    console.log(`✅ Permissions: ${permCount[0].count}`);

    // Check role_permissions
    const rolePermCount = await AppDataSource.query('SELECT COUNT(*) FROM role_permissions');
    console.log(`✅ Role-Permission Assignments: ${rolePermCount[0].count}`);

    console.log('\n✅ Database check completed!\n');
  } catch (error) {
    console.error('❌ Error checking database:', error);
  } finally {
    await AppDataSource.destroy();
  }
}

checkDatabase();
