const bcrypt = require("bcryptjs");
const { Client } = require("pg");

async function main() {
  const client = new Client({
    host: "localhost",
    port: 5432,
    user: "pkserviziuser",
    password: "PKSERVIZIUSER",
    database: "pkservizidb",
  });
  await client.connect();

  const users = await client.query(
    "SELECT id, email, full_name, role_id FROM users LIMIT 10"
  );
  console.log("Existing users:");
  users.rows.forEach((u) =>
    console.log(" ", u.email, u.full_name, u.role_id)
  );

  const roles = await client.query("SELECT id, name FROM roles");
  console.log("Roles:");
  roles.rows.forEach((r) => console.log(" ", r.id, r.name));

  const adminRole = roles.rows.find(
    (r) => r.name === "super_admin" || r.name === "admin"
  );
  if (!adminRole) {
    console.log("No admin role found!");
    await client.end();
    return;
  }

  const hashedPassword = await bcrypt.hash("Admin@123", 10);

  const res = await client.query(
    "SELECT id, email FROM users WHERE email = $1",
    ["admin@pkservizi.com"]
  );
  if (res.rows.length === 0) {
    await client.query(
      "INSERT INTO users (email, password, full_name, role_id, is_active) VALUES ($1, $2, $3, $4, true)",
      ["admin@pkservizi.com", hashedPassword, "Super Admin", adminRole.id]
    );
    console.log("Created admin@pkservizi.com");
  } else {
    await client.query(
      "UPDATE users SET password = $1, role_id = $2 WHERE email = $3",
      [hashedPassword, adminRole.id, "admin@pkservizi.com"]
    );
    console.log("Updated admin@pkservizi.com password");
  }

  await client.end();
  console.log("Done! Login: admin@pkservizi.com / Admin@123");
}

main().catch((e) => console.error(e));
