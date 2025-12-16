# 🚀 Osama's Portfolio - MERN Stack

A modern, full-stack portfolio website built with the MERN stack (MongoDB, Express.js, React, Node.js).

## ✨ Features

### 🎨 Frontend (React)
- **Responsive Design** with Tailwind CSS
- **Dark/Light Mode** toggle
- **Smooth Animations** with Framer Motion
- **Interactive Components** with React Query
- **Rich Text Editor** for blog posts
- **Image Upload** with preview
- **Real-time Analytics** dashboard

### 🔧 Backend (Node.js + Express)
- **RESTful API** with Express.js
- **JWT Authentication** with secure cookies
- **MongoDB Database** with Mongoose ODM
- **File Upload** with Cloudinary integration
- **Email Notifications** with Nodemailer
- **Input Validation** with express-validator
- **Security Middleware** (Helmet, CORS, Rate Limiting)

### 📊 Database (MongoDB)
- **User Management** with authentication
- **Blog System** with CRUD operations
- **Visitor Analytics** with detailed tracking
- **Contact Form** with email notifications
- **File Storage** with Cloudinary

## 🛠️ Tech Stack

### Frontend
- **React 18** - UI library
- **React Router** - Client-side routing
- **React Query** - Data fetching and caching
- **Tailwind CSS** - Utility-first CSS framework
- **Framer Motion** - Animation library
- **React Hook Form** - Form handling
- **React Quill** - Rich text editor
- **React Hot Toast** - Notifications

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - NoSQL database
- **Mongoose** - MongoDB object modeling
- **JWT** - Authentication tokens
- **Bcryptjs** - Password hashing
- **Multer** - File upload handling
- **Cloudinary** - Image storage and optimization
- **Nodemailer** - Email sending
- **Express Validator** - Input validation

## 🚀 Quick Start

### Prerequisites
- Node.js (v16 or higher)
- MongoDB (local or Atlas)
- Cloudinary account
- Email service (Gmail, etc.)

### 1. Clone the Repository
```bash
git clone <your-repo-url>
cd portfolio
```

### 2. Backend Setup
```bash
cd backend

# Install dependencies
npm install

# Create environment file
cp env.example .env

# Edit .env with your configuration
# - MongoDB connection string
# - JWT secret
# - Cloudinary credentials
# - Email configuration

# Setup database and create admin user
npm run setup

# Start development server
npm run dev
```

### 3. Frontend Setup
```bash
# Go back to root directory
cd ..

# Install dependencies
npm install

# Create environment file
echo "REACT_APP_API_URL=http://localhost:5000/api" > .env

# Start development server
npm start
```

### 4. Access the Application
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:5000/api
- **API Health Check**: http://localhost:5000/api/health

## 📁 Project Structure

```
portfolio/
├── backend/                 # Backend API
│   ├── models/             # Mongoose models
│   │   ├── User.js
│   │   ├── Blog.js
│   │   ├── Visitor.js
│   │   └── Contact.js
│   ├── routes/             # Express routes
│   │   ├── auth.js
│   │   ├── blogs.js
│   │   ├── visitors.js
│   │   └── contact.js
│   ├── middleware/         # Custom middleware
│   │   ├── auth.js
│   │   └── upload.js
│   ├── server.js           # Main server file
│   ├── setup.js            # Database setup script
│   └── package.json
├── src/                    # React frontend
│   ├── component/          # React components
│   ├── services/           # API services
│   ├── pages/              # Page components
│   ├── ui/                 # UI components
│   └── App.js
├── public/                 # Static assets
└── package.json
```

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

## 📊 API Endpoints

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

## 🔐 Security Features

- **JWT Authentication** with secure HTTP-only cookies
- **Password Hashing** with bcryptjs (12 rounds)
- **Input Validation** with express-validator
- **Rate Limiting** (100 requests per 15 minutes per IP)
- **CORS Configuration** for secure cross-origin requests
- **Helmet** for security headers
- **File Upload Validation** with size and type restrictions
- **SQL Injection Protection** with Mongoose
- **XSS Protection** with input sanitization

## 📈 Performance Optimizations

- **Database Indexing** for faster queries
- **Image Optimization** with Cloudinary transformations
- **Gzip Compression** for API responses
- **React Query Caching** for frontend data
- **Lazy Loading** for React components
- **Code Splitting** for smaller bundle sizes

## 🧪 Testing

### Backend Testing
```bash
cd backend
npm test
```

### Frontend Testing
```bash
npm test
```

### Manual Testing Checklist
- [ ] User registration and login
- [ ] Blog CRUD operations
- [ ] Visitor counter updates
- [ ] Contact form submission
- [ ] File upload functionality
- [ ] Admin dashboard access
- [ ] Responsive design on mobile
- [ ] Dark/light mode toggle

## 🚀 Deployment

### Backend Deployment (Heroku)
```bash
# Install Heroku CLI
# Login to Heroku
heroku login

# Create Heroku app
heroku create your-portfolio-api

# Set environment variables
heroku config:set MONGODB_URI=your_mongodb_atlas_uri
heroku config:set JWT_SECRET=your_jwt_secret
heroku config:set CLOUDINARY_CLOUD_NAME=your_cloudinary_name
# ... set other variables

# Deploy
git push heroku main
```

### Frontend Deployment (Netlify)
```bash
# Build the project
npm run build

# Deploy to Netlify
# Update REACT_APP_API_URL to production backend URL
```

### Database Setup (MongoDB Atlas)
1. Create MongoDB Atlas account
2. Create new cluster
3. Get connection string
4. Update MONGODB_URI in backend .env
5. Run `npm run setup` to initialize database

## 🔧 Troubleshooting

### Common Issues

1. **CORS Errors**
   - Check CORS configuration in server.js
   - Ensure frontend URL is in allowed origins

2. **Authentication Issues**
   - Verify JWT_SECRET is set
   - Check token expiration settings
   - Ensure cookies are enabled

3. **File Upload Issues**
   - Verify Cloudinary configuration
   - Check file size limits
   - Ensure proper file types

4. **Database Connection**
   - Verify MongoDB is running
   - Check connection string format
   - Ensure network access is allowed

5. **Email Issues**
   - Check email service configuration
   - Verify app passwords for Gmail
   - Test SMTP settings

### Debug Mode
Enable debug logging by setting `NODE_ENV=development` in your backend .env file.

## 📝 Development

### Adding New Features
1. Create new model in `backend/models/`
2. Add routes in `backend/routes/`
3. Update frontend services in `src/services/`
4. Create React components in `src/component/`
5. Add tests for new functionality

### Code Style
- Use ESLint and Prettier for code formatting
- Follow React best practices
- Use meaningful variable names
- Add comments for complex logic
- Write descriptive commit messages

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 👨‍💻 Author

**Osama** - Full Stack Developer
- Portfolio: [Your Portfolio URL]
- LinkedIn: [Your LinkedIn URL]
- Email: [Your Email]

## 🙏 Acknowledgments

- React team for the amazing framework
- Express.js for the robust backend framework
- MongoDB for the flexible database
- Tailwind CSS for the utility-first CSS framework
- All the open-source contributors who made this possible

---

**Happy Coding! 🚀**
