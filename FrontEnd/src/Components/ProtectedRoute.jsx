import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import LoadingSpinner from './LoadingSpinner'; // Import the loading spinner

/**
 * ProtectedRoute Component
 * This component wraps routes that require authentication
 * It checks if the user is logged in and redirects to login if not
 * 
 * Props:
 * - children: The component to render if authenticated
 * - requiredUserType: Optional - specific user type required (jobseeker/employer/admin)
 */
const ProtectedRoute = ({ children, requiredUserType = null }) => {
  // Get authentication state from context
  const { isAuthenticated, getUserType, loading, user } = useAuth();
  
  // Get current location for redirect after login
  const location = useLocation();

  /**
   * Show loading spinner while checking authentication
   * This prevents flashing of login form when user is actually authenticated
   */
  if (loading) {
    return <LoadingSpinner fullScreen={true} message="Checking authentication..." />;
  }

  /**
   * Check if user is authenticated
   * If not, redirect to login page with return URL
   */
  if (!isAuthenticated()) {
    // Redirect to login page, but remember where they were trying to go
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  /**
   * Check if specific user type is required
   * If user doesn't have the required type, redirect to appropriate page
   * SPECIAL CASE: Admins can access all routes
   */
  if (requiredUserType) {
    const userType = getUserType();
    const isAdmin = user?.isAdmin && user?.userType === 'admin';
    
    // If user is admin, they can access any route
    if (isAdmin) {
      return children;
    }
    
    // For non-admin users, check if they have the required user type
    if (userType !== requiredUserType) {
      // Redirect based on user type
      if (userType === 'employer') {
        return <Navigate to="/dashboard" replace />;
      } else if (userType === 'admin') {
        return <Navigate to="/admin-dashboard" replace />;
      } else {
        return <Navigate to="/home" replace />;
      }
    }
  }

  /**
   * If all checks pass, render the protected component
   */
  return children;
};

export default ProtectedRoute; 