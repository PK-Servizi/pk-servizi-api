const bcrypt = require('bcryptjs');
const { Client } = require('pg');

async function main() {
  const client = new Client({
    host: 'localhost',
    port: 5432,
    user: 'postgres',
    password: 'postgres',
    database: 'pk_servizi'
  });
  await client.connect();
  
  // Check existing users
  const users = await client.query('SELECT id, email, full_name, role_id FROM users LIMIT 10');
  console.log('Existing users:');
  users.rows.forEach(u => console.log('  ', u.email, u.full_name, u.role_id));
  
  // Check roles
  const roles = await client.query('SELECT id, name FROM roles');
  console.log('\nRoles:');
  roles.rows.forEach(r => console.log('  ', r.id, r.name));
  
  // Find admin/super_admin role
  const adminRole = roles.rows.find(r => r.name === 'super_admin' || r.name === 'admin');
  if (!adminRole) {
    console.log('\nNo admin role found! Creating one...');
    const res = await client.query(
      `INSERT INTO roles (name, description) VALUES ('super_admin', 'Super Administrator') RETURNING id, name`
    );
    console.log('Created role:', res.rows[0]);
  }
  
  // Update or create admin user with known password
  const adminRoleId = adminRole ? adminRole.id : (await client.query(`SELECT id FROM roles WHERE name = 'super_admin'`)).rows[0].id;
  const hashedPassword = await bcrypt.hash('Admin@123', 10);
  
  // Check if huqapani686@gmail.com exists
  const existingUser = await client.query('SELECT id, email FROM users WHERE email = $1', ['huqapani686@gmail.com']);
  if (existingUser.rows.length > 0) {
    // Update password and role
    await client.query(
      'UPDATE users SET password = $1, role_id = $2 WHERE email = $3',
      [hashedPassword, adminRoleId, 'huqapani686@gmail.com']
    );
    console.log('\nUpdated huqapani686@gmail.com password to Admin@123 and set admin role');
  } else {
    console.log('\nUser huqapani686@gmail.com does not exist in the database');
  }
  
  // Also ensure admin@pkservizi.com exists
  const adminUser = await client.query('SELECT id, email FROM users WHERE email = $1', ['admin@pkservizi.com']);
  if (adminUser.rows.length === 0) {
    await client.query(
      `INSERT INTO users (email, password, full_name, role_id, is_active) VALUES ($1, $2, $3, $4, true)`,
      ['admin@pkservizi.com', hashedPassword, 'Super Admin', adminRoleId]
    );
    console.log('Created admin@pkservizi.com with password Admin@123');
  } else {
    await client.query('UPDATE users SET password = $1, role_id = $2 WHERE email = $3', [hashedPassword, adminRoleId, 'admin@pkservizi.com']);
    console.log('Updated admin@pkservizi.com password to Admin@123');
  }
  
  await client.end();
  console.log('\nDone! You can now login with:');
  console.log('  Email: admin@pkservizi.com');
  console.log('  Password: Admin@123');
}

main().catch(e => console.error(e));
