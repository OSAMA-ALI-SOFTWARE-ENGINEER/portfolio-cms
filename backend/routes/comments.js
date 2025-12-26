const express = require('express');
const { body, validationResult } = require('express-validator');
const { protect, canManageBlogs } = require('../middleware/auth');
const db = require('../config/db');

const router = express.Router();

// @desc    Get comments for a public blog post (Approved only)
// @route   GET /api/comments/:blogId
// @access  Public
router.get('/:blogId', async (req, res) => {
    try {
        const { blogId } = req.params;
        const comments = await db.query(
            `SELECT * FROM comments 
             WHERE blog_id = ? AND status = 'approved' 
             ORDER BY created_at DESC`,
            [blogId]
        );

        // Group by parent_id? For now just return linear, frontend can nest if we implement nesting
        // Keeping it simple as per first iteration, or we can handle threading.

        res.status(200).json({
            success: true,
            count: comments.length,
            data: comments
        });
    } catch (error) {
        console.error('Get comments error:', error);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
});

// @desc    Post a comment
// @route   POST /api/comments/:blogId
// @access  Public
router.post('/:blogId', [
    body('name').trim().notEmpty().withMessage('Name is required'),
    body('email').trim().isEmail().withMessage('Valid email is required'),
    body('content').trim().notEmpty().withMessage('Comment cannot be empty'),
    // body('parentId').optional().isInt() // Optional nesting
], async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ success: false, errors: errors.array() });
        }

        const { blogId } = req.params;
        const { name, email, content, parentId } = req.body;

        // Check if blog exists and accepts comments? (Optional)

        const result = await db.query(
            `INSERT INTO comments (blog_id, parent_id, name, email, content, status, role) VALUES (?, ?, ?, ?, ?, 'pending', 'visitor')`,
            [blogId, parentId || null, name, email, content]
        );

        // Return 201
        res.status(201).json({
            success: true,
            message: 'Comment submitted successfully! It will appear after moderation.',
            data: { id: result.insertId }
        });

    } catch (error) {
        console.error('Post comment error:', error);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
});

// =========================================================================
// ADMIN ROUTES
// =========================================================================

// @desc    Get ALL comments for admin (With filters)
// @route   GET /api/comments/admin/all
// @access  Private (Admin)
router.get('/admin/all', protect, canManageBlogs, async (req, res) => {
    try {
        const status = req.query.status || 'all'; // all, pending, approved, trash
        const search = req.query.search;
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 20;
        const offset = (page - 1) * limit;

        let query = `
            SELECT c.*, b.title as blog_title 
            FROM comments c 
            JOIN blogs b ON c.blog_id = b.id 
            WHERE 1=1
        `;
        const params = [];

        if (status !== 'all') {
            query += ` AND c.status = ?`;
            params.push(status);
        }

        if (search) {
            query += ` AND (c.content LIKE ? OR c.name LIKE ? OR c.email LIKE ?)`;
            params.push(`%${search}%`, `%${search}%`, `%${search}%`);
        }

        query += ` ORDER BY c.created_at DESC LIMIT ? OFFSET ?`;
        params.push(limit, offset);

        const comments = await db.query(query, params);

        // Count total for pagination
        // ... (Skipping full count for brevity/speed unless requested)

        res.status(200).json({
            success: true,
            data: comments
        });
    } catch (error) {
        console.error('Admin get comments error:', error);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
});

// @desc    Update comment status (Approve/Reject/Trash)
// @route   PUT /api/comments/:id/status
// @access  Private (Admin)
router.put('/:id/status', protect, canManageBlogs, async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body; // approved, trash, pending

        if (!['approved', 'trash', 'pending'].includes(status)) {
            return res.status(400).json({ success: false, message: 'Invalid status' });
        }

        await db.query(`UPDATE comments SET status = ? WHERE id = ?`, [status, id]);

        res.status(200).json({ success: true, message: `Comment status updated to ${status}` });
    } catch (error) {
        console.error('Update comment status error:', error);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
});

// @desc    Delete comment permanently
// @route   DELETE /api/comments/:id
// @access  Private (Admin)
router.delete('/:id', protect, canManageBlogs, async (req, res) => {
    try {
        const { id } = req.params;
        await db.query(`DELETE FROM comments WHERE id = ?`, [id]);
        res.status(200).json({ success: true, message: 'Comment deleted permanently' });
    } catch (error) {
        console.error('Delete comment error:', error);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
});

module.exports = router;
