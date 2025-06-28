import React, { useState } from 'react';  //import React and useState hook to manage local state
import { motion, AnimatePresence } from 'framer-motion';  // importing animation components from framer-motion
import { useNavigate } from 'react-router-dom'; // useNavigate is used to programatically users (like after login)
import '../Css/AuthForm.css'; // importing custom css

/**
 * AuthForm Component
 * Handles user registration and login functionality
 * Features:
 * - Toggle between registration and login forms
 * - Form validation and error handling
 * - API integration with backend
 * - Smooth animations between form states
 * - Responsive design for mobile and desktop
 */
const AuthForm = () => {  
  // State to toggle between registration and login forms
  const [isRegistering, setIsRegistering] = useState(true);
  
  // React Router navigation hook
  const navigate = useNavigate();
  
  // Function to switch between register and login forms
  const toggleForm = () => setIsRegistering(!isRegistering);

  // Form data state - holds all input values
  const [formData, setFormData] = useState({
    name: '',           // User's full name (registration only)
    email: '',          // User's email address
    password: '',       // User's password
    userType: 'jobseeker' // User type: jobseeker or employer
  });

  // UI state management
  const [loading, setLoading] = useState(false);  // Loading state for API calls
  const [error, setError] = useState('');         // Error message display

  // Animation variants for smooth form transitions
  const formVariants = {
    hidden: { opacity: 0, x: 100 },  // Start from right and invisible
    visible: { opacity: 1, x: 0 },   // Animate into view 
    exit: { opacity: 0, x: -100 }    // Exit animation to left
  };

  /**
   * Handle input field changes
   * Updates form state and clears any previous errors
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
   * Handle form submission (registration or login)
   * Makes API call to backend and handles response
   */
  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent default form submission
    setLoading(true);   // Show loading state
    setError('');       // Clear previous errors

    try {
      // Determine API endpoint based on form type
      const endpoint = isRegistering ? '/api/auth/register' : '/api/auth/login';
      
      // Prepare request data based on form type
      const requestData = isRegistering ? formData : {
        email: formData.email,
        password: formData.password
      };

      // Make API call to backend
      const response = await fetch(`http://localhost:5000${endpoint}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestData),
      });

      // Parse response data
      const data = await response.json();

      // Handle API errors
      if (!response.ok) {
        throw new Error(data.message || 'Something went wrong');
      }

      if (isRegistering) {
        // After successful registration, show success message and switch to login
        setError(''); // Clear any previous errors
        alert('Registration successful! Please log in with your credentials.');
        
        // Clear form and switch to login form
        setFormData({
          name: '',
          email: '',
          password: '',
          userType: 'jobseeker'
        });
        setIsRegistering(false);
      } else {
        // For login, store authentication data and redirect
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));

        // Redirect based on user type
        if (data.user.userType === 'employer') {
          navigate('/dashboard');
        } else {
          navigate('/home');
        }
      }

    } catch (err) {
      // Display error message to user
      setError(err.message);
    } finally {
      // Always hide loading state
      setLoading(false);
    }
  };

  return (
    <div className="auth-container"> {/* Container for the entire auth form*/}
      <div className="auth-box glass">  {/* styled box using glass effect*/}
        {/* If registering then the text will be CUYA and ig logging in then WB*/}
        <h2>{isRegistering ? 'Create Your WorkVerse Account' : 'Welcome Back!'}</h2>
        
        {error && (
          <div className="error-message" style={{ color: 'red', marginBottom: '10px', textAlign: 'center' }}>
            {error}
          </div>
        )}

        <AnimatePresence mode="wait">
          {isRegistering ? (
            <motion.form
              key="register"
              initial="hidden"
              animate="visible"
              exit="exit"
              variants={formVariants}
              transition={{ duration: 0.5 }}
              className="auth-form"
              onSubmit={handleSubmit}
            >
              <input
                type="text"
                name="name"
                placeholder="Full Name"
                value={formData.name}
                onChange={handleInputChange}
                required
              />
              <input
                type="email"
                name="email"
                placeholder="Email"
                value={formData.email}
                onChange={handleInputChange}
                required
              />
              <input
                type="password"
                name="password"
                placeholder="Password"
                value={formData.password}
                onChange={handleInputChange}
                required
                minLength={6}
              />
              <select
                name="userType"
                value={formData.userType}
                onChange={handleInputChange}
                required
              >
                <option value="jobseeker">Job Seeker</option>
                <option value="employer">Employer</option>
              </select>
              <button type="submit" disabled={loading}>
                {loading ? 'Signing Up...' : 'Sign Up'}
              </button>
            </motion.form>
          ) : (
            <motion.form
              key="login"
              initial="hidden"
              animate="visible"
              exit="exit"
              variants={formVariants}
              transition={{ duration: 0.5 }}
              className="auth-form"
              onSubmit={handleSubmit}
            >
              <input
                type="email"
                name="email"
                placeholder="Email"
                value={formData.email}
                onChange={handleInputChange}
                required
              />
              <input
                type="password"
                name="password"
                placeholder="Password"
                value={formData.password}
                onChange={handleInputChange}
                required
              />
              <button type="submit" disabled={loading}>
                {loading ? 'Signing In...' : 'Sign In'}
              </button>
            </motion.form>
          )}
        </AnimatePresence>

        <p className="auth-toggle">
          {isRegistering ? 'Already have an account?' : "Don't have an account?"}
          <span onClick={toggleForm}>
            {isRegistering ? ' Login' : ' Register'}
          </span>
        </p>
      </div>
    </div>
  );
};

export default AuthForm;
