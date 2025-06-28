import React, { useState, useEffect } from 'react';
import { Search, MapPin, Users, Star, Globe, Calendar, Filter, Grid, List, Award, TrendingUp, Clock, Building, ArrowRight, ChevronDown, Heart, Share2, Bookmark, Briefcase } from 'lucide-react';
import Navbar from '../Components/Navbar';
import Footer from '../Components/Footer';
const CompaniesPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedIndustry, setSelectedIndustry] = useState('all');
  const [selectedSize, setSelectedSize] = useState('all');
  const [selectedLocation, setSelectedLocation] = useState('all');
  const [viewMode, setViewMode] = useState('grid');
  const [sortBy, setSortBy] = useState('featured');
  const [isLoaded, setIsLoaded] = useState(false);
  const [savedCompanies, setSavedCompanies] = useState(new Set());

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  // Streamlined company data
  const companies = [
    {
      id: 1,
      name: "TechNova Solutions",
      logo: "🚀",
      industry: "Technology",
      size: "500-1000",
      location: "San Francisco, CA",
      description: "Leading AI and machine learning solutions provider transforming businesses worldwide",
      rating: 4.8,
      reviewCount: 342,
      openJobs: 25,
      website: "technova.com",
      featured: true,
      verified: true,
      trending: true,
      topBenefits: ["Remote Work", "Stock Options", "Learning Budget"],
      salaryRange: "$80k - $180k",
      hiringUrgency: "high"
    },
    {
      id: 2,
      name: "GreenEnergy Corp",
      logo: "🌱",
      industry: "Energy",
      size: "1000+",
      location: "Austin, TX",
      description: "Renewable energy solutions and sustainability consulting for a greener future",
      rating: 4.6,
      reviewCount: 256,
      openJobs: 18,
      website: "greenenergy.com",
      featured: false,
      verified: true,
      trending: false,
      topBenefits: ["401k Match", "Flexible Hours", "Green Commute"],
      salaryRange: "$70k - $150k",
      hiringUrgency: "medium"
    },
    {
      id: 3,
      name: "MedTech Innovations",
      logo: "🏥",
      industry: "Healthcare",
      size: "200-500",
      location: "Boston, MA",
      description: "Revolutionary medical technology and healthcare solutions saving lives globally",
      rating: 4.9,
      reviewCount: 189,
      openJobs: 32,
      website: "medtech-innov.com",
      featured: true,
      verified: true,
      trending: true,
      topBenefits: ["Premium Healthcare", "Research Time", "Sabbatical"],
      salaryRange: "$90k - $200k",
      hiringUrgency: "high"
    },
    {
      id: 4,
      name: "FinanceFlow",
      logo: "💰",
      industry: "Finance",
      size: "100-200",
      location: "New York, NY",
      description: "Modern financial services and digital banking solutions for the next generation",
      rating: 4.7,
      reviewCount: 423,
      openJobs: 15,
      website: "financeflow.com",
      featured: false,
      verified: true,
      trending: false,
      topBenefits: ["Bonus Structure", "Stock Options", "Gym Membership"],
      salaryRange: "$100k - $250k",
      hiringUrgency: "medium"
    },
    {
      id: 5,
      name: "EduTech Academy",
      logo: "📚",
      industry: "Education",
      size: "50-100",
      location: "Seattle, WA",
      description: "Online learning platforms and educational technology reshaping how we learn",
      rating: 4.5,
      reviewCount: 98,
      openJobs: 12,
      website: "edutech-academy.com",
      featured: false,
      verified: true,
      trending: true,
      topBenefits: ["Learning Budget", "Flexible Schedule", "Home Office"],
      salaryRange: "$60k - $120k",
      hiringUrgency: "low"
    },
    {
      id: 6,
      name: "CloudScale Systems",
      logo: "☁️",
      industry: "Technology",
      size: "200-500",
      location: "Denver, CO",
      description: "Cloud infrastructure and enterprise solutions powering digital transformation",
      rating: 4.8,
      reviewCount: 234,
      openJobs: 28,
      website: "cloudscale.com",
      featured: true,
      verified: true,
      trending: false,
      topBenefits: ["Remote First", "Unlimited PTO", "Tech Stipend"],
      salaryRange: "$85k - $170k",
      hiringUrgency: "high"
    }
  ];

  const industries = ['all', 'Technology', 'Healthcare', 'Finance', 'Education', 'Energy', 'Retail', 'Agriculture'];
  const companySizes = ['all', '1-50', '50-100', '100-200', '200-500', '500-1000', '1000+'];
  const locations = ['all', 'San Francisco, CA', 'Austin, TX', 'Boston, MA', 'New York, NY', 'Seattle, WA', 'Denver, CO'];
  const sortOptions = [
    { value: 'featured', label: 'Featured First' },
    { value: 'rating', label: 'Highest Rated' },
    { value: 'jobs', label: 'Most Jobs' },
    { value: 'trending', label: 'Trending' }
  ];

  const filteredAndSortedCompanies = companies
    .filter(company => {
      const matchesSearch = company.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           company.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           company.industry.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesIndustry = selectedIndustry === 'all' || company.industry === selectedIndustry;
      const matchesSize = selectedSize === 'all' || company.size === selectedSize;
      const matchesLocation = selectedLocation === 'all' || company.location === selectedLocation;
      
      return matchesSearch && matchesIndustry && matchesSize && matchesLocation;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'rating':
          return b.rating - a.rating;
        case 'jobs':
          return b.openJobs - a.openJobs;
        case 'trending':
          return (b.trending ? 1 : 0) - (a.trending ? 1 : 0);
        case 'featured':
        default:
          return (b.featured ? 1 : 0) - (a.featured ? 1 : 0);
      }
    });

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
        className={`save-btn ${savedCompanies.has(company.id) ? 'saved' : ''}`}
        onClick={() => toggleSaveCompany(company.id)}
      >
        <Heart size={16} fill={savedCompanies.has(company.id) ? "currentColor" : "none"} />
      </button>

      {/* Company header */}
      <div className="company-header"style={{marginTop:"3rem"}}>
        <div className="company-logo">{company.logo}</div>
        <div className="company-info">
          <h3 className="company-name">{company.name}</h3>
          <div className="company-location">
            <MapPin size={14} />
            <span>{company.location}</span>
          </div>
        </div>
        <div className={`hiring-status ${company.hiringUrgency}`}>
          <Clock size={14} />
          {company.hiringUrgency === 'high' ? 'Hiring' : 
           company.hiringUrgency === 'medium' ? 'Soon' : 'Open'}
        </div>
      </div>

      {/* Description */}
      <p className="company-description">{company.description}</p>

      {/* Key stats */}
      <div className="stats-row">
        <div className="stat">
          <Star size={16} />
          <span>{company.rating}</span>
          <span className="stat-label">({company.reviewCount})</span>
        </div>
        <div className="stat">
          <Users size={16} />
          <span>{company.size}</span>
        </div>
        <div className="stat">
          <Briefcase size={16} />
          <span>{company.openJobs}</span>
          <span className="stat-label">jobs</span>
        </div>
      </div>

      {/* Benefits */}
      <div className="benefits">
        {company.topBenefits.map((benefit, idx) => (
          <span key={idx} className="benefit-tag">{benefit}</span>
        ))}
      </div>

      {/* Salary and actions */}
      <div className="card-footer">
        <div className="salary">{company.salaryRange}</div>
        <div className="actions">
          <button className="btn-view">View Jobs</button>
          <button className="btn-company">
            <Globe size={16} />
          </button>
        </div>
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
          font-family: 'Arial', sans-serif;
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

        .header {
          padding: 100px 24px 60px;
          text-align: center;
          animation: fadeInUp 0.8s ease-out;
        }

        .header h1 {
          font-size: 3.5rem;
          font-weight: 900;
          margin-bottom: 16px;
          background: linear-gradient(135deg, var(--gold-light), var(--gold-dark));
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .header p {
          font-size: 1.2rem;
          color: var(--text-muted);
          max-width: 600px;
          margin: 0 auto 32px;
          line-height: 1.6;
        }

        .header-stats {
          display: flex;
          justify-content: center;
          gap: 32px;
          flex-wrap: wrap;
        }

        .header-stat {
          text-align: center;
        }

        .header-stat-number {
          font-size: 2rem;
          font-weight: bold;
          color: var(--gold-light);
          display: block;
        }

        .header-stat-label {
          font-size: 0.9rem;
          color: var(--text-muted);
        }

        .filters-container {
          padding: 0 24px;
          margin-bottom: 40px;
        }

        .filters-wrapper {
          max-width: 1400px;
          margin: 0 auto;
        }

        .filters-card {
          background: var(--card-bg);
          backdrop-filter: blur(20px);
          border-radius: 20px;
          padding: 32px;
          border: 1px solid var(--card-border);
        }

        .filters-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 24px;
        }

        .filters-title {
          font-size: 1.3rem;
          font-weight: bold;
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .results-count {
          color: var(--text-muted);
        }

        .filters-grid {
          display: grid;
          grid-template-columns: 2fr 1fr 1fr 1fr;
          gap: 16px;
          margin-bottom: 20px;
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
        }

        .search-input input,
        .filter-select {
          width: 100%;
          padding: 12px 16px 12px 48px;
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 12px;
          color: var(--text-light);
          font-size: 14px;
          transition: all 0.3s ease;
        }

        .filter-select {
          padding-left: 16px;
          cursor: pointer;
        }

        .search-input input::placeholder {
          color: var(--text-muted);
        }

        .search-input input:focus,
        .filter-select:focus {
          outline: none;
          border-color: var(--gold-light);
          background: rgba(255, 255, 255, 0.08);
        }

        .filter-select option {
          background: #2c3e50;
          color: var(--text-light);
        }

        .filters-secondary {
          display: flex;
          justify-content: space-between;
          align-items: center;
          flex-wrap: wrap;
          gap: 16px;
        }

        .sort-container {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .sort-label {
          color: var(--text-muted);
          font-size: 0.9rem;
        }

        .sort-select {
          padding: 8px 12px;
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 8px;
          color: var(--text-light);
          cursor: pointer;
        }

        .view-toggle {
          display: flex;
          gap: 4px;
          background: rgba(255, 255, 255, 0.05);
          padding: 4px;
          border-radius: 8px;
        }

        .view-btn {
          padding: 8px 12px;
          border-radius: 6px;
          border: none;
          cursor: pointer;
          transition: all 0.3s ease;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .view-btn.active {
          background: var(--gold-light);
          color: black;
        }

        .view-btn:not(.active) {
          background: transparent;
          color: var(--text-muted);
        }

        .companies-section {
          padding: 0 24px 60px;
        }

        .companies-wrapper {
          max-width: 1400px;
          margin: 0 auto;
        }

        .companies-grid {
          display: grid;
          gap: 24px;
          animation: fadeInUp 0.8s ease-out;
        }

        .companies-grid.grid-view {
          grid-template-columns: repeat(auto-fit, minmax(380px, 1fr));
        }

        .companies-grid.list-view {
          grid-template-columns: 1fr;
        }

        .company-card {
          position: relative;
          background: var(--card-bg);
          backdrop-filter: blur(20px);
          border: 1px solid var(--card-border);
          border-radius: 16px;
          padding: 24px;
          transition: all 0.3s ease;
          cursor: pointer;
          animation: fadeInUp 0.6s ease-out both;
        }

        .company-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
          border-color: rgba(252, 210, 159, 0.3);
        }

        .company-card.featured-card {
          background: linear-gradient(135deg, rgba(252, 210, 159, 0.1), rgba(212, 160, 86, 0.05));
          border-color: rgba(252, 210, 159, 0.2);
        }

        .card-badges {
          position: absolute;
          top: 16px;
          left: 16px;
          display: flex;
          gap: 6px;
        }

        .badge {
          padding: 4px 8px;
          border-radius: 12px;
          font-size: 0.7rem;
          font-weight: 600;
          text-transform: uppercase;
        }

        .badge.featured {
          background: linear-gradient(135deg, var(--gold-light), var(--gold-dark));
          color: black;
        }

        .badge.trending {
          background: var(--info-color);
          color: white;
        }

        .badge.verified {
          background: var(--success-color);
          color: white;
        }

        .save-btn {
          position: absolute;
          top: 16px;
          right: 16px;
          width: 32px;
          height: 32px;
          border-radius: 8px;
          border: none;
          background: rgba(255, 255, 255, 0.1);
          color: var(--text-muted);
          cursor: pointer;
          transition: all 0.3s ease;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .save-btn:hover {
          background: rgba(255, 255, 255, 0.2);
          color: var(--text-light);
        }

        .save-btn.saved {
          background: var(--error-color);
          color: white;
        }

        .company-header {
          display: flex;
          align-items: flex-start;
          gap: 16px;
          margin-bottom: 16px;
          margin-top: 20px;
        }

        .company-logo {
          width: 48px;
          height: 48px;
          background: rgba(255, 255, 255, 0.1);
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1.5rem;
          flex-shrink: 0;
        }

        .company-info {
          flex: 1;
          min-width: 0;
        }

        .company-name {
          font-size: 1.2rem;
          font-weight: bold;
          margin-bottom: 4px;
          color: var(--text-light);
        }

        .company-location {
          display: flex;
          align-items: center;
          gap: 4px;
          color: var(--text-muted);
          font-size: 0.85rem;
        }

        .hiring-status {
          display: flex;
          align-items: center;
          gap: 4px;
          padding: 4px 8px;
          border-radius: 12px;
          font-size: 0.75rem;
          font-weight: 600;
          white-space: nowrap;
          flex-shrink: 0;
        }

        .hiring-status.high {
          background: var(--error-color);
          color: white;
        }

        .hiring-status.medium {
          background: var(--warning-color);
          color: white;
        }

        .hiring-status.low {
          background: var(--success-color);
          color: white;
        }

        .company-description {
          color: var(--text-muted);
          font-size: 0.9rem;
          line-height: 1.5;
          margin-bottom: 16px;
        }

        .stats-row {
          display: flex;
          gap: 20px;
          margin-bottom: 16px;
          flex-wrap: wrap;
        }

        .stat {
          display: flex;
          align-items: center;
          gap: 6px;
          color: var(--text-muted);
          font-size: 0.85rem;
        }

        .stat svg {
          color: var(--gold-light);
        }

        .stat-label {
          color: var(--text-muted);
          font-size: 0.75rem;
        }

        .benefits {
          display: flex;
          flex-wrap: wrap;
          gap: 6px;
          margin-bottom: 16px;
        }

        .benefit-tag {
          padding: 4px 8px;
          background: rgba(255, 255, 255, 0.08);
          border-radius: 12px;
          font-size: 0.75rem;
          color: var(--text-light);
          border: 1px solid rgba(255, 255, 255, 0.1);
        }

        .card-footer {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding-top: 16px;
          border-top: 1px solid rgba(255, 255, 255, 0.1);
        }

        .salary {
          font-weight: 600;
          color: var(--gold-light);
          font-size: 0.9rem;
        }

        .actions {
          display: flex;
          gap: 8px;
        }

        .btn-view {
          padding: 8px 16px;
          background: linear-gradient(135deg, var(--gold-light), var(--gold-dark));
          color: black;
          border: none;
          border-radius: 8px;
          font-size: 0.85rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .btn-view:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(252, 210, 159, 0.3);
        }

        .btn-company {
          width: 32px;
          height: 32px;
          background: rgba(255, 255, 255, 0.1);
          border: none;
          border-radius: 8px;
          color: var(--text-muted);
          cursor: pointer;
          transition: all 0.3s ease;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .btn-company:hover {
          background: rgba(255, 255, 255, 0.2);
          color: var(--text-light);
        }

        .no-results {
          text-align: center;
          padding: 60px 24px;
          color: var(--text-muted);
        }

        .no-results h3 {
          font-size: 1.3rem;
          margin-bottom: 12px;
          color: var(--text-light);
        }

        .no-results p {
          margin-bottom: 24px;
        }

        .clear-filters-btn {
          padding: 12px 24px;
          background: linear-gradient(135deg, var(--gold-light), var(--gold-dark));
          color: black;
          border: none;
          border-radius: 12px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .clear-filters-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 16px rgba(252, 210, 159, 0.3);
        }

        @media (max-width: 768px) {
          .header h1 {
            font-size: 2.5rem;
          }

          .filters-grid {
            grid-template-columns: 1fr;
          }

          .companies-grid.grid-view {
            grid-template-columns: 1fr;
          }

          .company-header {
            flex-wrap: wrap;
          }

          .hiring-status {
            order: -1;
            margin-left: auto;
          }

          .stats-row {
            gap: 16px;
          }

          .card-footer {
            flex-direction: column;
            gap: 12px;
            align-items: stretch;
          }

          .actions {
            justify-content: center;
          }
        }

        @media (max-width: 480px) {
          .header {
            padding: 80px 16px 40px;
          }

          .header h1 {
            font-size: 2rem;
          }

          .filters-card {
            padding: 20px;
          }

          .company-card {
            padding: 20px;
          }

          .companies-section {
            padding: 0 16px 40px;
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
                {filteredAndSortedCompanies.length} companies found
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
        <div className="companies-wrapper" >
          {filteredAndSortedCompanies.length > 0 ? (
            <div className={`companies-grid ${viewMode}-view`} >
              {filteredAndSortedCompanies.map((company, index) => (
                <CompanyCard key={company.id} company={company} index={index} />
              ))}
            </div>
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