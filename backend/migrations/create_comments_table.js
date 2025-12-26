const db = require('../config/db');

const createCommentsTable = async () => {
    try {
        console.log('🔄 Creating comments table...');

        const createTableQuery = `
            CREATE TABLE IF NOT EXISTS comments (
                id INT AUTO_INCREMENT PRIMARY KEY,
                blog_id INT NOT NULL,
                parent_id INT DEFAULT NULL,
                name VARCHAR(255) NOT NULL,
                email VARCHAR(255) NOT NULL,
                role ENUM('admin', 'visitor') DEFAULT 'visitor',
                content TEXT NOT NULL,
                status ENUM('pending', 'approved', 'trash') DEFAULT 'pending',
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (blog_id) REFERENCES blogs(id) ON DELETE CASCADE,
                FOREIGN KEY (parent_id) REFERENCES comments(id) ON DELETE CASCADE
            )
        `;

        await db.query(createTableQuery);

        // Add index for faster queries by blog_id and status
        // Error handling for index existence is a bit tricky in raw SQL without IF NOT EXISTS for indexes in older MySQL, 
        // but assuming this is a new table it's fine.
        try {
            await db.query(`CREATE INDEX idx_blog_id ON comments(blog_id)`);
            await db.query(`CREATE INDEX idx_status ON comments(status)`);
        } catch (e) {
            // Indexes might already exist if table existed, ignore
            console.log('⚠️ Indexes might already exist or creation skipped.');
        }

        console.log('✅ Comments table created successfully.');
        process.exit(0);
    } catch (error) {
        console.error('❌ Failed to create comments table:', error);
        process.exit(1);
    }
};

createCommentsTable();
