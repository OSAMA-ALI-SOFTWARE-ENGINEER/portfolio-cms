const db = require('../config/db');

const addStatusColumn = async () => {
    try {
        console.log('🔄 Starting migration: Add status column...');

        // 1. Check if column exists
        try {
            // db.query returns the rows array directly based on db.js implementation
            // const [results] = await pool.execute(sql, params); return results;
            const columns = await db.query("SHOW COLUMNS FROM blogs LIKE 'status'");

            if (columns && columns.length > 0) {
                console.log('⚠️ Column "status" already exists. Skipping column creation.');
            } else {
                // 2. Add the column
                const addColumnQuery = `
          ALTER TABLE blogs 
          ADD COLUMN status ENUM('published', 'draft', 'trash') NOT NULL DEFAULT 'draft';
        `;
                await db.query(addColumnQuery);
                console.log('✅ Column "status" added successfully.');
            }
        } catch (err) {
            console.error('Error checking/adding column:', err.message);
            throw err;
        }

        // 3. Migrate data: Map isPublished -> status
        console.log('🔄 Migrating existing data...');

        // Set status='published' where isPublished=1
        // db.query for UPDATE returns the result header (affectedRows etc)
        const result = await db.query(`
      UPDATE blogs SET status = 'published' WHERE isPublished = 1 AND status = 'draft'
    `);

        console.log(`✅ Updated ${result.changedRows || result.affectedRows || 0} rows to 'published'`);

        console.log('✅ Migration completed successfully.');
        process.exit(0);

    } catch (error) {
        console.error('❌ Migration failed:', error);
        process.exit(1);
    }
};

addStatusColumn();
