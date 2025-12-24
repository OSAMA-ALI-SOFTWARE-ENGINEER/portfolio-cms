const express = require('express');
const { body, validationResult } = require('express-validator');
const { protect, isAdmin } = require('../middleware/auth');
const { uploadCertificate, handleUploadError } = require('../middleware/upload');
const db = require('../config/db');
const fs = require('fs');
const path = require('path');

const router = express.Router();

// @desc    Get all certificates
// @route   GET /api/certificates
// @access  Public
router.get('/', async (req, res) => {
  try {
    const certificates = await db.query('SELECT * FROM certificates ORDER BY createdAt DESC');
    res.status(200).json({
      success: true,
      count: certificates.length,
      certificates
    });
  } catch (error) {
    console.error('Get certificates error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// @desc    Create new certificate
// @route   POST /api/certificates
// @access  Private (Admin only)
router.post('/', protect, isAdmin, uploadCertificate, handleUploadError, [
  body('title').trim().notEmpty().withMessage('Title is required'),
  body('verificationUrl').optional().isURL().withMessage('Invalid URL')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      // Delete uploaded files if validation fails
      if (req.files) {
        if (req.files.image) fs.unlinkSync(req.files.image[0].path);
        if (req.files.pdf) fs.unlinkSync(req.files.pdf[0].path);
      }
      return res.status(400).json({ success: false, errors: errors.array() });
    }

    if (!req.files || !req.files.image) {
      return res.status(400).json({ success: false, message: 'Certificate image is required' });
    }

    const { title, verificationUrl } = req.body;
    
    // Process paths
    let imagePath = req.files.image[0].path;
    let pdfPath = req.files.pdf ? req.files.pdf[0].path : null;

    // Convert absolute paths to relative if local storage
    if (imagePath.includes('uploads')) {
      const parts = imagePath.split('uploads');
      imagePath = 'uploads' + parts[parts.length - 1].replace(/\\/g, '/');
    }
    if (pdfPath && pdfPath.includes('uploads')) {
      const parts = pdfPath.split('uploads');
      pdfPath = 'uploads' + parts[parts.length - 1].replace(/\\/g, '/');
    }

    const result = await db.query(
      'INSERT INTO certificates (title, image, pdf, verificationUrl) VALUES (?, ?, ?, ?)',
      [title, imagePath, pdfPath, verificationUrl]
    );

    const newCertificate = await db.queryOne('SELECT * FROM certificates WHERE id = ?', [result.insertId]);

    res.status(201).json({
      success: true,
      message: 'Certificate created successfully',
      certificate: newCertificate
    });
  } catch (error) {
    console.error('Create certificate error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// @desc    Update certificate
// @route   PUT /api/certificates/:id
// @access  Private (Admin only)
router.put('/:id', protect, isAdmin, uploadCertificate, handleUploadError, [
  body('title').optional().trim().notEmpty().withMessage('Title cannot be empty'),
  body('verificationUrl').optional().isURL().withMessage('Invalid URL')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
       if (req.files) {
        if (req.files.image) fs.unlinkSync(req.files.image[0].path);
        if (req.files.pdf) fs.unlinkSync(req.files.pdf[0].path);
      }
      return res.status(400).json({ success: false, errors: errors.array() });
    }

    const certificate = await db.queryOne('SELECT * FROM certificates WHERE id = ?', [req.params.id]);
    if (!certificate) {
      return res.status(404).json({ success: false, message: 'Certificate not found' });
    }

    const { title, verificationUrl } = req.body;
    let imagePath = certificate.image;
    let pdfPath = certificate.pdf;

    if (req.files) {
      if (req.files.image) {
        // Delete old image if local
        // (Optional: implement deletion logic)
        
        let newPath = req.files.image[0].path;
        if (newPath.includes('uploads')) {
          const parts = newPath.split('uploads');
          imagePath = 'uploads' + parts[parts.length - 1].replace(/\\/g, '/');
        } else {
          imagePath = newPath;
        }
      }

      if (req.files.pdf) {
        let newPath = req.files.pdf[0].path;
        if (newPath.includes('uploads')) {
          const parts = newPath.split('uploads');
          pdfPath = 'uploads' + parts[parts.length - 1].replace(/\\/g, '/');
        } else {
          pdfPath = newPath;
        }
      }
    }

    // Update fields
    const updates = [];
    const values = [];

    if (title) { updates.push('title = ?'); values.push(title); }
    if (verificationUrl !== undefined) { updates.push('verificationUrl = ?'); values.push(verificationUrl); }
    if (req.files && req.files.image) { updates.push('image = ?'); values.push(imagePath); }
    if (req.files && req.files.pdf) { updates.push('pdf = ?'); values.push(pdfPath); }
    
    if (updates.length > 0) {
      values.push(req.params.id);
      await db.query(`UPDATE certificates SET ${updates.join(', ')} WHERE id = ?`, values);
    }

    const updatedCertificate = await db.queryOne('SELECT * FROM certificates WHERE id = ?', [req.params.id]);

    res.status(200).json({
      success: true,
      message: 'Certificate updated successfully',
      certificate: updatedCertificate
    });
  } catch (error) {
    console.error('Update certificate error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// @desc    Delete certificate
// @route   DELETE /api/certificates/:id
// @access  Private (Admin only)
router.delete('/:id', protect, isAdmin, async (req, res) => {
  try {
    const certificate = await db.queryOne('SELECT * FROM certificates WHERE id = ?', [req.params.id]);
    if (!certificate) {
      return res.status(404).json({ success: false, message: 'Certificate not found' });
    }

    await db.query('DELETE FROM certificates WHERE id = ?', [req.params.id]);

    // Optional: Delete files from storage
    
    res.status(200).json({
      success: true,
      message: 'Certificate deleted successfully'
    });
  } catch (error) {
    console.error('Delete certificate error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

module.exports = router;
