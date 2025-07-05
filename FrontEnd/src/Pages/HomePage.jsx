// Import necessary React hooks and components
import React, { useState, useEffect } from 'react';
// Import React Router for navigation
import { useNavigate } from 'react-router-dom';
// Import Lucide React icons for UI elements
import { Search, MapPin, Briefcase, Users, TrendingUp, Star, Clock, DollarSign, Filter, ArrowRight, Building, Award, ChevronDown } from 'lucide-react';
// Import CSS styles for the homepage
import "../Css/HomePage.css";
// Import the navigation component
import Navbar from '../Components/Navbar';

// Main HomePage component - serves as the landing page for job seekers
const JobPortalHomepage = () => {
  // State management for search functionality
  const [searchTerm, setSearchTerm] = useState(''); // Stores job search keywords
  const [location, setLocation] = useState(''); // Stores location filter
  const [jobType, setJobType] = useState(''); // Stores job type filter (full-time, part-time, etc.)
  
  // State for testimonials carousel
  const [currentSlide, setCurrentSlide] = useState(0); // Tracks current testimonial slide
  
  // State for job data management
  const [jobs, setJobs] = useState([]); // Stores fetched job listings
  const [loading, setLoading] = useState(true); // Loading state for job fetching
  const [error, setError] = useState(''); // Error state for failed API calls
  
  // State for animated statistics counter
  const [animatedStats, setAnimatedStats] = useState({
    jobs: 0,      // Number of active jobs
    companies: 0, // Number of companies
    users: 0,     // Number of job seekers
    success: 0    // Success rate percentage
  });
  
  // State for job application modal
  const [showApplyModal, setShowApplyModal] = useState(false); // Controls modal visibility
  const [selectedJob, setSelectedJob] = useState(null); // Stores job being applied to
  const [cvFile, setCvFile] = useState(null); // Stores uploaded CV file
  const [coverLetter, setCoverLetter] = useState(''); // Stores cover letter text
  const [applyLoading, setApplyLoading] = useState(false); // Loading state for application submission
  const [applyError, setApplyError] = useState(''); // Error state for application submission
  const [applySuccess, setApplySuccess] = useState(''); // Success message for application
  const [appliedJobs, setAppliedJobs] = useState([]); // Tracks jobs user has already applied to
  
  // React Router navigation hook
  const navigate = useNavigate();
  
  // Function to fetch job listings from the backend API
  const fetchJobs = async () => {
    try {
      setLoading(true);
      // Make API call to get latest job listings (limited to 6 for homepage)
      const response = await fetch('http://localhost:5000/api/jobs?limit=6');
      const result = await response.json();
      
      if (response.ok) {
        setJobs(result.data.jobs);
        console.log('Jobs fetched successfully:', result.data.jobs.length, 'jobs');
      } else {
        console.error('Failed to fetch jobs:', result.message);
        setError('Failed to load jobs');
      }
    } catch (error) {
      console.error('Error fetching jobs:', error);
      setError('Failed to load jobs');
    } finally {
      setLoading(false);
    }
  };

  // Fetch jobs when component mounts
  useEffect(() => {
    fetchJobs();
  }, []);

  // Auto-refresh jobs every 30 seconds to keep listings current
  useEffect(() => {
    const interval = setInterval(() => {
      fetchJobs();
    }, 30000); // Refresh every 30 seconds

    return () => clearInterval(interval); // Cleanup interval on component unmount
  }, []);

  // Animate statistics counter on component mount for visual appeal
  useEffect(() => {
    const targets = { jobs: 15000, companies: 2500, users: 50000, success: 95 };
    const duration = 2000; // Animation duration in milliseconds
    const steps = 60; // Number of animation steps
    const stepTime = duration / steps; // Time per step
    
    let currentStep = 0;
    const timer = setInterval(() => {
      currentStep++;
      const progress = currentStep / steps;
      
      // Update stats with animated values
      setAnimatedStats({
        jobs: Math.floor(targets.jobs * progress),
        companies: Math.floor(targets.companies * progress),
        users: Math.floor(targets.users * progress),
        success: Math.floor(targets.success * progress)
      });
      
      // Stop animation when complete
      if (currentStep >= steps) {
        clearInterval(timer);
        setAnimatedStats(targets);
      }
    }, stepTime);
    
    return () => clearInterval(timer); // Cleanup timer on unmount
  }, []);

  // Auto-slide testimonials every 5 seconds for dynamic content
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide(prev => (prev + 1) % 3); // Cycle through 3 testimonials
    }, 5000);
    return () => clearInterval(timer); // Cleanup timer on unmount
  }, []);

  // Helper function to format salary display based on job data
  const formatSalary = (job) => {
    // Check if salary is visible to the public
    if (!job.salaryRange.isSalaryVisible) {
      return 'Salary not disclosed';
    }
    
    const { minSalary, maxSalary, currency } = job.salaryRange;
    // Currency symbol mapping for different currencies
    const currencySymbols = {
      'USD': '$',
      'EUR': '€',
      'GBP': '£',
      'INR': '₹',
      'CAD': 'C$',
      'AUD': 'A$'
    };
    
    const symbol = currencySymbols[currency] || currency;
    
    // Display single salary if min and max are the same
    if (minSalary === maxSalary) {
      return `${symbol}${minSalary.toLocaleString()}`;
    }
    
    // Display salary range
    return `${symbol}${minSalary.toLocaleString()} - ${symbol}${maxSalary.toLocaleString()}`;
  };

  // Helper function to format how long ago a job was posted
  const formatJobAge = (createdAt) => {
    const now = new Date();
    const created = new Date(createdAt);
    const diffTime = now - created;
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    
    // Return human-readable time format
    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
    if (diffDays < 365) return `${Math.floor(diffDays / 30)} months ago`;
    return `${Math.floor(diffDays / 365)} years ago`;
  };

  // Static data for testimonials section
  const testimonials = [
    {
      name: "Sarah Johnson",
      role: "Software Engineer",
      company: "Google",
      text: "Found my dream job within 2 weeks! The platform's matching algorithm is incredible.",
      rating: 5
    },
    {
      name: "Mike Chen",
      role: "Product Manager",
      company: "Microsoft",
      text: "The best job portal I've used. Clean interface and relevant job recommendations.",
      rating: 5
    },
    {
      name: "Emily Davis",
      role: "Data Analyst",
      company: "Amazon",
      text: "Landed 3 interviews in my first week. Highly recommend to all job seekers!",
      rating: 5
    }
  ];

  // Static data for job categories section
  const topCategories = [
    { name: "Technology", jobs: 3500, icon: "💻" },
    { name: "Healthcare", jobs: 2800, icon: "🏥" },
    { name: "Finance", jobs: 2200, icon: "💰" },
    { name: "Marketing", jobs: 1900, icon: "📢" },
    { name: "Education", jobs: 1600, icon: "🎓" },
    { name: "Design", jobs: 1400, icon: "🎨" }
  ];

  // Function to open the job application modal
  const openApplyModal = (job) => {
    setSelectedJob(job);
    setShowApplyModal(true);
    // Reset form fields
    setCvFile(null);
    setCoverLetter('');
    setApplyError('');
    setApplySuccess('');
  };

  // Function to close the job application modal
  const closeApplyModal = () => {
    setShowApplyModal(false);
    setSelectedJob(null);
    // Reset form fields
    setCvFile(null);
    setCoverLetter('');
    setApplyError('');
    setApplySuccess('');
  };

  // Handler for CV file upload
  const handleCvChange = (e) => {
    setCvFile(e.target.files[0]);
  };

  // Function to handle job application submission
  const handleApplySubmit = async (e) => {
    e.preventDefault();
    // Validate that CV is uploaded
    if (!cvFile) {
      setApplyError('Please upload your CV.');
      return;
    }
    
    setApplyLoading(true);
    setApplyError('');
    setApplySuccess('');
    
    try {
      // Create FormData for file upload
      const formData = new FormData();
      formData.append('jobId', selectedJob._id);
      formData.append('coverLetter', coverLetter);
      formData.append('cv', cvFile);
      
      // Submit application to backend API
      const res = await fetch('http://localhost:5000/api/applications', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: formData
      });
      
      const result = await res.json();
      if (!res.ok) throw new Error(result.message || 'Failed to apply');
      
      // Handle successful application
      setApplySuccess('Application submitted successfully!');
      setAppliedJobs(prev => [...prev, selectedJob._id]);
      setTimeout(() => closeApplyModal(), 2000); // Close modal after 2 seconds
    } catch (err) {
      setApplyError(err.message);
    } finally {
      setApplyLoading(false);
    }
  };

  return (
    <>
    {/* Navigation bar component */}
    <Navbar/>
    
    {/* Main homepage container */}
    <div className="homepage">
      {/* Hero Section - Main landing area with search functionality */}
      <section className="hero">
        {/* Animated background with floating elements */}
        <div className="hero-background">
          <div className="floating-elements">
            <div className="floating-element" style={{top: '20%', left: '10%'}}>💼</div>
            <div className="floating-element" style={{top: '60%', right: '15%'}}>🚀</div>
            <div className="floating-element" style={{top: '40%', left: '80%'}}>⭐</div>
          </div>
        </div>
        
        {/* Hero content with title and search form */}
        <div className="hero-content">
          <div className="hero-text">
            <h1 className="hero-title">
              Find Your <span className="highlight">Dream Job</span>
              <br />Today
            </h1>
            <p className="hero-subtitle">
              Connect with top employers and discover opportunities that match your skills and aspirations.
            </p>
          </div>
          
          {/* Advanced search form with multiple filters */}
          <div className="search-container">
            <div className="search-box">
              {/* Job title/keywords search field */}
              <div className="search-field search-field-with-icon">
                <Search className="search-icon" />
                <input
                  type="text"
                  placeholder="Job title, keywords, or company"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              
              {/* Location search field */}
              <div className="search-field search-field-with-icon">
                <MapPin className="search-icon" />
                <input
                  type="text"
                  placeholder="City, state, or remote"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                />
              </div>
              
              {/* Job type dropdown filter */}
              <div className="search-field search-field-dropdown">
                <select value={jobType} onChange={(e) => setJobType(e.target.value)} style={{paddingLeft: '2.5rem'}}>
                  <option value="">Job Type</option>
                  <option value="full-time">Full-time</option>
                  <option value="part-time">Part-time</option>
                  <option value="remote">Remote</option>
                  <option value="contract">Contract</option>
                </select>
                <ChevronDown className="select-arrow" />
              </div>
              
              {/* Search button */}
              <button className="search-btn">
                Search Jobs
              </button>
            </div>
          </div>

          {/* Popular search tags for quick access */}
          <div className="popular-searches">
            <span>Popular searches:</span>
            {["React Developer", "Product Manager", "Data Scientist", "UI Designer"].map((term, idx) => (
              <button key={idx} className="popular-tag">{term}</button>
            ))}
          </div>
        </div>
      </section>

      {/* Statistics Section - Animated counters showing platform metrics */}
      <section className="stats">
        <div className="stats-container">
          <div className="stat-item">
            <div className="stat-number">{animatedStats.jobs.toLocaleString()}+</div>
            <div className="stat-label">Active Jobs</div>
          </div>
          <div className="stat-item">
            <div className="stat-number">{animatedStats.companies.toLocaleString()}+</div>
            <div className="stat-label">Companies</div>
          </div>
          <div className="stat-item">
            <div className="stat-number">{animatedStats.users.toLocaleString()}+</div>
            <div className="stat-label">Job Seekers</div>
          </div>
          <div className="stat-item">
            <div className="stat-number">{animatedStats.success}%</div>
            <div className="stat-label">Success Rate</div>
          </div>
        </div>
      </section>

      {/* Featured Jobs Section - Showcases latest job opportunities */}
      <section className="featured-jobs">
        <div className="section-container">
          <div className="section-header">
            <h2>Featured Jobs</h2>
            <p>Hand-picked opportunities from top companies</p>
          </div>
          
          {/* Grid layout for job cards */}
          <div className="jobs-grid">
            {loading ? (
              <div className="loading-message">Loading jobs...</div>
            ) : error ? (
              <div className="error-message">{error}</div>
            ) : jobs.length === 0 ? (
              <div className="no-jobs-message">No jobs available at the moment.</div>
            ) : (
              // Render individual job cards
              jobs.map(job => (
                <div key={job._id} className="job-card">
                  {/* Job card header with company info and posting time */}
                  <div className="job-header">
                    <div className="company-logo">🏢</div>
                    <div className="job-meta">
                      <div className="job-type-badge">{job.jobType}</div>
                      <div className="job-posted">
                        <Clock size={14} />
                        {formatJobAge(job.createdAt)}
                      </div>
                    </div>
                  </div>
                  
                  {/* Job title */}
                  <h3 className="job-title">{job.jobTitle}</h3>
                  
                  {/* Company name */}
                  <div className="job-company">
                    <Building size={16} />
                    {job.companyName}
                  </div>
                  
                  {/* Job location with remote indicator */}
                  <div className="job-location">
                    <MapPin size={16} />
                    {job.jobLocation}
                    {job.isRemote && <span className="remote-badge">Remote</span>}
                  </div>
                  
                  {/* Salary information */}
                  <div className="job-salary">
                    <DollarSign size={16} />
                    {formatSalary(job)}
                  </div>
                  
                  {/* Required skills tags */}
                  <div className="job-skills">
                    {job.requiredSkills && job.requiredSkills.slice(0, 3).map((skill, idx) => (
                      <span key={idx} className="skill-tag">{skill}</span>
                    ))}
                    {job.requiredSkills && job.requiredSkills.length > 3 && (
                      <span className="skill-tag">+{job.requiredSkills.length - 3} more</span>
                    )}
                  </div>
                  
                  {/* Job card footer with applicant count and apply button */}
                  <div className="job-footer">
                    <div className="applicants">
                      <Users size={14} />
                      {job.totalApplications || 0} applicants
                    </div>
                    <button className="apply-btn" onClick={() => openApplyModal(job)} disabled={appliedJobs.includes(job._id)}>
                      {appliedJobs.includes(job._id) ? 'Applied' : 'Apply Now'}
                      <ArrowRight size={16} />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
          
          {/* Section footer with link to all jobs */}
          <div className="section-footer">
            <button className="btn-outline" onClick={() => navigate('/jobs')}>View All Jobs</button>
          </div>
        </div>
      </section>

      {/* Job Categories Section - Browse jobs by industry */}
      <section className="categories">
        <div className="section-container">
          <div className="section-header">
            <h2>Browse by Category</h2>
            <p>Explore opportunities across different industries</p>
          </div>
          
          {/* Grid layout for category cards */}
          <div className="categories-grid">
            {topCategories.map((category, idx) => (
              <div key={idx} className="category-card">
                <div className="category-icon">{category.icon}</div>
                <h3 className="category-name">{category.name}</h3>
                <div className="category-jobs">{category.jobs.toLocaleString()} jobs available</div>
                <button className="category-btn">
                  Explore
                  <ArrowRight size={16} />
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section - User success stories */}
      <section className="testimonials">
        <div className="section-container">
          <div className="section-header">
            <h2>Success Stories</h2>
            <p>What our users say about us</p>
          </div>
          
          {/* Testimonials carousel */}
          <div className="testimonials-slider">
            {testimonials.map((testimonial, idx) => (
              <div
                key={idx}
                className={`testimonial-card ${idx === currentSlide ? 'active' : ''}`}
              >
                <div className="testimonial-content">
                  {/* Star rating display */}
                  <div className="stars">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} size={16} fill="currentColor" />
                    ))}
                  </div>
                  
                  {/* Testimonial text */}
                  <p className="testimonial-text">"{testimonial.text}"</p>
                  
                  {/* Author information */}
                  <div className="testimonial-author">
                    <div className="author-info">
                      <div className="author-name">{testimonial.name}</div>
                      <div className="author-role">{testimonial.role} at {testimonial.company}</div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          {/* Carousel navigation dots */}
          <div className="slider-dots">
            {testimonials.map((_, idx) => (
              <button
                key={idx}
                className={`dot ${idx === currentSlide ? 'active' : ''}`}
                onClick={() => setCurrentSlide(idx)}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Call-to-Action Section - Encourages user registration */}
      <section className="cta">
        <div className="cta-content">
          <h2>Ready to Take the Next Step?</h2>
          <p>Join thousands of professionals who found their perfect job through our platform</p>
          <div className="cta-buttons">
            <button className="btn-primary-large">
              Get Started Now
              <ArrowRight size={20} />
            </button>
            <button className="btn-outline-large">Learn More</button>
          </div>
        </div>
      </section>

      {/* Footer Section - Site navigation and information */}
      <footer className="footer">
        <div className="footer-content">
          {/* Brand section */}
          <div className="footer-section">
            <div className="footer-brand">
              <Briefcase size={24} />
              <span>WorkVerse</span>
            </div>
            <p>Connecting talent with opportunity since 2020</p>
          </div>
          
          {/* Job seeker links */}
          <div className="footer-section">
            <h4>For Job Seekers</h4>
            <ul>
              <li><a href="#browse">Browse Jobs</a></li>
              <li><a href="#companies">Companies</a></li>
              <li><a href="#resources">Career Resources</a></li>
              <li><a href="#resume">Resume Builder</a></li>
            </ul>
          </div>
          
          {/* Employer links */}
          <div className="footer-section">
            <h4>For Employers</h4>
            <ul>
              <li><a href="#post">Post a Job</a></li>
              <li><a href="#candidates">Browse Candidates</a></li>
              <li><a href="#pricing">Pricing</a></li>
              <li><a href="#tools">Hiring Tools</a></li>
            </ul>
          </div>
          
          {/* Company information links */}
          <div className="footer-section">
            <h4>Company</h4>
            <ul>
              <li><a href="#about">About Us</a></li>
              <li><a href="#contact">Contact</a></li>
              <li><a href="#privacy">Privacy Policy</a></li>
              <li><a href="#terms">Terms of Service</a></li>
            </ul>
          </div>
        </div>
        
        {/* Copyright notice */}
        <div className="footer-bottom">
          <p>&copy; 2025 JobPortal. All rights reserved.</p>
        </div>
      </footer>
    </div>
    
    {/* Job Application Modal - Overlay for applying to jobs */}
    {showApplyModal && (
      <div className="modal-overlay">
        <div className="modal-content">
          {/* Modal close button */}
          <button onClick={closeApplyModal} className="modal-close">&times;</button>
          
          {/* Modal title */}
          <h2>Apply for: {selectedJob?.jobTitle}</h2>
          
          {/* Application form */}
          <form onSubmit={handleApplySubmit}>
            {/* CV upload field */}
            <div>
              <label>Upload CV (PDF/DOC):</label>
              <input type="file" accept=".pdf,.doc,.docx" onChange={handleCvChange} required />
            </div>
            
            {/* Cover letter text area */}
            <div>
              <label>Cover Letter (optional):</label>
              <textarea
                value={coverLetter}
                onChange={e => setCoverLetter(e.target.value)}
                rows={4}
                placeholder="Write a short message..."
              />
            </div>
            
            {/* Error and success message display */}
            {applyError && <div style={{ color: 'red', marginBottom: '0.5rem' }}>{applyError}</div>}
            {applySuccess && <div style={{ color: '#4ade80', marginBottom: '0.5rem' }}>{applySuccess}</div>}
            
            {/* Submit button */}
            <button
              type="submit"
              disabled={applyLoading}
              className="apply-btn"
            >
              {applyLoading ? 'Submitting...' : 'Submit Application'}
            </button>
          </form>
        </div>
      </div>
    )}
    </>
  );
};

// Export the component for use in other parts of the application
export default JobPortalHomepage;