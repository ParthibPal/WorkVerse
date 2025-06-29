const jwt = require('jsonwebtoken');
const User = require('../models/User');

/**
 * Auth Middleware
 * Verifies JWT token and attaches user to req.user
 */
const authMiddleware = async (req, res, next) => {
  try {
    console.log('Auth middleware - Headers:', req.headers);
    
    const authHeader = req.headers['authorization'] || req.headers['Authorization'];
    console.log('Auth header:', authHeader);
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      console.log('No Bearer token found');
      return res.status(401).json({
        success: false,
        message: 'No token provided. Authorization denied.'
      });
    }

    const token = authHeader.split(' ')[1];
    console.log('Extracted token:', token ? token.substring(0, 20) + '...' : 'null');
    
    if (!token) {
      console.log('Token is empty');
      return res.status(401).json({
        success: false,
        message: 'No token provided. Authorization denied.'
      });
    }

    // Verify token
    console.log('Verifying token with JWT_SECRET:', process.env.JWT_SECRET ? 'exists' : 'missing');
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log('Token decoded:', decoded);
    
    if (!decoded || !decoded.userId) {
      console.log('Invalid token structure - missing userId');
      return res.status(401).json({
        success: false,
        message: 'Invalid token. Authorization denied.'
      });
    }

    // Attach user to request
    const user = await User.findById(decoded.userId).select('-password');
    console.log('User found:', user ? { id: user._id, name: user.name, userType: user.userType } : 'null');
    
    if (!user) {
      console.log('User not found in database');
      return res.status(401).json({
        success: false,
        message: 'User not found. Authorization denied.'
      });
    }
    req.user = user;
    next();
  } catch (error) {
    console.error('Auth middleware error:', error);
    return res.status(401).json({
      success: false,
      message: 'Token is not valid or expired. Authorization denied.'
    });
  }
};

module.exports = authMiddleware; 