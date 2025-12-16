const db = require('../config/db');

const createTable = async () => {
  try {
    console.log('Attempting to create blog_gallery table...');
    await db.query(`
      CREATE TABLE IF NOT EXISTS blog_gallery (
        id INT AUTO_INCREMENT PRIMARY KEY,
        blog_id INT NOT NULL,
        image_path VARCHAR(500) NOT NULL,
        createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (blog_id) REFERENCES blogs(id) ON DELETE CASCADE
      )
    `);
    console.log('blog_gallery table created successfully');
    process.exit(0);
  } catch (error) {
    console.error('Error creating table:', error);
    process.exit(1);
  }
};

createTable();
