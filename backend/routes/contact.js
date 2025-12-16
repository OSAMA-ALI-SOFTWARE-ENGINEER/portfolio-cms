const express = require('express');
const nodemailer = require('nodemailer');
const { body, validationResult } = require('express-validator');
const { protect, isAdmin } = require('../middleware/auth');
const db = require('../config/db');

const router = express.Router();

// Create email transporter
const createTransporter = () => {
  return nodemailer.createTransporter({
    service: process.env.EMAIL_SERVICE || 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    }
  });
};

// @desc    Send contact message
// @route   POST /api/contact/send
// @access  Public
router.post('/send', [
  body('name')
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage('Name must be between 2 and 100 characters'),
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Please provide a valid email'),
  body('phoneNumber')
    .trim()
    .isLength({ min: 10, max: 20 })
    .withMessage('Phone number must be between 10 and 20 characters'),
  body('message')
    .trim()
    .isLength({ min: 10, max: 1000 })
    .withMessage('Message must be between 10 and 1000 characters')
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

    const { name, email, phoneNumber, message } = req.body;
    const ipAddress = req.ip || req.connection.remoteAddress;
    const userAgent = req.get('User-Agent');

    // Save contact message to database
    const result = await db.query(
      'INSERT INTO contacts (name, email, phoneNumber, message, ipAddress, userAgent) VALUES (?, ?, ?, ?, ?, ?)',
      [name, email, phoneNumber, message, ipAddress, userAgent]
    );

    const newContact = await db.query('SELECT * FROM contacts WHERE id = ?', [result.insertId]);

    // Send email notification
    try {
      const transporter = createTransporter();
      
      const mailOptions = {
        from: process.env.EMAIL_USER,
        to: process.env.EMAIL_USER, // Send to yourself
        subject: `New Contact Message from ${name}`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #333;">New Contact Message</h2>
            <div style="background-color: #f5f5f5; padding: 20px; border-radius: 5px;">
              <p><strong>Name:</strong> ${name}</p>
              <p><strong>Email:</strong> ${email}</p>
              <p><strong>Phone:</strong> ${phoneNumber}</p>
              <p><strong>Message:</strong></p>
              <div style="background-color: white; padding: 15px; border-radius: 3px; margin-top: 10px;">
                ${message.replace(/\n/g, '<br>')}
              </div>
            </div>
            <p style="color: #666; font-size: 12px; margin-top: 20px;">
              This message was sent from your portfolio contact form.
            </p>
          </div>
        `
      };

      await transporter.sendMail(mailOptions);
    } catch (emailError) {
      console.error('Email sending error:', emailError);
      // Don't fail the request if email fails
    }

    res.status(201).json({
      success: true,
      message: 'Your message has been sent successfully!',
      data: {
        id: newContact[0].id,
        name: newContact[0].name,
        email: newContact[0].email
      }
    });
  } catch (error) {
    console.error('Send contact message error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while sending message'
    });
  }
});

// @desc    Get all contact messages (Admin only)
// @route   GET /api/contact/messages
// @access  Private (Admin only)
router.get('/messages', protect, isAdmin, async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;
    const isRead = req.query.isRead;

    // Build query
    let query = 'SELECT * FROM contacts';
    let countQuery = 'SELECT COUNT(*) as total FROM contacts';
    const params = [];

    if (isRead !== undefined) {
      query += ' WHERE isRead = ?';
      countQuery += ' WHERE isRead = ?';
      params.push(isRead === 'true');
    }

    query += ' ORDER BY createdAt DESC LIMIT ? OFFSET ?';
    
    // Execute count query
    const countResult = await db.query(countQuery, params);
    const total = countResult[0].total;

    // Execute data query
    const dataParams = [...params, limit, offset];
    const messages = await db.query(query, dataParams);

    res.status(200).json({
      success: true,
      count: messages.length,
      total,
      page,
      pages: Math.ceil(total / limit),
      data: messages
    });
  } catch (error) {
    console.error('Get contact messages error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching contact messages'
    });
  }
});

// @desc    Get single contact message (Admin only)
// @route   GET /api/contact/messages/:id
// @access  Private (Admin only)
router.get('/messages/:id', protect, isAdmin, async (req, res) => {
  try {
    const rows = await db.query('SELECT * FROM contacts WHERE id = ?', [req.params.id]);
    const message = rows[0];
    
    if (!message) {
      return res.status(404).json({
        success: false,
        message: 'Contact message not found'
      });
    }

    // Mark as read
    if (!message.isRead) {
      await db.query('UPDATE contacts SET isRead = TRUE WHERE id = ?', [req.params.id]);
      message.isRead = true;
    }

    res.status(200).json({
      success: true,
      data: message
    });
  } catch (error) {
    console.error('Get contact message error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching contact message'
    });
  }
});

// @desc    Reply to contact message (Admin only)
// @route   POST /api/contact/messages/:id/reply
// @access  Private (Admin only)
router.post('/messages/:id/reply', protect, isAdmin, [
  body('replyMessage')
    .trim()
    .isLength({ min: 10, max: 1000 })
    .withMessage('Reply message must be between 10 and 1000 characters')
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

    const { replyMessage } = req.body;
    
    const rows = await db.query('SELECT * FROM contacts WHERE id = ?', [req.params.id]);
    const message = rows[0];
    
    if (!message) {
      return res.status(404).json({
        success: false,
        message: 'Contact message not found'
      });
    }

    // Send reply email
    try {
      const transporter = createTransporter();
      
      const mailOptions = {
        from: process.env.EMAIL_USER,
        to: message.email,
        subject: `Re: Your message from ${message.name}`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #333;">Reply to your message</h2>
            <div style="background-color: #f5f5f5; padding: 20px; border-radius: 5px;">
              <p>Hello ${message.name},</p>
              <p>Thank you for contacting me. Here's my reply:</p>
              <div style="background-color: white; padding: 15px; border-radius: 3px; margin: 15px 0;">
                ${replyMessage.replace(/\n/g, '<br>')}
              </div>
              <p>Best regards,<br>Osama</p>
            </div>
          </div>
        `
      };

      await transporter.sendMail(mailOptions);
      
      // Update message as replied
      await db.query(
        'UPDATE contacts SET isReplied = TRUE, replyMessage = ?, repliedAt = NOW() WHERE id = ?',
        [replyMessage, req.params.id]
      );
      
    } catch (emailError) {
      console.error('Reply email sending error:', emailError);
      return res.status(500).json({
        success: false,
        message: 'Failed to send reply email'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Reply sent successfully'
    });
  } catch (error) {
    console.error('Reply to contact message error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while sending reply'
    });
  }
});

// @desc    Delete contact message (Admin only)
// @route   DELETE /api/contact/messages/:id
// @access  Private (Admin only)
router.delete('/messages/:id', protect, isAdmin, async (req, res) => {
  try {
    const result = await db.query('DELETE FROM contacts WHERE id = ?', [req.params.id]);
    
    if (result.affectedRows === 0) {
      return res.status(404).json({
        success: false,
        message: 'Contact message not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Contact message deleted successfully'
    });
  } catch (error) {
    console.error('Delete contact message error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while deleting contact message'
    });
  }
});

module.exports = router;
