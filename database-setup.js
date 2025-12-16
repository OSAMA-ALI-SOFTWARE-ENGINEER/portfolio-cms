// MongoDB Database Setup Script
// Run this script to set up your MongoDB database with sample data

const { MongoClient } = require('mongodb');

// Replace with your MongoDB connection string
const MONGODB_URI = 'mongodb+srv://portfolio-admin:yourpassword@cluster0.xxxxx.mongodb.net/portfolio?retryWrites=true&w=majority';

async function setupDatabase() {
  const client = new MongoClient(MONGODB_URI);
  
  try {
    console.log('🔗 Connecting to MongoDB...');
    await client.connect();
    console.log('✅ Connected to MongoDB');

    const db = client.db('portfolio');

    // Create collections with validation
    console.log('📊 Creating collections...');
    
    // Users collection
    await db.createCollection('users', {
      validator: {
        $jsonSchema: {
          bsonType: 'object',
          required: ['name', 'email', 'password'],
          properties: {
            name: { bsonType: 'string', minLength: 2, maxLength: 50 },
            email: { bsonType: 'string', pattern: '^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$' },
            password: { bsonType: 'string', minLength: 6 },
            isAdmin: { bsonType: 'bool' },
            isVerified: { bsonType: 'bool' }
          }
        }
      }
    });

    // Blogs collection
    await db.createCollection('blogs', {
      validator: {
        $jsonSchema: {
          bsonType: 'object',
          required: ['title', 'content', 'category', 'author'],
          properties: {
            title: { bsonType: 'string', minLength: 5, maxLength: 200 },
            content: { bsonType: 'string', minLength: 50 },
            category: { bsonType: 'string', minLength: 2, maxLength: 50 },
            author: { bsonType: 'string', minLength: 2, maxLength: 100 },
            views: { bsonType: 'int', minimum: 0 },
            likes: { bsonType: 'int', minimum: 0 },
            isPublished: { bsonType: 'bool' }
          }
        }
      }
    });

    // Visitors collection
    await db.createCollection('visitors');

    // Contacts collection
    await db.createCollection('contacts');

    console.log('✅ Collections created successfully');

    // Create indexes for better performance
    console.log('📈 Creating indexes...');
    
    // Users indexes
    await db.collection('users').createIndex({ email: 1 }, { unique: true });
    await db.collection('users').createIndex({ isAdmin: 1 });

    // Blogs indexes
    await db.collection('blogs').createIndex({ title: 'text', content: 'text', category: 'text' });
    await db.collection('blogs').createIndex({ createdAt: -1 });
    await db.collection('blogs').createIndex({ category: 1 });
    await db.collection('blogs').createIndex({ slug: 1 }, { unique: true });
    await db.collection('blogs').createIndex({ isPublished: 1 });

    // Contacts indexes
    await db.collection('contacts').createIndex({ createdAt: -1 });
    await db.collection('contacts').createIndex({ isRead: 1 });
    await db.collection('contacts').createIndex({ email: 1 });

    // Visitors indexes
    await db.collection('visitors').createIndex({ counter: -1 });

    console.log('✅ Indexes created successfully');

    // Insert initial visitor record
    console.log('📊 Setting up visitor analytics...');
    const existingVisitor = await db.collection('visitors').findOne();
    if (!existingVisitor) {
      await db.collection('visitors').insertOne({
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
        },
        countries: [],
        createdAt: new Date(),
        updatedAt: new Date()
      });
      console.log('✅ Visitor analytics initialized');
    } else {
      console.log('✅ Visitor analytics already exists');
    }

    // Insert sample blog post
    console.log('📝 Creating sample blog post...');
    const existingBlog = await db.collection('blogs').findOne({ title: 'Welcome to My Portfolio' });
    if (!existingBlog) {
      await db.collection('blogs').insertOne({
        title: 'Welcome to My Portfolio',
        content: '<p>This is my first blog post on my new MERN stack portfolio! I\'m excited to share my journey as a developer.</p><p>In this blog, I\'ll be sharing my experiences, projects, and insights about web development.</p><p>Stay tuned for more content about React, Node.js, MongoDB, and other technologies I work with.</p>',
        category: 'introduction',
        author: 'Osama',
        authorImage: null,
        author_linkdin: 'https://linkedin.com/in/osama',
        linkdin_followers: 1000,
        blogImage: 'https://via.placeholder.com/800x400',
        slug: 'welcome-to-my-portfolio',
        views: 0,
        likes: 0,
        isPublished: true,
        tags: ['portfolio', 'mern', 'introduction'],
        readTime: 2,
        createdAt: new Date(),
        updatedAt: new Date()
      });
      console.log('✅ Sample blog post created');
    } else {
      console.log('✅ Sample blog post already exists');
    }

    // Insert sample contact message
    console.log('📧 Creating sample contact message...');
    const existingContact = await db.collection('contacts').findOne({ email: 'john@example.com' });
    if (!existingContact) {
      await db.collection('contacts').insertOne({
        name: 'John Doe',
        email: 'john@example.com',
        phoneNumber: '+1234567890',
        message: 'Hello Osama! I\'m interested in your web development services. Could we schedule a call to discuss my project?',
        isRead: false,
        isReplied: false,
        replyMessage: null,
        repliedAt: null,
        ipAddress: '192.168.1.1',
        userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        createdAt: new Date(),
        updatedAt: new Date()
      });
      console.log('✅ Sample contact message created');
    } else {
      console.log('✅ Sample contact message already exists');
    }

    console.log('🎉 Database setup completed successfully!');
    console.log('\n📋 Next steps:');
    console.log('1. Update your backend .env file with the correct MongoDB URI');
    console.log('2. Start your backend server: npm run dev');
    console.log('3. Start your frontend server: npm start');
    console.log('4. Login with admin credentials: admin@portfolio.com / admin123');
    console.log('5. Change the default admin password');

  } catch (error) {
    console.error('❌ Database setup failed:', error);
  } finally {
    await client.close();
    console.log('🔌 Disconnected from MongoDB');
  }
}

// Run setup if this file is executed directly
if (require.main === module) {
  setupDatabase();
}

module.exports = setupDatabase;
