const express = require('express');
const jwt = require('jsonwebtoken');
const { body, validationResult } = require('express-validator');
const { protect } = require('../middleware/auth');
const { uploadAvatar, handleUploadError } = require('../middleware/upload');
const bcrypt = require('bcryptjs');
const db = require('../config/db');

const router = express.Router();

// Helpers for MySQL auth
const mysqlAuth = {
  async findUserByEmail(email, withPassword = false) {
    const select = withPassword
      ? 'id, name, email, password, avatar, isAdmin'
      : 'id, name, email, avatar, isAdmin';
    const rows = await db.query(`SELECT ${select} FROM users WHERE email = ? LIMIT 1`, [email]);
    return rows[0] || null;
  },
  async findUserById(id) {
    const rows = await db.query(
      'SELECT id, name, email, avatar, isAdmin, createdAt FROM users WHERE id = ? LIMIT 1',
      [id]
    );
    return rows[0] || null;
  },
  async createUser({ name, email, password }) {
    const hashed = await bcrypt.hash(password, 12);
    const result = await db.query(
      'INSERT INTO users (name, email, password, isAdmin, isVerified) VALUES (?, ?, ?, FALSE, TRUE)',
      [name, email, hashed]
    );
    return { id: result.insertId, name, email, isAdmin: 0, avatar: null };
  },
  async updateProfile(id, { name, email, avatar }) {
    const fields = [];
    const values = [];
    if (name) { fields.push('name = ?'); values.push(name); }
    if (email) { fields.push('email = ?'); values.push(email); }
    if (avatar) { fields.push('avatar = ?'); values.push(avatar); }
    if (!fields.length) return await this.findUserById(id);
    values.push(id);
    await db.query(`UPDATE users SET ${fields.join(', ')} WHERE id = ?`, values);
    return await this.findUserById(id);
  },
  async updatePassword(id, newPassword) {
    const hashed = await bcrypt.hash(newPassword, 12);
    await db.query('UPDATE users SET password = ? WHERE id = ?', [hashed, id]);
  },
  async updateUser(id, { name, email, role }) {
    const fields = [];
    const values = [];
    if (name) { fields.push('name = ?'); values.push(name); }
    if (email) { fields.push('email = ?'); values.push(email); }
    
    // Handle role/isAdmin
    if (role) {
      // Try to update role column if it exists
      try {
        const [columns] = await db.query("SHOW COLUMNS FROM users LIKE 'role'");
        if (columns.length > 0) {
          fields.push('role = ?');
          values.push(role);
        }
      } catch (e) {
        // Ignore error
      }

      // Sync isAdmin based on role
      fields.push('isAdmin = ?');
      values.push(role === 'admin' ? 1 : 0);
    }

    if (!fields.length) return await this.findUserById(id);
    
    values.push(id);
    await db.query(`UPDATE users SET ${fields.join(', ')} WHERE id = ?`, values);
    
    // Return updated user
    const user = await this.findUserById(id);
    // Attach role if it exists
    try {
      const [columns] = await db.query("SHOW COLUMNS FROM users LIKE 'role'");
      if (columns.length > 0) {
        const [rows] = await db.query('SELECT role FROM users WHERE id = ?', [id]);
        if (rows[0]) user.role = rows[0].role;
      }
    } catch (e) {}
    
    return user;
  }
};

// Generate JWT Token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE || '7d'
  });
};

// @desc    Register user
// @route   POST /api/auth/register
// @access  Public
router.post('/register', [
  body('name')
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('Name must be between 2 and 50 characters'),
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Please provide a valid email'),
  body('password')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters long')
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

    const { name, email, password } = req.body;

    const existing = await mysqlAuth.findUserByEmail(email);
    if (existing) {
      return res.status(400).json({
        success: false,
        message: 'User already exists with this email'
      });
    }
    const user = await mysqlAuth.createUser({ name, email, password });
    const token = generateToken(user.id);
    res.cookie('token', token, {
      expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict'
    });
    return res.status(201).json({
      success: true,
      message: 'User registered successfully',
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        avatar: user.avatar,
        isAdmin: !!user.isAdmin
      }
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during registration'
    });
  }
});

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
router.post('/login', [
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Please provide a valid email'),
  body('password')
    .notEmpty()
    .withMessage('Password is required')
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

    const { email, password } = req.body;

    const user = await mysqlAuth.findUserByEmail(email, true);
    if (!user) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    const isPasswordMatch = await bcrypt.compare(password, user.password);
    if (!isPasswordMatch) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    const token = generateToken(user.id);
    res.cookie('token', token, {
      expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict'
    });

    return res.status(200).json({
      success: true,
      message: 'Login successful',
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        avatar: user.avatar,
        isAdmin: !!user.isAdmin
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during login'
    });
  }
});

