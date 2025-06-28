// Import mongoose for schema and model creation
const mongoose = require('mongoose');

/**
 * User Schema Definition
 * This schema defines the structure for user documents in the WorkVerse collection
 * Each user can be either a jobseeker or an employer
 */
const userSchema = new mongoose.Schema({
    // User's full name - required field
    name: {
        type: String,
        required: true, // Must be provided during registration
        trim: true     // Remove whitespace from beginning and end
    },
    
    // User's email address - must be unique across all users
    email: {
        type: String,
        required: true,    // Must be provided during registration
        unique: true,      // No two users can have the same email
        trim: true,        // Remove whitespace
        lowercase: true    // Store email in lowercase for consistency
    },
    
    // User's password - will be hashed before saving
    password: {
        type: String,
        required: true,    // Must be provided during registration
        minlength: 6       // Minimum 6 characters for security
    },
    
    // User type - determines their role in the platform
    userType: {
        type: String,
        enum: ['jobseeker', 'employer'], // Only these values are allowed
        default: 'jobseeker'            // Default to jobseeker if not specified
    },
    
    // When the user registered - automatically set
    registrationDate: {
        type: Date,
        default: Date.now  // Set to current date/time when user is created
    },
    
    // Whether the user account is active
    isActive: {
        type: Boolean,
        default: true      // New users are active by default
    }
}, {
    // Schema options
    timestamps: true,      // Automatically add createdAt and updatedAt fields
    collection: 'WorkVerse' // Store in WorkVerse collection as requested
});

// Export the User model
// This creates a model named 'User' that uses the userSchema
module.exports = mongoose.model('User', userSchema); 
