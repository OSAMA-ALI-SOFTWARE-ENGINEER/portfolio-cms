const db = require('./config/db');

async function checkPaths() {
  try {
    console.log('Checking current image paths in database...\n');
    
    const blogs = await db.query('SELECT id, title, blogImage FROM blogs ORDER BY id DESC LIMIT 5');
    
    console.log('Recent blogs:');
    blogs.forEach(blog => {
      console.log(`\nID: ${blog.id}`);
      console.log(`Title: ${blog.title}`);
      console.log(`Image Path: ${blog.blogImage}`);
      console.log(`Path type: ${blog.blogImage?.includes('C:') ? 'ABSOLUTE (BAD)' : 'RELATIVE (GOOD)'}`);
    });
    
    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

checkPaths();
