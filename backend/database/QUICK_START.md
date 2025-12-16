# 🚀 MySQL Database Quick Start Guide

Follow these steps to set up your MySQL database for the Portfolio CMS.

## Step 1: Install MySQL Driver

Open a terminal in the `backend` directory and run:

```bash
npm install mysql2
```

## Step 2: Configure Environment Variables

1. **Copy the example environment file:**
   ```bash
   copy env.example .env
   ```
   (Or manually create `.env` file in the `backend` directory)

2. **Edit `.env` file** and add/update MySQL configuration:
   ```env
   # Database - MySQL Configuration
   DB_HOST=localhost
   DB_PORT=3306
   DB_USER=root
   DB_PASSWORD=
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

   # Optional: Create default admin user during initialization
   CREATE_ADMIN=true
   ADMIN_EMAIL=admin@portfolio.com
   ADMIN_PASSWORD=admin123
   ADMIN_NAME=Admin User
   ```

   **Important:** 
   - If using XAMPP, `DB_PASSWORD` is usually empty (leave it blank)
   - Change `ADMIN_PASSWORD` after first login!

## Step 3: Start MySQL (XAMPP)

1. Open **XAMPP Control Panel**
2. Click **Start** next to MySQL
3. Wait until MySQL status shows as "Running"

## Step 4: Initialize Database

Run the initialization script:

```bash
npm run db:init
```

Or directly:
```bash
node database/init.js
```

This will:
- ✅ Create the `portfolio_cms` database
- ✅ Create all tables, indexes, views, and stored procedures
- ✅ Optionally create a default admin user

## Step 5: (Optional) Load Sample Data

If you want to populate the database with sample data for testing:

**Option A: Using MySQL Command Line**
```bash
mysql -u root -p portfolio_cms < database/seed.sql
```
(Enter your MySQL password when prompted, or press Enter if no password)

**Option B: Using phpMyAdmin**
1. Go to `http://localhost/phpmyadmin`
2. Select `portfolio_cms` database
3. Click "Import" tab
4. Choose `database/seed.sql` file
5. Click "Go"

## Step 6: Verify Installation

Test the database connection:

```bash
node -e "require('./config/db.js').testConnection()"
```

Or create a test file `test-db.js`:

```javascript
const { testConnection } = require('./config/db');

testConnection().then(success => {
  if (success) {
    console.log('✅ Database is ready!');
    process.exit(0);
  } else {
    console.log('❌ Database connection failed');
    process.exit(1);
  }
});
```

Run: `node test-db.js`

## ✅ Success!

If everything worked, you should see:
- ✅ Database `portfolio_cms` created
- ✅ All tables created successfully
- ✅ Connection test passed

## 🐛 Troubleshooting

### "Cannot find module 'mysql2'"
**Solution:** Run `npm install mysql2` in the backend directory

### "Access denied for user 'root'@'localhost'"
**Solution:** 
- Check your MySQL password in `.env`
- For XAMPP, try leaving password blank
- Or reset MySQL password

### "Can't connect to MySQL server"
**Solution:**
- Make sure MySQL is running in XAMPP Control Panel
- Check `DB_HOST` and `DB_PORT` in `.env`
- Verify MySQL is listening on port 3306

### "Unknown database 'portfolio_cms'"
**Solution:** Run `npm run db:init` to create the database

## 📚 Next Steps

1. **Update your backend code** to use MySQL instead of MongoDB
2. **Replace Mongoose models** with MySQL queries using `config/db.js`
3. **Test all API endpoints** with the new database
4. **Review** `MYSQL_SETUP_GUIDE.md` for detailed documentation

## 📖 Additional Resources

- See `MYSQL_SETUP_GUIDE.md` for comprehensive setup guide
- See `queries.sql` for common SQL queries
- See `README.md` for database structure overview

---

**Need Help?** Check the troubleshooting section or review the detailed setup guide.

