const jwt = require('jsonwebtoken');
const db = require('../config/db');

// Protect routes - verify JWT token
const protect = async (req, res, next) => {
  try {
    let token;

    // Check for token in headers
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }

    // Check for token in cookies
    if (!token && req.cookies.token) {
      token = req.cookies.token;
    }

    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Not authorized to access this route'
      });
    }

    try {
      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      
      // Try to fetch role if it exists
      let sql = 'SELECT id, name, email, avatar, isAdmin FROM users WHERE id = ?';
      try {
         const [columns] = await db.query("SHOW COLUMNS FROM users LIKE 'role'");
         if (columns.length > 0) {
           sql = 'SELECT id, name, email, avatar, isAdmin, role FROM users WHERE id = ?';
         }
      } catch (e) {}

      const rows = await db.query(sql, [decoded.id]);
      const user = rows[0];

      if (!user) {
        return res.status(401).json({
          success: false,
          message: 'No user found with this token'
        });
      }

      req.user = {
        id: user.id,
        name: user.name,
        email: user.email,
        avatar: user.avatar,
        isAdmin: !!user.isAdmin,
        role: user.role || (user.isAdmin ? 'admin' : 'user')
      };
      return next();
    } catch (error) {
      return res.status(401).json({
        success: false,
        message: 'Not authorized to access this route'
      });
    }
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Server error in authentication'
    });
  }
};

// Grant access to specific roles
const authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: `User role ${req.user.role} is not authorized to access this route`
      });
    }
    next();
  };
};

// Check if user is admin
const isAdmin = (req, res, next) => {
  if (!req.user.isAdmin) {
    return res.status(403).json({
      success: false,
      message: 'Access denied. Admin privileges required.'
    });
  }
  next();
};

// Check if user can manage blogs (Admin or Editor)
const canManageBlogs = (req, res, next) => {
  if (req.user.isAdmin || req.user.role === 'editor') {
    return next();
  }
  return res.status(403).json({
    success: false,
    message: 'Access denied. Admin or Editor privileges required.'
  });
};

module.exports = {
  protect,
  authorize,
  isAdmin,
  canManageBlogs
};
