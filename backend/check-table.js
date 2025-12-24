const mysql = require('mysql2/promise');

async function checkTable() {
  try {
    const connection = await mysql.createConnection({
      host: '127.0.0.1',
      port: 3306,
      user: 'root',
      password: '',
      database: 'portfolio_cms'
    });

    const [rows] = await connection.query("SHOW TABLES LIKE 'certificates'");
    if (rows.length > 0) {
      console.log('✅ Table certificates exists');
    } else {
      console.log('❌ Table certificates does NOT exist');
    }
    await connection.end();
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

checkTable();
