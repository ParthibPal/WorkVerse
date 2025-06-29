const express = require('express');
const router = express.Router();
const Job = require('../models/Job');
const User = require('../models/User');
const authMiddleware = require('../middleware/authMiddleware');
const employerMiddleware = require('../middleware/employerMiddleware');

/**
 * @route   GET /api/jobs/test
 * @desc    Test route to verify jobs API is working
 * @access  Public
 */
router.get('/test', (req, res) => {
  res.json({
    success: true,
    message: 'Jobs API is working!',
    timestamp: new Date().toISOString()
  });
});

/**
 * @route   GET /api/jobs
 * @desc    Get all active jobs with filtering and pagination
 * @access  Public
 */
router.get('/', async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      category,
      jobType,
      experienceLevel,
      location,
      isRemote,
      isUrgent,
      search,
      sortBy = 'publishedAt',
      sortOrder = 'desc'
    } = req.query;

    // Build filter object
    const filter = {
      jobStatus: 'active',
      applicationDeadline: { $gt: new Date() }
    };

    if (category) filter.jobCategory = category;
    if (jobType) filter.jobType = jobType;
    if (experienceLevel) filter.experienceLevel = experienceLevel;
    if (location) filter.jobLocation = { $regex: location, $options: 'i' };
    if (isRemote !== undefined) filter.isRemote = isRemote === 'true';
    if (isUrgent !== undefined) filter.isUrgent = isUrgent === 'true';

    // Text search
    if (search) {
      filter.$text = { $search: search };
    }

    // Build sort object
    const sort = {};
    sort[sortBy] = sortOrder === 'desc' ? -1 : 1;

    // Calculate pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);

    // Execute query
    const jobs = await Job.find(filter)
      .sort(sort)
      .skip(skip)
      .limit(parseInt(limit))
      .populate('employerId', 'name email company');

    // Get total count for pagination
    const totalJobs = await Job.countDocuments(filter);

    res.json({
      success: true,
      data: {
        jobs,
        pagination: {
          currentPage: parseInt(page),
          totalPages: Math.ceil(totalJobs / parseInt(limit)),
          totalJobs,
          hasNextPage: skip + jobs.length < totalJobs,
          hasPrevPage: parseInt(page) > 1
        }
      }
    });

  } catch (error) {
    console.error('Error fetching jobs:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch jobs',
      error: error.message
    });
  }
});

/**
 * @route   GET /api/jobs/:jobId
 * @desc    Get a specific job by ID and increment view count
 * @access  Public
 */
router.get('/:jobId', async (req, res) => {
  try {
    const { jobId } = req.params;

    const job = await Job.findById(jobId)
      .populate('employerId', 'name email company');

    if (!job) {
      return res.status(404).json({
        success: false,
        message: 'Job not found'
      });
    }

    // Increment view count
    await job.incrementViews();

    res.json({
      success: true,
      data: job
    });

  } catch (error) {
    console.error('Error fetching job:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch job',
      error: error.message
    });
  }
});

/**
 * @route   POST /api/jobs
 * @desc    Create a new job posting (Employer only)
 * @access  Private (Employer)
 */
