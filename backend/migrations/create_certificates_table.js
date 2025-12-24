const db = require('../config/db');

async function createCertificatesTable() {
  try {
    console.log('Creating certificates table...');
    
    const sql = `
      CREATE TABLE IF NOT EXISTS certificates (
        id INT AUTO_INCREMENT PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        image VARCHAR(255) NOT NULL,
        pdf VARCHAR(255),
        verificationUrl VARCHAR(255),
        createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      )
    `;
    
    await db.query(sql);
    console.log('✅ Certificates table created successfully');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error creating certificates table:', error);
    process.exit(1);
  }
}

createCertificatesTable();
