# MySQL Database Files

This directory contains all MySQL database-related files for the Portfolio CMS.

## 📁 Files Overview

### `schema.sql`
Complete database schema with:
- All table definitions
- Indexes for performance
- Foreign key constraints
- Views for easier querying
- Stored procedures
- Triggers for automation

**Usage:**
```bash
mysql -u root -p portfolio_cms < schema.sql
```

### `seed.sql`
Sample data for development and testing:
- Sample users (including admin)
- Sample blog posts
- Sample contact messages
- Sample visitor analytics data

**Usage:**
```bash
mysql -u root -p portfolio_cms < seed.sql
```

### `init.js`
Node.js script to automatically initialize the database:
- Creates database if it doesn't exist
- Executes schema.sql
- Optionally creates default admin user

**Usage:**
```bash
npm run db:init
# or
node database/init.js
```

### `MYSQL_SETUP_GUIDE.md`
Comprehensive setup guide with:
- Installation instructions
- Configuration steps
- Troubleshooting tips
- Best practices

## 🚀 Quick Start

1. **Install MySQL dependencies:**
   ```bash
   npm install mysql2
   ```

2. **Configure environment variables** in `.env`:
   ```env
   DB_HOST=localhost
   DB_PORT=3306
   DB_USER=root
   DB_PASSWORD=your_password
   DB_NAME=portfolio_cms
   ```

3. **Initialize database:**
   ```bash
   npm run db:init
   ```

4. **(Optional) Load sample data:**
   ```bash
   mysql -u root -p portfolio_cms < database/seed.sql
   ```

## 📊 Database Structure

### Tables
- `users` - User accounts and authentication
- `blogs` - Blog posts
- `blog_tags` - Blog tags (many-to-many)
- `visitors` - Visitor analytics
- `visitor_device_types` - Device analytics
- `visitor_browsers` - Browser analytics
- `visitor_countries` - Geographic analytics
- `contacts` - Contact form submissions

### Views
- `blog_summary` - Aggregated blog data
- `visitor_statistics` - Visitor analytics summary

### Stored Procedures
- `UpdateVisitorCounter(page_path)` - Update visitor counters
- `GetBlogWithTags(blog_id)` - Get blog with tags

### Triggers
- `generate_blog_slug` - Auto-generate slugs
- `calculate_read_time` - Auto-calculate reading time

## 🔧 Configuration

See `MYSQL_SETUP_GUIDE.md` for detailed configuration instructions.

## 📝 Notes

- All tables use `utf8mb4` charset for full Unicode support
- Timestamps are automatically managed
- Foreign keys use `ON DELETE CASCADE` for data integrity
- Indexes are optimized for common queries
- Full-text search is enabled on blogs table

## 🐛 Troubleshooting

If you encounter issues:

1. **Check MySQL is running:**
   ```bash
   # Windows (XAMPP)
   # Check XAMPP Control Panel

   # Linux/Mac
   sudo systemctl status mysql
   ```

2. **Verify database exists:**
   ```sql
   SHOW DATABASES;
   ```

3. **Check user permissions:**
   ```sql
   SHOW GRANTS FOR 'root'@'localhost';
   ```

4. **Review error logs:**
   - Check MySQL error log
   - Review application console output

For more help, see `MYSQL_SETUP_GUIDE.md`.

