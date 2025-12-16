const db = require('./config/db');

async function checkBlogImages() {
  try {
    console.log('Checking blog image paths...\n');
    
    const blogs = await db.query('SELECT id, title, blogImage FROM blogs ORDER BY id DESC LIMIT 5');
    
    console.log('Recent blogs:');
    blogs.forEach(blog => {
      console.log(`\nID: ${blog.id}`);
      console.log(`Title: ${blog.title}`);
      console.log(`Image Path: ${blog.blogImage}`);
    });
    
    console.log('\n\nChecking gallery images...\n');
    const gallery = await db.query('SELECT * FROM blog_gallery ORDER BY id DESC LIMIT 10');
    
    console.log('Recent gallery images:');
    gallery.forEach(img => {
      console.log(`\nGallery ID: ${img.id}`);
      console.log(`Blog ID: ${img.blog_id}`);
      console.log(`Image Path: ${img.image_path}`);
    });
    
    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

checkBlogImages();
