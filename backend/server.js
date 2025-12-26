const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');
const rateLimit = require('express-rate-limit');
const cookieParser = require('cookie-parser');
require('dotenv').config();

// Import database connection
const { testConnection } = require('./config/db');

// Import routes
const authRoutes = require('./routes/auth');
const blogRoutes = require('./routes/blogs');
const visitorRoutes = require('./routes/visitors');
const contactRoutes = require('./routes/contact');
const certificateRoutes = require('./routes/certificates');
const commentRoutes = require('./routes/comments');

const app = express();

// Security middleware
app.use(helmet());
app.use(compression());

// Rate limiting (relaxed in development to avoid local lockouts)
if (process.env.NODE_ENV === 'production') {
  const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // limit each IP to 100 requests per windowMs
    message: 'Too many requests from this IP, please try again later.'
  });
  app.use('/api/', limiter);
}

// Serve static files from uploads directory FIRST (before CORS)
// This ensures images are served without CORS restrictions
app.use('/uploads', express.static('uploads', {
  setHeaders: (res, path) => {
    res.set('Cross-Origin-Resource-Policy', 'cross-origin');
    res.set('Access-Control-Allow-Origin', '*');
  }
}));

// CORS configuration for API routes
app.use(cors({
  origin: process.env.NODE_ENV === 'production'
    ? ['https://yourdomain.com']
    : ['http://localhost:3000'],
  credentials: true
}));

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(cookieParser());

// Database connection (MySQL)
testConnection()
  .then(connected => {
    if (connected) {
      console.log('✅ MySQL database connected successfully');
    } else {
      console.warn('⚠️  MySQL connection failed. Please check your configuration.');
      console.warn('💡 Make sure MySQL is running and .env file is configured correctly.');
    }
  })
  .catch((err) => {
    console.error('❌ MySQL connection error:', err.message);
    console.error('💡 Run: npm run db:init to initialize the database');
  });

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/blogs', blogRoutes);
app.use('/api/visitors', visitorRoutes);
app.use('/api/contact', contactRoutes);
app.use('/api/certificates', certificateRoutes);
app.use('/api/comments', commentRoutes);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'OK',
    message: 'Portfolio API is running',
    timestamp: new Date().toISOString()
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    message: 'Something went wrong!',
    error: process.env.NODE_ENV === 'development' ? err.message : 'Internal server error'
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found'
  });
});

const PORT = process.env.PORT || 5000;

if (require.main === module) {
  const server = app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
    console.log(`📊 Environment: ${process.env.NODE_ENV || 'development'}`);
  });

  // Handle port already in use error
  server.on('error', (err) => {
    if (err.code === 'EADDRINUSE') {
      console.error(`\n❌ Port ${PORT} is already in use!\n`);
      console.error('💡 To fix this issue, you can:');
      console.error(`   1. Kill the process using port ${PORT}:`);
      console.error(`      Windows: netstat -ano | findstr :${PORT}`);
      console.error(`      Then: taskkill /PID <PID> /F`);
      console.error(`   2. Or change the PORT in your .env file\n`);
      process.exit(1);
    } else {
      console.error('❌ Server error:', err);
      process.exit(1);
    }
  });
}

module.exports = app;
