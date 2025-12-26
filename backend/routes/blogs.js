const express = require('express');
const { body, validationResult } = require('express-validator');
const { protect, canManageBlogs } = require('../middleware/auth');
const { uploadBlog, handleUploadError } = require('../middleware/upload');
const db = require('../config/db');

const router = express.Router();

// @desc    Get all blogs (Admin - with status filter)
// @route   GET /api/blogs/admin
// @access  Private (Admin only)
router.get('/admin', protect, canManageBlogs, async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const status = req.query.status || 'published'; // Default to published if not specified, or 'all'
    const search = req.query.search;
    const offset = (page - 1) * limit;

    let query = 'SELECT * FROM blogs WHERE 1=1';
    let countQuery = 'SELECT COUNT(*) as total FROM blogs WHERE 1=1';
    const params = [];

    // Filter by status
    if (status !== 'all') {
      query += ' AND status = ?';
      countQuery += ' AND status = ?';
      params.push(status);
    } else {
      // If 'all', usually we exclude trash unless specifically asked, but let's say 'all' excludes trash by default in many systems?
      // For simplicity, let's say 'all' means everything EXCEPT trash. 
      // And we have a specific 'trash' status.
      query += " AND status != 'trash'";
      countQuery += " AND status != 'trash'";
    }

    if (search) {
      const searchCondition = ' AND (title LIKE ? OR content LIKE ? OR category LIKE ?)';
      query += searchCondition;
      countQuery += searchCondition;
      const searchTerm = `%${search}%`;
      params.push(searchTerm, searchTerm, searchTerm);
    }

    query += ' ORDER BY createdAt DESC LIMIT ? OFFSET ?';

    // Count
    const countResult = await db.query(countQuery, params);
    const total = countResult[0].total;

    // Data
    const dataParams = [...params, limit, offset];
    const blogs = await db.query(query, dataParams);

    res.status(200).json({
      success: true,
      count: blogs.length,
      total,
      page,
      pages: Math.ceil(total / limit),
      data: blogs
    });
  } catch (error) {
    console.error('Get admin blogs error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// @desc    Update blog status (Soft Delete / Restore / Trash)
// @route   PUT /api/blogs/:id/status
// @access  Private
router.put('/:id/status', protect, canManageBlogs, async (req, res) => {
  try {
    const { status } = req.body;
    if (!['published', 'draft', 'trash'].includes(status)) {
      return res.status(400).json({ success: false, message: 'Invalid status' });
    }

    const isPublished = status === 'published' ? 1 : 0;

    await db.query('UPDATE blogs SET status = ?, isPublished = ? WHERE id = ?', [status, isPublished, req.params.id]);

    res.status(200).json({ success: true, message: `Blog moved to ${status}` });
  } catch (error) {
    console.error('Update status error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// @desc    Delete blog (Soft or Hard)
// @route   DELETE /api/blogs/:id
// @access  Private (Admin only)
router.delete('/:id', protect, canManageBlogs, async (req, res) => {
  try {
    const rows = await db.query('SELECT status FROM blogs WHERE id = ?', [req.params.id]);
    if (rows.length === 0) return res.status(404).json({ success: false });

    const blog = rows[0];

    // If already in trash, Hard Delete
    if (blog.status === 'trash' || req.query.force === 'true') {
      const result = await db.query('DELETE FROM blogs WHERE id = ?', [req.params.id]);
      return res.status(200).json({ success: true, message: 'Blog permanently deleted' });
    } else {
      // Soft Delete -> Move to Trash
      await db.query("UPDATE blogs SET status = 'trash', isPublished = 0 WHERE id = ?", [req.params.id]);
      return res.status(200).json({ success: true, message: 'Blog moved to trash' });
    }
  } catch (error) {
    console.error('Delete blog error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// @desc    Get all blogs
// @route   GET /api/blogs
// @access  Public
router.get('/', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const category = req.query.category;
    const search = req.query.search;
    const offset = (page - 1) * limit;

    // Build query
    let query = "SELECT * FROM blogs WHERE status = 'published'";
    let countQuery = "SELECT COUNT(*) as total FROM blogs WHERE status = 'published'";
    const params = [];

    if (category) {
      query += ' AND category LIKE ?';
      countQuery += ' AND category LIKE ?';
      params.push(`%${category}%`);
    }

    if (search) {
      const searchCondition = ' AND (title LIKE ? OR content LIKE ? OR category LIKE ?)';
      query += searchCondition;
      countQuery += searchCondition;
      const searchTerm = `%${search}%`;
      params.push(searchTerm, searchTerm, searchTerm);
    }

    // Add sorting and pagination
    query += ' ORDER BY createdAt DESC LIMIT ? OFFSET ?';

    // Execute count query first
    const countResult = await db.query(countQuery, params);
    const total = countResult[0].total;

    // Execute data query
    const dataParams = [...params, limit, offset];
    const blogs = await db.query(query, dataParams);

    res.status(200).json({
      success: true,
      count: blogs.length,
      total,
      page,
      pages: Math.ceil(total / limit),
      data: blogs
    });
  } catch (error) {
    console.error('Get blogs error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching blogs'
    });
  }
});

// @desc    Create new blog
// @route   POST /api/blogs
// @access  Private (Admin only)
router.post('/', protect, canManageBlogs, uploadBlog, handleUploadError, [
  body('title')
    .trim()
    .isLength({ min: 2, max: 200 })
    .withMessage('Title must be between 2 and 200 characters'),
  body('content')
    .trim()
    .isLength({ min: 5 })
    .withMessage('Content must be at least 5 characters long'),
  body('category')
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('Category must be between 2 and 50 characters'),
  body('author')
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage('Author name must be between 2 and 100 characters'),
  body('author_linkdin')
    .isURL()
    .withMessage('Please provide a valid LinkedIn URL'),
  body('linkdin_followers')
    .isInt({ min: 0 })
    .withMessage('LinkedIn followers must be a positive number')
], async (req, res) => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    if (!req.files || !req.files['blogImage']) {
      return res.status(400).json({
        success: false,
        message: 'Blog image is required'
      });
    }

    // Calculate read time
    const wordsPerMinute = 200;
    const wordCount = req.body.content.replace(/<[^>]*>/g, '').split(/\s+/).length;
    const readTime = Math.ceil(wordCount / wordsPerMinute);

    // Generate slug
    const slug = req.body.title
      .toLowerCase()
      .replace(/[^a-zA-Z0-9\s]/g, '')
      .replace(/\s+/g, '-')
      .substring(0, 50);

    const blogImageFile = req.files['blogImage'][0];
    let blogImagePath;

    // Check if using Cloudinary or local storage
    if (process.env.CLOUDINARY_CLOUD_NAME === 'your_cloudinary_cloud_name' || !process.env.CLOUDINARY_CLOUD_NAME) {
      // Using local storage - store relative path
      // Multer gives us absolute path, we need to make it relative
      const absolutePath = blogImageFile.path || blogImageFile.filename;
      // Extract just the uploads/... part
      const relativePath = absolutePath.split('uploads').pop();
      blogImagePath = 'uploads' + relativePath.replace(/\\/g, '/');
    } else {
      // Using Cloudinary - use the cloudinary URL
      blogImagePath = blogImageFile.path;
    }

    // Default status is draft unless specified
    const status = req.body.status || 'draft';
    const isPublished = status === 'published' ? 1 : 0;

    const blogData = {
      ...req.body,
      blogImage: blogImagePath,
      authorImage: req.user.avatar,
      readTime,
      slug,
      isPublished,
      status
    };

    const result = await db.query(
      `INSERT INTO blogs (
        title, content, category, author, authorImage, 
        author_linkdin, linkdin_followers, blogImage, 
        slug, readTime, isPublished, status
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        blogData.title, blogData.content, blogData.category,
        blogData.author, blogData.authorImage, blogData.author_linkdin,
        blogData.linkdin_followers, blogData.blogImage,
        blogData.slug, blogData.readTime, blogData.isPublished,
        blogData.status
      ]
    );

    const blogId = result.insertId;

    // Handle Gallery Images
    if (req.files['galleryImages']) {
      const galleryPromises = req.files['galleryImages'].map(file => {
        let imagePath;

        if (process.env.CLOUDINARY_CLOUD_NAME === 'your_cloudinary_cloud_name' || !process.env.CLOUDINARY_CLOUD_NAME) {
          // Using local storage - convert to relative path
          const absolutePath = file.path || file.filename;
          const relativePath = absolutePath.split('uploads').pop();
          imagePath = 'uploads' + relativePath.replace(/\\/g, '/');
        } else {
          // Using Cloudinary
          imagePath = file.path;
        }

        return db.query('INSERT INTO blog_gallery (blog_id, image_path) VALUES (?, ?)', [blogId, imagePath]);
      });
      await Promise.all(galleryPromises);
    }

    const newBlog = await db.query('SELECT * FROM blogs WHERE id = ?', [blogId]);

    res.status(201).json({
      success: true,
      message: 'Blog created successfully',
      data: newBlog[0]
    });
  } catch (error) {
    console.error('Create blog error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while creating blog'
    });
  }
});

// @desc    Duplicate blog
// @route   POST /api/blogs/:id/duplicate
// @access  Private (Admin only)
router.post('/:id/duplicate', protect, canManageBlogs, async (req, res) => {
  try {
    const { id } = req.params;

    // 1. Get original blog
    const [originalBlog] = await db.query('SELECT * FROM blogs WHERE id = ?', [id]);

    if (!originalBlog) {
      return res.status(404).json({ success: false, message: 'Blog not found' });
    }

    // 2. Prepare new data
    const newTitle = `Copy of ${originalBlog.title}`;
    const timestamp = Date.now();
    const newSlug = `${originalBlog.slug}-copy-${timestamp}`;

    // 3. Insert new blog
    const result = await db.query(
      `INSERT INTO blogs (
        title, content, category, author, authorImage, 
        author_linkdin, linkdin_followers, blogImage, 
        slug, readTime, isPublished, status
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        newTitle,
        originalBlog.content,
        originalBlog.category,
        originalBlog.author,
        originalBlog.authorImage,
        originalBlog.author_linkdin,
        originalBlog.linkdin_followers,
        originalBlog.blogImage,
        newSlug,
        originalBlog.readTime,
        0, // isPublished = false
        'draft' // status = draft
      ]
    );

    // 4. Duplicate gallery images if any
    const galleryImages = await db.query('SELECT image_path FROM blog_gallery WHERE blog_id = ?', [id]);

    if (galleryImages.length > 0) {
      const newBlogId = result.insertId;
      await Promise.all(galleryImages.map(img =>
        db.query('INSERT INTO blog_gallery (blog_id, image_path) VALUES (?, ?)', [newBlogId, img.image_path])
      ));
    }

    res.status(201).json({
      success: true,
      message: 'Blog duplicated successfully',
      data: { id: result.insertId, title: newTitle }
    });

  } catch (error) {
    console.error('Duplicate blog error:', error);
    res.status(500).json({ success: false, message: 'Server error while duplicating blog' });
  }
});

// @desc    Bulk update blogs (publish/draft)
// @route   PUT /api/blogs/bulk-update
// @access  Private (Admin only)
router.put('/bulk-update', protect, canManageBlogs, async (req, res) => {
  try {
    const { blogIds, isPublished } = req.body;

    if (!blogIds || !Array.isArray(blogIds) || blogIds.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Blog IDs array is required'
      });
    }

    if (typeof isPublished !== 'boolean') {
      return res.status(400).json({
        success: false,
        message: 'isPublished must be a boolean value'
      });
    }

    // Update all blogs in the array
    const status = isPublished ? 'published' : 'draft';
    const placeholders = blogIds.map(() => '?').join(',');
    await db.query(
      `UPDATE blogs SET isPublished = ?, status = ? WHERE id IN (${placeholders})`,
      [isPublished, status, ...blogIds]
    );

    res.status(200).json({
      success: true,
      message: `${blogIds.length} blog(s) updated successfully`,
      data: { count: blogIds.length, isPublished, status }
    });
  } catch (error) {
    console.error('Bulk update blogs error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while updating blogs'
    });
  }
});

// @desc    Update blog
// @route   PUT /api/blogs/:id
// @access  Private (Admin only)
router.put('/:id', protect, canManageBlogs, uploadBlog, handleUploadError, [
  body('title')
    .optional({ checkFalsy: true })
    .trim()
    .isLength({ min: 2, max: 200 })
    .withMessage('Title must be between 2 and 200 characters'),
  body('content')
    .optional({ checkFalsy: true })
    .trim()
    .isLength({ min: 5 })
    .withMessage('Content must be at least 5 characters long'),
  body('category')
    .optional({ checkFalsy: true })
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('Category must be between 2 and 50 characters'),
  body('author')
    .optional({ checkFalsy: true })
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage('Author name must be between 2 and 100 characters'),
  body('author_linkdin')
    .optional({ checkFalsy: true })
    .isURL()
    .withMessage('Please provide a valid LinkedIn URL'),
  body('linkdin_followers')
    .optional({ checkFalsy: true })
    .isInt({ min: 0 })
    .withMessage('LinkedIn followers must be a positive number')
], async (req, res) => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      console.log('Validation errors:', errors.array());
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const rows = await db.query('SELECT * FROM blogs WHERE id = ?', [req.params.id]);
    if (rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Blog not found'
      });
    }

    const fields = [];
    const values = [];
    const allowedFields = ['title', 'content', 'category', 'author', 'author_linkdin', 'linkdin_followers'];

    allowedFields.forEach(field => {
      let value = req.body[field];

      // Skip undefined or null values (including strings from FormData)
      if (value === undefined || value === null || value === 'undefined' || value === 'null') {
        return;
      }

      // Handle integer fields
      if (field === 'linkdin_followers') {
        const num = parseInt(value, 10);
        if (!isNaN(num)) {
          fields.push(`${field} = ?`);
          values.push(num);
        }
      } else {
        fields.push(`${field} = ?`);
        values.push(value);
      }
    });

    if (req.files && req.files['blogImage']) {
      const blogImageFile = req.files['blogImage'][0];
      let blogImagePath;

      if (process.env.CLOUDINARY_CLOUD_NAME === 'your_cloudinary_cloud_name' || !process.env.CLOUDINARY_CLOUD_NAME) {
        const absolutePath = blogImageFile.path || blogImageFile.filename;
        const relativePath = absolutePath.split('uploads').pop();
        blogImagePath = 'uploads' + relativePath.replace(/\\/g, '/');
      } else {
        blogImagePath = blogImageFile.path;
      }

      fields.push('blogImage = ?');
      values.push(blogImagePath);
    }

    // Handle Gallery Images
    if (req.files && req.files['galleryImages']) {
      const galleryPromises = req.files['galleryImages'].map(file => {
        let imagePath;

        if (process.env.CLOUDINARY_CLOUD_NAME === 'your_cloudinary_cloud_name' || !process.env.CLOUDINARY_CLOUD_NAME) {
          const absolutePath = file.path || file.filename;
          const relativePath = absolutePath.split('uploads').pop();
          imagePath = 'uploads' + relativePath.replace(/\\/g, '/');
        } else {
          imagePath = file.path;
        }

        return db.query('INSERT INTO blog_gallery (blog_id, image_path) VALUES (?, ?)', [req.params.id, imagePath]);
      });
      await Promise.all(galleryPromises);
    }

    if (fields.length === 0) {
      return res.status(200).json({
        success: true,
        message: 'Blog updated successfully',
        data: rows[0]
      });
    }

    // Recalculate read time if content changed
    if (req.body.content && typeof req.body.content === 'string') {
      try {
        const wordsPerMinute = 200;
        const wordCount = req.body.content.replace(/\u003c[^\u003e]*\u003e/g, '').split(/\\s+/).length;
        const readTime = Math.ceil(wordCount / wordsPerMinute);
        fields.push('readTime = ?');
        values.push(readTime);
      } catch (err) {
        console.error('Error calculating read time:', err);
      }
    }

    // Regenerate slug if title changed
    if (req.body.title && typeof req.body.title === 'string') {
      try {
        const slug = req.body.title
          .toLowerCase()
          .replace(/[^a-zA-Z0-9\\s]/g, '')
          .replace(/\\s+/g, '-')
          .substring(0, 50);
        fields.push('slug = ?');
        values.push(slug);
      } catch (err) {
        console.error('Error generating slug:', err);
      }
    }

    values.push(req.params.id);
    await db.query(`UPDATE blogs SET ${fields.join(', ')} WHERE id = ?`, values);

    const updatedRows = await db.query('SELECT * FROM blogs WHERE id = ?', [req.params.id]);

    res.status(200).json({
      success: true,
      message: 'Blog updated successfully',
      data: updatedRows[0]
    });
  } catch (error) {
    console.error('Update blog error:', error);
    console.error('Request body:', req.body); // Log body for debugging
    res.status(500).json({
      success: false,
      message: 'Server error while updating blog',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});



// @desc    Get blog categories
// @route   GET /api/blogs/categories/list
// @access  Public
router.get('/categories/list', async (req, res) => {
  try {
    const rows = await db.query('SELECT DISTINCT category FROM blogs WHERE isPublished = TRUE');
    const categories = rows.map(row => row.category);

    res.status(200).json({
      success: true,
      data: categories
    });
  } catch (error) {
    console.error('Get categories error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching categories'
    });
  }
});

