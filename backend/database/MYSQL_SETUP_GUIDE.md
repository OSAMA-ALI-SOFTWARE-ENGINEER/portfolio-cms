# MySQL Database Setup Guide for Portfolio CMS

This guide will help you set up MySQL database for your Portfolio CMS application.

## 📋 Prerequisites

- MySQL Server 8.0 or higher (or MariaDB 10.3+)
- Node.js 16+ installed
- npm or yarn package manager
- Access to MySQL server with CREATE DATABASE privileges

## 🚀 Quick Start

### Option 1: Using XAMPP (Windows)

If you're using XAMPP (which you are based on your workspace path):

1. **Start MySQL in XAMPP**
   - Open XAMPP Control Panel
   - Start MySQL service
   - MySQL will run on `localhost:3306`

2. **Access phpMyAdmin** (Optional)
   - Go to `http://localhost/phpmyadmin`
   - You can create the database manually here if preferred

### Option 2: Using MySQL Command Line

1. **Open MySQL Command Line Client** or Terminal
2. **Login to MySQL:**
   ```bash
   mysql -u root -p
   ```
   (Enter your MySQL root password when prompted)

3. **Create Database:**
   ```sql
   CREATE DATABASE portfolio_cms CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
   ```

## 📦 Installation Steps

### Step 1: Install MySQL Dependencies

Navigate to the backend directory and install MySQL driver:

```bash
cd backend
npm install mysql2 dotenv
```

### Step 2: Configure Environment Variables

1. **Copy the example environment file:**
   ```bash
   cp env.example .env
   ```

2. **Edit `.env` file** and add MySQL configuration:
   ```env
   # Database - MySQL Configuration
   DB_HOST=localhost
   DB_PORT=3306
   DB_USER=root
   DB_PASSWORD=your_mysql_password
   DB_NAME=portfolio_cms
   DB_CONNECTION_LIMIT=10

   # JWT
   JWT_SECRET=your_super_secret_jwt_key_here
   JWT_EXPIRE=7d

   # Cloudinary (for image uploads)
   CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
   CLOUDINARY_API_KEY=your_cloudinary_api_key
   CLOUDINARY_API_SECRET=your_cloudinary_api_secret

   # Server
   PORT=5000
   NODE_ENV=development

   # Email (for contact form)
   EMAIL_SERVICE=gmail
   EMAIL_USER=your_email@gmail.com
   EMAIL_PASS=your_app_password

   # Optional: Create default admin user
   CREATE_ADMIN=true
   ADMIN_EMAIL=admin@portfolio.com
   ADMIN_PASSWORD=admin123
   ADMIN_NAME=Admin User
   ```

### Step 3: Initialize Database

**Option A: Using the initialization script (Recommended)**

```bash
node database/init.js
```

This script will:
- Create the database if it doesn't exist
- Run the schema.sql to create all tables
- Optionally create a default admin user

**Option B: Manual SQL execution**

1. **Using MySQL Command Line:**
   ```bash
   mysql -u root -p portfolio_cms < database/schema.sql
   ```

2. **Using phpMyAdmin:**
   - Select the `portfolio_cms` database
   - Go to "Import" tab
   - Choose `database/schema.sql` file
   - Click "Go"

### Step 4: (Optional) Load Sample Data

If you want to populate the database with sample data for testing:

```bash
mysql -u root -p portfolio_cms < database/seed.sql
```

Or using phpMyAdmin:
- Select the `portfolio_cms` database
- Go to "Import" tab
- Choose `database/seed.sql` file
- Click "Go"

## 📊 Database Structure

The database includes the following tables:

### Core Tables

1. **users** - User authentication and profiles
   - Stores user accounts, passwords (hashed), admin status
   - Includes email verification and password reset tokens

2. **blogs** - Blog posts
   - Stores blog content, metadata, views, likes
   - Includes full-text search indexes

3. **blog_tags** - Blog tags (many-to-many relationship)
   - Links blogs with tags for categorization

4. **visitors** - Visitor analytics
   - Tracks page views, unique visitors, counters per page

5. **visitor_device_types** - Device analytics
   - Tracks desktop, mobile, tablet visits

6. **visitor_browsers** - Browser analytics
   - Tracks browser usage (Chrome, Firefox, Safari, etc.)

7. **visitor_countries** - Geographic analytics
   - Tracks visitor locations by country

8. **contacts** - Contact form submissions
   - Stores messages, reply status, IP addresses

### Views

- **blog_summary** - Aggregated blog data with tag counts
- **visitor_statistics** - Comprehensive visitor analytics

### Stored Procedures

- **UpdateVisitorCounter** - Updates visitor counters by page
- **GetBlogWithTags** - Retrieves blog with associated tags

