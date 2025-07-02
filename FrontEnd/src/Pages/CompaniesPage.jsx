import React, { useState, useEffect } from 'react';
import { Search, MapPin, Users, Star, Globe, Calendar, Filter, Grid, List, Award, TrendingUp, Clock, Building, ArrowRight, ChevronDown, Heart, Share2, Bookmark, Briefcase } from 'lucide-react';
import Navbar from '../Components/Navbar';
import Footer from '../Components/Footer';
import { useNavigate } from 'react-router-dom';

const CompaniesPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedIndustry, setSelectedIndustry] = useState('all');
  const [selectedSize, setSelectedSize] = useState('all');
  const [selectedLocation, setSelectedLocation] = useState('all');
  const [viewMode, setViewMode] = useState('grid');
  const [sortBy, setSortBy] = useState('featured');
  const [savedCompanies, setSavedCompanies] = useState(new Set());
  
  // New state for dynamic data
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    total: 0,
    hasNext: false,
    hasPrev: false
  });

  const navigate = useNavigate();

  // Fetch companies from API
  const fetchCompanies = async () => {
    try {
      setLoading(true);
      setError('');
      
      // Build query parameters
      const params = new URLSearchParams({
        page: pagination.currentPage,
        limit: 12,
        sortBy: sortBy
      });

      if (searchTerm) params.append('search', searchTerm);
      if (selectedIndustry !== 'all') params.append('industry', selectedIndustry);
      if (selectedSize !== 'all') params.append('size', selectedSize);
      if (selectedLocation !== 'all') params.append('location', selectedLocation);

      const response = await fetch(`http://localhost:5000/api/companies?${params}`);
      const result = await response.json();

      if (response.ok) {
        setCompanies(result.data.companies);
        setPagination(result.data.pagination);
        console.log('Companies fetched successfully:', result.data.companies.length, 'companies');
      } else {
        console.error('Failed to fetch companies:', result.message);
        setError('Failed to load companies');
      }
    } catch (error) {
      console.error('Error fetching companies:', error);
      setError('Failed to load companies');
    } finally {
      setLoading(false);
    }
  };

  // Fetch companies on component mount and when filters change
  useEffect(() => {
    fetchCompanies();
  }, [searchTerm, selectedIndustry, selectedSize, selectedLocation, sortBy, pagination.currentPage]);

  // Format salary range for display
  const formatSalaryRange = (company) => {
    if (!company.salaryRange || (!company.salaryRange.min && !company.salaryRange.max)) {
      return 'Salary not disclosed';
    }
    
    const currencySymbols = {
      'USD': '$',
      'EUR': '€',
      'GBP': '£',
      'INR': '₹',
      'CAD': 'C$',
      'AUD': 'A$'
    };
    
    const symbol = currencySymbols[company.salaryRange.currency] || company.salaryRange.currency;
    
    if (company.salaryRange.min === company.salaryRange.max) {
      return `${symbol}${company.salaryRange.min.toLocaleString()}`;
    }
    
    return `${symbol}${company.salaryRange.min.toLocaleString()} - ${symbol}${company.salaryRange.max.toLocaleString()}`;
  };

  const industries = ['all', 'Technology', 'Healthcare', 'Finance', 'Education', 'Energy', 'Retail', 'Agriculture', 'Manufacturing', 'Consulting', 'Media', 'Transportation', 'Real Estate', 'Other'];
  const companySizes = ['all', '1-50', '50-100', '100-200', '200-500', '500-1000', '1000+'];
  const locations = ['all', 'San Francisco, CA', 'Austin, TX', 'Boston, MA', 'New York, NY', 'Seattle, WA', 'Denver, CO', 'Los Angeles, CA', 'Chicago, IL'];
  const sortOptions = [
    { value: 'featured', label: 'Featured First' },
    { value: 'rating', label: 'Highest Rated' },
    { value: 'jobs', label: 'Most Jobs' },
    { value: 'trending', label: 'Trending' }
  ];

  const toggleSaveCompany = (companyId) => {
    const newSaved = new Set(savedCompanies);
    if (newSaved.has(companyId)) {
      newSaved.delete(companyId);
    } else {
      newSaved.add(companyId);
    }
    setSavedCompanies(newSaved);
  };

  const CompanyCard = ({ company, index }) => (
    <div 
      className={`company-card ${company.featured ? 'featured-card' : ''}`}
      style={{ animationDelay: `${index * 0.1}s` }}
    >
      {/* Quick badges */}
      <div className="card-badges">
        {company.featured && <span className="badge featured">Featured</span>}
        {company.trending && <span className="badge trending">Trending</span>}
        {company.verified && <span className="badge verified">✓</span>}
      </div>

      {/* Save button */}
      <button 
        className={`save-btn ${savedCompanies.has(company._id) ? 'saved' : ''}`}
        onClick={() => toggleSaveCompany(company._id)}
      >
        <Heart size={16} fill={savedCompanies.has(company._id) ? "currentColor" : "none"} />
      </button>

      {/* Company logo and basic info */}
      <div className="company-header">
        <div className="company-logo">{company.logo}</div>
        <div className="company-info">
          <h3 className="company-name">{company.name}</h3>
          <div className="company-meta">
            <span className="industry">{company.industry}</span>
            <span className="size">{company.size} employees</span>
          </div>
        </div>
      </div>

      {/* Rating and reviews */}
      <div className="rating-section">
        <div className="stars">
          {[...Array(5)].map((_, i) => (
            <Star 
              key={i} 
              size={14} 
              fill={i < Math.floor(company.rating) ? "currentColor" : "none"} 
            />
          ))}
        </div>
        <span className="rating-text">{company.rating} ({company.reviewCount} reviews)</span>
      </div>

      {/* Description */}
      <p className="company-description">{company.description}</p>

      {/* Location and website */}
      <div className="company-details">
        <div className="location">
          <MapPin size={14} />
          {company.location}
        </div>
        {company.website && (
          <div className="website">
            <Globe size={14} />
            {company.website}
          </div>
        )}
      </div>

      {/* Benefits */}
      {company.topBenefits && company.topBenefits.length > 0 && (
        <div className="benefits">
          <h4>Top Benefits</h4>
          <div className="benefits-list">
            {company.topBenefits.slice(0, 3).map((benefit, idx) => (
              <span key={idx} className="benefit-tag">{benefit}</span>
            ))}
            {company.topBenefits.length > 3 && (
              <span className="benefit-tag">+{company.topBenefits.length - 3} more</span>
            )}
          </div>
        </div>
      )}

      {/* Job info and salary */}
      <div className="job-info">
        <div className="open-jobs">
          <Briefcase size={14} />
          {company.openJobs} open jobs
        </div>
        <div className="salary-range">
          {formatSalaryRange(company)}
        </div>
      </div>

      {/* Action buttons */}
      <div className="card-actions">
        <button
          className="apply-btn"
          onClick={() => navigate(`/jobs?company=${encodeURIComponent(company.name)}`)}
        >
          View Jobs
        </button>
        <button className="view-company-btn">
          View Company
        </button>
      </div>
    </div>
  );

  return (
    <div className="companies-container">
        <Navbar/>
      <style>{`
        :root {
          --primary-bg: linear-gradient(135deg, #0f2027, #203a43, #2c5364);
          --card-bg: rgba(255, 255, 255, 0.08);
          --card-border: rgba(255, 255, 255, 0.12);
          --text-light: #f5f5f5;
          --text-muted: #ccc;
          --gold-light: #fcd29f;
          --gold-dark: #d4a056;
          --success-color: #4ade80;
          --error-color: #ef4444;
          --warning-color: #f59e0b;
          --info-color: #3b82f6;
          --box-shadow: rgba(0, 0, 0, 0.3);
        }

        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }

        .companies-container {
          min-height: 100vh;
          background: var(--primary-bg);
          color: var(--text-light);
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
          line-height: 1.6;
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

        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translateX(-20px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        .header {
          padding: 120px 24px 80px;
          text-align: center;
          animation: fadeInUp 0.8s ease-out;
          background: linear-gradient(135deg, rgba(252, 210, 159, 0.05), rgba(212, 160, 86, 0.02));
          border-bottom: 1px solid rgba(255, 255, 255, 0.08);
        }

        .header h1 {
          font-size: clamp(2.5rem, 5vw, 4rem);
          font-weight: 900;
          margin-bottom: 20px;
          background: linear-gradient(135deg, var(--gold-light), var(--gold-dark));
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          letter-spacing: -0.02em;
        }

        .header p {
          font-size: 1.2rem;
          color: var(--text-muted);
          max-width: 700px;
          margin: 0 auto 40px;
          line-height: 1.7;
          font-weight: 400;
        }

        .header-stats {
          display: flex;
          justify-content: center;
          gap: 48px;
          flex-wrap: wrap;
          margin-top: 40px;
        }

        .header-stat {
          text-align: center;
          padding: 20px;
          background: rgba(255, 255, 255, 0.05);
          border-radius: 16px;
          border: 1px solid rgba(255, 255, 255, 0.1);
          min-width: 120px;
          transition: all 0.3s ease;
        }

        .header-stat:hover {
          transform: translateY(-2px);
          background: rgba(255, 255, 255, 0.08);
          border-color: rgba(252, 210, 159, 0.3);
        }

        .header-stat-number {
          font-size: 2.5rem;
          font-weight: 800;
          color: var(--gold-light);
          display: block;
          margin-bottom: 8px;
        }

        .header-stat-label {
          font-size: 0.9rem;
          color: var(--text-muted);
          font-weight: 500;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .filters-container {
          padding: 40px 24px;
          margin-bottom: 40px;
        }

        .filters-wrapper {
          max-width: 1400px;
          margin: 0 auto;
        }

        .filters-card {
          background: var(--card-bg);
          backdrop-filter: blur(20px);
          border-radius: 24px;
          padding: 32px;
          border: 1px solid var(--card-border);
          box-shadow: 0 8px 32px var(--box-shadow);
          animation: slideIn 0.6s ease-out;
        }

        .filters-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 28px;
          flex-wrap: wrap;
          gap: 16px;
        }

        .filters-title {
          font-size: 1.4rem;
          font-weight: 700;
          display: flex;
          align-items: center;
          gap: 12px;
          color: var(--gold-light);
        }

        .results-count {
          color: var(--text-muted);
          font-weight: 500;
          background: rgba(255, 255, 255, 0.05);
          padding: 8px 16px;
          border-radius: 20px;
          font-size: 0.9rem;
        }

        .filters-grid {
          display: grid;
          grid-template-columns: 2fr 1fr 1fr 1fr;
          gap: 20px;
          margin-bottom: 24px;
        }

        .search-input {
          position: relative;
        }

        .search-input svg {
          position: absolute;
          left: 16px;
          top: 50%;
          transform: translateY(-50%);
          color: var(--text-muted);
          z-index: 1;
        }

        .search-input input,
        .filter-select {
          width: 100%;
          padding: 16px 20px 16px 48px;
          background: rgba(255, 255, 255, 0.08);
          border: 2px solid rgba(255, 255, 255, 0.1);
          border-radius: 16px;
          color: var(--text-light);
          font-size: 15px;
          font-weight: 500;
          transition: all 0.3s ease;
        }

        .filter-select {
          padding-left: 20px;
          cursor: pointer;
          appearance: none;
          background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%23ccc' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='m6 8 4 4 4-4'/%3e%3c/svg%3e");
          background-repeat: no-repeat;
          background-position: right 16px center;
          background-size: 16px;
        }

        .search-input input::placeholder {
          color: var(--text-muted);
          font-weight: 400;
        }

        .search-input input:focus,
        .filter-select:focus {
          outline: none;
          border-color: var(--gold-light);
          background: rgba(255, 255, 255, 0.12);
          box-shadow: 0 0 0 4px rgba(252, 210, 159, 0.1);
        }

        .filter-select option {
          background: #1a202c;
          color: var(--text-light);
          padding: 12px;
        }

        .filters-secondary {
          display: flex;
          justify-content: space-between;
          align-items: center;
          flex-wrap: wrap;
          gap: 20px;
          padding-top: 20px;
          border-top: 1px solid rgba(255, 255, 255, 0.1);
        }

        .sort-container {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .sort-label {
          color: var(--text-muted);
          font-size: 0.9rem;
          font-weight: 500;
        }

        .sort-select {
          padding: 10px 16px;
          background: rgba(255, 255, 255, 0.08);
          border: 2px solid rgba(255, 255, 255, 0.1);
          border-radius: 12px;
          color: var(--text-light);
          cursor: pointer;
          font-weight: 500;
          transition: all 0.3s ease;
        }

        .sort-select:focus {
          outline: none;
          border-color: var(--gold-light);
          box-shadow: 0 0 0 3px rgba(252, 210, 159, 0.1);
        }

        .view-toggle {
          display: flex;
          gap: 4px;
          background: rgba(255, 255, 255, 0.08);
          padding: 6px;
          border-radius: 12px;
          border: 1px solid rgba(255, 255, 255, 0.1);
        }

        .view-btn {
          padding: 10px 14px;
          border-radius: 8px;
          border: none;
          cursor: pointer;
          transition: all 0.3s ease;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 500;
        }

        .view-btn.active {
          background: var(--gold-light);
          color: #0f2027;
          box-shadow: 0 4px 12px rgba(252, 210, 159, 0.3);
        }

        .view-btn:not(.active) {
          background: transparent;
          color: var(--text-muted);
        }

        .view-btn:hover:not(.active) {
          background: rgba(255, 255, 255, 0.1);
          color: var(--text-light);
        }

        .companies-section {
          padding: 0 24px 80px;
        }

        .companies-wrapper {
          max-width: 1400px;
          margin: 0 auto;
        }

        .companies-grid {
          display: grid;
          gap: 28px;
          animation: fadeInUp 0.8s ease-out;
        }

        .companies-grid.grid-view {
          grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
        }

        .companies-grid.list-view {
          grid-template-columns: 1fr;
        }

        .company-card {
          position: relative;
          background: var(--card-bg);
          backdrop-filter: blur(20px);
          border: 1px solid var(--card-border);
          border-radius: 20px;
          padding: 28px;
          transition: all 0.4s ease;
          cursor: pointer;
          animation: fadeInUp 0.6s ease-out both;
          overflow: hidden;
        }

        .company-card::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 3px;
          background: linear-gradient(90deg, var(--gold-light), var(--gold-dark));
          opacity: 0;
          transition: opacity 0.3s ease;
        }

        .company-card:hover {
          transform: translateY(-6px);
          box-shadow: 0 24px 48px var(--box-shadow);
          border-color: rgba(252, 210, 159, 0.3);
        }

        .company-card:hover::before {
          opacity: 1;
        }

        .company-card.featured-card {
          background: linear-gradient(135deg, rgba(252, 210, 159, 0.08), rgba(212, 160, 86, 0.04));
          border-color: rgba(252, 210, 159, 0.25);
        }

        .company-card.featured-card::before {
          opacity: 1;
        }

        .card-badges {
          position: absolute;
          top: 20px;
          left: 20px;
          display: flex;
          gap: 8px;
          z-index: 2;
        }

        .badge {
          padding: 6px 12px;
          border-radius: 20px;
          font-size: 0.75rem;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
        }

        .badge.featured {
          background: linear-gradient(135deg, var(--gold-light), var(--gold-dark));
          color: #0f2027;
        }

        .badge.trending {
          background: linear-gradient(135deg, var(--info-color), #1d4ed8);
          color: white;
        }

        .badge.verified {
          background: linear-gradient(135deg, var(--success-color), #16a34a);
          color: white;
        }

        .save-btn {
          position: absolute;
          top: 20px;
          right: 20px;
          width: 40px;
          height: 40px;
          border-radius: 12px;
          border: none;
          background: rgba(255, 255, 255, 0.1);
          color: var(--text-muted);
          cursor: pointer;
          transition: all 0.3s ease;
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 2;
        }

        .save-btn:hover {
          background: rgba(255, 255, 255, 0.2);
          color: var(--text-light);
          transform: scale(1.1);
        }

        .save-btn.saved {
          background: linear-gradient(135deg, var(--error-color), #dc2626);
          color: white;
          box-shadow: 0 4px 12px rgba(239, 68, 68, 0.3);
        }

        .company-header {
          display: flex;
          align-items: flex-start;
          gap: 20px;
          margin-bottom: 20px;
          margin-top: 30px;
        }

        .company-logo {
          width: 60px;
          height: 60px;
          background: linear-gradient(135deg, rgba(252, 210, 159, 0.2), rgba(212, 160, 86, 0.1));
          border-radius: 16px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1.8rem;
          flex-shrink: 0;
          border: 1px solid rgba(252, 210, 159, 0.2);
        }

        .company-info {
          flex: 1;
          min-width: 0;
        }

        .company-name {
          font-size: 1.4rem;
          font-weight: 700;
          margin-bottom: 8px;
          color: var(--text-light);
          line-height: 1.3;
        }

        .company-meta {
          display: flex;
          align-items: center;
          gap: 12px;
          flex-wrap: wrap;
          margin-bottom: 12px;
        }

        .industry {
          background: rgba(252, 210, 159, 0.15);
          color: var(--gold-light);
          padding: 4px 12px;
          border-radius: 20px;
          font-size: 0.8rem;
          font-weight: 600;
          border: 1px solid rgba(252, 210, 159, 0.2);
        }

        .size {
          color: var(--text-muted);
          font-size: 0.85rem;
          font-weight: 500;
        }

        .rating-section {
          display: flex;
          align-items: center;
          gap: 8px;
          margin-bottom: 16px;
        }

        .stars {
          display: flex;
          gap: 2px;
          color: var(--gold-light);
        }

        .rating-text {
          color: var(--text-muted);
          font-size: 0.85rem;
          font-weight: 500;
        }

        .company-description {
          color: var(--text-muted);
          font-size: 0.95rem;
          line-height: 1.6;
          margin-bottom: 20px;
          display: -webkit-box;
          -webkit-line-clamp: 3;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }

        .company-details {
          display: flex;
          flex-direction: column;
          gap: 8px;
          margin-bottom: 20px;
        }

        .location,
        .website {
          display: flex;
          align-items: center;
          gap: 8px;
          color: var(--text-muted);
          font-size: 0.9rem;
          font-weight: 500;
        }

        .location svg,
        .website svg {
          color: var(--gold-light);
          flex-shrink: 0;
        }

        .benefits {
          margin-bottom: 20px;
        }

        .benefits h4 {
          font-size: 0.9rem;
          font-weight: 600;
          color: var(--gold-light);
          margin-bottom: 8px;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .benefits-list {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
        }

        .benefit-tag {
          padding: 6px 12px;
          background: rgba(255, 255, 255, 0.08);
          border-radius: 16px;
          font-size: 0.8rem;
          color: var(--text-light);
          border: 1px solid rgba(255, 255, 255, 0.1);
          font-weight: 500;
          transition: all 0.3s ease;
        }

        .benefit-tag:hover {
          background: rgba(255, 255, 255, 0.12);
          border-color: rgba(252, 210, 159, 0.3);
        }

        .job-info {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 20px;
          padding: 16px;
          background: rgba(255, 255, 255, 0.05);
          border-radius: 12px;
          border: 1px solid rgba(255, 255, 255, 0.1);
        }

        .open-jobs {
          display: flex;
          align-items: center;
          gap: 6px;
          color: var(--success-color);
          font-weight: 600;
          font-size: 0.9rem;
        }

        .salary-range {
          color: var(--gold-light);
          font-weight: 600;
          font-size: 0.9rem;
        }

        .card-actions {
          display: flex;
          gap: 12px;
        }

        .apply-btn,
        .view-company-btn {
          flex: 1;
          padding: 12px 20px;
          border: none;
          border-radius: 12px;
          font-weight: 600;
          font-size: 0.9rem;
          cursor: pointer;
          transition: all 0.3s ease;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
        }

        .apply-btn {
          background: linear-gradient(135deg, var(--gold-light), var(--gold-dark));
          color: #0f2027;
        }

        .apply-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 20px rgba(252, 210, 159, 0.3);
        }

        .view-company-btn {
          background: rgba(255, 255, 255, 0.1);
          color: var(--text-light);
          border: 1px solid rgba(255, 255, 255, 0.2);
        }

        .view-company-btn:hover {
          background: rgba(255, 255, 255, 0.15);
          border-color: rgba(252, 210, 159, 0.3);
          transform: translateY(-2px);
        }

        /* Loading and empty states */
        .loading-container,
        .empty-container {
          text-align: center;
          padding: 80px 24px;
          animation: fadeInUp 0.8s ease-out;
        }

        .loading-spinner {
          width: 48px;
          height: 48px;
          border: 3px solid rgba(252, 210, 159, 0.3);
          border-top: 3px solid var(--gold-light);
          border-radius: 50%;
          animation: spin 1s linear infinite;
          margin: 0 auto 24px;
        }

        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }

        .empty-title {
          font-size: 1.5rem;
          font-weight: 700;
          color: var(--gold-light);
          margin-bottom: 12px;
        }

        .empty-text {
          color: var(--text-muted);
          font-size: 1rem;
          margin-bottom: 24px;
        }

        /* Pagination */
        .pagination {
          display: flex;
          justify-content: center;
          align-items: center;
          gap: 12px;
          margin-top: 40px;
          padding: 20px;
        }

        .pagination-btn {
          padding: 12px 16px;
          border: 1px solid rgba(255, 255, 255, 0.2);
          background: rgba(255, 255, 255, 0.05);
          color: var(--text-light);
          border-radius: 12px;
          cursor: pointer;
          transition: all 0.3s ease;
          font-weight: 500;
        }

        .pagination-btn:hover:not(:disabled) {
          background: rgba(255, 255, 255, 0.1);
          border-color: var(--gold-light);
        }

        .pagination-btn:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        .pagination-btn.active {
          background: var(--gold-light);
          color: #0f2027;
          border-color: var(--gold-light);
        }

        /* Responsive Design */
        @media (max-width: 1200px) {
          .companies-grid.grid-view {
            grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
          }
        }

        @media (max-width: 768px) {
          .header {
            padding: 80px 16px 60px;
          }

          .header h1 {
            font-size: 2.5rem;
          }

          .header-stats {
            gap: 24px;
          }

          .header-stat {
            min-width: 100px;
            padding: 16px;
          }

          .header-stat-number {
            font-size: 2rem;
          }

          .filters-container {
            padding: 24px 16px;
          }

          .filters-card {
            padding: 24px;
          }

          .filters-grid {
            grid-template-columns: 1fr;
            gap: 16px;
          }

          .filters-secondary {
            flex-direction: column;
            align-items: stretch;
          }

          .sort-container {
            justify-content: center;
          }

          .companies-section {
            padding: 0 16px 60px;
          }

          .companies-grid.grid-view {
            grid-template-columns: 1fr;
          }

          .company-card {
            padding: 24px;
          }

          .company-header {
            gap: 16px;
          }

          .company-logo {
            width: 50px;
            height: 50px;
            font-size: 1.5rem;
          }

          .company-name {
            font-size: 1.2rem;
          }

          .job-info {
            flex-direction: column;
            gap: 12px;
            align-items: flex-start;
          }

          .card-actions {
            flex-direction: column;
          }
        }

        @media (max-width: 480px) {
          .header h1 {
            font-size: 2rem;
          }

          .header p {
            font-size: 1rem;
          }

          .company-card {
            padding: 20px;
          }

          .company-header {
            flex-direction: column;
            align-items: flex-start;
            gap: 12px;
          }

          .company-meta {
            flex-direction: column;
            align-items: flex-start;
            gap: 8px;
          }
        }
      `}</style>

      {/* Header */}
      <div className="header">
        <h1>Discover Amazing Companies</h1>
        <p>
          Find your dream workplace among innovative companies. Explore opportunities and discover cultures that match your values.
        </p>
        <div className="header-stats">
          <div className="header-stat">
            <span className="header-stat-number">500+</span>
            <span className="header-stat-label">Companies</span>
          </div>
          <div className="header-stat">
            <span className="header-stat-number">2,000+</span>
            <span className="header-stat-label">Open Positions</span>
          </div>
          <div className="header-stat">
            <span className="header-stat-number">4.7</span>
            <span className="header-stat-label">Avg Rating</span>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="filters-container">
        <div className="filters-wrapper">
          <div className="filters-card">
            <div className="filters-header">
              <div className="filters-title">
                <Filter size={20} />
                <span>Find Your Perfect Company</span>
              </div>
              <div className="results-count">
                {loading ? 'Loading...' : `${pagination.total} companies found`}
              </div>
            </div>

            <div className="filters-grid">
              <div className="search-input">
                <Search size={16} />
                <input
                  type="text"
                  placeholder="Search companies or keywords..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>

              <select
                className="filter-select"
                value={selectedIndustry}
                onChange={(e) => setSelectedIndustry(e.target.value)}
              >
                {industries.map(industry => (
                  <option key={industry} value={industry}>
                    {industry === 'all' ? 'All Industries' : industry}
                  </option>
                ))}
              </select>

              <select
                className="filter-select"
                value={selectedSize}
                onChange={(e) => setSelectedSize(e.target.value)}
              >
                {companySizes.map(size => (
                  <option key={size} value={size}>
                    {size === 'all' ? 'All Sizes' : `${size} employees`}
                  </option>
                ))}
              </select>

              <select
                className="filter-select"
                value={selectedLocation}
                onChange={(e) => setSelectedLocation(e.target.value)}
              >
                {locations.map(location => (
                  <option key={location} value={location}>
                    {location === 'all' ? 'All Locations' : location}
                  </option>
                ))}
              </select>
            </div>

            <div className="filters-secondary">
              <div className="sort-container">
                <span className="sort-label">Sort by:</span>
                <select
                  className="sort-select"
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                >
                  {sortOptions.map(option => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>

              <div className="view-toggle">
                <button
                  className={`view-btn ${viewMode === 'grid' ? 'active' : ''}`}
                  onClick={() => setViewMode('grid')}
                >
                    
                  <Grid size={16} />
                </button>
                <button
                  className={`view-btn ${viewMode === 'list' ? 'active' : ''}`}
                  onClick={() => setViewMode('list')}
                >
                  <List size={16} />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Companies Section */}
      <div className="companies-section">
        <div className="companies-wrapper">
          {loading ? (
            <div className="loading-state">
              <div className="loading-spinner"></div>
              <p>Loading companies...</p>
            </div>
          ) : error ? (
            <div className="error-state">
              <h3>Error loading companies</h3>
              <p>{error}</p>
              <button 
                className="retry-btn"
                onClick={fetchCompanies}
              >
                Try Again
              </button>
            </div>
          ) : companies.length > 0 ? (
            <>
              <div className={`companies-grid ${viewMode}-view`}>
                {companies.map((company, index) => (
                  <CompanyCard key={company._id} company={company} index={index} />
                ))}
              </div>
              
              {/* Pagination */}
              {pagination.totalPages > 1 && (
                <div className="pagination">
                  <button 
                    className="pagination-btn"
                    disabled={!pagination.hasPrev}
                    onClick={() => setPagination(prev => ({ ...prev, currentPage: prev.currentPage - 1 }))}
                  >
                    Previous
                  </button>
                  
                  <div className="page-info">
                    Page {pagination.currentPage} of {pagination.totalPages}
                  </div>
                  
                  <button 
                    className="pagination-btn"
                    disabled={!pagination.hasNext}
                    onClick={() => setPagination(prev => ({ ...prev, currentPage: prev.currentPage + 1 }))}
                  >
                    Next
                  </button>
                </div>
              )}
            </>
          ) : (
            <div className="no-results">
              <h3>No companies found</h3>
              <p>Try adjusting your filters to see more results</p>
              <button 
                className="clear-filters-btn"
                onClick={() => {
                  setSearchTerm('');
                  setSelectedIndustry('all');
                  setSelectedSize('all');
                  setSelectedLocation('all');
                  setPagination(prev => ({ ...prev, currentPage: 1 }));
                }}
              >
                Clear All Filters
              </button>
            </div>
          )}
        </div>
      </div>
      <Footer/>
    </div>
  );
};

export default CompaniesPage;