const db = require('../config/db');

async function migrate() {
  try {
    console.log('Checking for role column in users table...');
    const [columns] = await db.pool.query("SHOW COLUMNS FROM users LIKE 'role'");
    
    if (columns.length === 0) {
      console.log('Adding role column...');
      await db.pool.query("ALTER TABLE users ADD COLUMN role VARCHAR(20) DEFAULT 'user'");
      console.log('Role column added.');
      
      console.log('Migrating existing data...');
      await db.pool.query("UPDATE users SET role = 'admin' WHERE isAdmin = 1");
      await db.pool.query("UPDATE users SET role = 'user' WHERE isAdmin = 0");
      console.log('Data migrated.');
    } else {
      console.log('Role column already exists.');
    }
    
    process.exit(0);
  } catch (error) {
    console.error('Migration failed:', error);
    process.exit(1);
  }
}

migrate();
