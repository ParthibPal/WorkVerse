const express = require('express');
const router = express.Router();
const Company = require('../models/Company');
const authMiddleware = require('../middleware/authMiddleware');

/**
 * GET /api/companies
 * Get all companies with filtering, sorting, and pagination
 */
router.get('/', async (req, res) => {
  try {
    const {
      search,
      industry,
      size,
      location,
      sortBy = 'featured',
      page = 1,
      limit = 10,
      featured,
      trending,
      verified
    } = req.query;

    // Build filter object
    const filter = {};

    // Search filter
    if (search) {
      filter.$text = { $search: search };
    }

    // Industry filter
    if (industry && industry !== 'all') {
      filter.industry = industry;
    }

    // Size filter
    if (size && size !== 'all') {
      filter.size = size;
    }

    // Location filter
    if (location && location !== 'all') {
      filter.location = { $regex: location, $options: 'i' };
    }

    // Status filters
    if (featured === 'true') {
      filter.featured = true;
    }
    if (trending === 'true') {
      filter.trending = true;
    }
    if (verified === 'true') {
      filter.verified = true;
    }

    // Build sort object
    let sort = {};
    switch (sortBy) {
      case 'rating':
        sort = { rating: -1, reviewCount: -1 };
        break;
      case 'jobs':
        sort = { openJobs: -1 };
        break;
      case 'trending':
        sort = { trending: -1, rating: -1 };
        break;
      case 'featured':
      default:
        sort = { featured: -1, rating: -1 };
        break;
    }

    // Calculate pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);

    // Execute query
    const companies = await Company.find(filter)
      .sort(sort)
      .skip(skip)
      .limit(parseInt(limit))
      .lean();

    // Get total count for pagination
    const total = await Company.countDocuments(filter);

    // Calculate total pages
    const totalPages = Math.ceil(total / parseInt(limit));

    res.json({
      success: true,
      data: {
        companies,
        pagination: {
          currentPage: parseInt(page),
          totalPages,
          total,
          hasNext: parseInt(page) < totalPages,
          hasPrev: parseInt(page) > 1
        }
      }
    });

  } catch (error) {
    console.error('Error fetching companies:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch companies',
      error: error.message
    });
  }
});

/**
 * GET /api/companies/:id
 * Get a specific company by ID
 */
router.get('/:id', async (req, res) => {
  try {
    const company = await Company.findById(req.params.id);
    
    if (!company) {
      return res.status(404).json({
        success: false,
        message: 'Company not found'
      });
    }

    res.json({
      success: true,
      data: { company }
    });

  } catch (error) {
    console.error('Error fetching company:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch company',
      error: error.message
    });
  }
});

/**
 * POST /api/companies
 * Create a new company (Admin/Employer only)
 */
router.post('/', authMiddleware, async (req, res) => {
  try {
    const {
      name,
      logo,
      industry,
      size,
      location,
      description,
      website,
      contactEmail,
      contactPhone,
      linkedin,
      twitter,
      foundedYear,
      headquarters,
      totalEmployees,
      topBenefits,
      salaryRange,
      hiringUrgency
    } = req.body;

    // Validate required fields
    if (!name || !industry || !size || !location || !description) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields: name, industry, size, location, description'
      });
    }

    // Create company
    const company = new Company({
      name,
      logo: logo || '🏢',
      industry,
      size,
      location,
      description,
      website,
      contactEmail,
      contactPhone,
      linkedin,
      twitter,
      foundedYear,
      headquarters,
      totalEmployees,
      topBenefits: topBenefits ? (Array.isArray(topBenefits) ? topBenefits : topBenefits.split(',').map(s => s.trim())) : [],
      salaryRange,
      hiringUrgency: hiringUrgency || 'medium',
      verified: req.user.userType === 'admin' // Auto-verify if admin creates
    });

    await company.save();

    res.status(201).json({
      success: true,
      message: 'Company created successfully',
      data: { company }
    });

  } catch (error) {
    console.error('Error creating company:', error);
    
    if (error.name === 'ValidationError') {
      const errors = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors
      });
    }

    res.status(500).json({
      success: false,
      message: 'Failed to create company',
      error: error.message
    });
  }
});

/**
 * PUT /api/companies/:id
 * Update a company (Admin/Company owner only)
 */
