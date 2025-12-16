const db = require('./config/db');

async function fixImagePaths() {
  try {
    console.log('Starting image path migration...\n');
    
    // Fix blog images
    console.log('Fixing blog hero images...');
    const blogs = await db.query('SELECT id, blogImage FROM blogs');
    
    let blogCount = 0;
    for (const blog of blogs) {
      if (!blog.blogImage) continue;
      
      const oldPath = blog.blogImage;
      
      // Check if it's an absolute path (contains drive letter or full path)
      if (oldPath.includes(':') || oldPath.includes('xampp') || oldPath.includes('backend\\') || oldPath.includes('backend/')) {
        // Extract the relative path
        let newPath;
        if (oldPath.includes('uploads')) {
          const parts = oldPath.split('uploads');
          newPath = 'uploads' + parts[parts.length - 1].replace(/\\/g, '/');
        } else {
          console.log(`⚠ Skipping blog ${blog.id} - cannot extract path from: ${oldPath}`);
          continue;
        }
        
        await db.query('UPDATE blogs SET blogImage = ? WHERE id = ?', [newPath, blog.id]);
        console.log(`✓ Blog ${blog.id}:`);
        console.log(`  Old: ${oldPath}`);
        console.log(`  New: ${newPath}`);
        blogCount++;
      }
    }
    
    console.log(`\n✅ Fixed ${blogCount} blog hero images`);
    
    // Fix gallery images
    console.log('\nFixing gallery images...');
    const galleryImages = await db.query('SELECT id, blog_id, image_path FROM blog_gallery');
    
    let galleryCount = 0;
    for (const img of galleryImages) {
      if (!img.image_path) continue;
      
      const oldPath = img.image_path;
      
      // Check if it's an absolute path
      if (oldPath.includes(':') || oldPath.includes('xampp') || oldPath.includes('backend\\') || oldPath.includes('backend/')) {
        // Extract the relative path
        let newPath;
        if (oldPath.includes('uploads')) {
          const parts = oldPath.split('uploads');
          newPath = 'uploads' + parts[parts.length - 1].replace(/\\/g, '/');
        } else {
          console.log(`⚠ Skipping gallery ${img.id} - cannot extract path from: ${oldPath}`);
          continue;
        }
        
        await db.query('UPDATE blog_gallery SET image_path = ? WHERE id = ?', [newPath, img.id]);
        console.log(`✓ Gallery ${img.id}:`);
        console.log(`  Old: ${oldPath}`);
        console.log(`  New: ${newPath}`);
        galleryCount++;
      }
    }
    
    console.log(`\n✅ Fixed ${galleryCount} gallery images`);
    console.log('\n🎉 Migration completed successfully!');
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Migration failed:', error);
    process.exit(1);
  }
}

fixImagePaths();
