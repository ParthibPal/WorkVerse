import React, { useState, useEffect } from 'react';
import { Search, MapPin, DollarSign, Clock, Building, Filter, Briefcase, Star, Users, Eye } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function JobsPage() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filters, setFilters] = useState({
    search: '',
    category: '',
    jobType: '',
    experienceLevel: '',
    location: '',
    isRemote: false,
    isUrgent: false
  });
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalJobs: 0,
    hasNextPage: false,
    hasPrevPage: false
  });
  const [showFilters, setShowFilters] = useState(false);
  const navigate = useNavigate();
  const { user, token } = useAuth();
  const [showApplyModal, setShowApplyModal] = useState(false);
  const [selectedJob, setSelectedJob] = useState(null);
  const [cvFile, setCvFile] = useState(null);
  const [coverLetter, setCoverLetter] = useState('');
  const [applyLoading, setApplyLoading] = useState(false);
  const [applyError, setApplyError] = useState('');
  const [applySuccess, setApplySuccess] = useState('');
  const [appliedJobs, setAppliedJobs] = useState([]);
  const location = useLocation();

  // Fetch jobs from API
  const fetchJobs = async (page = 1) => {
    try {
      setLoading(true);
      const queryParams = new URLSearchParams({
        page: page.toString(),
        limit: '10',
        ...filters
      });

      console.log('Fetching jobs with URL:', `http://localhost:5000/api/jobs?${queryParams}`);

      const response = await fetch(`http://localhost:5000/api/jobs?${queryParams}`);
      const result = await response.json();

      console.log('Jobs API response:', result);

      if (!response.ok) {
        throw new Error(result.message || 'Failed to fetch jobs');
      }

      setJobs(result.data.jobs);
      setPagination(result.data.pagination);
      console.log('Jobs set successfully:', result.data.jobs.length, 'jobs');
    } catch (error) {
      console.error('Error fetching jobs:', error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  // Fetch jobs on component mount and when filters change
  useEffect(() => {
    fetchJobs(1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters]);

  // On mount, check for ?company= in the URL and set filters.search
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const company = params.get('company');
    if (company) {
      setFilters(prev => ({ ...prev, search: company }));
    }
    // eslint-disable-next-line
  }, []);

  // Handle filter changes
  const handleFilterChange = (name, value) => {
    setFilters(prev => ({
      ...prev,
      [name]: value
    }));
    setPagination(prev => ({ ...prev, currentPage: 1 }));
  };

  // Handle pagination
  const handlePageChange = (page) => {
    fetchJobs(page);
  };

  // Format salary display
  const formatSalary = (job) => {
    if (!job.salaryRange.isSalaryVisible) {
      return 'Salary not disclosed';
    }
    
    const { minSalary, maxSalary, currency } = job.salaryRange;
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
  };

  // Format job age
  const formatJobAge = (createdAt) => {
    const now = new Date();
    const created = new Date(createdAt);
    const diffTime = now - created;
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
    if (diffDays < 365) return `${Math.floor(diffDays / 30)} months ago`;
    return `${Math.floor(diffDays / 365)} years ago`;
  };

  const jobCategories = [
    { value: 'technology', label: 'Technology' },
    { value: 'marketing', label: 'Marketing' },
    { value: 'sales', label: 'Sales' },
    { value: 'design', label: 'Design' },
    { value: 'finance', label: 'Finance' },
    { value: 'human-resources', label: 'Human Resources' },
    { value: 'operations', label: 'Operations' },
    { value: 'customer-service', label: 'Customer Service' },
    { value: 'engineering', label: 'Engineering' },
    { value: 'healthcare', label: 'Healthcare' },
    { value: 'education', label: 'Education' },
    { value: 'legal', label: 'Legal' },
    { value: 'consulting', label: 'Consulting' },
    { value: 'manufacturing', label: 'Manufacturing' },
    { value: 'other', label: 'Other' }
  ];

  const experienceLevels = [
    { value: 'entry-level', label: 'Entry Level' },
    { value: 'junior-level', label: 'Junior Level' },
    { value: 'mid-level', label: 'Mid Level' },
    { value: 'senior-level', label: 'Senior Level' },
    { value: 'lead-level', label: 'Lead Level' },
    { value: 'executive-level', label: 'Executive Level' }
  ];

  const jobTypes = [
    { value: 'full-time', label: 'Full-time' },
    { value: 'part-time', label: 'Part-time' },
    { value: 'contract', label: 'Contract' },
    { value: 'freelance', label: 'Freelance' },
    { value: 'internship', label: 'Internship' }
  ];

  const openApplyModal = (job) => {
    setSelectedJob(job);
    setShowApplyModal(true);
    setCvFile(null);
    setCoverLetter('');
    setApplyError('');
    setApplySuccess('');
  };

  const closeApplyModal = () => {
    setShowApplyModal(false);
    setSelectedJob(null);
    setCvFile(null);
    setCoverLetter('');
    setApplyError('');
    setApplySuccess('');
  };

  const handleCvChange = (e) => {
    setCvFile(e.target.files[0]);
  };

  const handleApplySubmit = async (e) => {
    e.preventDefault();
    if (!cvFile) {
      setApplyError('Please upload your CV.');
      return;
    }
    setApplyLoading(true);
    setApplyError('');
    setApplySuccess('');
    try {
      const formData = new FormData();
      formData.append('jobId', selectedJob._id);
      formData.append('coverLetter', coverLetter);
      formData.append('cv', cvFile);
      // Send application
      const res = await fetch('http://localhost:5000/api/applications', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${user?.token || token}`
        },
        body: formData
      });
      const result = await res.json();
      if (!res.ok) throw new Error(result.message || 'Failed to apply');
      setApplySuccess('Application submitted successfully!');
      setAppliedJobs(prev => [...prev, selectedJob._id]);
      setTimeout(() => closeApplyModal(), 2000);
    } catch (err) {
      setApplyError(err.message);
    } finally {
      setApplyLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: 'var(--primary-bg)',
      color: 'var(--text-light)',
      fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif"
    }}>
      {/* Header */}
      <header style={{
        background: 'var(--card-bg)',
        backdropFilter: 'blur(20px)',
        borderBottom: '1px solid var(--card-border)',
        padding: '1rem 0',
        position: 'sticky',
        top: 0,
        zIndex: 100
      }}>
        <div style={{
          maxWidth: '1200px',
          margin: '0 auto',
          padding: '0 1rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div style={{
              background: 'linear-gradient(45deg, var(--gold-light), var(--gold-dark))',
              padding: '0.5rem',
              borderRadius: '8px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <Briefcase size={24} color="#0f2027" />
            </div>
            <h1 style={{
              fontSize: '1.75rem',
              fontWeight: 'bold',
              background: 'linear-gradient(45deg, var(--gold-light), var(--gold-dark))',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              margin: 0,
              cursor: 'pointer'
            }} onClick={() => navigate("/")}>
              WorkVerse
            </h1>
          </div>
          <nav style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
            <a onClick={() => navigate("/")} style={{ color: 'var(--text-muted)', textDecoration: 'none', fontSize: '0.95rem', cursor: 'pointer' }}>Home</a>
            <a onClick={() => navigate("/about")} style={{ color: 'var(--text-muted)', textDecoration: 'none', fontSize: '0.95rem', cursor: 'pointer' }}>About</a>
            <a onClick={() => navigate("/contact")} style={{ color: 'var(--text-muted)', textDecoration: 'none', fontSize: '0.95rem', cursor: 'pointer' }}>Contact</a>
            <a onClick={() => navigate("/login")} style={{ color: 'var(--gold-light)', textDecoration: 'none', fontSize: '0.95rem', fontWeight: '500', cursor: 'pointer' }}>Login</a>
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main style={{ maxWidth: '1200px', margin: '0 auto', padding: '2rem 1rem' }}>
        {/* Hero Section */}
        <div style={{
          textAlign: 'center',
          marginBottom: '3rem',
          background: 'var(--card-bg)',
          backdropFilter: 'blur(20px)',
          border: '1px solid var(--card-border)',
          borderRadius: '16px',
          padding: '3rem 2rem',
          position: 'relative',
          overflow: 'hidden'
        }}>
          <div style={{
            position: 'absolute',
            top: '-50%',
            right: '-20%',
            width: '300px',
            height: '300px',
            background: 'radial-gradient(circle, rgba(252, 210, 159, 0.1) 0%, transparent 70%)',
            borderRadius: '50%'
          }}></div>
          
          <h2 style={{
            fontSize: 'clamp(2rem, 4vw, 3rem)',
            fontWeight: 'bold',
            marginBottom: '1rem',
            background: 'linear-gradient(45deg, var(--text-light), var(--gold-light))',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent'
          }}>
            Find Your Dream Job
          </h2>
          <p style={{
            fontSize: '1.25rem',
            color: 'var(--text-muted)',
            maxWidth: '600px',
            margin: '0 auto 2rem',
            lineHeight: '1.6'
          }}>
            Discover thousands of job opportunities with all the information you need. 
            Its your future.
          </p>
          
          {/* Search Bar */}
          <div style={{
            maxWidth: '600px',
            margin: '0 auto',
            position: 'relative'
          }}>
            <input
              type="text"
              placeholder="Search for jobs, companies, or keywords..."
              value={filters.search}
              onChange={(e) => handleFilterChange('search', e.target.value)}
              style={{
                width: '100%',
                padding: '1rem 1rem 1rem 3rem',
                border: '1px solid var(--card-border)',
                borderRadius: '12px',
                background: 'var(--highlight-bg)',
                color: 'var(--text-light)',
                fontSize: '1rem',
                outline: 'none',
                transition: 'border-color 0.3s ease'
              }}
              onFocus={(e) => e.target.style.borderColor = 'var(--gold-light)'}
              onBlur={(e) => e.target.style.borderColor = 'var(--card-border)'}
            />
            <Search 
              size={20} 
              style={{
                position: 'absolute',
                left: '1rem',
                top: '50%',
                transform: 'translateY(-50%)',
                color: 'var(--text-muted)'
              }}
            />
          </div>
        </div>

        {/* Filters and Jobs Section */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: showFilters ? '300px 1fr' : '1fr',
          gap: '2rem',
          alignItems: 'start'
        }}>
          {/* Filters Sidebar */}
          {showFilters && (
            <div style={{
              background: 'var(--card-bg)',
              backdropFilter: 'blur(20px)',
              border: '1px solid var(--card-border)',
              borderRadius: '16px',
              padding: '1.5rem',
              height: 'fit-content',
              position: 'sticky',
              top: '120px'
            }}>
              <h3 style={{
                fontSize: '1.25rem',
                fontWeight: 'bold',
                marginBottom: '1.5rem',
                color: 'var(--gold-light)',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem'
              }}>
                <Filter size={20} />
                Filters
              </h3>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                {/* Category Filter */}
                <div>
                  <label style={{
                    display: 'block',
                    marginBottom: '0.5rem',
                    fontWeight: '500',
                    color: 'var(--text-light)'
                  }}>
                    Category
                  </label>
                  <select
                    value={filters.category}
                    onChange={(e) => handleFilterChange('category', e.target.value)}
                    style={{
                      width: '100%',
                      padding: '0.75rem',
                      border: '1px solid var(--card-border)',
                      borderRadius: '8px',
                      background: 'var(--highlight-bg)',
                      color: 'var(--text-light)',
                      fontSize: '0.9rem',
                      outline: 'none'
                    }}
                  >
                    <option value="">All Categories</option>
                    {jobCategories.map(cat => (
                      <option key={cat.value} value={cat.value}>{cat.label}</option>
                    ))}
                  </select>
                </div>

                {/* Job Type Filter */}
                <div>
                  <label style={{
                    display: 'block',
                    marginBottom: '0.5rem',
                    fontWeight: '500',
                    color: 'var(--text-light)'
                  }}>
                    Job Type
                  </label>
                  <select
                    value={filters.jobType}
                    onChange={(e) => handleFilterChange('jobType', e.target.value)}
                    style={{
                      width: '100%',
                      padding: '0.75rem',
                      border: '1px solid var(--card-border)',
                      borderRadius: '8px',
                      background: 'var(--highlight-bg)',
                      color: 'var(--text-light)',
                      fontSize: '0.9rem',
                      outline: 'none'
                    }}
                  >
                    <option value="">All Types</option>
                    {jobTypes.map(type => (
                      <option key={type.value} value={type.value}>{type.label}</option>
                    ))}
                  </select>
                </div>

                {/* Experience Level Filter */}
                <div>
                  <label style={{
                    display: 'block',
                    marginBottom: '0.5rem',
                    fontWeight: '500',
                    color: 'var(--text-light)'
                  }}>
                    Experience Level
                  </label>
                  <select
                    value={filters.experienceLevel}
                    onChange={(e) => handleFilterChange('experienceLevel', e.target.value)}
                    style={{
                      width: '100%',
                      padding: '0.75rem',
                      border: '1px solid var(--card-border)',
                      borderRadius: '8px',
                      background: 'var(--highlight-bg)',
                      color: 'var(--text-light)',
                      fontSize: '0.9rem',
                      outline: 'none'
                    }}
                  >
                    <option value="">All Levels</option>
                    {experienceLevels.map(level => (
                      <option key={level.value} value={level.value}>{level.label}</option>
                    ))}
                  </select>
                </div>

                {/* Location Filter */}
                <div>
                  <label style={{
                    display: 'block',
                    marginBottom: '0.5rem',
                    fontWeight: '500',
                    color: 'var(--text-light)'
                  }}>
                    Location
                  </label>
                  <input
                    type="text"
                    placeholder="Enter location..."
                    value={filters.location}
                    onChange={(e) => handleFilterChange('location', e.target.value)}
                    style={{
                      width: '100%',
                      padding: '0.75rem',
                      border: '1px solid var(--card-border)',
                      borderRadius: '8px',
                      background: 'var(--highlight-bg)',
                      color: 'var(--text-light)',
                      fontSize: '0.9rem',
                      outline: 'none'
                    }}
                  />
                </div>

                {/* Remote Work Filter */}
                <div>
                  <label style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    cursor: 'pointer',
                    fontWeight: '500',
                    color: 'var(--text-light)'
                  }}>
                    <input
                      type="checkbox"
                      checked={filters.isRemote}
                      onChange={(e) => handleFilterChange('isRemote', e.target.checked)}
                      style={{
                        width: '16px',
                        height: '16px',
                        accentColor: 'var(--gold-light)'
                      }}
                    />
                    Remote Only
                  </label>
                </div>

                {/* Urgent Jobs Filter */}
                <div>
                  <label style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    cursor: 'pointer',
                    fontWeight: '500',
                    color: 'var(--text-light)'
                  }}>
                    <input
                      type="checkbox"
                      checked={filters.isUrgent}
                      onChange={(e) => handleFilterChange('isUrgent', e.target.checked)}
                      style={{
                        width: '16px',
                        height: '16px',
                        accentColor: 'var(--gold-light)'
                      }}
                    />
                    Urgent Jobs Only
                  </label>
                </div>
              </div>
            </div>
          )}

          {/* Jobs List */}
          <div>
            {/* Jobs Header */}
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '2rem',
              background: 'var(--card-bg)',
              backdropFilter: 'blur(20px)',
              border: '1px solid var(--card-border)',
              borderRadius: '16px',
              padding: '1.5rem'
            }}>
              <div>
                <h3 style={{
                  fontSize: '1.5rem',
                  fontWeight: 'bold',
                  color: 'var(--text-light)',
                  marginBottom: '0.5rem'
                }}>
                  {pagination.totalJobs} Jobs Found
                </h3>
                <p style={{
                  color: 'var(--text-muted)',
                  fontSize: '0.9rem'
                }}>
                  Showing {jobs.length} of {pagination.totalJobs} jobs
                </p>
              </div>
              <button
                onClick={() => setShowFilters(!showFilters)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  padding: '0.75rem 1.5rem',
                  border: '1px solid var(--card-border)',
                  borderRadius: '8px',
                  background: 'var(--highlight-bg)',
                  color: 'var(--text-light)',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease'
                }}
                onMouseEnter={(e) => {
                  e.target.style.borderColor = 'var(--gold-light)';
                  e.target.style.color = 'var(--gold-light)';
                }}
                onMouseLeave={(e) => {
                  e.target.style.borderColor = 'var(--card-border)';
                  e.target.style.color = 'var(--text-light)';
                }}
              >
                <Filter size={16} />
                {showFilters ? 'Hide Filters' : 'Show Filters'}
              </button>
            </div>

            {/* Error Message */}
            {error && (
              <div style={{
                background: 'rgba(239, 68, 68, 0.1)',
                border: '1px solid rgba(239, 68, 68, 0.3)',
                borderRadius: '8px',
                padding: '1rem',
                marginBottom: '1.5rem',
                color: '#ef4444',
                textAlign: 'center'
              }}>
                {error}
              </div>
            )}

            {/* Loading State */}
            {loading && (
              <div style={{
                textAlign: 'center',
                padding: '3rem',
                color: 'var(--text-muted)'
              }}>
                <div style={{
                  width: '40px',
                  height: '40px',
                  border: '3px solid var(--card-border)',
                  borderTop: '3px solid var(--gold-light)',
                  borderRadius: '50%',
                  animation: 'spin 1s linear infinite',
                  margin: '0 auto 1rem'
                }}></div>
                Loading jobs...
              </div>
            )}

            {/* Jobs List */}
            {jobs.length === 0 && !loading && (
              <div className="empty-state">
                <Briefcase size={48} style={{ marginBottom: '1rem', opacity: 0.5 }} />
                <h3>No jobs found</h3>
                <p>Try adjusting your filters or search terms.</p>
              </div>
            )}

            {!loading && jobs.length > 0 && (
              <div className="jobs-grid">
                {jobs.map(job => (
                  <div
                    key={job._id}
                    className={`job-card${job.companyName === filters.search ? ' company-highlight' : ''}`}
                    onClick={() => navigate(`/jobs/${job._id}`)}
                    style={{ cursor: 'pointer' }}
                  >
                    {/* Company Logo/Initials */}
                    <div className="company-logo-circle">
                      {job.companyLogo ? (
                        <img src={job.companyLogo} alt={job.companyName} />
                      ) : (
                        <span>{job.companyName?.[0] || '?'}</span>
                      )}
                    </div>
                    {/* Urgent Badge */}
                    {job.isUrgent && (
                      <div className="urgent-badge">URGENT</div>
                    )}
                    {/* Job Info */}
                    <div className="job-info">
                      <h3 className="job-title">{job.jobTitle}</h3>
                      <div className="job-meta">
                        <span className="job-company"><Building size={16} /> {job.companyName}</span>
                        <span className="job-location"><MapPin size={14} /> {job.jobLocation} {job.isRemote && <span className="remote-badge">Remote</span>}</span>
                        <span className="job-type"><Clock size={14} /> {job.jobType}</span>
                        <span className="job-salary"><DollarSign size={14} /> {formatSalary(job)}</span>
                      </div>
                      <p className="job-desc">{job.jobDescription.substring(0, 120)}...</p>
                      {job.requiredSkills && job.requiredSkills.length > 0 && (
                        <div className="job-skills">
                          {job.requiredSkills.slice(0, 3).map((skill, idx) => (
                            <span className="skill-tag" key={idx}>{skill}</span>
                          ))}
                          {job.requiredSkills.length > 3 && (
                            <span className="more-skills">+{job.requiredSkills.length - 3} more</span>
                          )}
                        </div>
                      )}
                    </div>
                    {/* Job Stats */}
                    <div className="job-stats">
                      <span><Eye size={12} /> {job.totalViews} views</span>
                      <span><Users size={12} /> {job.totalApplications} apps</span>
                      <span>{formatJobAge(job.createdAt)}</span>
                    </div>
                    {/* Apply Button */}
                    <button
                      type="button"
                      disabled={appliedJobs.includes(job._id) || !user || user.userType !== 'jobseeker'}
                      onClick={e => { e.stopPropagation(); openApplyModal(job); }}
                      className="apply-btn"
                      style={{ marginTop: '0.5rem' }}
                    >
                      {appliedJobs.includes(job._id) ? 'Applied' : 'Apply'}
                    </button>
                  </div>
                ))}
              </div>
            )}

            {/* Pagination */}
            {!loading && pagination.totalPages > 1 && (
              <div style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                gap: '1rem',
                marginTop: '2rem',
                padding: '1.5rem',
                background: 'var(--card-bg)',
                backdropFilter: 'blur(20px)',
                border: '1px solid var(--card-border)',
                borderRadius: '16px'
              }}>
                <button
                  onClick={() => handlePageChange(pagination.currentPage - 1)}
                  disabled={!pagination.hasPrevPage}
                  style={{
                    padding: '0.75rem 1rem',
                    border: '1px solid var(--card-border)',
                    borderRadius: '8px',
                    background: pagination.hasPrevPage ? 'var(--highlight-bg)' : 'var(--card-bg)',
                    color: pagination.hasPrevPage ? 'var(--text-light)' : 'var(--text-muted)',
                    cursor: pagination.hasPrevPage ? 'pointer' : 'not-allowed',
                    transition: 'all 0.3s ease'
                  }}
                  onMouseEnter={(e) => {
                    if (pagination.hasPrevPage) {
                      e.target.style.borderColor = 'var(--gold-light)';
                      e.target.style.color = 'var(--gold-light)';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (pagination.hasPrevPage) {
                      e.target.style.borderColor = 'var(--card-border)';
                      e.target.style.color = 'var(--text-light)';
                    }
                  }}
                >
                  Previous
                </button>

                <span style={{
                  color: 'var(--text-muted)',
                  fontSize: '0.9rem'
                }}>
                  Page {pagination.currentPage} of {pagination.totalPages}
                </span>

                <button
                  onClick={() => handlePageChange(pagination.currentPage + 1)}
                  disabled={!pagination.hasNextPage}
                  style={{
                    padding: '0.75rem 1rem',
                    border: '1px solid var(--card-border)',
                    borderRadius: '8px',
                    background: pagination.hasNextPage ? 'var(--highlight-bg)' : 'var(--card-bg)',
                    color: pagination.hasNextPage ? 'var(--text-light)' : 'var(--text-muted)',
                    cursor: pagination.hasNextPage ? 'pointer' : 'not-allowed',
                    transition: 'all 0.3s ease'
                  }}
                  onMouseEnter={(e) => {
                    if (pagination.hasNextPage) {
                      e.target.style.borderColor = 'var(--gold-light)';
                      e.target.style.color = 'var(--gold-light)';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (pagination.hasNextPage) {
                      e.target.style.borderColor = 'var(--card-border)';
                      e.target.style.color = 'var(--text-light)';
                    }
                  }}
                >
                  Next
                </button>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Apply Modal */}
      {showApplyModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <button onClick={closeApplyModal} className="modal-close">&times;</button>
            <h2>Apply for: {selectedJob?.jobTitle}</h2>
            <form onSubmit={handleApplySubmit}>
              <div>
                <label>Upload CV (PDF/DOC):</label>
                <input type="file" accept=".pdf,.doc,.docx" onChange={handleCvChange} required />
              </div>
              <div>
                <label>Cover Letter (optional):</label>
                <textarea
                  value={coverLetter}
                  onChange={e => setCoverLetter(e.target.value)}
                  rows={4}
                  placeholder="Write a short message..."
                />
              </div>
              {applyError && <div style={{ color: 'red', marginBottom: '0.5rem' }}>{applyError}</div>}
              {applySuccess && <div style={{ color: '#4ade80', marginBottom: '0.5rem' }}>{applySuccess}</div>}
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

      <style jsx>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
} 