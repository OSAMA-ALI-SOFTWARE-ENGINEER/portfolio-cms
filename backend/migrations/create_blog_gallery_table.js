const db = require('../config/db');

async function createBlogGalleryTable() {
    try {
        console.log('Creating blog_gallery table...');

        const sql = `
      CREATE TABLE IF NOT EXISTS blog_gallery (
        id INT AUTO_INCREMENT PRIMARY KEY,
        blog_id INT NOT NULL,
        image_path VARCHAR(255) NOT NULL,
        createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (blog_id) REFERENCES blogs(id) ON DELETE CASCADE
      )
    `;

        await db.query(sql);
        console.log('✅ Blog Gallery table created successfully');
        process.exit(0);
    } catch (error) {
        console.error('❌ Error creating blog_gallery table:', error);
        process.exit(1);
    }
}

createBlogGalleryTable();
