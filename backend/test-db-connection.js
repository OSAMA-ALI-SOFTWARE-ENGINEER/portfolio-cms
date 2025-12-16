/**
 * Test MySQL Database Connection
 * 
 * This script tests the MySQL database connection and displays database information.
 * 
 * Usage: node test-db-connection.js
 */

const { testConnection, query } = require('./config/db');

async function testDatabase() {
  console.log('🧪 Testing MySQL Database Connection...\n');

  try {
    // Test connection
    const connected = await testConnection();
    
    if (!connected) {
      console.log('\n❌ Connection test failed. Please check:');
      console.log('   1. MySQL is running (check XAMPP Control Panel)');
      console.log('   2. Database credentials in .env file are correct');
      console.log('   3. Database "portfolio_cms" exists (run: npm run db:init)');
      process.exit(1);
    }

    console.log('\n📊 Database Information:');
    
    // Get table count
    const tables = await query(`
      SELECT COUNT(*) as count 
      FROM information_schema.tables 
      WHERE table_schema = ?
    `, [process.env.DB_NAME || 'portfolio_cms']);
    
    console.log(`   Tables: ${tables[0].count}`);

    // Get table names
    const tableNames = await query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = ? 
      AND table_type = 'BASE TABLE'
      ORDER BY table_name
    `, [process.env.DB_NAME || 'portfolio_cms']);

    console.log('\n📋 Available Tables:');
    tableNames.forEach((row, index) => {
      console.log(`   ${index + 1}. ${row.table_name}`);
    });

    // Check for sample data
    console.log('\n📈 Data Statistics:');
    
    const userCount = await query('SELECT COUNT(*) as count FROM users');
    const blogCount = await query('SELECT COUNT(*) as count FROM blogs');
    const contactCount = await query('SELECT COUNT(*) as count FROM contacts');
    const visitorData = await query('SELECT * FROM visitors LIMIT 1');

    console.log(`   Users: ${userCount[0].count}`);
    console.log(`   Blogs: ${blogCount[0].count}`);
    console.log(`   Contacts: ${contactCount[0].count}`);
    
    if (visitorData.length > 0) {
      console.log(`   Total Visits: ${visitorData[0].counter}`);
    }

    console.log('\n✅ Database is ready to use!');
    console.log('\n💡 Next Steps:');
    console.log('   1. Update your backend routes to use MySQL');
    console.log('   2. Replace Mongoose models with MySQL queries');
    console.log('   3. Test all API endpoints');
    console.log('\n📚 See database/QUICK_START.md for setup instructions\n');

  } catch (error) {
    console.error('\n❌ Error testing database:', error.message);
    console.error('\n💡 Troubleshooting:');
    console.error('   1. Make sure MySQL is running');
    console.error('   2. Check .env file configuration');
    console.error('   3. Run: npm run db:init to create database');
    process.exit(1);
  }
}

// Run test
testDatabase();

