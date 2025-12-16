const mongoose = require('mongoose');
const User = require('./models/User');
const Visitor = require('./models/Visitor');
require('dotenv').config();

// Database setup and seeding script
async function setupDatabase() {
  try {
    console.log('🔗 Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('✅ Connected to MongoDB');

    // Create initial visitor record if it doesn't exist
    console.log('📊 Setting up visitor analytics...');
    const existingVisitor = await Visitor.findOne();
    if (!existingVisitor) {
      await Visitor.create({
        counter: 0,
        homePageCounter: 0,
        featurePageCounter: 0,
        blogPageCounter: 0,
        resumePageCounter: 0,
        contactPageCounter: 0,
        uniqueVisitors: 0,
        deviceTypes: {
          desktop: 0,
          mobile: 0,
          tablet: 0
        },
        browsers: {
          chrome: 0,
          firefox: 0,
          safari: 0,
          edge: 0,
          other: 0
        }
      });
      console.log('✅ Visitor analytics initialized');
    } else {
      console.log('✅ Visitor analytics already exists');
    }

    // Create admin user if it doesn't exist
    console.log('👤 Setting up admin user...');
    const existingAdmin = await User.findOne({ isAdmin: true });
    if (!existingAdmin) {
      const adminUser = await User.create({
        name: 'Admin User',
        email: 'admin@portfolio.com',
        password: 'admin123', // Change this in production!
        isAdmin: true,
        isVerified: true
      });
      console.log('✅ Admin user created:');
      console.log(`   Email: ${adminUser.email}`);
      console.log(`   Password: admin123`);
      console.log('⚠️  Please change the admin password after first login!');
    } else {
      console.log('✅ Admin user already exists');
    }

    console.log('🎉 Database setup completed successfully!');
    console.log('\n📋 Next steps:');
    console.log('1. Start the backend server: npm run dev');
    console.log('2. Update your frontend environment variables');
    console.log('3. Test the API endpoints');
    console.log('4. Change the default admin password');

  } catch (error) {
    console.error('❌ Database setup failed:', error);
  } finally {
    await mongoose.disconnect();
    console.log('🔌 Disconnected from MongoDB');
  }
}

// Run setup if this file is executed directly
if (require.main === module) {
  setupDatabase();
}

module.exports = setupDatabase;
