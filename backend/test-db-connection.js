const mysql = require('mysql2/promise');

async function testConnection(host, port) {
  console.log(`Testing connection to ${host}:${port}...`);
  try {
    const connection = await mysql.createConnection({
      host: host,
      port: port,
      user: 'root',
      password: '',
      connectTimeout: 2000
    });
    console.log(`✅ Success: Connected to ${host}:${port}`);
    await connection.end();
    return true;
  } catch (error) {
    console.log(`❌ Failed: ${host}:${port} - ${error.message}`);
    return false;
  }
}

async function runTests() {
  const configs = [
    { host: '127.0.0.1', port: 3306 },
    { host: 'localhost', port: 3306 },
    { host: '::1', port: 3306 },
    { host: '127.0.0.1', port: 3307 }, // Common alternative
    { host: 'localhost', port: 3307 }
  ];

  for (const config of configs) {
    await testConnection(config.host, config.port);
  }
  process.exit(0);
}

runTests();