### Triggers

- **generate_blog_slug** - Auto-generates URL-friendly slugs from titles
- **calculate_read_time** - Calculates reading time based on content length

## 🔧 Database Connection

### Creating a MySQL Connection Module

Create a file `backend/config/db.js`:

```javascript
const mysql = require('mysql2/promise');
require('dotenv').config();

const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || 3306,
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'portfolio_cms',
  waitForConnections: true,
  connectionLimit: process.env.DB_CONNECTION_LIMIT || 10,
  queueLimit: 0,
  enableKeepAlive: true,
  keepAliveInitialDelay: 0
});

// Test connection
pool.getConnection()
  .then(connection => {
    console.log('✅ MySQL database connected');
    connection.release();
  })
  .catch(error => {
    console.error('❌ MySQL connection error:', error.message);
  });

module.exports = pool;
```

## 🔄 Migration from MongoDB

If you're migrating from MongoDB to MySQL:

1. **Export MongoDB data:**
   ```bash
   mongoexport --db portfolio --collection users --out users.json
   mongoexport --db portfolio --collection blogs --out blogs.json
   # ... repeat for other collections
   ```

2. **Convert JSON to SQL INSERT statements** (you may need a custom script)

3. **Import into MySQL** using the generated SQL file

## 🧪 Testing the Database

### Test Connection

```javascript
const pool = require('./config/db');

async function testConnection() {
  try {
    const [rows] = await pool.query('SELECT 1 as test');
    console.log('✅ Database connection successful:', rows);
  } catch (error) {
    console.error('❌ Database connection failed:', error);
  }
}

testConnection();
```

### Verify Tables

```sql
USE portfolio_cms;
SHOW TABLES;
```

### Check Table Structure

```sql
DESCRIBE users;
DESCRIBE blogs;
DESCRIBE contacts;
DESCRIBE visitors;
```

## 🔐 Security Best Practices

1. **Use Environment Variables**
   - Never hardcode database credentials
   - Use `.env` file (and add it to `.gitignore`)

2. **Create Dedicated Database User**
   ```sql
   CREATE USER 'portfolio_user'@'localhost' IDENTIFIED BY 'strong_password';
   GRANT ALL PRIVILEGES ON portfolio_cms.* TO 'portfolio_user'@'localhost';
   FLUSH PRIVILEGES;
   ```

3. **Use Connection Pooling**
   - Limit connection pool size
   - Enable connection timeouts

4. **Enable SSL** (for production)
   ```javascript
   const pool = mysql.createPool({
     // ... other config
     ssl: {
       rejectUnauthorized: false
     }
   });
   ```

## 📈 Performance Optimization

1. **Indexes** - Already included in schema.sql
2. **Query Optimization** - Use EXPLAIN to analyze queries
3. **Connection Pooling** - Configured in connection pool
4. **Caching** - Consider Redis for frequently accessed data

## 🐛 Troubleshooting

### Common Issues

1. **"Access denied for user"**
   - Check username and password in `.env`
   - Verify user has privileges on the database

2. **"Can't connect to MySQL server"**
   - Ensure MySQL service is running
   - Check host and port settings
   - Verify firewall settings

3. **"Unknown database"**
   - Create the database first: `CREATE DATABASE portfolio_cms;`
   - Or run the init script: `node database/init.js`

4. **"Table already exists"**
   - Drop existing tables: `DROP DATABASE portfolio_cms; CREATE DATABASE portfolio_cms;`
   - Or use `IF NOT EXISTS` in schema (already included)

5. **Character encoding issues**
   - Ensure database uses `utf8mb4` charset
   - Check table collation is `utf8mb4_unicode_ci`

### Debug Mode

Enable detailed MySQL logging:

```javascript
const pool = mysql.createPool({
  // ... config
  debug: process.env.NODE_ENV === 'development' ? ['ComQueryPacket'] : false
});
```

## 📝 Next Steps

1. **Update Backend Models**
   - Replace Mongoose models with MySQL queries
   - Update routes to use MySQL connection pool

2. **Test All Endpoints**
   - Test authentication
   - Test blog CRUD operations
   - Test visitor tracking
   - Test contact form

3. **Production Setup**
   - Use environment-specific configurations
   - Set up database backups
   - Configure monitoring and logging

## 🔗 Useful Resources

- [MySQL Documentation](https://dev.mysql.com/doc/)
- [mysql2 npm package](https://www.npmjs.com/package/mysql2)
- [SQL Tutorial](https://www.w3schools.com/sql/)

## 📞 Support

If you encounter any issues:
1. Check the troubleshooting section
2. Review MySQL error logs
3. Verify environment variables
4. Test database connection independently

---

**Happy Coding! 🚀**

