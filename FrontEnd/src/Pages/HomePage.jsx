import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, MapPin, Briefcase, Users, TrendingUp, Star, Clock, DollarSign, Filter, ArrowRight, Building, Award, ChevronDown } from 'lucide-react';
import "../Css/HomePage.css";
import Navbar from '../Components/Navbar';
const JobPortalHomepage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [location, setLocation] = useState('');
  const [jobType, setJobType] = useState('');
  const [currentSlide, setCurrentSlide] = useState(0);
  const [animatedStats, setAnimatedStats] = useState({
    jobs: 0,
    companies: 0,
    users: 0,
    success: 0
  });
  
  // Animate stats on mount
  useEffect(() => {
    const targets = { jobs: 15000, companies: 2500, users: 50000, success: 95 };
    const duration = 2000;
    const steps = 60;
    const stepTime = duration / steps;
    
    let currentStep = 0;
    const timer = setInterval(() => {
      currentStep++;
      const progress = currentStep / steps;
      
      setAnimatedStats({
        jobs: Math.floor(targets.jobs * progress),
        companies: Math.floor(targets.companies * progress),
        users: Math.floor(targets.users * progress),
        success: Math.floor(targets.success * progress)
      });
      
      if (currentStep >= steps) {
        clearInterval(timer);
        setAnimatedStats(targets);
      }
    }, stepTime);
    
    return () => clearInterval(timer);
  }, []);

  // Auto-slide testimonials
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide(prev => (prev + 1) % 3);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const featuredJobs = [
    {
      id: 1,
      title: "Senior Full Stack Developer",
      company: "TechCorp Inc.",
      location: "San Francisco, CA",
      salary: "$120k - $160k",
      type: "Full-time",
      logo: "🚀",
      posted: "2 days ago",
      applicants: 45,
      skills: ["React", "Node.js", "MongoDB", "Express"]
    },
    {
      id: 2,
      title: "UI/UX Designer",
      company: "Design Studio",
      location: "New York, NY",
      salary: "$80k - $110k",
      type: "Full-time",
      logo: "🎨",
      posted: "1 day ago",
      applicants: 32,
      skills: ["Figma", "Adobe XD", "Sketch", "Prototyping"]
    },
    {
      id: 3,
      title: "Data Scientist",
      company: "AI Solutions",
      location: "Remote",
      salary: "$100k - $140k",
      type: "Remote",
      logo: "📊",
      posted: "3 days ago",
      applicants: 28,
      skills: ["Python", "ML", "TensorFlow", "SQL"]
    }
  ];

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

  const topCategories = [
    { name: "Technology", jobs: 3500, icon: "💻" },
    { name: "Healthcare", jobs: 2800, icon: "🏥" },
    { name: "Finance", jobs: 2200, icon: "💰" },
    { name: "Marketing", jobs: 1900, icon: "📢" },
    { name: "Education", jobs: 1600, icon: "🎓" },
    { name: "Design", jobs: 1400, icon: "🎨" }
  ];

  return (
    <>
    <Navbar/>
    <div className="homepage">
      {/* Hero Section */}
      <section className="hero">
        <div className="hero-background">
          <div className="floating-elements">
            <div className="floating-element" style={{top: '20%', left: '10%'}}>💼</div>
            <div className="floating-element" style={{top: '60%', right: '15%'}}>🚀</div>
            <div className="floating-element" style={{top: '40%', left: '80%'}}>⭐</div>
          </div>
        </div>
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
          
          <div className="search-container">
            <div className="search-box">
              <div className="search-field">
                <Search className="search-icon" />
                <input
                  type="text"
                  placeholder="Job title, keywords, or company"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <div className="search-field">
                <MapPin className="search-icon" />
                <input
                  type="text"
                  placeholder="City, state, or remote"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                />
              </div>
              <div className="search-field">
                <Filter className="search-icon" />
                <select value={jobType} onChange={(e) => setJobType(e.target.value)}>
                  <option value="">Job Type</option>
                  <option value="full-time">Full-time</option>
                  <option value="part-time">Part-time</option>
                  <option value="remote">Remote</option>
                  <option value="contract">Contract</option>
                </select>
                <ChevronDown className="select-arrow" />
              </div>
              <button className="search-btn">
                <Search size={20} />
                Search Jobs
              </button>
            </div>
          </div>

          <div className="popular-searches">
            <span>Popular searches:</span>
            {["React Developer", "Product Manager", "Data Scientist", "UI Designer"].map((term, idx) => (
              <button key={idx} className="popular-tag">{term}</button>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
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

      {/* Featured Jobs */}
      <section className="featured-jobs">
        <div className="section-container">
          <div className="section-header">
            <h2>Featured Jobs</h2>
            <p>Hand-picked opportunities from top companies</p>
          </div>
          <div className="jobs-grid">
            {featuredJobs.map(job => (
              <div key={job.id} className="job-card">
                <div className="job-header">
                  <div className="company-logo">{job.logo}</div>
                  <div className="job-meta">
                    <div className="job-type-badge">{job.type}</div>
                    <div className="job-posted">
                      <Clock size={14} />
                      {job.posted}
                    </div>
                  </div>
                </div>
                <h3 className="job-title">{job.title}</h3>
                <div className="job-company">
                  <Building size={16} />
                  {job.company}
                </div>
                <div className="job-location">
                  <MapPin size={16} />
                  {job.location}
                </div>
                <div className="job-salary">
                  <DollarSign size={16} />
                  {job.salary}
                </div>
                <div className="job-skills">
                  {job.skills.map((skill, idx) => (
                    <span key={idx} className="skill-tag">{skill}</span>
                  ))}
                </div>
                <div className="job-footer">
                  <div className="applicants">
                    <Users size={14} />
                    {job.applicants} applicants
                  </div>
                  <button className="apply-btn">
                    Apply Now
                    <ArrowRight size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>
          <div className="section-footer">
            <button className="btn-outline">View All Jobs</button>
          </div>
        </div>
      </section>

      {/* Job Categories */}
      <section className="categories">
        <div className="section-container">
          <div className="section-header">
            <h2>Browse by Category</h2>
            <p>Explore opportunities across different industries</p>
          </div>
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

      {/* Testimonials */}
      <section className="testimonials">
        <div className="section-container">
          <div className="section-header">
            <h2>Success Stories</h2>
            <p>What our users say about us</p>
          </div>
          <div className="testimonials-slider">
            {testimonials.map((testimonial, idx) => (
              <div
                key={idx}
                className={`testimonial-card ${idx === currentSlide ? 'active' : ''}`}
              >
                <div className="testimonial-content">
                  <div className="stars">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} size={16} fill="currentColor" />
                    ))}
                  </div>
                  <p className="testimonial-text">"{testimonial.text}"</p>
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

      {/* CTA Section */}
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

      {/* Footer */}
      <footer className="footer">
        <div className="footer-content">
          <div className="footer-section">
            <div className="footer-brand">
              <Briefcase size={24} />
              <span>WorkVerse</span>
            </div>
            <p>Connecting talent with opportunity since 2020</p>
          </div>
          <div className="footer-section">
            <h4>For Job Seekers</h4>
            <ul>
              <li><a href="#browse">Browse Jobs</a></li>
              <li><a href="#companies">Companies</a></li>
              <li><a href="#resources">Career Resources</a></li>
              <li><a href="#resume">Resume Builder</a></li>
            </ul>
          </div>
          <div className="footer-section">
            <h4>For Employers</h4>
            <ul>
              <li><a href="#post">Post a Job</a></li>
              <li><a href="#candidates">Browse Candidates</a></li>
              <li><a href="#pricing">Pricing</a></li>
              <li><a href="#tools">Hiring Tools</a></li>
            </ul>
          </div>
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
        <div className="footer-bottom">
          <p>&copy; 2025 JobPortal. All rights reserved.</p>
        </div>
      </footer>
    </div>
    </>
  );
};

export default JobPortalHomepage;