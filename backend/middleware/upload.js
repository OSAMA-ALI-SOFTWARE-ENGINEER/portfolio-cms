const multer = require('multer');
const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const path = require('path');
const fs = require('fs');

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

// Ensure uploads directory exists
const uploadsDir = path.join(__dirname, '..', 'uploads');
const blogImagesDir = path.join(uploadsDir, 'blog-images');
const avatarsDir = path.join(uploadsDir, 'avatars');

[uploadsDir, blogImagesDir, avatarsDir].forEach(dir => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
});

// Local disk storage configuration for blog images
const localBlogStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, blogImagesDir);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, 'blog-' + uniqueSuffix + path.extname(file.originalname));
  }
});

// Local disk storage configuration for avatars
const localAvatarStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, avatarsDir);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, 'avatar-' + uniqueSuffix + path.extname(file.originalname));
  }
});

// Storage configuration for blog images (Cloudinary)
const blogImageStorage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'portfolio/blog-images',
    allowed_formats: ['jpg', 'jpeg', 'png', 'gif', 'webp'],
    transformation: [
      { width: 1200, height: 630, crop: 'fill', quality: 'auto' }
    ]
  }
});

// Storage configuration for user avatars (Cloudinary)
const avatarStorage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'portfolio/avatars',
    allowed_formats: ['jpg', 'jpeg', 'png', 'gif', 'webp'],
    transformation: [
      { width: 300, height: 300, crop: 'fill', quality: 'auto' }
    ]
  }
});

// File filter function
const fileFilter = (req, file, cb) => {
  // Check file type
  if (file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    cb(new Error('Only image files are allowed!'), false);
  }
};

// Multer configuration for blog images (Hero + Gallery)
const uploadBlog = multer({
  storage: (process.env.CLOUDINARY_CLOUD_NAME === 'your_cloudinary_cloud_name' || !process.env.CLOUDINARY_CLOUD_NAME) 
    ? localBlogStorage // Use local disk storage
    : blogImageStorage, // Use Cloudinary
  fileFilter: fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit per file
  }
}).fields([
  { name: 'blogImage', maxCount: 1 },
  { name: 'galleryImages', maxCount: 10 }
]);

// Multer configuration for avatars
const uploadAvatar = multer({
  storage: (process.env.CLOUDINARY_CLOUD_NAME === 'your_cloudinary_cloud_name' || !process.env.CLOUDINARY_CLOUD_NAME)
    ? localAvatarStorage // Use local disk storage
    : avatarStorage, // Use Cloudinary
  fileFilter: fileFilter,
  limits: {
    fileSize: 2 * 1024 * 1024 // 2MB limit
  }
});

// Error handling middleware for multer
const handleUploadError = (error, req, res, next) => {
  if (error instanceof multer.MulterError) {
    if (error.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({
        success: false,
        message: 'File too large. Maximum size is 5MB for blog images and 2MB for avatars.'
      });
    }
    if (error.code === 'LIMIT_FILE_COUNT') {
      return res.status(400).json({
        success: false,
        message: 'Too many files. Only one file allowed.'
      });
    }
  }
  
  if (error.message === 'Only image files are allowed!') {
    return res.status(400).json({
      success: false,
      message: 'Only image files are allowed!'
    });
  }
  
  next(error);
};

module.exports = {
  uploadBlog,
  uploadAvatar,
  handleUploadError
};