// @desc    Get current user
// @route   GET /api/auth/me
// @access  Private
router.get('/me', protect, async (req, res) => {
  try {
    const user = await mysqlAuth.findUserById(req.user.id);
    return res.status(200).json({
      success: true,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        avatar: user.avatar,
        isAdmin: !!user.isAdmin,
        createdAt: user.createdAt
      }
    });
  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @desc    Update user profile
// @route   PUT /api/auth/update-profile
// @access  Private
router.put('/update-profile', protect, uploadAvatar.single('avatar'), handleUploadError, [
  body('name')
    .optional()
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('Name must be between 2 and 50 characters'),
  body('email')
    .optional()
    .isEmail()
    .normalizeEmail()
    .withMessage('Please provide a valid email')
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

    let avatarPath;
    if (req.file) {
      if (process.env.CLOUDINARY_CLOUD_NAME === 'your_cloudinary_cloud_name' || !process.env.CLOUDINARY_CLOUD_NAME) {
        // Local storage: convert absolute path to relative URL
        const absolutePath = req.file.path;
        // Extract just the uploads/... part
        // We assume the path contains 'uploads'
        const relativePath = absolutePath.split('uploads').pop();
        avatarPath = 'uploads' + relativePath.replace(/\\/g, '/');
        
        // Ensure it starts with a slash if needed, but usually 'uploads/...' is fine if we prepend base URL on frontend
        // or if we serve it from root.
        // server.js serves '/uploads', so 'uploads/avatars/...' -> 'http://localhost:5000/uploads/avatars/...'
        // If we save 'uploads/avatars/...' in DB.
      } else {
        avatarPath = req.file.path;
      }
    }

    const updated = await mysqlAuth.updateProfile(req.user.id, {
      name: req.body.name,
      email: req.body.email,
      avatar: avatarPath
    });

    return res.status(200).json({
      success: true,
      message: 'Profile updated successfully',
      user: {
        id: updated.id,
        name: updated.name,
        email: updated.email,
        avatar: updated.avatar,
        isAdmin: !!updated.isAdmin
      }
    });
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during profile update'
    });
  }
});

// @desc    Update password
// @route   PUT /api/auth/update-password
// @access  Private
router.put('/update-password', protect, [
  body('currentPassword')
    .notEmpty()
    .withMessage('Current password is required'),
  body('newPassword')
    .isLength({ min: 6 })
    .withMessage('New password must be at least 6 characters long')
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

    const { currentPassword, newPassword } = req.body;

    const user = await mysqlAuth.findUserById(req.user.id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }
    // Need password for comparison
    const withPassword = await db.query(
      'SELECT password FROM users WHERE id = ? LIMIT 1',
      [req.user.id]
    );
    const hashed = withPassword[0]?.password;
    if (!hashed) {
      return res.status(404).json({ success: false, message: 'User password not found' });
    }

    const isMatch = await bcrypt.compare(currentPassword, hashed);
    if (!isMatch) {
      return res.status(400).json({
        success: false,
        message: 'Current password is incorrect'
      });
    }

    await mysqlAuth.updatePassword(req.user.id, newPassword);

    return res.status(200).json({
      success: true,
      message: 'Password updated successfully'
    });
  } catch (error) {
    console.error('Update password error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during password update'
    });
  }
});

// @desc    Check email availability
// @route   POST /api/auth/check-email
// @access  Public
router.post('/check-email', [
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Please provide a valid email')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        available: false,
        message: 'Invalid email format'
      });
    }

    const { email } = req.body;
    const existing = await mysqlAuth.findUserByEmail(email);
    
    return res.status(200).json({
      success: true,
      available: !existing,
      message: existing ? 'Email is already taken' : 'Email is available'
    });
  } catch (error) {
    console.error('Email check error:', error);
    res.status(500).json({
      success: false,
      available: false,
      message: 'Server error during email check'
    });
  }
});

// @desc    Logout user
// @route   POST /api/auth/logout
// @access  Private
router.post('/logout', (req, res) => {
  res.cookie('token', '', {
    expires: new Date(0),
    httpOnly: true
  });

  res.status(200).json({
    success: true,
    message: 'Logged out successfully'
  });
});

// @desc    Get all users (Admin only)
// @route   GET /api/auth/users
// @access  Private/Admin
router.get('/users', protect, async (req, res) => {
  if (!req.user.isAdmin) {
    return res.status(403).json({ success: false, message: 'Not authorized' });
  }
  try {
    const users = await db.query('SELECT id, name, email, avatar, isAdmin, createdAt FROM users ORDER BY createdAt DESC');
    res.status(200).json({
      success: true,
      count: users.length,
      users
    });
  } catch (error) {
    console.error('Get all users error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// @desc    Delete user (Admin only)
// @route   DELETE /api/auth/users/:id
// @access  Private/Admin
router.delete('/users/:id', protect, async (req, res) => {
  if (!req.user.isAdmin) {
    return res.status(403).json({ success: false, message: 'Not authorized' });
  }
  try {
    const userId = req.params.id;
    
    // Prevent deleting yourself
    if (parseInt(userId) === req.user.id) {
      return res.status(400).json({ success: false, message: 'Cannot delete yourself' });
    }

    const user = await mysqlAuth.findUserById(userId);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    await db.query('DELETE FROM users WHERE id = ?', [userId]);

    res.status(200).json({
      success: true,
      message: 'User deleted successfully'
    });
  } catch (error) {
    console.error('Delete user error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// @desc    Update user (Admin only)
// @route   PUT /api/auth/users/:id
// @access  Private/Admin
router.put('/users/:id', protect, async (req, res) => {
  if (!req.user.isAdmin) {
    return res.status(403).json({ success: false, message: 'Not authorized' });
  }
  try {
    const userId = req.params.id;
    const { name, email, role } = req.body;

    // Prevent removing your own admin status (optional safety)
    if (parseInt(userId) === req.user.id && role !== 'admin') {
       return res.status(400).json({ success: false, message: 'Cannot remove your own admin status' });
    }

    const updatedUser = await mysqlAuth.updateUser(userId, { name, email, role });

    res.status(200).json({
      success: true,
      message: 'User updated successfully',
      user: updatedUser
    });
  } catch (error) {
    console.error('Update user error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

module.exports = router;
