/**
 * MySQL Database Initialization Script
 * 
 * This script initializes the MySQL database for the Portfolio CMS.
 * It creates the database and runs the schema.sql file.
 * 
 * Usage: node database/init.js
 */

const mysql = require('mysql2/promise');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

const DB_CONFIG = {
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || 3306,
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  multipleStatements: true // Allow multiple SQL statements
};

const DB_NAME = process.env.DB_NAME || 'portfolio_cms';

async function initializeDatabase() {
  let connection;

  try {
    console.log('🔌 Connecting to MySQL server...');
    
    // Connect without database first
    connection = await mysql.createConnection(DB_CONFIG);
    console.log('✅ Connected to MySQL server');

    // Create database if it doesn't exist
    console.log(`📦 Creating database '${DB_NAME}' if it doesn't exist...`);
    await connection.query(`CREATE DATABASE IF NOT EXISTS \`${DB_NAME}\` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci`);
    console.log(`✅ Database '${DB_NAME}' is ready`);

    // Select the database
    await connection.query(`USE \`${DB_NAME}\``);
    console.log(`✅ Using database '${DB_NAME}'`);

    // Read and execute schema file
    const schemaPath = path.join(__dirname, 'schema.sql');
    console.log('📄 Reading schema file...');
    
    if (!fs.existsSync(schemaPath)) {
      throw new Error(`Schema file not found at ${schemaPath}`);
    }

    const schema = fs.readFileSync(schemaPath, 'utf8');
    
    // Split by delimiter and execute statements
    console.log('🚀 Executing schema...');
    const statements = schema
      .split(';')
      .map(stmt => stmt.trim())
      .filter(stmt => stmt.length > 0 && !stmt.startsWith('--') && !stmt.startsWith('/*'));

    for (const statement of statements) {
      if (statement.trim()) {
        try {
          await connection.query(statement);
        } catch (error) {
          // Ignore errors for CREATE IF NOT EXISTS, DROP IF EXISTS, etc.
          if (!error.message.includes('already exists') && 
              !error.message.includes('Unknown database') &&
              !error.message.includes('doesn\'t exist')) {
            console.warn(`⚠️  Warning executing statement: ${error.message}`);
          }
        }
      }
    }

    console.log('✅ Schema executed successfully');

    // Create default admin user if specified
    if (process.env.CREATE_ADMIN === 'true') {
      const adminEmail = process.env.ADMIN_EMAIL || 'admin@portfolio.com';
      const adminPassword = process.env.ADMIN_PASSWORD || 'admin123';
      const adminName = process.env.ADMIN_NAME || 'Admin User';

      console.log('👤 Creating default admin user...');
      
      // Check if admin already exists
      const [existing] = await connection.query(
        'SELECT id FROM users WHERE email = ?',
        [adminEmail]
      );

      if (existing.length === 0) {
        const bcrypt = require('bcryptjs');
        const hashedPassword = await bcrypt.hash(adminPassword, 12);

        await connection.query(
          `INSERT INTO users (name, email, password, isAdmin, isVerified) 
           VALUES (?, ?, ?, TRUE, TRUE)`,
          [adminName, adminEmail, hashedPassword]
        );

        console.log(`✅ Admin user created:`);
        console.log(`   Email: ${adminEmail}`);
        console.log(`   Password: ${adminPassword}`);
        console.log(`   ⚠️  Please change the password after first login!`);
      } else {
        console.log('ℹ️  Admin user already exists');
      }
    }

    console.log('\n🎉 Database initialization completed successfully!');
    console.log(`\n📊 Database: ${DB_NAME}`);
    console.log(`🔗 Host: ${DB_CONFIG.host}:${DB_CONFIG.port}`);
    console.log(`\n✨ You can now start your application.\n`);

  } catch (error) {
    console.error('❌ Error initializing database:', error.message);
    console.error(error);
    process.exit(1);
  } finally {
    if (connection) {
      await connection.end();
      console.log('🔌 Database connection closed');
    }
  }
}

// Run initialization
if (require.main === module) {
  initializeDatabase();
}

module.exports = { initializeDatabase };

