// Import mongoose for schema and model creation
const mongoose = require('mongoose');

/**
 * User Schema Definition
 * This schema defines the structure for user documents in the WorkVerse collection
 * Each user can be either a jobseeker, employer, or admin
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
        enum: ['jobseeker', 'employer', 'admin'], // Added admin role
        default: 'jobseeker'            // Default to jobseeker if not specified
    },
    
    // Admin-specific fields
    isAdmin: {
        type: Boolean,
        default: false     // Only true for admin users
    },
    
    // Admin access level (for future use)
    adminLevel: {
        type: String,
        enum: ['super_admin', 'moderator', 'support'],
        default: 'moderator'
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
    collection: 'RegisteredUsers' // Store in RegisteredUsers collection as requested
});

/**
 * Pre-save middleware to ensure admin users are properly configured
 * This prevents unauthorized admin creation and ensures admin users have proper flags
 */
userSchema.pre('save', function(next) {
    // If this is a new user (not an update)
    if (this.isNew) {
        // SECURITY: Prevent admin creation through regular registration
        if (this.userType === 'admin' && !this.isAdmin) {
            const error = new Error('Admin users must be created through proper admin creation process');
            error.name = 'AdminCreationError';
            return next(error);
        }
        
        // If user is marked as admin, ensure proper admin configuration
        if (this.isAdmin) {
            this.userType = 'admin';
            this.adminLevel = this.adminLevel || 'moderator';
        }
    }
    
    // If updating an existing user
    if (!this.isNew && this.isModified('userType')) {
        // SECURITY: Prevent changing user type to admin through regular updates
        if (this.userType === 'admin' && !this.isAdmin) {
            const error = new Error('Cannot change user type to admin without proper admin privileges');
            error.name = 'AdminUpdateError';
            return next(error);
        }
    }
    
    next();
});

/**
 * Static method to create admin users (for use in admin creation script)
 * This ensures admin users are created with proper configuration
 */
userSchema.statics.createAdmin = async function(adminData) {
    // Ensure admin data has proper flags
    const adminUser = new this({
        ...adminData,
        userType: 'admin',
        isAdmin: true,
        adminLevel: adminData.adminLevel || 'moderator'
    });
    
    return await adminUser.save();
};

// Export the User model
// This creates a model named 'User' that uses the userSchema
module.exports = mongoose.model('User', userSchema); 
