const express = require('express');
const router = express.Router();
const JobApplication = require('../models/JobApplication');
const Job = require('../models/Job');
const User = require('../models/User');
const authMiddleware = require('../middleware/authMiddleware');
const employerMiddleware = require('../middleware/employerMiddleware');
const multer = require('multer');
const path = require('path');

// Multer storage for CV uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, '../uploads/cv'));
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, 'cv-' + uniqueSuffix + path.extname(file.originalname));
  }
});
const upload = multer({ storage });

/**
 * POST /api/applications
 * Apply for a job
 */
router.post('/', authMiddleware, upload.single('cv'), async (req, res) => {
  try {
    const { jobId, coverLetter } = req.body;

    // Check if user is a jobseeker
    if (req.user.userType !== 'jobseeker') {
      return res.status(403).json({
        success: false,
        message: 'Only job seekers can apply for jobs'
      });
    }

    // Validate required fields
    if (!jobId) {
      return res.status(400).json({
        success: false,
        message: 'Job ID is required'
      });
    }

    // Check if job exists and is active
    const job = await Job.findById(jobId);
    if (!job) {
      return res.status(404).json({
        success: false,
        message: 'Job not found'
      });
    }

    if (job.jobStatus !== 'active') {
      return res.status(400).json({
        success: false,
        message: 'This job is not currently accepting applications'
      });
    }

    // Check if application deadline has passed
    if (new Date() > new Date(job.applicationDeadline)) {
      return res.status(400).json({
        success: false,
        message: 'Application deadline has passed'
      });
    }

    // Check if user has a complete profile
    const user = await User.findById(req.user._id);
    if (!user || !user.isProfileComplete) {
      return res.status(400).json({
        success: false,
        message: 'Please complete your profile before applying for jobs',
        data: {
          hasProfile: !!user,
          completion: user ? user.profileCompletion : 0,
          isComplete: user ? user.isProfileComplete : false,
          missingFields: user ? user.getCompletionDetails().missingFields : []
        }
      });
    }

    // Check if user has already applied for this job
    const existingApplication = await JobApplication.findOne({
      jobId,
      applicantId: req.user._id
    });

    if (existingApplication) {
      return res.status(400).json({
        success: false,
        message: 'You have already applied for this job'
      });
    }

    // Handle CV file
    let cvFile = null;
    if (req.file) {
      cvFile = {
        fileName: req.file.filename,
        fileUrl: `/uploads/cv/${req.file.filename}`,
        fileSize: req.file.size
      };
    } else if (user.cvFile) {
      cvFile = user.cvFile;
    }

    // Create new application
    const application = new JobApplication({
      jobId,
      jobTitle: job.jobTitle,
      companyName: job.companyName,
      applicantId: req.user._id,
      applicantName: `${user.firstName} ${user.lastName}`,
      applicantEmail: req.user.email,
      coverLetter,
      cvFile
    });

    await application.save();

    res.status(201).json({
      success: true,
      message: 'Application submitted successfully',
      data: { application }
    });
  } catch (error) {
    console.error('Error submitting application:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to submit application'
    });
  }
});

/**
 * GET /api/applications/my-applications
 * Get current user's applications (for job seekers)
 */
router.get('/my-applications', authMiddleware, async (req, res) => {
  try {
    if (req.user.userType !== 'jobseeker') {
      return res.status(403).json({
        success: false,
        message: 'Only job seekers can view their applications'
      });
    }

    const { page = 1, limit = 10, status } = req.query;
    const skip = (page - 1) * limit;

    const query = { applicantId: req.user._id };
    if (status && status !== 'all') {
      query.status = status;
    }

    const applications = await JobApplication.find(query)
      .sort({ appliedAt: -1 })
      .skip(skip)
      .limit(parseInt(limit))
      .populate('jobId', 'jobTitle companyName jobLocation jobType experienceLevel');

    const total = await JobApplication.countDocuments(query);

    res.json({
      success: true,
      data: {
        applications,
        pagination: {
          currentPage: parseInt(page),
          totalPages: Math.ceil(total / limit),
          total,
          hasNext: page * limit < total,
          hasPrev: page > 1
        }
      }
    });
  } catch (error) {
    console.error('Error fetching applications:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch applications'
    });
  }
});

/**
 * GET /api/applications/job/:jobId
 * Get applications for a specific job (for employers)
 */
router.get('/job/:jobId', authMiddleware, employerMiddleware, async (req, res) => {
  try {
    const { jobId } = req.params;
    const { page = 1, limit = 10, status, sortBy = 'appliedAt' } = req.query;
    const skip = (page - 1) * limit;

    // Verify the job belongs to the current employer
    const job = await Job.findById(jobId);
    if (!job || job.employerId.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'You can only view applications for your own jobs'
      });
    }

    const query = { jobId };
    if (status && status !== 'all') {
      query.status = status;
    }

    let sortQuery = {};
    switch (sortBy) {
      case 'appliedAt':
        sortQuery = { appliedAt: -1 };
        break;
      case 'status':
        sortQuery = { status: 1, appliedAt: -1 };
        break;
      case 'name':
        sortQuery = { applicantName: 1 };
        break;
      default:
        sortQuery = { appliedAt: -1 };
    }

    const applications = await JobApplication.find(query)
      .sort(sortQuery)
      .skip(skip)
      .limit(parseInt(limit))
      .populate('applicantId');

    const total = await JobApplication.countDocuments(query);

    // Get application statistics
    const stats = await JobApplication.getApplicationStats(jobId);

    res.json({
      success: true,
      data: {
        applications,
        stats,
        pagination: {
          currentPage: parseInt(page),
          totalPages: Math.ceil(total / limit),
          total,
          hasNext: page * limit < total,
          hasPrev: page > 1
        }
      }
    });
  } catch (error) {
    console.error('Error fetching job applications:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch applications'
    });
  }
});

