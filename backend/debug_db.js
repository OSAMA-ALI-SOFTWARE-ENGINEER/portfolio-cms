const db = require('./config/db');

async function test() {
  try {
    console.log('Testing login logic...');

    // Simulate findUserByEmail
    const email = 'osama@example.com'; // Replace with actual email if known, or just check any user
    console.log(`\n--- Finding user by email: ${email} ---`);
    
    // Check if any user exists first
    const allUsers = await db.query('SELECT * FROM users LIMIT 1');
    if (allUsers.length > 0) {
        const testEmail = allUsers[0].email;
        console.log(`Found a user with email: ${testEmail}`);
        
        const sql = 'SELECT id, name, email, password, avatar, isAdmin FROM users WHERE email = ? LIMIT 1';
        const rows = await db.query(sql, [testEmail]);
        console.log('Type of rows:', typeof rows);
        console.log('Is array?', Array.isArray(rows));
        console.log('Rows:', rows);
        const user = rows[0];
        console.log('User object:', user);
        
        if (user) {
            console.log('✅ User found correctly');
        } else {
            console.log('❌ User NOT found (unexpected)');
        }
    } else {
        console.log('⚠️ No users found in database to test with.');
    }

  } catch (err) {
    console.error('Error:', err);
  } finally {
    await db.close();
  }
}

test();
