import React, { useState } from 'react';
import { Briefcase, MapPin, DollarSign, Clock, Users, Building, Star, CheckCircle, AlertCircle, Send } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
export default function PostJobPage() {
    
  const [formData, setFormData] = useState({
    jobTitle: '',
    company: '',
    location: '',
    jobType: 'full-time',
    experience: '',
    salary: '',
    description: '',
    requirements: '',
    benefits: '',
    skills: '',
    category: '',
    urgency: 'normal',
    contactEmail: '',
    applicationDeadline: ''
  });
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [showPreview, setShowPreview] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    alert('Analysis of job data completed successfully.');
    setIsSubmitting(false);
  };

  const nextStep = () => {
    if (currentStep < 3) setCurrentStep(currentStep + 1);
  };

  const prevStep = () => {
    if (currentStep > 1) setCurrentStep(currentStep - 1);
  };

  const jobCategories = [
    'Technology', 'Marketing', 'Sales', 'Design', 'Finance', 'HR',
    'Operations', 'Customer Service', 'Engineering', 'Healthcare',
    'Education', 'Legal', 'Consulting', 'Manufacturing', 'Other'
  ];

  const experienceLevels = [
    'Entry Level (0-1 years)',
    'Junior Level (1-3 years)',
    'Mid Level (3-5 years)',
    'Senior Level (5-8 years)',
    'Lead Level (8+ years)',
    'Executive Level'
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
                      <input
                        type="text"
                        name="company"
                        value={formData.company}
                        onChange={handleInputChange}
                        required
                        placeholder="e.g. TechCorp Inc."
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
                        <MapPin size={16} style={{ display: 'inline', marginRight: '0.25rem' }} />
                        Location *
                      </label>
                      <input
                        type="text"
                        name="location"
                        value={formData.location}
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
                        name="category"
                        value={formData.category}
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
                          <option key={cat} value={cat.toLowerCase()}>{cat}</option>
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
                        name="experience"
                        value={formData.experience}
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
                        {experienceLevels.map(exp => (
                          <option key={exp} value={exp}>{exp}</option>
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
                          name="salary"
                          value={formData.salary}
                          onChange={handleInputChange}
                          placeholder="e.g. $80,000 - $120,000"
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
                        name="description"
                        value={formData.description}
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
                        name="requirements"
                        value={formData.requirements}
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
                        name="benefits"
                        value={formData.benefits}
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
                        name="skills"
                        value={formData.skills}
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
                        {formData.company || 'Company Name'}
                      </p>
                      <p style={{ color: 'var(--text-muted)', margin: 0 }}>
                        <MapPin size={16} style={{ display: 'inline', marginRight: '0.5rem' }} />
                        {formData.location || 'Location'}
                      </p>
                      <p style={{ color: 'var(--text-muted)', margin: 0 }}>
                        <Clock size={16} style={{ display: 'inline', marginRight: '0.5rem' }} />
                        {formData.jobType || 'Job Type'} • {formData.experience || 'Experience Level'}
                      </p>
                      {formData.salary && (
                        <p style={{ color: 'var(--success-color)', margin: 0, fontWeight: '500' }}>
                          <DollarSign size={16} style={{ display: 'inline', marginRight: '0.5rem' }} />
                          {formData.salary}
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
                    disabled={isSubmitting}
                    style={{
                      padding: '0.75rem 2rem',
                      background: isSubmitting ? 'var(--highlight-bg)' : 'linear-gradient(45deg, var(--success-color), #22c55e)',
                      border: 'none',
                      borderRadius: '8px',
                      color: isSubmitting ? 'var(--text-muted)' : '#fff',
                      fontSize: '1rem',
                      fontWeight: '600',
                      cursor: isSubmitting ? 'not-allowed' : 'pointer',
                      transition: 'all 0.3s ease',
                      boxShadow: isSubmitting ? 'none' : '0 4px 15px rgba(74, 222, 128, 0.3)',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.5rem'
                    }}
                    onMouseOver={(e) => {
                      if (!isSubmitting) {
                        e.target.style.transform = 'translateY(-2px)';
                        e.target.style.boxShadow = '0 6px 20px rgba(74, 222, 128, 0.4)';
                      }
                    }}
                    onMouseOut={(e) => {
                      if (!isSubmitting) {
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
                      {formData.company || 'Company Name'}
                    </span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <MapPin size={16} color="var(--gold-light)" />
                    <span style={{ color: 'var(--text-muted)' }}>
                      {formData.location || 'Location'}
                    </span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <Clock size={16} color="var(--gold-light)" />
                    <span style={{ color: 'var(--text-muted)' }}>
                      {formData.jobType || 'Job Type'}
                    </span>
                  </div>
                  {formData.salary && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <DollarSign size={16} color="var(--success-color)" />
                      <span style={{ color: 'var(--success-color)', fontWeight: '500' }}>
                        {formData.salary}
                      </span>
                    </div>
                  )}
                </div>

                {formData.description && (
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
                      {formData.description.substring(0, 200)}
                      {formData.description.length > 200 && '...'}
                    </p>
                  </div>
                )}

                {formData.skills && (
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
                      {formData.skills.split(',').map((skill, index) => (
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

        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
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