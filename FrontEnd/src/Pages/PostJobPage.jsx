import React, { useState, useContext } from 'react';
import { Briefcase, MapPin, DollarSign, Clock, Users, Building, Star, CheckCircle, AlertCircle, Send } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

export default function PostJobPage() {
    
  const [formData, setFormData] = useState({
    jobTitle: '',
    companyName: '',
    jobLocation: '',
    jobType: 'full-time',
    experienceLevel: 'entry-level',
    minSalary: '',
    maxSalary: '',
    currency: 'USD',
    isSalaryVisible: true,
    jobDescription: '',
    jobRequirements: '',
    jobBenefits: '',
    requiredSkills: '',
    jobCategory: '',
    applicationDeadline: '',
    contactEmail: '',
    isUrgent: false,
    isRemote: false
  });
  
  const navigate = useNavigate();
  const { user, token } = useContext(AuthContext);
  const [currentStep, setCurrentStep] = useState(1);
  const [showPreview, setShowPreview] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  // New state for company checking
  const [companyExists, setCompanyExists] = useState(null);
  const [isCheckingCompany, setIsCheckingCompany] = useState(false);

  // Check if user is returning from company registration
  const location = useLocation();
  const returningFromRegistration = location.state?.fromRegistration;

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Reset company check when company name changes
    if (name === 'companyName') {
      setCompanyExists(null);
    }
  };

  // Check if company exists when company name is entered
  const checkCompanyExists = async (companyName) => {
    if (!companyName || companyName.length < 3) {
      setCompanyExists(null);
      return;
    }

    setIsCheckingCompany(true);
    try {
      const response = await fetch(`http://localhost:5000/api/companies?exactName=${encodeURIComponent(companyName)}&limit=1`);
      const result = await response.json();
      
      if (response.ok && result.data.companies.length > 0) {
        const foundCompany = result.data.companies[0];
        // Check if the company name is a close match
        if (foundCompany.name.toLowerCase().includes(companyName.toLowerCase()) || 
            companyName.toLowerCase().includes(foundCompany.name.toLowerCase())) {
          setCompanyExists(foundCompany);
        } else {
          setCompanyExists(null);
        }
      } else {
        setCompanyExists(null);
      }
    } catch (error) {
      console.error('Error checking company:', error);
      setCompanyExists(null);
    } finally {
      setIsCheckingCompany(false);
    }
  };

  // Debounced company check
  const debouncedCompanyCheck = React.useCallback(
    React.useMemo(() => {
      let timeoutId;
      return (companyName) => {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => checkCompanyExists(companyName), 500);
      };
    }, []),
    []
  );

  // Check company when company name changes
  React.useEffect(() => {
    debouncedCompanyCheck(formData.companyName);
  }, [formData.companyName, debouncedCompanyCheck]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate all required fields before submission
    if (!isFormComplete()) {
      setError('Please fill in all required fields before submitting');
      return;
    }
    
    setIsSubmitting(true);
    setError('');
    setSuccess('');
    
    try {
      console.log('Starting job submission...');
      console.log('Form data:', formData);
      console.log('User token:', token);
      console.log('User data:', user);
      console.log('User type:', user?.userType);
      console.log('Is user employer?', user?.userType === 'employer');
      
      // Check if user is authenticated and is an employer
      if (!token) {
        setError('No authentication token found. Please login again.');
        setIsSubmitting(false);
        return;
      }

      if (!user || user.userType !== 'employer') {
        setError(`You must be logged in as an employer to post jobs. Current user type: ${user?.userType || 'none'}`);
        setIsSubmitting(false);
        return;
      }

      // Check if company exists and warn user if it doesn't
      if (!companyExists && formData.companyName) {
        const shouldContinue = window.confirm(
          `The company "${formData.companyName}" doesn't exist in our database. Would you like to:\n\n` +
          `1. Continue posting the job (company will be created automatically)\n` +
          `2. Register your company first for better visibility\n\n` +
          `Click OK to continue posting, or Cancel to register your company first.`
        );
        
        if (!shouldContinue) {
          navigate('/register-company', { 
            state: { 
              prefillCompany: formData.companyName 
            } 
          });
          setIsSubmitting(false);
          return;
        }
      }

      // Validate application deadline is in the future (only if provided)
      if (formData.applicationDeadline) {
        const deadline = new Date(formData.applicationDeadline);
        if (deadline <= new Date()) {
          setError('Application deadline must be in the future');
          setIsSubmitting(false);
          return;
        }
      }

      // Validate salary range
      if (formData.minSalary && formData.maxSalary && 
          parseInt(formData.minSalary) > parseInt(formData.maxSalary)) {
        setError('Minimum salary cannot be greater than maximum salary');
        setIsSubmitting(false);
        return;
      }

      // Prepare job data
      const jobData = {
        ...formData,
        minSalary: parseInt(formData.minSalary) || 0,
        maxSalary: parseInt(formData.maxSalary) || parseInt(formData.minSalary) || 0, // If max is empty, use min
        requiredSkills: formData.requiredSkills ? 
          formData.requiredSkills.split(',').map(s => s.trim()) : [],
        applicationDeadline: formData.applicationDeadline ? 
          new Date(formData.applicationDeadline).toISOString() : 
          new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString() // Default to 30 days from now
      };

      console.log('Prepared job data:', jobData);

      // Make API call
      const response = await fetch('http://localhost:5000/api/jobs', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(jobData)
      });

      console.log('Response status:', response.status);
      console.log('Response headers:', response.headers);

      const result = await response.json();
      console.log('Response result:', result);

      if (!response.ok) {
        // Handle validation errors specifically
        if (result.errors && Array.isArray(result.errors)) {
          const errorMessages = result.errors.join(', ');
          throw new Error(`Validation errors: ${errorMessages}`);
        }
        throw new Error(result.message || 'Failed to post job');
      }

      setSuccess('Job posted successfully!');
      console.log('Job posted successfully!');
      
      // Reset form after successful submission
      setTimeout(() => {
        setFormData({
          jobTitle: '',
          companyName: '',
          jobLocation: '',
          jobType: 'full-time',
          experienceLevel: 'entry-level',
          minSalary: '',
          maxSalary: '',
          currency: 'USD',
          isSalaryVisible: true,
          jobDescription: '',
          jobRequirements: '',
          jobBenefits: '',
          requiredSkills: '',
          jobCategory: '',
          applicationDeadline: '',
          contactEmail: '',
          isUrgent: false,
          isRemote: false
        });
        setCurrentStep(1);
        setShowPreview(false);
        setCompanyExists(null);
        navigate('/dashboard');
      }, 2000);

    } catch (error) {
      console.error('Error posting job:', error);
      setError(error.message || 'Failed to post job. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const nextStep = () => {
    // Validate current step before proceeding
    if (currentStep === 1) {
      if (!formData.jobTitle || !formData.companyName || !formData.jobLocation) {
        setError('Please fill in all required fields: Job Title, Company Name, and Location');
        return;
      }
    } else if (currentStep === 2) {
      if (!formData.jobDescription || !formData.jobRequirements) {
        setError('Please fill in all required fields: Job Description and Job Requirements');
        return;
      }
    }
    
    setError(''); // Clear any previous errors
    if (currentStep < 3) setCurrentStep(currentStep + 1);
  };

  const prevStep = () => {
    setError(''); // Clear errors when going back
    if (currentStep > 1) setCurrentStep(currentStep - 1);
  };

  // Helper function to check if all required fields are filled
  const isFormComplete = () => {
    const requiredFields = [
      formData.jobTitle,
      formData.companyName,
      formData.jobLocation,
      formData.jobDescription,
      formData.jobRequirements
    ];
    return requiredFields.every(field => field && field.trim() !== '');
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
    { value: 'entry-level', label: 'Entry Level (0-1 years)' },
    { value: 'junior-level', label: 'Junior Level (1-3 years)' },
    { value: 'mid-level', label: 'Mid Level (3-5 years)' },
    { value: 'senior-level', label: 'Senior Level (5-8 years)' },
    { value: 'lead-level', label: 'Lead Level (8+ years)' },
    { value: 'executive-level', label: 'Executive Level' }
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
              margin: 0
            }} onClick={() => navigate("/")}>
              WorkVerse
            </h1>
          </div>
          <nav style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
            <a onClick={() => navigate("/dashboard")} style={{ color: 'var(--text-muted)', textDecoration: 'none', fontSize: '0.95rem' }}>Dashboard</a>
            <a href="#" style={{ color: 'var(--text-muted)', textDecoration: 'none', fontSize: '0.95rem' }}>My Jobs</a>
            <a href="#" style={{ color: 'var(--gold-light)', textDecoration: 'none', fontSize: '0.95rem', fontWeight: '500' }}>Post Job</a>
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
            Find Your Perfect Candidate
          </h2>
          <p style={{
            fontSize: '1.25rem',
            color: 'var(--text-muted)',
            maxWidth: '600px',
            margin: '0 auto 2rem',
            lineHeight: '1.6'
          }}>
            Post your job opening and connect with talented professionals from around the world. 
            Our platform makes hiring simple, efficient, and effective.
          </p>
          
          {/* Progress Steps */}
          <div style={{
            display: 'flex',
            justifyContent: 'center',
            gap: '2rem',
            marginTop: '2rem',
            flexWrap: 'wrap'
          }}>
            {[1, 2, 3].map((step) => (
              <div key={step} style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                opacity: currentStep >= step ? 1 : 0.5,
                transition: 'opacity 0.3s ease'
              }}>
                <div style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '50%',
                  background: currentStep >= step ? 
                    'linear-gradient(45deg, var(--gold-light), var(--gold-dark))' : 
                    'var(--highlight-bg)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: currentStep >= step ? '#0f2027' : 'var(--text-muted)',
                  fontWeight: 'bold',
                  fontSize: '0.9rem'
                }}>
                  {step}
                </div>
                <span style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>
                  {step === 1 ? 'Basic Info' : step === 2 ? 'Details' : 'Review'}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Form Container */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: showPreview ? '1fr 1fr' : '1fr',
          gap: '2rem',
          alignItems: 'start'
        }}>
          {/* Job Posting Form */}
          <div style={{
            background: 'var(--card-bg)',
            backdropFilter: 'blur(20px)',
            border: '1px solid var(--card-border)',
            borderRadius: '16px',
            padding: '2rem',
            boxShadow: '0 20px 40px var(--box-shadow)'
          }}>
            <form onSubmit={handleSubmit}>
              {/* Error and Success Messages */}
              {error && (
                <div style={{
                  background: 'rgba(239, 68, 68, 0.1)',
                  border: '1px solid rgba(239, 68, 68, 0.3)',
                  borderRadius: '8px',
                  padding: '1rem',
                  marginBottom: '1.5rem',
                  color: '#ef4444',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem'
                }}>
                  <AlertCircle size={20} />
                  {error}
                </div>
              )}
              
              {success && (
                <div style={{
                  background: 'rgba(34, 197, 94, 0.1)',
                  border: '1px solid rgba(34, 197, 94, 0.3)',
                  borderRadius: '8px',
                  padding: '1rem',
                  marginBottom: '1.5rem',
                  color: '#22c55e',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem'
                }}>
                  <CheckCircle size={20} />
                  {success}
                </div>
              )}

              {returningFromRegistration && (
                <div style={{
                  background: 'rgba(212, 160, 86, 0.1)',
                  border: '1px solid rgba(212, 160, 86, 0.3)',
                  borderRadius: '8px',
                  padding: '1rem',
                  marginBottom: '1.5rem',
                  color: '#d4a056',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem'
                }}>
                  <Building size={20} />
                  Welcome back! Your company has been registered. You can now continue with your job posting.
                </div>
              )}

              {/* Step 1: Basic Information */}
              {currentStep === 1 && (
                <div>
                  <h3 style={{
                    fontSize: '1.5rem',
                    fontWeight: 'bold',
                    marginBottom: '1.5rem',
                    color: 'var(--gold-light)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem'
                  }}>
                    <Building size={24} />
                    Basic Information
                  </h3>

                  <div style={{
                    display: 'grid',
                    gap: '1.5rem',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))'
                  }}>
                    <div>
                      <label style={{
                        display: 'block',
                        marginBottom: '0.5rem',
                        fontWeight: '500',
                        color: 'var(--text-light)'
                      }}>
                        Job Title *
                      </label>
                      <input
                        type="text"
                        name="jobTitle"
                        value={formData.jobTitle}
                        onChange={handleInputChange}
                        required
                        placeholder="e.g. Senior Frontend Developer"
                        style={{
                          width: '100%',
                          padding: '0.75rem',
                          border: '1px solid var(--card-border)',
                          borderRadius: '8px',
                          background: 'var(--highlight-bg)',
                          color: 'var(--text-light)',
                          fontSize: '1rem',
                          transition: 'border-color 0.3s ease',
                          outline: 'none'
                        }}
                        onFocus={(e) => e.target.style.borderColor = 'var(--gold-light)'}
                        onBlur={(e) => e.target.style.borderColor = 'var(--card-border)'}
                      />
                    </div>

                    <div>
                      <label style={{
                        display: 'block',
                        marginBottom: '0.5rem',
                        fontWeight: '500',
                        color: 'var(--text-light)'
                      }}>
                        Company Name *
                      </label>
                      <div style={{ position: 'relative' }}>
                        <input
                          type="text"
                          name="companyName"
                          value={formData.companyName}
                          onChange={handleInputChange}
                          required
                          placeholder="e.g. TechCorp Inc."
                          style={{
                            width: '100%',
                            padding: '0.75rem',
                            paddingRight: '2.5rem',
                            border: '1px solid var(--card-border)',
                            borderRadius: '8px',
                            background: 'var(--highlight-bg)',
                            color: 'var(--text-light)',
                            fontSize: '1rem',
                            transition: 'border-color 0.3s ease',
                            outline: 'none'
                          }}
                          onFocus={(e) => e.target.style.borderColor = 'var(--gold-light)'}
                          onBlur={(e) => e.target.style.borderColor = 'var(--card-border)'}
                        />
                        
                        {/* Company Status Indicator */}
                        {formData.companyName && (
                          <div style={{
                            position: 'absolute',
                            right: '0.75rem',
                            top: '50%',
                            transform: 'translateY(-50%)',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.25rem'
                          }}>
                            {isCheckingCompany ? (
                              <div style={{
                                width: '16px',
                                height: '16px',
                                border: '2px solid var(--gold-light)',
                                borderTop: '2px solid transparent',
                                borderRadius: '50%',
                                animation: 'spin 1s linear infinite'
                              }} />
                            ) : companyExists ? (
                              <div style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '0.25rem',
                                color: '#22c55e',
                                fontSize: '0.75rem'
                              }}>
                                <CheckCircle size={16} />
                                <span>Verified</span>
                              </div>
                            ) : formData.companyName.length >= 3 ? (
                              <div style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '0.25rem',
                                color: '#f59e0b',
                                fontSize: '0.75rem'
                              }}>
                                <AlertCircle size={16} />
                                <span>New</span>
                              </div>
                            ) : null}
                          </div>
                        )}
                      </div>
                      
                      {/* Company Info */}
                      {companyExists && (
                        <div style={{
                          marginTop: '0.5rem',
                          padding: '0.75rem',
                          background: 'rgba(34, 197, 94, 0.1)',
                          border: '1px solid rgba(34, 197, 94, 0.3)',
                          borderRadius: '8px',
                          fontSize: '0.875rem',
                          color: '#22c55e'
                        }}>
                          <div style={{ fontWeight: '600', marginBottom: '0.25rem' }}>
                            ✓ Company Found: {companyExists.name}
                          </div>
                          <div style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>
                            Industry: {companyExists.industry} • Size: {companyExists.size} • Location: {companyExists.location}
                          </div>
                        </div>
                      )}
                      
                      {!companyExists && formData.companyName && formData.companyName.length >= 3 && !isCheckingCompany && (
                        <div style={{
                          marginTop: '0.5rem',
                          padding: '0.75rem',
                          background: 'rgba(245, 158, 11, 0.1)',
                          border: '1px solid rgba(245, 158, 11, 0.3)',
                          borderRadius: '8px',
                          fontSize: '0.875rem',
                          color: '#f59e0b'
                        }}>
                          <div style={{ fontWeight: '600', marginBottom: '0.25rem' }}>
                            ⚠️ New Company
                          </div>
                          <div style={{ color: 'var(--text-muted)', fontSize: '0.8rem', marginBottom: '0.5rem' }}>
                            This company doesn't exist in our database yet. Consider registering it for better visibility.
                          </div>
                          <button
                            type="button"
                            onClick={() => {
                              // Navigate to company registration with pre-filled company name
                              navigate('/register-company', { 
                                state: { 
                                  prefillCompany: formData.companyName 
                                } 
                              });
                            }}
                            style={{
                              background: 'var(--gold-dark)',
                              color: 'white',
                              border: 'none',
                              padding: '0.5rem 1rem',
                              borderRadius: '6px',
                              fontSize: '0.8rem',
                              cursor: 'pointer',
                              transition: 'background 0.3s ease'
                            }}
                            onMouseEnter={(e) => e.target.style.background = 'var(--gold-light)'}
                            onMouseLeave={(e) => e.target.style.background = 'var(--gold-dark)'}
                          >
                            Register Company
                          </button>
                        </div>
                      )}
                    </div>

                    <div>
                      <label style={{
                        display: 'block',
                        marginBottom: '0.5rem',
                        fontWeight: '500',
                        color: 'var(--text-light)'
                      }}>
                        <MapPin size={16} style={{ display: 'inline', marginRight: '0.25rem' }} />
                        Location *
                      </label>
                      <input
                        type="text"
                        name="jobLocation"
                        value={formData.jobLocation}
                        onChange={handleInputChange}
                        required
                        placeholder="e.g. New York, NY / Remote"
                        style={{
                          width: '100%',
                          padding: '0.75rem',
                          border: '1px solid var(--card-border)',
                          borderRadius: '8px',
                          background: 'var(--highlight-bg)',
                          color: 'var(--text-light)',
                          fontSize: '1rem',
                          transition: 'border-color 0.3s ease',
                          outline: 'none'
                        }}
                        onFocus={(e) => e.target.style.borderColor = 'var(--gold-light)'}
                        onBlur={(e) => e.target.style.borderColor = 'var(--card-border)'}
                      />
                    </div>

                    <div>
                      <label style={{
                        display: 'block',
                        marginBottom: '0.5rem',
                        fontWeight: '500',
                        color: 'var(--text-light)'
                      }}>
                        <Clock size={16} style={{ display: 'inline', marginRight: '0.25rem' }} />
                        Job Type *
                      </label>
                      <select
                        name="jobType"
                        value={formData.jobType}
                        onChange={handleInputChange}
                        required
                        style={{
                          width: '100%',
                          padding: '0.75rem',
                          border: '1px solid var(--card-border)',
                          borderRadius: '8px',
                          background: 'var(--highlight-bg)',
                          color: 'var(--text-light)',
                          fontSize: '1rem',
                          transition: 'border-color 0.3s ease',
                          outline: 'none'
                        }}
                      >
                        <option value="full-time">Full-time</option>
                        <option value="part-time">Part-time</option>
                        <option value="contract">Contract</option>
                        <option value="freelance">Freelance</option>
                        <option value="internship">Internship</option>
                      </select>
                    </div>

                    <div>
                      <label style={{
                        display: 'block',
                        marginBottom: '0.5rem',
                        fontWeight: '500',
                        color: 'var(--text-light)'
                      }}>
                        Category *
                      </label>
                      <select
                        name="jobCategory"
                        value={formData.jobCategory}
                        onChange={handleInputChange}
                        required
                        style={{
                          width: '100%',
                          padding: '0.75rem',
                          border: '1px solid var(--card-border)',
                          borderRadius: '8px',
                          background: 'var(--highlight-bg)',
                          color: 'var(--text-light)',
                          fontSize: '1rem',
                          transition: 'border-color 0.3s ease',
                          outline: 'none'
                        }}
                      >
                        <option value="">Select Category</option>
                        {jobCategories.map(cat => (
                          <option key={cat.value} value={cat.value}>{cat.label}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label style={{
                        display: 'block',
                        marginBottom: '0.5rem',
                        fontWeight: '500',
                        color: 'var(--text-light)'
                      }}>
                        <Users size={16} style={{ display: 'inline', marginRight: '0.25rem' }} />
                        Experience Level *
                      </label>
                      <select
                        name="experienceLevel"
                        value={formData.experienceLevel}
                        onChange={handleInputChange}
                        required
                        style={{
                          width: '100%',
                          padding: '0.75rem',
                          border: '1px solid var(--card-border)',
                          borderRadius: '8px',
                          background: 'var(--highlight-bg)',
                          color: 'var(--text-light)',
                          fontSize: '1rem',
                          transition: 'border-color 0.3s ease',
                          outline: 'none'
                        }}
                      >
                        <option value="">Select Experience</option>
                        {experienceLevels.map((exp) => (
                          <option key={exp.value} value={exp.value}>{exp.label}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>
              )}

              {/* Step 2: Job Details */}
              {currentStep === 2 && (
                <div>
                  <h3 style={{
                    fontSize: '1.5rem',
                    fontWeight: 'bold',
                    marginBottom: '1.5rem',
                    color: 'var(--gold-light)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem'
                  }}>
                    <AlertCircle size={24} />
                    Job Details
                  </h3>

                  <div style={{ display: 'grid', gap: '1.5rem' }}>
                    <div style={{
                      display: 'grid',
                      gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
                      gap: '1.5rem'
                    }}>
                      <div>
                        <label style={{
                          display: 'block',
                          marginBottom: '0.5rem',
                          fontWeight: '500',
                          color: 'var(--text-light)'
                        }}>
                          <DollarSign size={16} style={{ display: 'inline', marginRight: '0.25rem' }} />
                          Salary Range
                        </label>
                        <input
                          type="text"
                          name="minSalary"
                          value={formData.minSalary}
                          onChange={handleInputChange}
                          placeholder="e.g. $80,000"
                          style={{
                            width: '100%',
                            padding: '0.75rem',
                            border: '1px solid var(--card-border)',
                            borderRadius: '8px',
                            background: 'var(--highlight-bg)',
                            color: 'var(--text-light)',
                            fontSize: '1rem',
                            transition: 'border-color 0.3s ease',
                            outline: 'none'
                          }}
                          onFocus={(e) => e.target.style.borderColor = 'var(--gold-light)'}
                          onBlur={(e) => e.target.style.borderColor = 'var(--card-border)'}
                        />
                      </div>

                      <div>
                        <label style={{
                          display: 'block',
                          marginBottom: '0.5rem',
                          fontWeight: '500',
                          color: 'var(--text-light)'
                        }}>
                          <DollarSign size={16} style={{ display: 'inline', marginRight: '0.25rem' }} />
                          Currency
                        </label>
                        <select
                          name="currency"
                          value={formData.currency}
                          onChange={handleInputChange}
                          style={{
                            width: '100%',
                            padding: '0.75rem',
                            border: '1px solid var(--card-border)',
                            borderRadius: '8px',
                            background: 'var(--highlight-bg)',
                            color: 'var(--text-light)',
                            fontSize: '1rem',
                            transition: 'border-color 0.3s ease',
                            outline: 'none'
                          }}
                        >
                          <option value="USD">USD</option>
                          <option value="EUR">EUR</option>
                          <option value="GBP">GBP</option>
                          <option value="JPY">JPY</option>
                          <option value="CAD">CAD</option>
                          <option value="AUD">AUD</option>
                          <option value="CHF">CHF</option>
                          <option value="CNY">CNY</option>
                          <option value="SEK">SEK</option>
                          <option value="NZD">NZD</option>
                        </select>
                      </div>

                      <div>
                        <label style={{
                          display: 'block',
                          marginBottom: '0.5rem',
                          fontWeight: '500',
                          color: 'var(--text-light)'
                        }}>
                          Contact Email *
                        </label>
                        <input
                          type="email"
                          name="contactEmail"
                          value={formData.contactEmail}
                          onChange={handleInputChange}
                          required
                          placeholder="hr@company.com"
                          style={{
                            width: '100%',
                            padding: '0.75rem',
                            border: '1px solid var(--card-border)',
                            borderRadius: '8px',
                            background: 'var(--highlight-bg)',
                            color: 'var(--text-light)',
                            fontSize: '1rem',
                            transition: 'border-color 0.3s ease',
                            outline: 'none'
                          }}
                          onFocus={(e) => e.target.style.borderColor = 'var(--gold-light)'}
                          onBlur={(e) => e.target.style.borderColor = 'var(--card-border)'}
                        />
                      </div>
                    </div>

                    <div>
                      <label style={{
                        display: 'block',
                        marginBottom: '0.5rem',
                        fontWeight: '500',
                        color: 'var(--text-light)'
                      }}>
                        Job Description *
                      </label>
                      <textarea
                        name="jobDescription"
                        value={formData.jobDescription}
                        onChange={handleInputChange}
                        required
                        rows={6}
                        placeholder="Describe the role, responsibilities, and what makes this opportunity unique..."
                        style={{
                          width: '100%',
                          padding: '0.75rem',
                          border: '1px solid var(--card-border)',
                          borderRadius: '8px',
                          background: 'var(--highlight-bg)',
                          color: 'var(--text-light)',
                          fontSize: '1rem',
                          transition: 'border-color 0.3s ease',
                          outline: 'none',
                          resize: 'vertical',
                          fontFamily: 'inherit'
                        }}
                        onFocus={(e) => e.target.style.borderColor = 'var(--gold-light)'}
                        onBlur={(e) => e.target.style.borderColor = 'var(--card-border)'}
                      />
                    </div>

                    <div>
                      <label style={{
                        display: 'block',
                        marginBottom: '0.5rem',
                        fontWeight: '500',
                        color: 'var(--text-light)'
                      }}>
                        Requirements *
                      </label>
                      <textarea
                        name="jobRequirements"
                        value={formData.jobRequirements}
                        onChange={handleInputChange}
                        required
                        rows={4}
                        placeholder="List the required qualifications, experience, and skills..."
                        style={{
                          width: '100%',
                          padding: '0.75rem',
                          border: '1px solid var(--card-border)',
                          borderRadius: '8px',
                          background: 'var(--highlight-bg)',
                          color: 'var(--text-light)',
                          fontSize: '1rem',
                          transition: 'border-color 0.3s ease',
                          outline: 'none',
                          resize: 'vertical',
                          fontFamily: 'inherit'
                        }}
                        onFocus={(e) => e.target.style.borderColor = 'var(--gold-light)'}
                        onBlur={(e) => e.target.style.borderColor = 'var(--card-border)'}
                      />
                    </div>

                    <div>
                      <label style={{
                        display: 'block',
                        marginBottom: '0.5rem',
                        fontWeight: '500',
                        color: 'var(--text-light)'
                      }}>
                        Benefits & Perks
                      </label>
                      <textarea
                        name="jobBenefits"
                        value={formData.jobBenefits}
                        onChange={handleInputChange}
                        rows={3}
                        placeholder="Health insurance, flexible hours, remote work, professional development..."
                        style={{
                          width: '100%',
                          padding: '0.75rem',
                          border: '1px solid var(--card-border)',
                          borderRadius: '8px',
                          background: 'var(--highlight-bg)',
                          color: 'var(--text-light)',
                          fontSize: '1rem',
                          transition: 'border-color 0.3s ease',
                          outline: 'none',
                          resize: 'vertical',
                          fontFamily: 'inherit'
                        }}
                        onFocus={(e) => e.target.style.borderColor = 'var(--gold-light)'}
                        onBlur={(e) => e.target.style.borderColor = 'var(--card-border)'}
                      />
                    </div>

                    <div>
                      <label style={{
                        display: 'block',
                        marginBottom: '0.5rem',
                        fontWeight: '500',
                        color: 'var(--text-light)'
                      }}>
                        Required Skills
                      </label>
                      <input
                        type="text"
                        name="requiredSkills"
                        value={formData.requiredSkills}
                        onChange={handleInputChange}
                        placeholder="React, Node.js, Python, AWS (separate with commas)"
                        style={{
                          width: '100%',
                          padding: '0.75rem',
                          border: '1px solid var(--card-border)',
                          borderRadius: '8px',
                          background: 'var(--highlight-bg)',
                          color: 'var(--text-light)',
                          fontSize: '1rem',
                          transition: 'border-color 0.3s ease',
                          outline: 'none'
                        }}
                        onFocus={(e) => e.target.style.borderColor = 'var(--gold-light)'}
                        onBlur={(e) => e.target.style.borderColor = 'var(--card-border)'}
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Step 3: Review & Submit */}
              {currentStep === 3 && (
                <div>
                  <h3 style={{
                    fontSize: '1.5rem',
                    fontWeight: 'bold',
                    marginBottom: '1.5rem',
                    color: 'var(--gold-light)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem'
                  }}>
                    <CheckCircle size={24} />
                    Review & Publish
                  </h3>

                  <div style={{
                    background: 'var(--highlight-bg)',
                    border: '1px solid var(--card-border)',
                    borderRadius: '12px',
                    padding: '1.5rem',
                    marginBottom: '2rem'
                  }}>
                    <h4 style={{
                      fontSize: '1.25rem',
                      fontWeight: 'bold',
                      color: 'var(--gold-light)',
                      marginBottom: '1rem'
                    }}>
                      {formData.jobTitle || 'Job Title'}
                    </h4>
                    <div style={{ display: 'grid', gap: '0.5rem', marginBottom: '1rem' }}>
                      <p style={{ color: 'var(--text-muted)', margin: 0 }}>
                        <Building size={16} style={{ display: 'inline', marginRight: '0.5rem' }} />
                        {formData.companyName || 'Company Name'}
                      </p>
                      <p style={{ color: 'var(--text-muted)', margin: 0 }}>
                        <MapPin size={16} style={{ display: 'inline', marginRight: '0.5rem' }} />
                        {formData.jobLocation || 'Location'}
                      </p>
                      <p style={{ color: 'var(--text-muted)', margin: 0 }}>
                        <Clock size={16} style={{ display: 'inline', marginRight: '0.5rem' }} />
                        {formData.jobType || 'Job Type'} • {formData.experienceLevel || 'Experience Level'}
                      </p>
                      {formData.minSalary && (
                        <p style={{ color: 'var(--success-color)', margin: 0, fontWeight: '500' }}>
                          <DollarSign size={16} style={{ display: 'inline', marginRight: '0.5rem' }} />
                          {formData.minSalary} - {formData.maxSalary} {formData.currency}
                        </p>
                      )}
                    </div>
                    
                    <div style={{
                      display: 'flex',
                      gap: '1rem',
                      marginTop: '1rem',
                      alignItems: 'center'
                    }}>
                      <button
                        type="button"
                        onClick={() => setShowPreview(!showPreview)}
                        style={{
                          padding: '0.5rem 1rem',
                          background: 'var(--card-bg)',
                          border: '1px solid var(--card-border)',
                          borderRadius: '6px',
                          color: 'var(--text-light)',
                          fontSize: '0.9rem',
                          cursor: 'pointer',
                          transition: 'all 0.3s ease'
                        }}
                        onMouseOver={(e) => e.target.style.background = 'var(--highlight-bg)'}
                        onMouseOut={(e) => e.target.style.background = 'var(--card-bg)'}
                      >
                        {showPreview ? 'Hide Preview' : 'Show Preview'}
                      </button>
                      
                      <span style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                        Make sure all details are accurate before publishing
                      </span>
                    </div>
                  </div>

                  <div style={{
                    background: 'rgba(74, 222, 128, 0.1)',
                    border: '1px solid rgba(74, 222, 128, 0.3)',
                    borderRadius: '8px',
                    padding: '1rem',
                    marginBottom: '2rem'
                  }}>
                    <p style={{
                      margin: 0,
                      color: 'var(--success-color)',
                      fontSize: '0.9rem',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.5rem'
                    }}>
                      <Star size={16} />
                      Your job will be live immediately after publishing and visible to thousands of candidates.
                    </p>
                  </div>
                </div>
              )}

              {/* Navigation Buttons */}
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                marginTop: '2rem',
                paddingTop: '2rem',
                borderTop: '1px solid var(--card-border)'
              }}>
                <button
                  type="button"
                  onClick={prevStep}
                  disabled={currentStep === 1}
                  style={{
                    padding: '0.75rem 1.5rem',
                    background: currentStep === 1 ? 'var(--highlight-bg)' : 'var(--card-bg)',
                    border: '1px solid var(--card-border)',
                    borderRadius: '8px',
                    color: currentStep === 1 ? 'var(--text-muted)' : 'var(--text-light)',
                    fontSize: '1rem',
                    cursor: currentStep === 1 ? 'not-allowed' : 'pointer',
                    transition: 'all 0.3s ease',
                    opacity: currentStep === 1 ? 0.5 : 1
                  }}
                  onMouseOver={(e) => {
                    if (currentStep !== 1) {
                      e.target.style.background = 'var(--highlight-bg)';
                    }
                  }}
                  onMouseOut={(e) => {
                    if (currentStep !== 1) {
                      e.target.style.background = 'var(--card-bg)';
                    }
                  }}
                >
                  Previous
                </button>

                {currentStep < 3 ? (
                  <button
                    type="button"
                    onClick={nextStep}
                    style={{
                      padding: '0.75rem 2rem',
                      background: 'linear-gradient(45deg, var(--gold-light), var(--gold-dark))',
                      border: 'none',
                      borderRadius: '8px',
                      color: '#0f2027',
                      fontSize: '1rem',
                      fontWeight: '600',
                      cursor: 'pointer',
                      transition: 'all 0.3s ease',
                      boxShadow: '0 4px 15px rgba(252, 210, 159, 0.3)'
                    }}
                    onMouseOver={(e) => {
                      e.target.style.transform = 'translateY(-2px)';
                      e.target.style.boxShadow = '0 6px 20px rgba(252, 210, 159, 0.4)';
                    }}
                    onMouseOut={(e) => {
                      e.target.style.transform = 'translateY(0)';
                      e.target.style.boxShadow = '0 4px 15px rgba(252, 210, 159, 0.3)';
                    }}
                  >
                    Next Step
                  </button>
                ) : (
                  <button
                    type="submit"
                    disabled={isSubmitting || !isFormComplete()}
                    style={{
                      padding: '0.75rem 2rem',
                      background: isSubmitting || !isFormComplete() ? 'var(--highlight-bg)' : 'linear-gradient(45deg, var(--success-color), #22c55e)',
                      border: 'none',
                      borderRadius: '8px',
                      color: isSubmitting || !isFormComplete() ? 'var(--text-muted)' : '#fff',
                      fontSize: '1rem',
                      fontWeight: '600',
                      cursor: isSubmitting || !isFormComplete() ? 'not-allowed' : 'pointer',
                      transition: 'all 0.3s ease',
                      boxShadow: isSubmitting || !isFormComplete() ? 'none' : '0 4px 15px rgba(74, 222, 128, 0.3)',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.5rem'
                    }}
                    onMouseOver={(e) => {
                      if (!isSubmitting && isFormComplete()) {
                        e.target.style.transform = 'translateY(-2px)';
                        e.target.style.boxShadow = '0 6px 20px rgba(74, 222, 128, 0.4)';
                      }
                    }}
                    onMouseOut={(e) => {
                      if (!isSubmitting && isFormComplete()) {
                        e.target.style.transform = 'translateY(0)';
                        e.target.style.boxShadow = '0 4px 15px rgba(74, 222, 128, 0.3)';
                      }
                    }}
                  >
                    {isSubmitting ? (
                      <>
                        <div style={{
                          width: '16px',
                          height: '16px',
                          border: '2px solid var(--text-muted)',
                          borderTop: '2px solid transparent',
                          borderRadius: '50%',
                          animation: 'spin 1s linear infinite'
                        }}></div>
                        Publishing...
                      </>
                    ) : !isFormComplete() ? (
                      <>
                        <AlertCircle size={16} />
                        Complete All Fields
                      </>
                    ) : (
                      <>
                        <Send size={16} />
                        Publish Job
                      </>
                    )}
                  </button>
                )}
              </div>
            </form>
          </div>

          {/* Job Preview Panel */}

          
          {showPreview && (
            <div style={{
              background: 'var(--card-bg)',
              backdropFilter: 'blur(20px)',
              border: '1px solid var(--card-border)',
              borderRadius: '16px',
              padding: '2rem',
              boxShadow: '0 20px 40px var(--box-shadow)',
              position: 'sticky',
              top: '2rem'
            }}>
              <h3 style={{
                fontSize: '1.25rem',
                fontWeight: 'bold',
                marginBottom: '1.5rem',
                color: 'var(--gold-light)',
                textAlign: 'center'
              }}>
                Job Preview
              </h3>

              <div style={{
                background: 'var(--highlight-bg)',
                border: '1px solid var(--card-border)',
                borderRadius: '12px',
                padding: '1.5rem',
                marginBottom: '1rem'
              }}>
                <h4 style={{
                  fontSize: '1.5rem',
                  fontWeight: 'bold',
                  color: 'var(--text-light)',
                  marginBottom: '1rem'
                }}>
                  {formData.jobTitle || 'Job Title'}
                </h4>

                <div style={{ display: 'grid', gap: '0.75rem', marginBottom: '1.5rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <Building size={16} color="var(--gold-light)" />
                    <span style={{ color: 'var(--text-light)' }}>
                      {formData.companyName || 'Company Name'}
                    </span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <MapPin size={16} color="var(--gold-light)" />
                    <span style={{ color: 'var(--text-muted)' }}>
                      {formData.jobLocation || 'Location'}
                    </span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <Clock size={16} color="var(--gold-light)" />
                    <span style={{ color: 'var(--text-muted)' }}>
                      {formData.jobType || 'Job Type'}
                    </span>
                  </div>
                  {formData.minSalary && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <DollarSign size={16} color="var(--success-color)" />
                      <span style={{ color: 'var(--success-color)', fontWeight: '500' }}>
                        {formData.minSalary} - {formData.maxSalary} {formData.currency}
                      </span>
                    </div>
                  )}
                </div>

                {formData.jobDescription && (
                  <div style={{ marginBottom: '1.5rem' }}>
                    <h5 style={{
                      fontSize: '1rem',
                      fontWeight: '600',
                      color: 'var(--gold-light)',
                      marginBottom: '0.5rem'
                    }}>
                      Job Description
                    </h5>
                    <p style={{
                      color: 'var(--text-muted)',
                      lineHeight: '1.6',
                      margin: 0,
                      fontSize: '0.9rem'
                    }}>
                      {formData.jobDescription.substring(0, 200)}
                      {formData.jobDescription.length > 200 && '...'}
                    </p>
                  </div>
                )}

                {formData.requiredSkills && (
                  <div style={{ marginBottom: '1rem' }}>
                    <h5 style={{
                      fontSize: '1rem',
                      fontWeight: '600',
                      color: 'var(--gold-light)',
                      marginBottom: '0.5rem'
                    }}>
                      Required Skills
                    </h5>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                      {formData.requiredSkills.split(',').map((skill, index) => (
                        <span
                          key={index}
                          style={{
                            background: 'var(--card-bg)',
                            border: '1px solid var(--card-border)',
                            borderRadius: '16px',
                            padding: '0.25rem 0.75rem',
                            fontSize: '0.8rem',
                            color: 'var(--text-light)'
                          }}
                        >
                          {skill.trim()}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  paddingTop: '1rem',
                  borderTop: '1px solid var(--card-border)',
                  marginTop: '1.5rem'
                }}>
                  <span style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>
                    Posted on WorkVerse
                  </span>
                  <button style={{
                    background: 'linear-gradient(45deg, var(--gold-light), var(--gold-dark))',
                    border: 'none',
                    borderRadius: '6px',
                    padding: '0.5rem 1rem',
                    color: '#0f2027',
                    fontSize: '0.9rem',
                    fontWeight: '600',
                    cursor: 'pointer'
                  }}>
                    Apply Now
                  </button>
                </div>
              </div>

              <div style={{
                background: 'rgba(74, 222, 128, 0.1)',
                border: '1px solid rgba(74, 222, 128, 0.3)',
                borderRadius: '8px',
                padding: '1rem',
                textAlign: 'center'
              }}>
                <p style={{
                  margin: 0,
                  color: 'var(--success-color)',
                  fontSize: '0.85rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.5rem'
                }}>
                  <CheckCircle size={16} />
                  This is how your job will appear to candidates
                </p>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer style={{
        background: 'var(--card-bg)',
        backdropFilter: 'blur(20px)',
        borderTop: '1px solid var(--card-border)',
        padding: '2rem 0',
        marginTop: '4rem'
      }}>
        <div style={{
          maxWidth: '1200px',
          margin: '0 auto',
          padding: '0 1rem',
          textAlign: 'center'
        }}>
          <div style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            gap: '0.75rem',
            marginBottom: '1rem'
          }}>
            <div style={{
              background: 'linear-gradient(45deg, var(--gold-light), var(--gold-dark))',
              padding: '0.5rem',
              borderRadius: '8px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <Briefcase size={20} color="#0f2027" />
            </div>
            <span style={{
              fontSize: '1.25rem',
              fontWeight: 'bold',
              background: 'linear-gradient(45deg, var(--gold-light), var(--gold-dark))',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent'
            }}>
              WorkVerse
            </span>
          </div>
          <p style={{
            color: 'var(--text-muted)',
            margin: 0,
            fontSize: '0.9rem'
          }}>
            Connecting talent with opportunity. © 2025 WorkVerse. All rights reserved.
          </p>
        </div>
      </footer>

      {/* CSS Animations */}
      <style>{`
        :root {
          --primary-bg: linear-gradient(135deg, #0f2027, #203a43, #2c5364);
          --highlight-bg: #2c3e50;
          --glass-border: rgba(255, 255, 255, 0.2);
          --box-shadow: rgba(0, 0, 0, 0.2);
          --gold-light: #fcd29f;
          --gold-dark: #d4a056;
          --text-light: #f5f5f5;
          --text-muted: #ccc;
          --button-hover: linear-gradient(to right, #fbd7a1, #c9953e);
          --card-bg: rgba(255, 255, 255, 0.1);
          --card-border: rgba(255, 255, 255, 0.15);
          --success-color: #4ade80;
        }

        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes spin {
          0% { transform: translateY(-50%) rotate(0deg); }
          100% { transform: translateY(-50%) rotate(360deg); }
        }

        @media (max-width: 768px) {
          .grid-responsive {
            grid-template-columns: 1fr !important;
          }
        }

        * {
          box-sizing: border-box;
        }

        body {
          margin: 0;
          padding: 0;
        }

        input::placeholder,
        textarea::placeholder,
        select option {
          color: var(--text-muted);
          opacity: 0.7;
        }

        input:focus,
        textarea:focus,
        select:focus {
          border-color: var(--gold-light) !important;
          box-shadow: 0 0 0 3px rgba(252, 210, 159, 0.1);
        }
      `}</style>
    </div>
  );
}