router.post('/', [authMiddleware, employerMiddleware], async (req, res) => {
  try {
    console.log('Job creation request received');
    console.log('Request body:', req.body);
    console.log('User:', req.user);
    console.log('Extracted fields:');
    const {
      jobTitle,
      companyName,
      jobLocation,
      jobType,
      experienceLevel,
      minSalary,
      maxSalary,
      currency = 'USD',
      isSalaryVisible = true,
      jobDescription,
      jobRequirements,
      jobBenefits,
      requiredSkills,
      jobCategory,
      applicationDeadline,
      contactEmail,
      isUrgent = false,
      isRemote = false
    } = req.body;
    console.log('- jobTitle:', jobTitle);
    console.log('- companyName:', companyName);
    console.log('- jobLocation:', jobLocation);
    console.log('- jobType:', jobType);
    console.log('- experienceLevel:', experienceLevel);
    console.log('- minSalary:', minSalary);
    console.log('- maxSalary:', maxSalary);
    console.log('- jobDescription:', jobDescription ? jobDescription.substring(0, 50) + '...' : 'null');
    console.log('- jobRequirements:', jobRequirements ? jobRequirements.substring(0, 50) + '...' : 'null');
    console.log('- applicationDeadline:', applicationDeadline);
    console.log('- contactEmail:', contactEmail);

    // Validate required fields
    if (!jobTitle || !companyName || !jobLocation || !jobDescription || !jobRequirements) {
      console.log('Validation failed: Missing required fields');
      console.log('jobTitle:', !!jobTitle);
      console.log('companyName:', !!companyName);
      console.log('jobLocation:', !!jobLocation);
      console.log('jobDescription:', !!jobDescription);
      console.log('jobRequirements:', !!jobRequirements);
      return res.status(400).json({
        success: false,
        message: 'Missing required fields'
      });
    }

    // Validate application deadline
    if (!applicationDeadline) {
      console.log('Validation failed: Application deadline is required');
      return res.status(400).json({
        success: false,
        message: 'Application deadline is required'
      });
    }

    // Validate salary range
    if (minSalary && maxSalary && minSalary > maxSalary) {
      console.log('Validation failed: Invalid salary range');
      return res.status(400).json({
        success: false,
        message: 'Minimum salary cannot be greater than maximum salary'
      });
    }

    // Parse skills array
    const skillsArray = requiredSkills ? 
      (Array.isArray(requiredSkills) ? requiredSkills : requiredSkills.split(',').map(s => s.trim())) : 
      [];

    // Create job object
    const jobData = {
      jobTitle,
      companyName,
      jobLocation,
      jobType,
      experienceLevel,
      salaryRange: {
        minSalary: parseInt(minSalary),
        maxSalary: parseInt(maxSalary),
        currency,
        isSalaryVisible
      },
      jobDescription,
      jobRequirements,
      jobBenefits,
      requiredSkills: skillsArray,
      jobCategory,
      applicationDeadline: new Date(applicationDeadline),
      contactEmail,
      isUrgent,
      isRemote,
      employerId: req.user._id,
      employerName: req.user.name
    };

    console.log('Job data to save:', jobData);

    const newJob = new Job(jobData);
    console.log('Job model created, saving to database...');
    
    await newJob.save();
    console.log('Job saved successfully:', newJob._id);

    res.status(201).json({
      success: true,
      message: 'Job posted successfully',
      data: newJob
    });

  } catch (error) {
    console.error('Error creating job:', error);
    
    if (error.name === 'ValidationError') {
      return res.status(400).json({
        success: false,
        message: 'Validation error',
        errors: Object.values(error.errors).map(err => err.message)
      });
    }

    res.status(500).json({
      success: false,
      message: 'Failed to create job',
      error: error.message
    });
  }
});

/**
 * @route   PUT /api/jobs/:jobId
 * @desc    Update a job posting (Owner only)
 * @access  Private (Job Owner)
 */
router.put('/:jobId', authMiddleware, async (req, res) => {
  try {
    const { jobId } = req.params;
    const updateData = req.body;

    const job = await Job.findById(jobId);

    if (!job) {
      return res.status(404).json({
        success: false,
        message: 'Job not found'
      });
    }

    // Check if user owns this job
    if (job.employerId.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this job'
      });
    }

    // Update job
    const updatedJob = await Job.findByIdAndUpdate(
      jobId,
      { ...updateData, updatedAt: new Date() },
      { new: true, runValidators: true }
    );

    res.json({
      success: true,
      message: 'Job updated successfully',
      data: updatedJob
    });

  } catch (error) {
    console.error('Error updating job:', error);
    
    if (error.name === 'ValidationError') {
      return res.status(400).json({
        success: false,
        message: 'Validation error',
        errors: Object.values(error.errors).map(err => err.message)
      });
    }

    res.status(500).json({
      success: false,
      message: 'Failed to update job',
      error: error.message
    });
  }
});

/**
 * @route   DELETE /api/jobs/:jobId
 * @desc    Delete a job posting (Owner only)
 * @access  Private (Job Owner)
 */
