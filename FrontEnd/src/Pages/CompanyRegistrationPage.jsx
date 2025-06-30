import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Building, MapPin, Globe, Mail, Phone, Linkedin, Twitter, Calendar, Users, Award, DollarSign, ArrowRight, CheckCircle, AlertCircle } from 'lucide-react';
import Navbar from '../Components/Navbar';
import Footer from '../Components/Footer';

const CompanyRegistrationPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Pre-fill company name if coming from job posting
  const prefillCompany = location.state?.prefillCompany || '';

  const [formData, setFormData] = useState({
    name: prefillCompany,
    logo: '🏢',
    industry: '',
    size: '',
    location: '',
    description: '',
    website: '',
    contactEmail: '',
    contactPhone: '',
    linkedin: '',
    twitter: '',
    foundedYear: '',
    headquarters: '',
    totalEmployees: '',
    topBenefits: '',
    salaryRange: {
      min: '',
      max: '',
      currency: 'USD'
    },
    hiringUrgency: 'medium'
  });

  const industries = [
    'Technology', 'Healthcare', 'Finance', 'Education', 'Energy', 
    'Retail', 'Agriculture', 'Manufacturing', 'Consulting', 'Media', 
    'Transportation', 'Real Estate', 'Other'
  ];

  const companySizes = ['1-50', '50-100', '100-200', '200-500', '500-1000', '1000+'];
  const currencies = ['USD', 'EUR', 'GBP', 'INR', 'CAD', 'AUD'];
  const hiringUrgencies = [
    { value: 'low', label: 'Low - Occasional hiring' },
    { value: 'medium', label: 'Medium - Regular hiring' },
    { value: 'high', label: 'High - Actively hiring' }
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    setError('');
  };

  const handleSalaryChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      salaryRange: {
        ...prev.salaryRange,
        [field]: value
      }
    }));
  };

  const validateStep = (step) => {
    switch (step) {
      case 1:
        return formData.name && formData.industry && formData.size && formData.location;
      case 2:
        return formData.description && formData.contactEmail;
      case 3:
        return true; // Optional fields
      default:
        return true;
    }
  };

  const nextStep = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(prev => Math.min(prev + 1, 3));
    } else {
      setError('Please fill in all required fields');
    }
  };

  const prevStep = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate all required fields before submission
    if (!isFormComplete()) {
      setError('Please fill in all required fields before submitting');
      return;
    }
    
    setIsSubmitting(true);
    setError('');

    try {
      // Prepare data for submission
      const submitData = {
        ...formData,
        totalEmployees: formData.totalEmployees ? parseInt(formData.totalEmployees) : undefined,
        foundedYear: formData.foundedYear ? parseInt(formData.foundedYear) : undefined,
        salaryRange: {
          min: formData.salaryRange.min ? parseInt(formData.salaryRange.min) : undefined,
          max: formData.salaryRange.max ? parseInt(formData.salaryRange.max) : undefined,
          currency: formData.salaryRange.currency
        },
        topBenefits: formData.topBenefits ? formData.topBenefits.split(',').map(s => s.trim()) : []
      };

      const response = await fetch('http://localhost:5000/api/companies/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(submitData)
      });

      const result = await response.json();

      if (response.ok) {
        setSuccess(result.message);
        setTimeout(() => {
          // Navigate back to job posting if they came from there
          if (location.state?.prefillCompany) {
            navigate('/postjob', { 
              state: { 
                fromRegistration: true,
                registeredCompany: result.data.company.name 
              } 
            });
          } else {
            navigate('/companies');
          }
        }, 3000);
      } else {
        setError(result.message || 'Failed to register company');
      }
    } catch (error) {
      console.error('Error registering company:', error);
      setError('Failed to register company. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleKeyDown = (e) => {
    // Prevent form submission on Enter key
    if (e.key === 'Enter') {
      e.preventDefault();
    }
  };

  // Helper function to check if all required fields are filled
  const isFormComplete = () => {
    const requiredFields = [
      formData.name,
      formData.industry,
      formData.size,
      formData.location,
      formData.description,
      formData.contactEmail
    ];
    return requiredFields.every(field => field && field.trim() !== '');
  };

  const StepIndicator = () => (
    <div className="step-indicator">
      {[1, 2, 3].map(step => (
        <div key={step} className={`step ${step <= currentStep ? 'active' : ''}`}>
          <div className="step-number">{step}</div>
          <div className="step-label">
            {step === 1 ? 'Basic Info' : step === 2 ? 'Description' : 'Additional Details'}
          </div>
        </div>
      ))}
    </div>
  );

  return (
    <div className="company-registration-container">
      <Navbar />
      
      <style>{`
        .company-registration-container {
          min-height: 100vh;
          background: linear-gradient(135deg, #0f2027, #203a43, #2c5364);
          color: #f5f5f5;
          font-family: 'Arial', sans-serif;
        }

        .registration-header {
          text-align: center;
          padding: 100px 24px 60px;
        }

        .registration-header h1 {
          font-size: 3rem;
          font-weight: 900;
          margin-bottom: 16px;
          background: linear-gradient(135deg, #fcd29f, #d4a056);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .registration-header p {
          font-size: 1.1rem;
          color: #ccc;
          max-width: 600px;
          margin: 0 auto;
        }

        .registration-form {
          max-width: 800px;
          margin: 0 auto;
          padding: 0 24px 60px;
        }

        .form-card {
          background: rgba(255, 255, 255, 0.08);
          backdrop-filter: blur(20px);
          border-radius: 20px;
          padding: 40px;
          border: 1px solid rgba(255, 255, 255, 0.12);
        }

        .step-indicator {
          display: flex;
          justify-content: center;
          margin-bottom: 40px;
          gap: 40px;
        }

        .step {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 8px;
          opacity: 0.5;
          transition: opacity 0.3s ease;
        }

        .step.active {
          opacity: 1;
        }

        .step-number {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          background: #d4a056;
          color: white;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: bold;
        }

        .step-label {
          font-size: 14px;
          color: #ccc;
        }

        .form-section {
          display: none;
        }

        .form-section.active {
          display: block;
        }

        .form-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 20px;
          margin-bottom: 30px;
        }

        .form-group {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .form-group.full-width {
          grid-column: 1 / -1;
        }

        .form-group label {
          display: block;
          margin-bottom: 8px;
          font-weight: 600;
          color: #f5f5f5;
          font-size: 14px;
        }

        .form-group label.required::after {
          content: " *";
          color: #ff6b6b;
        }

        .form-input,
        .form-select,
        .form-textarea {
          padding: 12px 16px;
          background: rgba(255, 255, 255, 0.1);
          border: 1px solid rgba(255, 255, 255, 0.2);
          border-radius: 8px;
          color: #f5f5f5;
          font-size: 14px;
          transition: all 0.3s ease;
        }

        .form-input:focus,
        .form-select:focus,
        .form-textarea:focus {
          outline: none;
          border-color: #d4a056;
          background: rgba(255, 255, 255, 0.15);
          box-shadow: 0 0 0 2px rgba(212, 160, 86, 0.2);
        }

        .form-input::placeholder,
        .form-textarea::placeholder {
          color: rgba(245, 245, 245, 0.6);
        }

        .form-select option {
          background: #2c5364;
          color: #f5f5f5;
        }

        .form-textarea {
          resize: vertical;
          min-height: 100px;
        }

        .salary-range {
          display: grid;
          grid-template-columns: 1fr 1fr 1fr;
          gap: 10px;
        }

        .form-actions {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-top: 40px;
        }

        .btn {
          padding: 12px 24px;
          border: none;
          border-radius: 8px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .btn-secondary {
          background: rgba(255, 255, 255, 0.1);
          color: #f5f5f5;
          border: 1px solid rgba(255, 255, 255, 0.2);
        }

        .btn-secondary:hover {
          background: rgba(255, 255, 255, 0.2);
        }

        .btn-primary {
          background: #d4a056;
          color: white;
        }

        .btn-primary:hover {
          background: #b8944a;
        }

        .btn:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        .error-message {
          background: rgba(239, 68, 68, 0.1);
          border: 1px solid rgba(239, 68, 68, 0.3);
          color: #ef4444;
          padding: 12px;
          border-radius: 8px;
          margin-bottom: 20px;
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .success-message {
          background: rgba(74, 222, 128, 0.1);
          border: 1px solid rgba(74, 222, 128, 0.3);
          color: #4ade80;
          padding: 12px;
          border-radius: 8px;
          margin-bottom: 20px;
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .required {
          color: #ef4444;
        }

        @media (max-width: 768px) {
          .form-grid {
            grid-template-columns: 1fr;
          }

          .salary-range {
            grid-template-columns: 1fr;
          }

          .step-indicator {
            gap: 20px;
          }

          .form-card {
            padding: 20px;
          }
        }
      `}</style>

      <div className="registration-header">
        <h1>Register Your Company</h1>
        <p>Join thousands of companies already using WorkVerse to find top talent</p>
        
        {prefillCompany && (
          <div style={{
            marginTop: '1rem',
            padding: '1rem',
            background: 'rgba(212, 160, 86, 0.1)',
            border: '1px solid rgba(212, 160, 86, 0.3)',
            borderRadius: '8px',
            maxWidth: '600px',
            margin: '1rem auto 0'
          }}>
            <div style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: '0.5rem',
              color: '#d4a056',
              fontWeight: '600',
              marginBottom: '0.5rem'
            }}>
              <Building size={16} />
              Welcome from Job Posting!
            </div>
            <p style={{ 
              color: '#ccc', 
              fontSize: '0.9rem',
              margin: 0
            }}>
              We noticed you're trying to post a job for <strong>{prefillCompany}</strong>. 
              Registering your company first will give you better visibility and credibility. 
              After registration, you'll be redirected back to complete your job posting.
            </p>
          </div>
        )}
      </div>

      <div className="registration-form">
        <div className="form-card">
          <StepIndicator />

          {error && (
            <div className="error-message">
              <AlertCircle size={16} />
              {error}
            </div>
          )}

          {success && (
            <div className="success-message">
              <CheckCircle size={16} />
              {success}
            </div>
          )}

          <form onSubmit={handleSubmit} onKeyDown={handleKeyDown}>
            {/* Step 1: Basic Information */}
            <div className={`form-section ${currentStep === 1 ? 'active' : ''}`}>
              <div className="form-grid">
                <div className="form-group">
                  <label className="form-label">
                    <Building size={16} />
                    Company Name <span className="required">*</span>
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="form-input"
                    placeholder="Enter company name"
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">
                    Industry <span className="required">*</span>
                  </label>
                  <select
                    name="industry"
                    value={formData.industry}
                    onChange={handleInputChange}
                    className="form-select"
                    required
                  >
                    <option value="">Select Industry</option>
                    {industries.map(industry => (
                      <option key={industry} value={industry}>{industry}</option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">
                    Company Size <span className="required">*</span>
                  </label>
                  <select
                    name="size"
                    value={formData.size}
                    onChange={handleInputChange}
                    className="form-select"
                    required
                  >
                    <option value="">Select Size</option>
                    {companySizes.map(size => (
                      <option key={size} value={size}>{size} employees</option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">
                    <MapPin size={16} />
                    Location <span className="required">*</span>
                  </label>
                  <input
                    type="text"
                    name="location"
                    value={formData.location}
                    onChange={handleInputChange}
                    className="form-input"
                    placeholder="City, State"
                    required
                  />
                </div>
              </div>
            </div>

            {/* Step 2: Description */}
            <div className={`form-section ${currentStep === 2 ? 'active' : ''}`}>
              <div className="form-group full-width">
                <label className="form-label">
                  Company Description <span className="required">*</span>
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  className="form-textarea"
                  placeholder="Describe your company, mission, and what makes you unique..."
                  required
                />
              </div>

              <div className="form-grid">
                <div className="form-group">
                  <label className="form-label">
                    <Mail size={16} />
                    Contact Email <span className="required">*</span>
                  </label>
                  <input
                    type="email"
                    name="contactEmail"
                    value={formData.contactEmail}
                    onChange={handleInputChange}
                    className="form-input"
                    placeholder="careers@company.com"
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">
                    <Globe size={16} />
                    Website
                  </label>
                  <input
                    type="text"
                    name="website"
                    value={formData.website}
                    onChange={handleInputChange}
                    className="form-input"
                    placeholder="example.com or https://example.com"
                  />
                </div>
              </div>
            </div>

            {/* Step 3: Additional Details */}
            <div className={`form-section ${currentStep === 3 ? 'active' : ''}`}>
              <div className="form-grid">
                <div className="form-group">
                  <label className="form-label">
                    <Phone size={16} />
                    Contact Phone
                  </label>
                  <input
                    type="tel"
                    name="contactPhone"
                    value={formData.contactPhone}
                    onChange={handleInputChange}
                    className="form-input"
                    placeholder="+1 (555) 123-4567"
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">
                    <Calendar size={16} />
                    Founded Year
                  </label>
                  <input
                    type="number"
                    name="foundedYear"
                    value={formData.foundedYear}
                    onChange={handleInputChange}
                    className="form-input"
                    placeholder="2020"
                    min="1800"
                    max={new Date().getFullYear()}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">
                    <Users size={16} />
                    Total Employees
                  </label>
                  <input
                    type="number"
                    name="totalEmployees"
                    value={formData.totalEmployees}
                    onChange={handleInputChange}
                    className="form-input"
                    placeholder="100"
                    min="1"
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">
                    Hiring Urgency
                  </label>
                  <select
                    name="hiringUrgency"
                    value={formData.hiringUrgency}
                    onChange={handleInputChange}
                    className="form-select"
                  >
                    {hiringUrgencies.map(urgency => (
                      <option key={urgency.value} value={urgency.value}>
                        {urgency.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="form-group full-width">
                <label className="form-label">
                  Top Benefits (comma-separated)
                </label>
                <input
                  type="text"
                  name="topBenefits"
                  value={formData.topBenefits}
                  onChange={handleInputChange}
                  className="form-input"
                  placeholder="Remote Work, Stock Options, Health Insurance, Learning Budget"
                />
              </div>

              <div className="form-group full-width">
                <label className="form-label">
                  <DollarSign size={16} />
                  Salary Range
                </label>
                <div className="salary-range">
                  <input
                    type="number"
                    placeholder="Min Salary"
                    value={formData.salaryRange.min}
                    onChange={(e) => handleSalaryChange('min', e.target.value)}
                    className="form-input"
                    min="0"
                  />
                  <input
                    type="number"
                    placeholder="Max Salary"
                    value={formData.salaryRange.max}
                    onChange={(e) => handleSalaryChange('max', e.target.value)}
                    className="form-input"
                    min="0"
                  />
                  <select
                    value={formData.salaryRange.currency}
                    onChange={(e) => handleSalaryChange('currency', e.target.value)}
                    className="form-select"
                  >
                    {currencies.map(currency => (
                      <option key={currency} value={currency}>{currency}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            <div className="form-actions">
              {currentStep > 1 && (
                <button
                  type="button"
                  onClick={prevStep}
                  className="btn btn-secondary"
                >
                  Previous
                </button>
              )}

              {prefillCompany && (
                <button
                  type="button"
                  onClick={() => navigate('/postjob')}
                  className="btn btn-secondary"
                  style={{ marginRight: 'auto' }}
                >
                  ← Back to Job Posting
                </button>
              )}

              {currentStep < 3 ? (
                <button
                  type="button"
                  onClick={nextStep}
                  className="btn btn-primary"
                >
                  Next
                  <ArrowRight size={16} />
                </button>
              ) : (
                <button
                  type="submit"
                  disabled={isSubmitting || !isFormComplete()}
                  className="btn btn-primary"
                >
                  {isSubmitting ? 'Registering...' : !isFormComplete() ? 'Complete All Fields' : 'Register Company'}
                  <ArrowRight size={16} />
                </button>
              )}
            </div>
          </form>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default CompanyRegistrationPage; 