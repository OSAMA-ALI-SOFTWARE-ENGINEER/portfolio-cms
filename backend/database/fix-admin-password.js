const mysql = require('mysql2/promise');
const bcrypt = require('bcryptjs');
require('dotenv').config();

async function fixPassword() {
    const connection = await mysql.createConnection({
        host: process.env.DB_HOST || '127.0.0.1',
        user: process.env.DB_USER || 'root',
        password: process.env.DB_PASSWORD || '',
        database: process.env.DB_NAME || 'portfolio_cms'
    });

    const adminEmail = process.env.ADMIN_EMAIL || 'admin@portfolio.com';
    const newPassword = process.env.ADMIN_PASSWORD || 'admin123';
    const hashedPassword = await bcrypt.hash(newPassword, 12);

    console.log(`Updating password for ${adminEmail}...`);

    const [rows] = await connection.execute('SELECT id FROM users WHERE email = ?', [adminEmail]);

    if (rows.length === 0) {
        console.log(`User ${adminEmail} not found. Creating...`);
        await connection.execute(
            'INSERT INTO users (name, email, password, isAdmin, isVerified) VALUES (?, ?, ?, TRUE, TRUE)',
            [process.env.ADMIN_NAME || 'Admin User', adminEmail, hashedPassword]
        );
    } else {
        await connection.execute(
            'UPDATE users SET password = ? WHERE email = ?',
            [hashedPassword, adminEmail]
        );
    }

    console.log('✅ Success! Admin password updated to bcrypt hash.');
    await connection.end();
}

fixPassword().catch(err => {
    console.error('❌ Error updating password:', err.message);
    process.exit(1);
});
