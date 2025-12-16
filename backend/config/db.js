/**
 * MySQL Database Connection Module
 * 
 * This module provides a connection pool for MySQL database operations.
 * It uses mysql2/promise for async/await support.
 */

const mysql = require('mysql2/promise');
require('dotenv').config();

// Database configuration
const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || 3306,
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'portfolio_cms',
  waitForConnections: true,
  connectionLimit: parseInt(process.env.DB_CONNECTION_LIMIT) || 10,
  queueLimit: 0,
  enableKeepAlive: true,
  keepAliveInitialDelay: 0,
  // Enable multiple statements (use with caution)
  multipleStatements: false
};

// Create connection pool
const pool = mysql.createPool(dbConfig);

// Test database connection
async function testConnection() {
  try {
    const connection = await pool.getConnection();
    console.log('✅ MySQL database connected successfully');
    console.log(`📊 Database: ${dbConfig.database}`);
    console.log(`🔗 Host: ${dbConfig.host}:${dbConfig.port}`);
    connection.release();
    return true;
  } catch (error) {
    console.error('❌ MySQL connection error:', error.message);
    console.error('💡 Make sure MySQL is running and credentials are correct');
    return false;
  }
}

// Execute a query with error handling
async function query(sql, params = []) {
  try {
    const [results] = await pool.execute(sql, params);
    return results;
  } catch (error) {
    console.error('Database query error:', error.message);
    throw error;
  }
}

// Execute a query and return first row
async function queryOne(sql, params = []) {
  const results = await query(sql, params);
  return results[0] || null;
}

// Execute a transaction
async function transaction(callback) {
  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();
    const result = await callback(connection);
    await connection.commit();
    return result;
  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    connection.release();
  }
}

// Get raw connection (use with caution)
async function getConnection() {
  return await pool.getConnection();
}

// Close all connections (useful for graceful shutdown)
async function close() {
  await pool.end();
  console.log('🔌 MySQL connection pool closed');
}

// Export pool and helper functions
module.exports = {
  pool,
  query,
  queryOne,
  transaction,
  getConnection,
  testConnection,
  close
};

// Auto-test connection on module load (only in development)
if (process.env.NODE_ENV === 'development' && process.env.DB_HOST) {
  testConnection().catch(console.error);
}

