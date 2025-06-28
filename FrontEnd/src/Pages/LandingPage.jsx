import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../Css/LandingPage.css';
const LandingPage = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();

  return (
    <div className="landing">
      {/* Navigation Bar */}
      <nav className="navbar">
        <div className="logo">WorkVerse</div>
        <ul className={`nav-links ${menuOpen ? 'open' : ''}`}>
          {/* <li><a onClick={() => navigate('/home')}>Home</a></li> */}
          <li><a onClick={() => navigate("/home")}>Jobs</a></li>
          <li><a onClick={() => navigate("/postjob")}>Post Job</a></li>
          <li><a href="/login">Login</a></li>
        </ul>
        <div className="burger" onClick={() => setMenuOpen(!menuOpen)}>
          <span></span>
          <span></span>
          <span></span>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="hero">
        <div className="hero-content">
          <h1>Find Your Dream Job Today</h1>
          <p>Connect with top employers or post job listings easily.</p>
          <button className="cta" onClick={() => navigate('/home')}>Explore Jobs</button>
        </div>
      </section>

      {/* Quick Banner */}
      <section className="banner">
        <p>💼 Post Jobs | 🔍 Search Talent | 💬 Hire & Get Hired</p>
      </section>

      {/* Features Section */}
      <section id="jobs-section" className="features">
        <div className="feature-card" onClick={() => navigate('/post-job')}>
          <h3>Post a Job</h3>
          <p>Looking to hire? Post job openings and find qualified candidates.</p>
        </div>
        <div className="feature-card" onClick={() => navigate('/home')}>
          <h3>Search Jobs</h3>
          <p>Explore thousands of job listings across various industries.</p>
        </div>
        <div className="feature-card">
          <h3>Top Employers</h3>
          <p>Connect with trusted and leading companies hiring now.</p>
        </div>
        <div className="feature-card highlight-card">
          <h3>Career Management</h3>
          <p>Track applications, get alerts, and manage your job search in one place.</p>
        </div>
      </section>

      {/* Call to Action Section */}
      <section id="post-job-section" className="cta-section">
        <h2>Ready to Start Your Career Journey?</h2>
        <p>Join WorkVerse and discover job opportunities tailored to your skills.</p>
        <button className="cta-btn" onClick={() => navigate('/login')}>Get Started</button>
      </section>

      {/* Footer */}
      <footer className="footer">
        <p>© 2025 WorkVerse. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default LandingPage;
