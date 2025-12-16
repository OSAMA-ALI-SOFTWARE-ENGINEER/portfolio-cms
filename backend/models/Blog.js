const mongoose = require('mongoose');

const blogSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Blog title is required'],
    trim: true,
    maxlength: [200, 'Title cannot be more than 200 characters']
  },
  content: {
    type: String,
    required: [true, 'Blog content is required']
  },
  category: {
    type: String,
    required: [true, 'Blog category is required'],
    trim: true,
    maxlength: [50, 'Category cannot be more than 50 characters']
  },
  author: {
    type: String,
    required: [true, 'Author name is required'],
    trim: true
  },
  authorImage: {
    type: String,
    default: null
  },
  author_linkdin: {
    type: String,
    required: [true, 'LinkedIn profile is required'],
    match: [
      /^https?:\/\/(www\.)?linkedin\.com\/in\/[a-zA-Z0-9-]+\/?$/,
      'Please provide a valid LinkedIn profile URL'
    ]
  },
  linkdin_followers: {
    type: Number,
    required: [true, 'LinkedIn followers count is required'],
    min: [0, 'Followers count cannot be negative']
  },
  blogImage: {
    type: String,
    required: [true, 'Blog image is required']
  },
  slug: {
    type: String,
    unique: true,
    lowercase: true
  },
  views: {
    type: Number,
    default: 0
  },
  likes: {
    type: Number,
    default: 0
  },
  isPublished: {
    type: Boolean,
    default: true
  },
  tags: [{
    type: String,
    trim: true
  }],
  readTime: {
    type: Number, // in minutes
    default: 5
  }
}, {
  timestamps: true
});

// Create slug from title before saving
blogSchema.pre('save', function(next) {
  if (this.isModified('title')) {
    this.slug = this.title
      .toLowerCase()
      .replace(/[^a-zA-Z0-9\s]/g, '')
      .replace(/\s+/g, '-')
      .substring(0, 50);
  }
  next();
});

// Calculate read time based on content length
blogSchema.pre('save', function(next) {
  if (this.isModified('content')) {
    const wordsPerMinute = 200;
    const wordCount = this.content.replace(/<[^>]*>/g, '').split(/\s+/).length;
    this.readTime = Math.ceil(wordCount / wordsPerMinute);
  }
  next();
});

// Index for better search performance
blogSchema.index({ title: 'text', content: 'text', category: 'text' });
blogSchema.index({ createdAt: -1 });
blogSchema.index({ category: 1 });

module.exports = mongoose.model('Blog', blogSchema);
