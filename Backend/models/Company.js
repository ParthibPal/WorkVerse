const mongoose = require('mongoose');

const companySchema = new mongoose.Schema({
  // Basic Information
  name: {
    type: String,
    required: [true, 'Company name is required'],
    trim: true,
    maxlength: [100, 'Company name cannot exceed 100 characters']
  },
  
  logo: {
    type: String,
    default: '🏢' // Default emoji logo
  },
  
  industry: {
    type: String,
    required: [true, 'Industry is required'],
    enum: [
      'Technology',
      'Healthcare', 
      'Finance',
      'Education',
      'Energy',
      'Retail',
      'Agriculture',
      'Manufacturing',
      'Consulting',
      'Media',
      'Transportation',
      'Real Estate',
      'Other'
    ]
  },
  
  size: {
    type: String,
    required: [true, 'Company size is required'],
    enum: ['1-50', '50-100', '100-200', '200-500', '500-1000', '1000+']
  },
  
  location: {
    type: String,
    required: [true, 'Location is required'],
    trim: true,
    maxlength: [100, 'Location cannot exceed 100 characters']
  },
  
  description: {
    type: String,
    required: [true, 'Company description is required'],
    minlength: [50, 'Description must be at least 50 characters'],
    maxlength: [1000, 'Description cannot exceed 1000 characters']
  },
  
  website: {
    type: String,
    trim: true,
    validate: {
      validator: function(value) {
        if (!value) return true; // Allow empty values
        
        // Accept both domain names and full URLs
        const domainRegex = /^[a-zA-Z0-9][a-zA-Z0-9-]{1,61}[a-zA-Z0-9]\.[a-zA-Z]{2,}$/;
        const urlRegex = /^https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)$/;
        
        return domainRegex.test(value) || urlRegex.test(value);
      },
      message: 'Please enter a valid domain name (e.g., example.com) or full URL (e.g., https://example.com)'
    }
  },
  
  // Ratings and Reviews
  rating: {
    type: Number,
    default: 0,
    min: [0, 'Rating cannot be negative'],
    max: [5, 'Rating cannot exceed 5']
  },
  
  reviewCount: {
    type: Number,
    default: 0,
    min: [0, 'Review count cannot be negative']
  },
  
  // Job Information
  openJobs: {
    type: Number,
    default: 0,
    min: [0, 'Open jobs cannot be negative']
  },
  
  // Status Flags
  featured: {
    type: Boolean,
    default: false
  },
  
  verified: {
    type: Boolean,
    default: false
  },
  
  trending: {
    type: Boolean,
    default: false
  },
  
  // Benefits and Compensation
  topBenefits: [{
    type: String,
    trim: true,
    maxlength: [50, 'Benefit name cannot exceed 50 characters']
  }],
  
  salaryRange: {
    min: {
      type: Number,
      min: [0, 'Minimum salary cannot be negative']
    },
    max: {
      type: Number,
      min: [0, 'Maximum salary cannot be negative']
    },
    currency: {
      type: String,
      default: 'USD',
      enum: ['USD', 'EUR', 'GBP', 'INR', 'CAD', 'AUD']
    }
  },
  
  hiringUrgency: {
    type: String,
    enum: ['low', 'medium', 'high'],
    default: 'medium'
  },
  
  // Contact Information
  contactEmail: {
    type: String,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email address']
  },
  
  contactPhone: {
    type: String,
    trim: true
  },
  
  // Social Media
  linkedin: {
    type: String,
    trim: true
  },
  
  twitter: {
    type: String,
    trim: true
  },
  
  // Company Details
  foundedYear: {
    type: Number,
    min: [1800, 'Founded year must be after 1800'],
    max: [new Date().getFullYear(), 'Founded year cannot be in the future']
  },
  
  headquarters: {
    type: String,
    trim: true
  },
  
  // Statistics
  totalEmployees: {
    type: Number,
    min: [0, 'Total employees cannot be negative']
  },
  
  // Timestamps
  createdAt: {
    type: Date,
    default: Date.now
  },
  
  updatedAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Index for better search performance
companySchema.index({ name: 'text', description: 'text', industry: 'text' });
companySchema.index({ featured: 1, rating: -1 });
companySchema.index({ industry: 1, location: 1 });
companySchema.index({ name: 1 }, { unique: true, collation: { locale: 'en', strength: 2 } });

// Virtual for formatted salary range
companySchema.virtual('formattedSalaryRange').get(function() {
  if (!this.salaryRange.min && !this.salaryRange.max) {
    return 'Salary not disclosed';
  }
  
  const currencySymbols = {
    'USD': '$',
    'EUR': '€',
    'GBP': '£',
    'INR': '₹',
    'CAD': 'C$',
    'AUD': 'A$'
  };
  
  const symbol = currencySymbols[this.salaryRange.currency] || this.salaryRange.currency;
  
  if (this.salaryRange.min === this.salaryRange.max) {
    return `${symbol}${this.salaryRange.min.toLocaleString()}`;
  }
  
  return `${symbol}${this.salaryRange.min.toLocaleString()} - ${symbol}${this.salaryRange.max.toLocaleString()}`;
});

// Ensure virtual fields are serialized
companySchema.set('toJSON', { virtuals: true });
companySchema.set('toObject', { virtuals: true });

module.exports = mongoose.model('Company', companySchema); 