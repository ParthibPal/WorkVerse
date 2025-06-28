// Import required dependencies
const express = require('express');
const bcrypt = require('bcryptjs');        // For password hashing
const jwt = require('jsonwebtoken');       // For creating authentication tokens
const User = require('../models/User');    // User model for database operations
const router = express.Router()          // Create Express router

/**
 * POST /api/auth/register
 * Register a new user account
 * 
 * Request body:
 * - name: User's full name (required)
 * - email: User's email address (required, must be unique)
 * - password: User's password (required, min 6 characters)
 * - userType: 'jobseeker' or 'employer' (optional, defaults to 'jobseeker')
 * 
 * Response:
 * - 201: User registered successfully with JWT token
 * - 400: User already exists or validation error
 * - 500: Server error
 */
router.post('/register', async (req, res) => {
    try {
        // Extract user data from request body
        const { name, email, password, userType } = req.body;

        // Check if user already exists with the same email
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'User already exists' });
        }

        // Hash the password for security
        // Salt rounds: 10 (good balance between security and performance)
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Create new user document
        const user = new User({
            name,
            email,
            password: hashedPassword,
            userType: userType || 'jobseeker'  // Default to jobseeker if not specified
        });

        // Save user to database
        await user.save();

        // Create JWT token for authentication
        // Token contains user ID and expires in 24 hours
        const token = jwt.sign(
            { userId: user._id },
            process.env.JWT_SECRET || 'your-secret-key',
            { expiresIn: '24h' }
        );

        // Send success response with user data and token
        res.status(201).json({
            message: 'User registered successfully',
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                userType: user.userType
            }
        });

    } catch (error) {
        // Log error for debugging
        console.error('Register error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

/**
 * POST /api/auth/login
 * Authenticate existing user and provide access token
 * 
 * Request body:
 * - email: User's email address (required)
 * - password: User's password (required)
 * 
 * Response:
 * - 200: Login successful with JWT token
 * - 400: Invalid credentials
 * - 500: Server error
 */
router.post('/login', async (req, res) => {
    try {
        // Extract login credentials from request body
        const { email, password } = req.body;

        // Find user by email address
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        // Verify password by comparing with hashed password in database
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        // Create JWT token for authenticated session
        const token = jwt.sign(
            { userId: user._id },
            process.env.JWT_SECRET || 'your-secret-key',
            { expiresIn: '24h' }
        );

        // Send success response with user data and token
        res.json({
            message: 'Login successful',
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                userType: user.userType
            }
        });

    } catch (error) {
        // Log error for debugging
        console.error('Login error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Export the router for use in main server file
module.exports = router; 
