#!/bin/bash

# Quick Start Script for MERN Stack Portfolio
# This script will set up your entire MERN stack portfolio

echo "🚀 Starting MERN Stack Portfolio Setup..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${GREEN}✅ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

print_error() {
    echo -e "${RED}❌ $1${NC}"
}

print_info() {
    echo -e "${BLUE}ℹ️  $1${NC}"
}

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    print_error "Node.js is not installed. Please install Node.js first."
    exit 1
fi

print_status "Node.js is installed: $(node --version)"

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    print_error "npm is not installed. Please install npm first."
    exit 1
fi

print_status "npm is installed: $(npm --version)"

# Install frontend dependencies
print_info "Installing frontend dependencies..."
npm install
if [ $? -eq 0 ]; then
    print_status "Frontend dependencies installed successfully"
else
    print_error "Failed to install frontend dependencies"
    exit 1
fi

# Install backend dependencies
print_info "Installing backend dependencies..."
cd backend
npm install
if [ $? -eq 0 ]; then
    print_status "Backend dependencies installed successfully"
else
    print_error "Failed to install backend dependencies"
    exit 1
fi

# Go back to root directory
cd ..

# Create frontend environment file
print_info "Creating frontend environment file..."
echo "REACT_APP_API_URL=http://localhost:5000/api" > .env
print_status "Frontend environment file created"

# Create backend environment file template
print_info "Creating backend environment file template..."
cat > backend/.env.example << EOF
# Database
MONGODB_URI=mongodb+srv://portfolio-admin:yourpassword@cluster0.xxxxx.mongodb.net/portfolio?retryWrites=true&w=majority

# JWT
JWT_SECRET=your_super_secret_jwt_key_here_make_it_long_and_random_at_least_32_characters
JWT_EXPIRE=7d

# Cloudinary (Sign up at cloudinary.com)
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret

# Server
PORT=5000
NODE_ENV=development

# Email (Gmail recommended)
EMAIL_SERVICE=gmail
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_app_password
EOF

print_status "Backend environment file template created"

# Check if .env file exists in backend
if [ ! -f "backend/.env" ]; then
    print_warning "Backend .env file not found. Please create it with your configuration."
    print_info "Copy backend/.env.example to backend/.env and update the values"
else
    print_status "Backend .env file found"
fi

# Create database setup script
print_info "Creating database setup script..."
cat > setup-database.js << 'EOF'
// MongoDB Database Setup Script
const { MongoClient } = require('mongodb');

async function setupDatabase() {
  const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/portfolio';
  const client = new MongoClient(MONGODB_URI);
  
  try {
    console.log('🔗 Connecting to MongoDB...');
    await client.connect();
    console.log('✅ Connected to MongoDB');

    const db = client.db('portfolio');

    // Create collections
    console.log('📊 Creating collections...');
    await db.createCollection('users');
    await db.createCollection('blogs');
    await db.createCollection('visitors');
    await db.createCollection('contacts');

    // Create indexes
    console.log('📈 Creating indexes...');
    await db.collection('users').createIndex({ email: 1 }, { unique: true });
    await db.collection('blogs').createIndex({ title: 'text', content: 'text' });
    await db.collection('blogs').createIndex({ createdAt: -1 });
    await db.collection('contacts').createIndex({ createdAt: -1 });

    // Insert initial data
    console.log('📊 Setting up initial data...');
    
    // Visitor record
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
        deviceTypes: { desktop: 0, mobile: 0, tablet: 0 },
        browsers: { chrome: 0, firefox: 0, safari: 0, edge: 0, other: 0 },
        countries: [],
        createdAt: new Date(),
        updatedAt: new Date()
      });
    }

    // Sample blog
    const existingBlog = await db.collection('blogs').findOne({ title: 'Welcome to My Portfolio' });
    if (!existingBlog) {
      await db.collection('blogs').insertOne({
        title: 'Welcome to My Portfolio',
        content: '<p>This is my first blog post on my new MERN stack portfolio!</p>',
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
    }

    console.log('🎉 Database setup completed successfully!');
  } catch (error) {
    console.error('❌ Database setup failed:', error);
  } finally {
    await client.close();
  }
}

setupDatabase();
EOF

print_status "Database setup script created"

# Create start script
print_info "Creating start script..."
cat > start-dev.sh << 'EOF'
#!/bin/bash

echo "🚀 Starting MERN Stack Portfolio..."

# Start backend in background
echo "Starting backend server..."
cd backend
npm run dev &
BACKEND_PID=$!

# Wait a moment for backend to start
sleep 3

# Go back to root and start frontend
cd ..
echo "Starting frontend server..."
npm start &
FRONTEND_PID=$!

echo "✅ Both servers are starting..."
echo "Backend: http://localhost:5000"
echo "Frontend: http://localhost:3000"
echo ""
echo "Press Ctrl+C to stop both servers"

# Wait for user to stop
wait $BACKEND_PID $FRONTEND_PID
EOF

chmod +x start-dev.sh
print_status "Start script created"

# Create stop script
print_info "Creating stop script..."
cat > stop-dev.sh << 'EOF'
#!/bin/bash

echo "🛑 Stopping MERN Stack Portfolio..."

# Kill all node processes
pkill -f "node.*server.js"
pkill -f "react-scripts start"

echo "✅ All servers stopped"
EOF

chmod +x stop-dev.sh
print_status "Stop script created"

# Final instructions
echo ""
echo "🎉 Setup completed successfully!"
echo ""
echo "📋 Next steps:"
echo "1. Set up MongoDB Atlas (see COMPLETE_SETUP_GUIDE.md)"
echo "2. Create backend/.env file with your configuration"
echo "3. Run: ./start-dev.sh (to start both servers)"
echo "4. Or run separately:"
echo "   - Backend: cd backend && npm run dev"
echo "   - Frontend: npm start"
echo ""
echo "📚 Documentation:"
echo "- COMPLETE_SETUP_GUIDE.md - Complete setup instructions"
echo "- README_MERN.md - Project documentation"
echo "- MIGRATION_GUIDE.md - Migration from Supabase"
echo ""
echo "🔐 Default admin credentials:"
echo "- Email: admin@portfolio.com"
echo "- Password: admin123"
echo ""
echo "⚠️  Remember to change the default admin password!"
echo ""
print_status "Setup complete! Happy coding! 🚀"
