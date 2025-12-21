const fs = require('fs');
const path = require('path');
const db = require('./config/db');

async function fixImagePaths() {
  try {
    console.log('🔍 Checking for absolute paths in database...');
    
    // Fix users avatars
    const users = await db.query("SELECT id, avatar FROM users WHERE avatar LIKE '%:%'");
    console.log(`Found ${users.length} users with absolute paths`);
    
    for (const user of users) {
      if (user.avatar && user.avatar.includes('uploads')) {
        // Extract relative path starting from 'uploads'
        const parts = user.avatar.split('uploads');
        const relativePath = 'uploads' + parts[parts.length - 1].replace(/\\/g, '/');
        
        console.log(`Fixing user ${user.id}: ${user.avatar} -> ${relativePath}`);
        await db.query('UPDATE users SET avatar = ? WHERE id = ?', [relativePath, user.id]);
      }
    }
    
    // Fix blog images
    const blogs = await db.query("SELECT id, blogImage FROM blogs WHERE blogImage LIKE '%:%'");
    console.log(`Found ${blogs.length} blogs with absolute paths`);
    
    for (const blog of blogs) {
      if (blog.blogImage && blog.blogImage.includes('uploads')) {
        const parts = blog.blogImage.split('uploads');
        const relativePath = 'uploads' + parts[parts.length - 1].replace(/\\/g, '/');
        
        console.log(`Fixing blog ${blog.id}: ${blog.blogImage} -> ${relativePath}`);
        await db.query('UPDATE blogs SET blogImage = ? WHERE id = ?', [relativePath, blog.id]);
      }
    }

    console.log('✅ All paths fixed successfully');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error fixing paths:', error);
    process.exit(1);
  }
}

fixImagePaths();
