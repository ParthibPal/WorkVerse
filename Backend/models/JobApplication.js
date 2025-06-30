const mongoose = require('mongoose');

/**
 * Job Application Schema
 * Tracks applications from job seekers to jobs
 */
const jobApplicationSchema = new mongoose.Schema({
  // Job Information
  jobId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Job',
    required: true
  },

  jobTitle: {
    type: String,
    required: true,
    trim: true
  },

  companyName: {
    type: String,
    required: true,
    trim: true
  },

  // Applicant Information
  applicantId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },

  applicantName: {
    type: String,
    required: true,
    trim: true
  },

  applicantEmail: {
    type: String,
    required: true,
    trim: true,
    lowercase: true
  },

  // Application Details
  coverLetter: {
    type: String,
    trim: true,
    maxlength: [2000, 'Cover letter cannot exceed 2000 characters']
  },

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
    }
  },

  // Application Status
  status: {
    type: String,
    enum: ['pending', 'reviewed', 'shortlisted', 'interviewed', 'offered', 'hired', 'rejected', 'withdrawn'],
    default: 'pending'
  },

  // Application Tracking
  appliedAt: {
    type: Date,
    default: Date.now
  },

  reviewedAt: {
    type: Date
  },

  reviewedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },

  // Communication
  employerNotes: {
    type: String,
    trim: true,
    maxlength: [1000, 'Employer notes cannot exceed 1000 characters']
  },

  applicantNotes: {
    type: String,
    trim: true,
    maxlength: [1000, 'Applicant notes cannot exceed 1000 characters']
  },

  // Interview Details
  interviewScheduled: {
    type: Boolean,
    default: false
  },

  interviewDate: {
    type: Date
  },

  interviewType: {
    type: String,
    enum: ['phone', 'video', 'in-person', 'technical', 'assessment'],
    default: 'phone'
  },

  interviewLocation: {
    type: String,
    trim: true
  },

  // Salary Discussion
  salaryDiscussed: {
    type: Boolean,
    default: false
  },

  offeredSalary: {
    amount: {
      type: Number,
      min: [0, 'Offered salary cannot be negative']
    },
    currency: {
      type: String,
      enum: ['USD', 'EUR', 'GBP', 'INR', 'CAD', 'AUD'],
      default: 'USD'
    }
  },

  // Flags
  isUrgent: {
    type: Boolean,
    default: false
  },

  isFavorite: {
    type: Boolean,
    default: false
  },

  // Communication History
  communicationHistory: [{
    type: {
      type: String,
      enum: ['email', 'message', 'note', 'status_change'],
      required: true
    },
    from: {
      type: String,
      enum: ['employer', 'applicant', 'system'],
      required: true
    },
    message: {
      type: String,
      required: true,
      trim: true
    },
    timestamp: {
      type: Date,
      default: Date.now
    },
    isRead: {
      type: Boolean,
      default: false
    }
  }]
}, {
  timestamps: true,
  collection: 'JobApplications'
});

/**
 * Indexes for better query performance
 */
jobApplicationSchema.index({ jobId: 1, applicantId: 1 }, { unique: true });
jobApplicationSchema.index({ applicantId: 1, status: 1 });
jobApplicationSchema.index({ jobId: 1, status: 1 });
jobApplicationSchema.index({ appliedAt: -1 });

/**
 * Pre-save middleware to ensure one application per job per applicant
 */
jobApplicationSchema.pre('save', function(next) {
  if (this.isNew) {
    // Check if application already exists
    this.constructor.findOne({
      jobId: this.jobId,
      applicantId: this.applicantId
    }).then(existingApplication => {
      if (existingApplication) {
        const error = new Error('You have already applied for this job');
        error.name = 'DuplicateApplicationError';
        return next(error);
      }
      next();
    }).catch(next);
  } else {
    next();
  }
});

/**
 * Post-save middleware to update job application count
 */
jobApplicationSchema.post('save', async function(doc) {
  try {
    const Job = mongoose.model('Job');
    await Job.findByIdAndUpdate(doc.jobId, {
      $inc: { totalApplications: 1 }
    });
  } catch (error) {
    console.error('Error updating job application count:', error);
  }
});

/**
 * Post-remove middleware to update job application count
 */
jobApplicationSchema.post('remove', async function(doc) {
  try {
    const Job = mongoose.model('Job');
    await Job.findByIdAndUpdate(doc.jobId, {
      $inc: { totalApplications: -1 }
    });
  } catch (error) {
    console.error('Error updating job application count:', error);
  }
});

/**
 * Virtual for application age
 */
jobApplicationSchema.virtual('applicationAge').get(function() {
  const now = new Date();
  const applied = new Date(this.appliedAt);
  const diffTime = now - applied;
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
  
  if (diffDays === 0) return 'Today';
  if (diffDays === 1) return 'Yesterday';
  if (diffDays < 7) return `${diffDays} days ago`;
  if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
  if (diffDays < 365) return `${Math.floor(diffDays / 30)} months ago`;
  return `${Math.floor(diffDays / 365)} years ago`;
});

/**
 * Method to add communication entry
 */
jobApplicationSchema.methods.addCommunication = function(type, from, message) {
  this.communicationHistory.push({
    type,
    from,
    message,
    timestamp: new Date()
  });
  return this.save();
};

/**
 * Method to update status
 */
jobApplicationSchema.methods.updateStatus = function(newStatus, notes = '') {
  this.status = newStatus;
  this.reviewedAt = new Date();
  
  if (notes) {
    this.employerNotes = notes;
  }
  
  // Add status change to communication history
  this.communicationHistory.push({
    type: 'status_change',
    from: 'system',
    message: `Application status changed to ${newStatus}`,
    timestamp: new Date()
  });
  
  return this.save();
};

/**
 * Static method to get application statistics
 */
jobApplicationSchema.statics.getApplicationStats = async function(jobId) {
  const stats = await this.aggregate([
    { $match: { jobId: new mongoose.Types.ObjectId(jobId) } },
    {
      $group: {
        _id: '$status',
        count: { $sum: 1 }
      }
    }
  ]);
  
  const result = {
    total: 0,
    pending: 0,
    reviewed: 0,
    shortlisted: 0,
    interviewed: 0,
    offered: 0,
    hired: 0,
    rejected: 0,
    withdrawn: 0
  };
  
  stats.forEach(stat => {
    result[stat._id] = stat.count;
    result.total += stat.count;
  });
  
  return result;
};

module.exports = mongoose.model('JobApplication', jobApplicationSchema); 