router.delete('/:jobId', authMiddleware, async (req, res) => {
  try {
    const { jobId } = req.params;

    const job = await Job.findById(jobId);

    if (!job) {
      return res.status(404).json({
        success: false,
        message: 'Job not found'
      });
    }

    // Check if user owns this job
    if (job.employerId.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this job'
      });
    }

    await Job.findByIdAndDelete(jobId);

    res.json({
      success: true,
      message: 'Job deleted successfully'
    });

  } catch (error) {
    console.error('Error deleting job:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete job',
      error: error.message
    });
  }
});

/**
 * @route   GET /api/jobs/employer/my-jobs
 * @desc    Get all jobs posted by the authenticated employer
 * @access  Private (Employer)
 */
router.get('/employer/my-jobs', [authMiddleware, employerMiddleware], async (req, res) => {
  try {
    const { page = 1, limit = 10, status } = req.query;

    const filter = { employerId: req.user._id };
    if (status) filter.jobStatus = status;

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const jobs = await Job.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const totalJobs = await Job.countDocuments(filter);

    res.json({
      success: true,
      data: {
        jobs,
        pagination: {
          currentPage: parseInt(page),
          totalPages: Math.ceil(totalJobs / parseInt(limit)),
          totalJobs,
          hasNextPage: skip + jobs.length < totalJobs,
          hasPrevPage: parseInt(page) > 1
        }
      }
    });

  } catch (error) {
    console.error('Error fetching employer jobs:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch your jobs',
      error: error.message
    });
  }
});

/**
 * @route   PUT /api/jobs/:jobId/status
 * @desc    Update job status (Owner only)
 * @access  Private (Job Owner)
 */
router.put('/:jobId/status', authMiddleware, async (req, res) => {
  try {
    const { jobId } = req.params;
    const { jobStatus } = req.body;

    if (!['active', 'paused', 'closed'].includes(jobStatus)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid job status'
      });
    }

    const job = await Job.findById(jobId);

    if (!job) {
      return res.status(404).json({
        success: false,
        message: 'Job not found'
      });
    }

    // Check if user owns this job
    if (job.employerId.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this job'
      });
    }

    job.jobStatus = jobStatus;
    await job.save();

    res.json({
      success: true,
      message: 'Job status updated successfully',
      data: job
    });

  } catch (error) {
    console.error('Error updating job status:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update job status',
      error: error.message
    });
  }
});

/**
 * @route   GET /api/jobs/categories
 * @desc    Get all available job categories
 * @access  Public
 */
router.get('/categories', (req, res) => {
  const categories = [
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
  ];

  res.json({
    success: true,
    data: categories
  });
});

/**
 * @route   GET /api/jobs/stats/overview
 * @desc    Get job statistics overview
 * @access  Public
 */
router.get('/stats/overview', async (req, res) => {
  try {
    const totalJobs = await Job.countDocuments();
    const activeJobs = await Job.countDocuments({ 
      jobStatus: 'active',
      applicationDeadline: { $gt: new Date() }
    });
    const urgentJobs = await Job.countDocuments({ 
      isUrgent: true,
      jobStatus: 'active',
      applicationDeadline: { $gt: new Date() }
    });
    const remoteJobs = await Job.countDocuments({ 
      isRemote: true,
      jobStatus: 'active',
      applicationDeadline: { $gt: new Date() }
    });

    res.json({
      success: true,
      data: {
        totalJobs,
        activeJobs,
        urgentJobs,
        remoteJobs
      }
    });

  } catch (error) {
    console.error('Error fetching job stats:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch job statistics',
      error: error.message
    });
  }
});

/**
 * @route   GET /api/jobs/debug/all
 * @desc    Get all jobs in database (for debugging)
 * @access  Public
 */
router.get('/debug/all', async (req, res) => {
  try {
    const allJobs = await Job.find({}).sort({ createdAt: -1 });
    res.json({
      success: true,
      count: allJobs.length,
      jobs: allJobs
    });
  } catch (error) {
    console.error('Error fetching all jobs:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch jobs',
      error: error.message
    });
  }
});

module.exports = router; 