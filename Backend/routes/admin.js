// Import required dependencies
const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const router = express.Router();

/**
 * Middleware to check if user is admin
 * This middleware verifies the JWT token and checks if user has admin privileges
 */
const requireAdmin = async (req, res, next) => {
    try {
        // Get token from header
        const token = req.header('Authorization')?.replace('Bearer ', '');
        
        if (!token) {
            return res.status(401).json({ message: 'No token, authorization denied' });
        }

        // Verify token
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
        
        // Find user by ID
        const user = await User.findById(decoded.userId);
        
        if (!user) {
            return res.status(401).json({ message: 'Token is not valid' });
        }

        // Check if user is admin
        if (!user.isAdmin || user.userType !== 'admin') {
            return res.status(403).json({ message: 'Access denied. Admin privileges required.' });
        }

        // Add user to request object
        req.user = user;
        next();
    } catch (error) {
        console.error('Admin middleware error:', error);
        res.status(401).json({ message: 'Token is not valid' });
    }
};

/**
 * POST /api/admin/login
 * Admin login endpoint
 * 
 * Request body:
 * - email: Admin's email address (required)
 * - password: Admin's password (required)
 * 
 * Response:
 * - 200: Login successful with JWT token
 * - 400: Invalid credentials
 * - 403: User is not admin
 * - 500: Server error
 */
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        // Find user by email
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        // Check if user is admin
        if (!user.isAdmin || user.userType !== 'admin') {
            return res.status(403).json({ message: 'Access denied. Admin privileges required.' });
        }

        // Verify password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        // Create JWT token
        const token = jwt.sign(
            { userId: user._id },
            process.env.JWT_SECRET || 'your-secret-key',
            { expiresIn: '24h' }
        );

        // Send success response
        res.json({
            message: 'Admin login successful',
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                userType: user.userType,
                isAdmin: user.isAdmin,
                adminLevel: user.adminLevel
            }
        });

    } catch (error) {
        console.error('Admin login error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

/**
 * GET /api/admin/dashboard
 * Get admin dashboard data
 * Protected route - requires admin authentication
 */
router.get('/dashboard', requireAdmin, async (req, res) => {
    try {
        // Get basic statistics
        const totalUsers = await User.countDocuments();
        const totalJobseekers = await User.countDocuments({ userType: 'jobseeker' });
        const totalEmployers = await User.countDocuments({ userType: 'employer' });
        const totalAdmins = await User.countDocuments({ userType: 'admin' });

        // Get recent registrations
        const recentUsers = await User.find()
            .sort({ createdAt: -1 })
            .limit(10)
            .select('name email userType createdAt');

        res.json({
            stats: {
                totalUsers,
                totalJobseekers,
                totalEmployers,
                totalAdmins
            },
            recentUsers,
            adminInfo: {
                name: req.user.name,
                email: req.user.email,
                adminLevel: req.user.adminLevel
            }
        });

    } catch (error) {
        console.error('Admin dashboard error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

/**
 * GET /api/admin/users
 * Get all users (admin only)
 * Protected route - requires admin authentication
 */
router.get('/users', requireAdmin, async (req, res) => {
    try {
        const users = await User.find()
            .select('-password') // Exclude password from response
            .sort({ createdAt: -1 });

        res.json(users);
    } catch (error) {
        console.error('Get users error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

/**
 * PUT /api/admin/users/:id/status
 * Update user status (activate/deactivate)
 * Protected route - requires admin authentication
 */
router.put('/users/:id/status', requireAdmin, async (req, res) => {
    try {
        const { isActive } = req.body;
        const userId = req.params.id;

        const user = await User.findByIdAndUpdate(
            userId,
            { isActive },
            { new: true }
        ).select('-password');

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.json({
            message: `User ${isActive ? 'activated' : 'deactivated'} successfully`,
            user
        });

    } catch (error) {
        console.error('Update user status error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router; 