/**
 * GET /api/applications/:id
 * Get specific application details
 */
router.get('/:id', authMiddleware, async (req, res) => {
  try {
    const application = await JobApplication.findById(req.params.id)
      .populate('jobId')
      .populate('applicantId', 'name email');

    if (!application) {
      return res.status(404).json({
        success: false,
        message: 'Application not found'
      });
    }

    // Check if user has permission to view this application
    const isApplicant = application.applicantId._id.toString() === req.user._id.toString();
    const isEmployer = req.user.userType === 'employer' && 
                      application.jobId.employerId.toString() === req.user._id.toString();

    if (!isApplicant && !isEmployer) {
      return res.status(403).json({
        success: false,
        message: 'You do not have permission to view this application'
      });
    }

    res.json({
      success: true,
      data: { application }
    });
  } catch (error) {
    console.error('Error fetching application:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch application'
    });
  }
});

/**
 * PUT /api/applications/:id/status
 * Update application status (for employers)
 */
router.put('/:id/status', authMiddleware, employerMiddleware, async (req, res) => {
  try {
    const { status, notes } = req.body;
    const { id } = req.params;

    const application = await JobApplication.findById(id).populate('jobId');

    if (!application) {
      return res.status(404).json({
        success: false,
        message: 'Application not found'
      });
    }

    // Verify the job belongs to the current employer
    if (application.jobId.employerId.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'You can only update applications for your own jobs'
      });
    }

    // Update application status
    await application.updateStatus(status, notes);

    res.json({
      success: true,
      message: 'Application status updated successfully',
      data: { application }
    });
  } catch (error) {
    console.error('Error updating application status:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update application status'
    });
  }
});

/**
 * POST /api/applications/:id/notes
 * Add notes to application (for employers)
 */
router.post('/:id/notes', authMiddleware, employerMiddleware, async (req, res) => {
  try {
    const { notes } = req.body;
    const { id } = req.params;

    const application = await JobApplication.findById(id).populate('jobId');

    if (!application) {
      return res.status(404).json({
        success: false,
        message: 'Application not found'
      });
    }

    // Verify the job belongs to the current employer
    if (application.jobId.employerId.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'You can only add notes to applications for your own jobs'
      });
    }

    application.employerNotes = notes;
    await application.save();

    res.json({
      success: true,
      message: 'Notes added successfully',
      data: { application }
    });
  } catch (error) {
    console.error('Error adding notes:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to add notes'
    });
  }
});

/**
 * DELETE /api/applications/:id
 * Withdraw application (for job seekers)
 */
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    const application = await JobApplication.findById(req.params.id);

    if (!application) {
      return res.status(404).json({
        success: false,
        message: 'Application not found'
      });
    }

    // Check if user is the applicant
    if (application.applicantId.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'You can only withdraw your own applications'
      });
    }

    // Update status to withdrawn instead of deleting
    await application.updateStatus('withdrawn');

    res.json({
      success: true,
      message: 'Application withdrawn successfully'
    });
  } catch (error) {
    console.error('Error withdrawing application:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to withdraw application'
    });
  }
});

/**
 * GET /api/applications/stats/overview
 * Get application statistics overview (for employers)
 */
router.get('/stats/overview', authMiddleware, employerMiddleware, async (req, res) => {
  try {
    const { timeframe = '30' } = req.query;
    const daysAgo = new Date();
    daysAgo.setDate(daysAgo.getDate() - parseInt(timeframe));

    // Get jobs posted by the employer
    const jobs = await Job.find({ employerId: req.user._id }).select('_id');
    const jobIds = jobs.map(job => job._id);

    // Get application statistics
    const totalApplications = await JobApplication.countDocuments({
      jobId: { $in: jobIds }
    });

    const recentApplications = await JobApplication.countDocuments({
      jobId: { $in: jobIds },
      appliedAt: { $gte: daysAgo }
    });

    const statusStats = await JobApplication.aggregate([
      { $match: { jobId: { $in: jobIds } } },
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 }
        }
      }
    ]);

    const stats = {
      total: totalApplications,
      recent: recentApplications,
      byStatus: {}
    };

    statusStats.forEach(stat => {
      stats.byStatus[stat._id] = stat.count;
    });

    res.json({
      success: true,
      data: { stats }
    });
  } catch (error) {
    console.error('Error fetching application stats:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch application statistics'
    });
  }
});

module.exports = router; 