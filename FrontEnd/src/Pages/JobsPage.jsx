import React, { useState, useEffect } from 'react';
import { Search, MapPin, DollarSign, Clock, Building, Filter, Briefcase, Star, Users, Eye } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

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
  }, [filters]);

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
            {!loading && jobs.length === 0 && !error && (
              <div style={{
                textAlign: 'center',
                padding: '3rem',
                color: 'var(--text-muted)'
              }}>
                <Briefcase size={48} style={{ marginBottom: '1rem', opacity: 0.5 }} />
                <h3 style={{ marginBottom: '0.5rem' }}>No jobs found</h3>
                <p>Try adjusting your filters or search terms</p>
              </div>
            )}

            {!loading && jobs.length > 0 && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {jobs.map((job) => (
                  <div
                    key={job._id}
                    style={{
                      background: 'var(--card-bg)',
                      backdropFilter: 'blur(20px)',
                      border: '1px solid var(--card-border)',
                      borderRadius: '16px',
                      padding: '1.5rem',
                      cursor: 'pointer',
                      transition: 'all 0.3s ease',
                      position: 'relative'
                    }}
                    onMouseEnter={(e) => {
                      e.target.style.transform = 'translateY(-2px)';
                      e.target.style.boxShadow = '0 10px 30px var(--box-shadow)';
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.transform = 'translateY(0)';
                      e.target.style.boxShadow = 'none';
                    }}
                    onClick={() => navigate(`/jobs/${job._id}`)}
                  >
                    {/* Urgent Badge */}
                    {job.isUrgent && (
                      <div style={{
                        position: 'absolute',
                        top: '1rem',
                        right: '1rem',
                        background: 'linear-gradient(45deg, #ef4444, #dc2626)',
                        color: 'white',
                        padding: '0.25rem 0.75rem',
                        borderRadius: '20px',
                        fontSize: '0.75rem',
                        fontWeight: 'bold'
                      }}>
                        URGENT
                      </div>
                    )}

                    <div style={{
                      display: 'grid',
                      gridTemplateColumns: '1fr auto',
                      gap: '1rem',
                      alignItems: 'start'
                    }}>
                      <div>
                        {/* Job Title and Company */}
                        <h3 style={{
                          fontSize: '1.25rem',
                          fontWeight: 'bold',
                          color: 'var(--text-light)',
                          marginBottom: '0.5rem'
                        }}>
                          {job.jobTitle}
                        </h3>
                        <p style={{
                          color: 'var(--gold-light)',
                          fontWeight: '500',
                          marginBottom: '1rem',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.5rem'
                        }}>
                          <Building size={16} />
                          {job.companyName}
                        </p>

                        {/* Job Details */}
                        <div style={{
                          display: 'flex',
                          flexWrap: 'wrap',
                          gap: '1rem',
                          marginBottom: '1rem'
                        }}>
                          <span style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.25rem',
                            color: 'var(--text-muted)',
                            fontSize: '0.9rem'
                          }}>
                            <MapPin size={14} />
                            {job.jobLocation}
                            {job.isRemote && (
                              <span style={{
                                background: 'var(--gold-light)',
                                color: '#0f2027',
                                padding: '0.125rem 0.5rem',
                                borderRadius: '12px',
                                fontSize: '0.75rem',
                                fontWeight: 'bold',
                                marginLeft: '0.5rem'
                              }}>
                                Remote
                              </span>
                            )}
                          </span>
                          <span style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.25rem',
                            color: 'var(--text-muted)',
                            fontSize: '0.9rem'
                          }}>
                            <Clock size={14} />
                            {job.jobType}
                          </span>
                          <span style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.25rem',
                            color: 'var(--text-muted)',
                            fontSize: '0.9rem'
                          }}>
                            <DollarSign size={14} />
                            {formatSalary(job)}
                          </span>
                        </div>

                        {/* Job Description Preview */}
                        <p style={{
                          color: 'var(--text-muted)',
                          fontSize: '0.9rem',
                          lineHeight: '1.5',
                          marginBottom: '1rem'
                        }}>
                          {job.jobDescription.substring(0, 150)}...
                        </p>

                        {/* Skills */}
                        {job.requiredSkills && job.requiredSkills.length > 0 && (
                          <div style={{
                            display: 'flex',
                            flexWrap: 'wrap',
                            gap: '0.5rem',
                            marginBottom: '1rem'
                          }}>
                            {job.requiredSkills.slice(0, 3).map((skill, index) => (
                              <span
                                key={index}
                                style={{
                                  background: 'var(--highlight-bg)',
                                  color: 'var(--text-light)',
                                  padding: '0.25rem 0.75rem',
                                  borderRadius: '20px',
                                  fontSize: '0.8rem',
                                  border: '1px solid var(--card-border)'
                                }}
                              >
                                {skill}
                              </span>
                            ))}
                            {job.requiredSkills.length > 3 && (
                              <span style={{
                                color: 'var(--text-muted)',
                                fontSize: '0.8rem',
                                padding: '0.25rem 0.75rem'
                              }}>
                                +{job.requiredSkills.length - 3} more
                              </span>
                            )}
                          </div>
                        )}
                      </div>

                      {/* Job Stats */}
                      <div style={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'flex-end',
                        gap: '0.5rem',
                        minWidth: '100px'
                      }}>
                        <span style={{
                          color: 'var(--text-muted)',
                          fontSize: '0.8rem',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.25rem'
                        }}>
                          <Eye size={12} />
                          {job.totalViews} views
                        </span>
                        <span style={{
                          color: 'var(--text-muted)',
                          fontSize: '0.8rem',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.25rem'
                        }}>
                          <Users size={12} />
                          {job.totalApplications} applications
                        </span>
                        <span style={{
                          color: 'var(--text-muted)',
                          fontSize: '0.8rem'
                        }}>
                          {formatJobAge(job.createdAt)}
                        </span>
                      </div>
                    </div>
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

      <style jsx>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
} 