router.put('/:id', authMiddleware, async (req, res) => {
  try {
    const company = await Company.findById(req.params.id);
    
    if (!company) {
      return res.status(404).json({
        success: false,
        message: 'Company not found'
      });
    }

    // Only admin or company owner can update
    if (req.user.userType !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Access denied. Only admins can update companies.'
      });
    }

    // Update company
    const updatedCompany = await Company.findByIdAndUpdate(
      req.params.id,
      { ...req.body, updatedAt: Date.now() },
      { new: true, runValidators: true }
    );

    res.json({
      success: true,
      message: 'Company updated successfully',
      data: { company: updatedCompany }
    });

  } catch (error) {
    console.error('Error updating company:', error);
    
    if (error.name === 'ValidationError') {
      const errors = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors
      });
    }

    res.status(500).json({
      success: false,
      message: 'Failed to update company',
      error: error.message
    });
  }
});

/**
 * DELETE /api/companies/:id
 * Delete a company (Admin only)
 */
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    // Only admin can delete
    if (req.user.userType !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Access denied. Only admins can delete companies.'
      });
    }

    const company = await Company.findByIdAndDelete(req.params.id);
    
    if (!company) {
      return res.status(404).json({
        success: false,
        message: 'Company not found'
      });
    }

    res.json({
      success: true,
      message: 'Company deleted successfully'
    });

  } catch (error) {
    console.error('Error deleting company:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete company',
      error: error.message
    });
  }
});

/**
 * GET /api/companies/stats/overview
 * Get companies statistics
 */
router.get('/stats/overview', async (req, res) => {
  try {
    const stats = await Company.aggregate([
      {
        $group: {
          _id: null,
          totalCompanies: { $sum: 1 },
          averageRating: { $avg: '$rating' },
          totalJobs: { $sum: '$openJobs' },
          featuredCompanies: { $sum: { $cond: ['$featured', 1, 0] } },
          verifiedCompanies: { $sum: { $cond: ['$verified', 1, 0] } }
        }
      }
    ]);

    const industryStats = await Company.aggregate([
      {
        $group: {
          _id: '$industry',
          count: { $sum: 1 },
          avgRating: { $avg: '$rating' },
          totalJobs: { $sum: '$openJobs' }
        }
      },
      { $sort: { count: -1 } },
      { $limit: 10 }
    ]);

    const locationStats = await Company.aggregate([
      {
        $group: {
          _id: '$location',
          count: { $sum: 1 },
          avgRating: { $avg: '$rating' },
          totalJobs: { $sum: '$openJobs' }
        }
      },
      { $sort: { count: -1 } },
      { $limit: 10 }
    ]);

    res.json({
      success: true,
      data: {
        overview: stats[0] || {
          totalCompanies: 0,
          averageRating: 0,
          totalJobs: 0,
          featuredCompanies: 0,
          verifiedCompanies: 0
        },
        topIndustries: industryStats,
        topLocations: locationStats
      }
    });

  } catch (error) {
    console.error('Error fetching company stats:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch company statistics',
      error: error.message
    });
  }
});

/**
 * POST /api/companies/register
 * Public company registration (no auth required)
 */
router.post('/register', async (req, res) => {
  try {
    const {
      name,
      logo,
      industry,
      size,
      location,
      description,
      website,
      contactEmail,
      contactPhone,
      linkedin,
      twitter,
      foundedYear,
      headquarters,
      totalEmployees,
      topBenefits,
      salaryRange,
      hiringUrgency
    } = req.body;

    // Validate required fields
    if (!name || !industry || !size || !location || !description || !contactEmail) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields: name, industry, size, location, description, contactEmail'
      });
    }

    // Check if company already exists
    const existingCompany = await Company.findOne({ 
      $or: [
        { name: { $regex: new RegExp(name, 'i') } },
        { contactEmail: contactEmail.toLowerCase() }
      ]
    });

    if (existingCompany) {
      return res.status(400).json({
        success: false,
        message: 'Company with this name or email already exists'
      });
    }

    // Create company (unverified by default)
    const company = new Company({
      name,
      logo: logo || '🏢',
      industry,
      size,
      location,
      description,
      website,
      contactEmail: contactEmail.toLowerCase(),
      contactPhone,
      linkedin,
      twitter,
      foundedYear,
      headquarters,
      totalEmployees,
      topBenefits: topBenefits ? (Array.isArray(topBenefits) ? topBenefits : topBenefits.split(',').map(s => s.trim())) : [],
      salaryRange,
      hiringUrgency: hiringUrgency || 'medium',
      verified: false, // Companies start unverified
      featured: false  // Companies start unfeatured
    });

    await company.save();

    res.status(201).json({
      success: true,
      message: 'Company registered successfully! Your company will be reviewed and verified within 24-48 hours.',
      data: { company }
    });

  } catch (error) {
    console.error('Error registering company:', error);
    
    if (error.name === 'ValidationError') {
      const errors = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors
      });
    }

    res.status(500).json({
      success: false,
      message: 'Failed to register company',
      error: error.message
    });
  }
});

module.exports = router; 