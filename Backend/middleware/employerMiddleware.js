/**
 * Employer Middleware
 * Ensures that only users with employer role can access protected routes
 */

const employerMiddleware = (req, res, next) => {
  try {
    console.log('Employer middleware - User:', req.user);
    console.log('User role:', req.user?.userType);
    console.log('Is employer?', req.user?.userType === 'employer');
    
    // Check if user exists and has employer role
    if (!req.user) {
      console.log('No user found in request');
      return res.status(401).json({
        success: false,
        message: 'Authentication required'
      });
    }

    if (req.user.userType !== 'employer') {
      console.log('User is not an employer. User type:', req.user.userType);
      return res.status(403).json({
        success: false,
        message: 'Access denied. Employer role required.'
      });
    }

    console.log('Employer middleware - Access granted');
    next();
  } catch (error) {
    console.error('Employer middleware error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message
    });
  }
};

module.exports = employerMiddleware; 