const mongoose = require('mongoose');

/**
 * Job Schema
 * Represents job postings in the WorkVerse platform
 * Clear naming conventions for all fields
 */
const jobSchema = new mongoose.Schema({
  // Basic Job Information
  jobTitle: {
    type: String,
    required: [true, 'Job title is required'],
    trim: true,
    maxlength: [100, 'Job title cannot exceed 100 characters']
  },
  
  companyName: {
    type: String,
    required: [true, 'Company name is required'],
    trim: true,
    maxlength: [100, 'Company name cannot exceed 100 characters']
  },
  
  jobLocation: {
    type: String,
    required: [true, 'Job location is required'],
    trim: true,
    maxlength: [100, 'Location cannot exceed 100 characters']
  },
  
  // Job Details
  jobType: {
    type: String,
    required: [true, 'Job type is required'],
    enum: ['full-time', 'part-time', 'contract', 'internship', 'freelance'],
    default: 'full-time'
  },
  
  experienceLevel: {
    type: String,
    required: [true, 'Experience level is required'],
    enum: [
      'entry-level',
      'junior-level', 
      'mid-level',
      'senior-level',
      'lead-level',
      'executive-level'
    ],
    default: 'entry-level'
  },
  
  salaryRange: {
    minSalary: {
      type: Number,
      required: [true, 'Minimum salary is required'],
      min: [0, 'Minimum salary cannot be negative']
    },
    maxSalary: {
      type: Number,
      required: [true, 'Maximum salary is required'],
      min: [0, 'Maximum salary cannot be negative']
    },
    currency: {
      type: String,
      default: 'USD',
      enum: ['USD', 'EUR', 'GBP', 'INR', 'CAD', 'AUD']
    },
    isSalaryVisible: {
      type: Boolean,
      default: true
    }
  },
  
  // Job Description
  jobDescription: {
    type: String,
    required: [true, 'Job description is required'],
    minlength: [50, 'Job description must be at least 50 characters'],
    maxlength: [5000, 'Job description cannot exceed 5000 characters']
  },
  
  jobRequirements: {
    type: String,
    required: [true, 'Job requirements are required'],
    minlength: [20, 'Job requirements must be at least 20 characters'],
    maxlength: [2000, 'Job requirements cannot exceed 2000 characters']
  },
  
  jobBenefits: {
    type: String,
    maxlength: [1000, 'Job benefits cannot exceed 1000 characters']
  },
  
  // Skills and Categories
  requiredSkills: [{
    type: String,
    trim: true,
    maxlength: [50, 'Skill name cannot exceed 50 characters']
  }],
  
  jobCategory: {
    type: String,
    required: [true, 'Job category is required'],
    enum: [
      'technology',
      'marketing', 
      'sales',
      'design',
      'finance',
      'human-resources',
      'operations',
      'customer-service',
      'engineering',
      'healthcare',
      'education',
      'legal',
      'consulting',
      'manufacturing',
      'other'
    ]
  },
  
  // Application Details
  applicationDeadline: {
    type: Date,
    required: [true, 'Application deadline is required'],
    validate: {
      validator: function(value) {
        return value > new Date();
      },
      message: 'Application deadline must be in the future'
    }
  },
  
  contactEmail: {
    type: String,
    required: [true, 'Contact email is required'],
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email address']
  },
  
  // Job Status and Visibility
  jobStatus: {
    type: String,
    enum: ['active', 'paused', 'closed', 'expired'],
    default: 'active'
  },
  
  isUrgent: {
    type: Boolean,
    default: false
  },
  
  isRemote: {
    type: Boolean,
    default: false
  },
  
  // Employer Information
  employerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Employer ID is required']
  },
  
  employerName: {
    type: String,
    required: [true, 'Employer name is required']
  },
  
  // Application Tracking
  totalApplications: {
    type: Number,
    default: 0,
    min: [0, 'Total applications cannot be negative']
  },
  
  totalViews: {
    type: Number,
    default: 0,
    min: [0, 'Total views cannot be negative']
  },
  
  // Timestamps
  createdAt: {
    type: Date,
    default: Date.now
  },
  
  updatedAt: {
    type: Date,
    default: Date.now
  },
  
  publishedAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Virtual for formatted salary display
jobSchema.virtual('formattedSalary').get(function() {
  if (!this.salaryRange.isSalaryVisible) {
    return 'Salary not disclosed';
  }
  
  const { minSalary, maxSalary, currency } = this.salaryRange;
  const currencySymbols = {
    'USD': '$',
    'EUR': '€',
    'GBP': '£',
    'INR': '₹',
    'CAD': 'C$',
    'AUD': 'A$'
  };
  
  const symbol = currencySymbols[currency] || currency;
  
  if (minSalary === maxSalary) {
    return `${symbol}${minSalary.toLocaleString()}`;
  }
  
  return `${symbol}${minSalary.toLocaleString()} - ${symbol}${maxSalary.toLocaleString()}`;
});

// Virtual for days until deadline
jobSchema.virtual('daysUntilDeadline').get(function() {
  const now = new Date();
  const deadline = new Date(this.applicationDeadline);
  const diffTime = deadline - now;
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays;
});

// Virtual for job age
jobSchema.virtual('jobAge').get(function() {
  const now = new Date();
  const created = new Date(this.createdAt);
  const diffTime = now - created;
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
  
  if (diffDays === 0) return 'Today';
  if (diffDays === 1) return 'Yesterday';
  if (diffDays < 7) return `${diffDays} days ago`;
  if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
  if (diffDays < 365) return `${Math.floor(diffDays / 30)} months ago`;
  return `${Math.floor(diffDays / 365)} years ago`;
});

// Indexes for better query performance
jobSchema.index({ jobStatus: 1, publishedAt: -1 });
jobSchema.index({ jobCategory: 1, jobStatus: 1 });
jobSchema.index({ employerId: 1, createdAt: -1 });
jobSchema.index({ jobTitle: 'text', jobDescription: 'text', requiredSkills: 'text' });
jobSchema.index({ applicationDeadline: 1 });
jobSchema.index({ isUrgent: 1, publishedAt: -1 });

// Pre-save middleware to update timestamps
jobSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

// Static method to find active jobs
jobSchema.statics.findActiveJobs = function() {
  return this.find({ 
    jobStatus: 'active',
    applicationDeadline: { $gt: new Date() }
  }).sort({ publishedAt: -1 });
};

// Static method to find jobs by employer
jobSchema.statics.findByEmployer = function(employerId) {
  return this.find({ employerId }).sort({ createdAt: -1 });
};

// Instance method to increment views
jobSchema.methods.incrementViews = function() {
  this.totalViews += 1;
  return this.save();
};

// Instance method to increment applications
jobSchema.methods.incrementApplications = function() {
  this.totalApplications += 1;
  return this.save();
};

// Instance method to check if job is expired
jobSchema.methods.isExpired = function() {
  return new Date() > this.applicationDeadline;
};

// Instance method to update job status based on deadline
jobSchema.methods.updateStatusByDeadline = function() {
  if (this.isExpired() && this.jobStatus === 'active') {
    this.jobStatus = 'expired';
    return this.save();
  }
  return Promise.resolve(this);
};

const Job = mongoose.model('Job', jobSchema);

module.exports = Job; 