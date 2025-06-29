import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Shield, Lock, Eye, EyeOff } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import '../Css/AdminLogin.css';

/**
 * AdminLogin Component
 * Separate login page for administrators only
 * Features:
 * - Admin-specific authentication
 * - Enhanced security UI elements
 * - Separate styling from regular login
 * - Admin dashboard redirect after login
 */
const AdminLogin = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  
  // Form state
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  // UI state
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  /**
   * Handle input field changes
   */
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    setError(''); // Clear error when user starts typing
  };

  /**
   * Toggle password visibility
   */
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  /**
   * Handle admin login form submission
   */
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // Make API call to admin login endpoint
      const response = await fetch('http://localhost:5000/api/admin/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      // Handle API errors
      if (!response.ok) {
        throw new Error(data.message || 'Admin login failed');
      }

      // Check if user is actually an admin
      if (!data.user.isAdmin || data.user.userType !== 'admin') {
        throw new Error('Access denied. Admin privileges required.');
      }

      // Use AuthContext to store authentication data
      login(data.user, data.token);

      // Redirect to admin dashboard
      navigate('/admin-dashboard', { replace: true });

    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Animation variants for smooth form transitions
   */
  const formVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <div className="admin-login-container">
      <div className="admin-login-box">
        {/* Header with admin icon */}
        <motion.div 
          className="admin-header"
          initial="hidden"
          animate="visible"
          variants={formVariants}
          transition={{ duration: 0.5 }}
        >
          <div className="admin-icon">
            <Shield size={48} />
          </div>
          <h1>Admin Access</h1>
          <p>Enter your administrator credentials</p>
        </motion.div>

        {/* Error message display */}
        {error && (
          <motion.div 
            className="error-message"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
          >
            {error}
          </motion.div>
        )}

        {/* Login form */}
        <motion.form
          className="admin-login-form"
          onSubmit={handleSubmit}
          initial="hidden"
          animate="visible"
          variants={formVariants}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          {/* Email input */}
          <div className="form-group">
            <label htmlFor="email">Admin Email</label>
            <div className="input-wrapper">
              <input
                type="email"
                id="email"
                name="email"
                placeholder="admin@workverse.com"
                value={formData.email}
                onChange={handleInputChange}
                required
                className="admin-input"
              />
            </div>
          </div>

          {/* Password input */}
          <div className="form-group">
            <label htmlFor="password">Admin Password</label>
            <div className="input-wrapper">
              <input
                type={showPassword ? 'text' : 'password'}
                id="password"
                name="password"
                placeholder="Enter your password"
                value={formData.password}
                onChange={handleInputChange}
                required
                className="admin-input"
              />
              <button
                type="button"
                className="password-toggle"
                onClick={togglePasswordVisibility}
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>

          {/* Submit button */}
          <button 
            type="submit" 
            className="admin-login-btn"
            disabled={loading}
          >
            {loading ? (
              <div className="loading-spinner">
                <div className="spinner"></div>
                <span>Authenticating...</span>
              </div>
            ) : (
              <>
                <Lock size={20} />
                <span>Access Admin Panel</span>
              </>
            )}
          </button>
        </motion.form>

        {/* Footer */}
        <motion.div 
          className="admin-footer"
          initial="hidden"
          animate="visible"
          variants={formVariants}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <p>This area is restricted to authorized administrators only.</p>
          <button 
            className="back-to-main"
            onClick={() => navigate('/')}
          >
            ← Back to Main Site
          </button>
        </motion.div>
      </div>
    </div>
  );
};

export default AdminLogin; 