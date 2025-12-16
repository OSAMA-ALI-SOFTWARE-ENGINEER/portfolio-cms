# Migration Guide: Supabase to MERN Stack

This guide will help you migrate your portfolio from Supabase to a full MERN stack with MongoDB.

## 🚀 Quick Start

### 1. Backend Setup

```bash
# Navigate to backend directory
cd backend

# Install dependencies
npm install

# Create .env file from example
cp env.example .env

# Update .env with your configuration
# - MongoDB connection string
# - JWT secret
# - Cloudinary credentials
# - Email configuration

# Start development server
npm run dev
```

### 2. Frontend Updates

The frontend services have been updated to use the new MERN API. You'll need to:

1. **Update environment variables** in your React app:
   ```env
   REACT_APP_API_URL=http://localhost:5000/api
   ```

2. **Replace Supabase imports** in your components:
   ```javascript
   // Old Supabase imports
   import { supabase } from './services/supabase';
   
   // New MERN API imports
   import { apiRequest } from './services/api';
   ```

## 📊 Database Schema

### Collections Created

1. **users** - User authentication and profiles
2. **blogs** - Blog posts with rich content
3. **visitors** - Website analytics and visitor tracking
4. **contacts** - Contact form submissions

### Key Features

- **JWT Authentication** with secure cookies
- **File Upload** with Cloudinary integration
- **Email Notifications** for contact form
- **Visitor Analytics** with device/browser tracking
- **Input Validation** with express-validator
- **Rate Limiting** and security middleware

## 🔧 Configuration

### Environment Variables

#### Backend (.env)
```env
# Database
MONGODB_URI=mongodb://localhost:27017/portfolio

# JWT
JWT_SECRET=your_super_secret_jwt_key_here
JWT_EXPIRE=7d

# Cloudinary
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret

# Server
PORT=5000
NODE_ENV=development

# Email
EMAIL_SERVICE=gmail
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_app_password
```

#### Frontend (.env)
```env
REACT_APP_API_URL=http://localhost:5000/api
```

## 🔄 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user
- `PUT /api/auth/update-profile` - Update user profile
- `PUT /api/auth/update-password` - Update password
- `POST /api/auth/logout` - Logout user

### Blogs
- `GET /api/blogs` - Get all blogs (with pagination, search, category filter)
- `GET /api/blogs/:id` - Get single blog
- `POST /api/blogs` - Create blog (Admin only)
- `PUT /api/blogs/:id` - Update blog (Admin only)
- `DELETE /api/blogs/:id` - Delete blog (Admin only)
- `GET /api/blogs/categories/list` - Get blog categories
- `POST /api/blogs/:id/like` - Like blog

### Visitors
- `POST /api/visitors/update` - Update visitor counter
- `GET /api/visitors/stats` - Get visitor statistics
- `GET /api/visitors/analytics` - Get detailed analytics (Admin only)
- `POST /api/visitors/device-info` - Update device/browser info
- `POST /api/visitors/reset` - Reset counters (Admin only)

### Contact
- `POST /api/contact/send` - Send contact message
- `GET /api/contact/messages` - Get contact messages (Admin only)
- `GET /api/contact/messages/:id` - Get single message (Admin only)
- `POST /api/contact/messages/:id/reply` - Reply to message (Admin only)
- `DELETE /api/contact/messages/:id` - Delete message (Admin only)

## 🛠️ Component Updates Needed

### 1. Authentication Components

Update these files to use the new API:
- `src/component/login/useLogin.js`
- `src/component/register/useCreateUser.js`
- `src/component/authentication/useCurrentUser.js`

### 2. Blog Components

Update these files:
- `src/component/blog/useCreateBlog.js`
- `src/component/blog/useBlogs.js`
- `src/component/blog/useSingleBlog.js`
- `src/component/blog/useUpdateBlog.js`
- `src/component/blog/useDeleteBlog.js`

### 3. Visitor Components

Update these files:
- `src/component/visitor/useUpdateVisitor.js`
- `src/component/visitor/useAllVisitors.js`

### 4. Contact Form

Update `src/component/contactData/ContactForm.jsx` to use the new contact API.

## 🔐 Security Features

- **JWT Authentication** with secure HTTP-only cookies
- **Password Hashing** with bcryptjs
- **Input Validation** with express-validator
- **Rate Limiting** to prevent abuse
- **CORS Configuration** for secure cross-origin requests
- **Helmet** for security headers
- **File Upload Validation** with size and type restrictions

## 📁 File Structure

```
backend/
├── models/           # Mongoose models
│   ├── User.js
│   ├── Blog.js
│   ├── Visitor.js
│   └── Contact.js
├── routes/           # Express routes
│   ├── auth.js
│   ├── blogs.js
│   ├── visitors.js
│   └── contact.js
├── middleware/       # Custom middleware
│   ├── auth.js
│   └── upload.js
├── server.js         # Main server file
├── package.json
└── env.example

src/services/
├── api.js            # Base API configuration
├── apiAuth.js        # Authentication API
├── apiBlog.js        # Blog API
├── apiVisitorCounter.js # Visitor API
└── apiContact.js     # Contact API
```

## 🚨 Important Notes

1. **Remove Supabase Dependencies**: Uninstall `@supabase/supabase-js` from your frontend
2. **Update Imports**: Replace all Supabase imports with the new API services
3. **Environment Variables**: Set up proper environment variables for both frontend and backend
4. **Database Setup**: Ensure MongoDB is running and accessible
5. **Cloudinary Setup**: Configure Cloudinary for image uploads
6. **Email Setup**: Configure email service for contact form notifications

## 🧪 Testing

1. **Start Backend**: `cd backend && npm run dev`
2. **Start Frontend**: `cd .. && npm start`
3. **Test Authentication**: Register/login functionality
4. **Test Blog CRUD**: Create, read, update, delete blogs
5. **Test Visitor Tracking**: Check if visitor counters work
6. **Test Contact Form**: Send contact messages

## 🔧 Troubleshooting

### Common Issues

1. **CORS Errors**: Ensure CORS is properly configured in server.js
2. **Authentication Issues**: Check JWT secret and token handling
3. **File Upload Issues**: Verify Cloudinary configuration
4. **Database Connection**: Ensure MongoDB is running and accessible
5. **Email Issues**: Check email service configuration

### Debug Mode

Enable debug logging by setting `NODE_ENV=development` in your backend .env file.

## 📈 Performance Optimizations

- **Database Indexing**: Added indexes for better query performance
- **Image Optimization**: Cloudinary transformations for optimized images
- **Compression**: Gzip compression for API responses
- **Rate Limiting**: Prevents API abuse
- **Caching**: Consider adding Redis for session management in production

## 🚀 Deployment

### Backend Deployment
1. Deploy to platforms like Heroku, Railway, or DigitalOcean
2. Set up MongoDB Atlas for production database
3. Configure environment variables
4. Set up SSL certificates

### Frontend Deployment
1. Update `REACT_APP_API_URL` to production backend URL
2. Deploy to Netlify, Vercel, or similar platforms
3. Configure CORS for production domain

## 📝 Next Steps

1. **Complete Migration**: Update all frontend components
2. **Testing**: Thoroughly test all functionality
3. **Performance**: Monitor and optimize performance
4. **Security**: Review and enhance security measures
5. **Documentation**: Update your portfolio documentation
6. **Backup**: Set up regular database backups

This migration provides you with a full MERN stack that's more customizable and gives you complete control over your backend infrastructure.
