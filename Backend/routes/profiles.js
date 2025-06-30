const express = require('express');
const router = express.Router();
const User = require('../models/User');
const authMiddleware = require('../middleware/authMiddleware');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadDir = 'uploads/cv';
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, 'cv-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  },
  fileFilter: function (req, file, cb) {
    const allowedTypes = ['.pdf', '.doc', '.docx'];
    const ext = path.extname(file.originalname).toLowerCase();
    if (allowedTypes.includes(ext)) {
      cb(null, true);
    } else {
      cb(new Error('Only PDF, DOC, and DOCX files are allowed'));
    }
  }
});

/**
 * GET /api/profiles/me
 * Get current user's profile
 */
router.get('/me', authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    res.json({
      success: true,
      data: { profile: user }
    });
  } catch (error) {
    console.error('Error fetching profile:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch profile'
    });
  }
});

/**
 * POST /api/profiles
 * Create or update user profile
 */
router.post('/', authMiddleware, async (req, res) => {
  try {
    // Check if user is a jobseeker
    if (req.user.userType !== 'jobseeker') {
      return res.status(403).json({
        success: false,
        message: 'Only job seekers can create profiles'
      });
    }

    const {
      firstName,
      lastName,
      phone,
      headline,
      summary,
      experience,
      education,
      skills,
      linkedin,
      github,
      portfolio
    } = req.body;

    // Validate required fields
    if (!firstName || !lastName) {
      return res.status(400).json({
        success: false,
        message: 'First name and last name are required'
      });
    }

    // Find and update user
    const user = await User.findById(req.user._id);
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Update user profile fields
    user.firstName = firstName;
    user.lastName = lastName;
    user.phone = phone;
    user.headline = headline;
    user.summary = summary;
    user.experience = experience;
    user.education = education;
    // Handle skills - could be string or array
    if (typeof skills === 'string') {
      user.skills = skills ? skills.split(',').map(s => s.trim()).filter(Boolean) : [];
    } else if (Array.isArray(skills)) {
      user.skills = skills;
    } else {
      user.skills = [];
    }
    user.linkedin = linkedin;
    user.github = github;
    user.portfolio = portfolio;

    await user.save();

    res.json({
      success: true,
      message: 'Profile saved successfully',
      data: { profile: user }
    });
  } catch (error) {
    console.error('Error saving profile:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to save profile'
    });
  }
});

/**
 * POST /api/profiles/upload-cv
 * Upload CV/Resume file
 */
router.post('/upload-cv', authMiddleware, upload.single('cv'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'No file uploaded'
      });
    }

    const user = await User.findById(req.user._id);
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Update CV file information
    user.cvFile = {
      fileName: req.file.originalname,
      fileUrl: `/uploads/cv/${req.file.filename}`,
      fileSize: req.file.size,
      uploadedAt: new Date()
    };

    await user.save();

    res.json({
      success: true,
      message: 'CV uploaded successfully',
      data: {
        cvFile: user.cvFile
      }
    });
  } catch (error) {
    console.error('Error uploading CV:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to upload CV'
    });
  }
});

/**
 * GET /api/profiles/completion-status
 * Get profile completion status
 */
router.get('/completion-status', authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    const completionDetails = user.getCompletionDetails();

    res.json({
      success: true,
      data: {
        hasProfile: true,
        ...completionDetails
      }
    });
  } catch (error) {
    console.error('Error getting completion status:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get completion status'
    });
  }
});

/**
 * GET /api/profiles/:id
 * Get public profile by ID (for employers)
 */
router.get('/:id', authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Profile not found'
      });
    }

    // Remove sensitive information for public viewing
    const publicProfile = {
      _id: user._id,
      firstName: user.firstName,
      lastName: user.lastName,
      headline: user.headline,
      summary: user.summary,
      experience: user.experience,
      education: user.education,
      skills: user.skills,
      linkedin: user.linkedin,
      github: user.github,
      portfolio: user.portfolio,
      createdAt: user.createdAt
    };

    res.json({
      success: true,
      data: { profile: publicProfile }
    });
  } catch (error) {
    console.error('Error fetching profile:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch profile'
    });
  }
});

/**
 * DELETE /api/profiles/cv
 * Remove CV file
 */
router.delete('/cv', authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    
    if (!user || !user.cvFile.fileUrl) {
      return res.status(404).json({
        success: false,
        message: 'CV file not found'
      });
    }

    // Remove file from filesystem
    const filePath = path.join(__dirname, '..', user.cvFile.fileUrl);
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }

    // Remove CV file information from user
    user.cvFile = {};
    await user.save();

    res.json({
      success: true,
      message: 'CV file removed successfully'
    });
  } catch (error) {
    console.error('Error removing CV:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to remove CV file'
    });
  }
});

module.exports = router; 