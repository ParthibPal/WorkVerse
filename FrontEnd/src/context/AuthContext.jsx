import React, { createContext, useContext, useState, useEffect } from 'react';

/**
 * Authentication Context
 * This context provides authentication state and methods to all components
 * It manages user login/logout state and provides helper functions
 */
const AuthContext = createContext();

// Export AuthContext for direct import
export { AuthContext };

/**
 * Custom hook to use the authentication context
 * This makes it easier to access auth data in any component
 */
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

/**
 * AuthProvider Component
 * Wraps the app and provides authentication state to all child components
 */
export const AuthProvider = ({ children }) => {
  // State to store current user information
  const [user, setUser] = useState(null);
  
  // State to track if we're still checking authentication status
  const [loading, setLoading] = useState(true);
  
  // State to store the JWT token
  const [token, setToken] = useState(null);

  /**
   * Check if user is authenticated on app startup
   * This runs when the component mounts to restore user session
   */
  useEffect(() => {
    // Get stored authentication data from localStorage
    const storedToken = localStorage.getItem('token');
    const storedUser = localStorage.getItem('user');

    if (storedToken && storedUser) {
      try {
        // Parse the stored user data
        const userData = JSON.parse(storedUser);
        
        // Set the authentication state
        setToken(storedToken);
        setUser(userData);
      } catch (error) {
        // If there's an error parsing user data, clear invalid data
        console.error('Error parsing stored user data:', error);
        localStorage.removeItem('token');
        localStorage.removeItem('user');
      }
    }
    
    // Mark loading as complete
    setLoading(false);
  }, []);

  /**
   * Login function
   * Stores user data and token, then updates state
   */
  const login = (userData, authToken) => {
    // Store authentication data in localStorage for persistence
    localStorage.setItem('token', authToken);
    localStorage.setItem('user', JSON.stringify(userData));
    
    // Update state
    setToken(authToken);
    setUser(userData);
  };

  /**
   * Logout function
   * Clears all authentication data and resets state
   */
  const logout = () => {
    // Remove authentication data from localStorage
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    
    // Reset state
    setToken(null);
    setUser(null);
  };

  /**
   * Check if user is currently authenticated
   * Returns true if user data and token exist
   */
  const isAuthenticated = () => {
    return !!user && !!token;
  };

  /**
   * Get the current user's type (jobseeker or employer)
   * Useful for conditional rendering based on user role
   */
  const getUserType = () => {
    return user?.userType || null;
  };

  /**
   * Context value object
   * Contains all the authentication state and methods
   */
  const value = {
    user,                    // Current user data
    token,                   // JWT token
    loading,                 // Loading state
    login,                   // Login function
    logout,                  // Logout function
    isAuthenticated,         // Check if authenticated
    getUserType,             // Get user type
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}; 