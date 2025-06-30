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
    
    // Profile fields for job seekers
    firstName: {
        type: String,
        trim: true,
        maxlength: [50, 'First name cannot exceed 50 characters']
    },
    
    lastName: {
        type: String,
        trim: true,
        maxlength: [50, 'Last name cannot exceed 50 characters']
    },
    
    phone: {
        type: String,
        trim: true,
        maxlength: [20, 'Phone number cannot exceed 20 characters']
    },
    
    headline: {
        type: String,
        trim: true,
        maxlength: [100, 'Headline cannot exceed 100 characters']
    },
    
    summary: {
        type: String,
        trim: true,
        maxlength: [500, 'Summary cannot exceed 500 characters']
    },
    
    experience: {
        type: String,
        enum: ['entry-level', 'junior', 'mid-level', 'senior', 'lead', 'executive'],
        default: 'entry-level'
    },
    
    education: {
        degree: {
            type: String,
            trim: true,
            maxlength: [100, 'Degree cannot exceed 100 characters']
        },
        institution: {
            type: String,
            trim: true,
            maxlength: [100, 'Institution cannot exceed 100 characters']
        },
        graduationYear: {
            type: Number,
            min: [1900, 'Graduation year must be after 1900'],
            max: [new Date().getFullYear() + 10, 'Graduation year cannot be more than 10 years in the future']
        },
        fieldOfStudy: {
            type: String,
            trim: true,
            maxlength: [100, 'Field of study cannot exceed 100 characters']
        }
    },
    
    skills: [{
        type: String,
        trim: true,
        maxlength: [50, 'Skill name cannot exceed 50 characters']
    }],
    
    linkedin: {
        type: String,
        trim: true,
        validate: {
            validator: function(value) {
                if (!value || value === '' || value.toLowerCase() === 'na' || value.toLowerCase() === 'n/a') {
                    return true; // Allow empty values and "NA"
                }
                return /^https?:\/\/(www\.)?linkedin\.com\/in\/[a-zA-Z0-9-]+\/?$/.test(value);
            },
            message: 'Please enter a valid LinkedIn profile URL or leave empty if not applicable'
        }
    },
    
    github: {
        type: String,
        trim: true,
        validate: {
            validator: function(value) {
                if (!value || value === '' || value.toLowerCase() === 'na' || value.toLowerCase() === 'n/a') {
                    return true; // Allow empty values and "NA"
                }
                return /^https?:\/\/(www\.)?github\.com\/[a-zA-Z0-9-]+\/?$/.test(value);
            },
            message: 'Please enter a valid GitHub profile URL or leave empty if not applicable'
        }
    },
    
    portfolio: {
        type: String,
        trim: true,
        validate: {
            validator: function(value) {
                if (!value || value === '' || value.toLowerCase() === 'na' || value.toLowerCase() === 'n/a') {
                    return true; // Allow empty values and "NA"
                }
                return /^https?:\/\//.test(value);
            },
            message: 'Please enter a valid portfolio URL or leave empty if not applicable'
        }
    },
    
    // CV/Resume
    cvFile: {
        fileName: {
            type: String,
            trim: true
        },
        fileUrl: {
            type: String,
            trim: true
        },
        fileSize: {
            type: Number,
            min: [0, 'File size cannot be negative']
        },
        uploadedAt: {
            type: Date,
            default: Date.now
        }
    },
    
    // Profile Completion
    profileCompletion: {
        type: Number,
        min: [0, 'Profile completion cannot be negative'],
        max: [100, 'Profile completion cannot exceed 100%'],
        default: 0
    },
    
    isProfileComplete: {
        type: Boolean,
        default: false
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
    
    // Calculate profile completion for job seekers
    if (this.userType === 'jobseeker') {
        this.calculateProfileCompletion();
    }
    
    next();
});

/**
 * Method to calculate profile completion percentage
 */
userSchema.methods.calculateProfileCompletion = function() {
    const requiredFields = [
        'firstName', 'lastName', 'phone', 'headline', 'summary',
        'education.degree', 'education.institution', 'skills'
    ];
    
    let completedFields = 0;
    let totalFields = requiredFields.length + 1; // +1 for CV
    
    // Check required fields
    requiredFields.forEach(field => {
        if (this.get(field) && this.get(field).toString().trim() !== '') {
            completedFields++;
        }
    });
    
    // Check CV upload
    if (this.cvFile && this.cvFile.fileUrl) {
        completedFields++;
    }
    
    // Calculate completion percentage
    this.profileCompletion = Math.round((completedFields / totalFields) * 100);
    this.isProfileComplete = this.profileCompletion >= 80; // 80% completion required
};

/**
 * Method to get profile completion details
 */
userSchema.methods.getCompletionDetails = function() {
    const missingFields = [];
    
    if (!this.firstName) missingFields.push('First Name');
    if (!this.lastName) missingFields.push('Last Name');
    if (!this.phone) missingFields.push('Phone Number');
    if (!this.headline) missingFields.push('Professional Headline');
    if (!this.summary) missingFields.push('Professional Summary');
    if (!this.education?.degree) missingFields.push('Education Degree');
    if (!this.education?.institution) missingFields.push('Education Institution');
    if (!this.skills || this.skills.length === 0) missingFields.push('Skills');
    if (!this.cvFile?.fileUrl) missingFields.push('CV/Resume Upload');

    return {
        completion: this.profileCompletion,
        isComplete: this.isProfileComplete,
        missingFields
    };
};

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
