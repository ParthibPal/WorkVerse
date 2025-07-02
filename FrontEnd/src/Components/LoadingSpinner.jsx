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
    <div className="spinner-overlay">
      <div className="spinner" />
    </div>
  );
};

export default LoadingSpinner; 