// @desc    Get single blog
// @route   GET /api/blogs/:id
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    const rows = await db.query('SELECT * FROM blogs WHERE id = ?', [req.params.id]);
    const blog = rows[0];

    if (!blog) {
      return res.status(404).json({
        success: false,
        message: 'Blog not found'
      });
    }

    // Fetch gallery images
    const galleryRows = await db.query('SELECT image_path FROM blog_gallery WHERE blog_id = ?', [req.params.id]);
    blog.gallery = galleryRows.map(row => row.image_path);

    // Increment view count
    await db.query('UPDATE blogs SET views = views + 1 WHERE id = ?', [req.params.id]);
    blog.views += 1;

    res.status(200).json({
      success: true,
      data: blog
    });
  } catch (error) {
    console.error('Get blog error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching blog'
    });
  }
});

// @desc    Like/Unlike blog
// @route   POST /api/blogs/:id/like
// @access  Private
router.post('/:id/like', protect, async (req, res) => {
  try {
    const rows = await db.query('SELECT * FROM blogs WHERE id = ?', [req.params.id]);
    if (rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Blog not found'
      });
    }

    // For now, just increment likes
    await db.query('UPDATE blogs SET likes = likes + 1 WHERE id = ?', [req.params.id]);
    const likes = rows[0].likes + 1;

    res.status(200).json({
      success: true,
      message: 'Blog liked successfully',
      likes
    });
  } catch (error) {
    console.error('Like blog error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while liking blog'
    });
  }
});

module.exports = router;
