import React from 'react';

/**
 * LoadingSpinner Component
 * A reusable loading spinner with customizable size and message
 * 
 * Props:
 * - size: 'small', 'medium', 'large' (default: 'medium')
 * - message: Custom loading message (default: 'Loading...')
 * - fullScreen: Whether to cover the full screen (default: false)
 */
const LoadingSpinner = ({ size = 'medium', message = 'Loading...', fullScreen = false }) => {
  // Size classes for different spinner sizes
  const sizeClasses = {
    small: 'w-6 h-6',
    medium: 'w-8 h-8',
    large: 'w-12 h-12'
  };

  // Container styles based on fullScreen prop
  const containerStyles = fullScreen ? {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100vh',
    fontSize: '18px'
  } : {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    padding: '20px'
  };

  return (
    <div style={containerStyles}>
      {/* Spinner animation */}
      <div 
        className={`animate-spin rounded-full border-4 border-gray-300 border-t-blue-600 ${sizeClasses[size]}`}
        style={{
          animation: 'spin 1s linear infinite'
        }}
      />
      
      {/* Loading message */}
      <p style={{ 
        marginTop: '10px', 
        color: '#666',
        fontSize: size === 'large' ? '16px' : '14px'
      }}>
        {message}
      </p>
      
      {/* CSS for the spin animation */}
      <style jsx>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

export default LoadingSpinner; 