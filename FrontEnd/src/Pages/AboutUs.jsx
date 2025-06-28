import React, { useState, useEffect, useRef } from 'react';
import Navbar from '../Components/Navbar';
import { 
  Users, Target, Zap, Award, ArrowRight, CheckCircle, Globe, Briefcase, 
  TrendingUp, Star, Shield, Clock, Heart, Lightbulb, Rocket, 
  ChevronDown, Play, Pause, BarChart3, Eye, Sparkles, Trophy,
  Building2, UserCheck, Compass, Coffee, Calendar, MapPin
} from 'lucide-react';
import "../Css/AboutUs.css"
import Footer from '../Components/Footer';
const AboutUs = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [activeCard, setActiveCard] = useState(null);
  const [activeTimeline, setActiveTimeline] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [scrollY, setScrollY] = useState(0);
  const [activeTab, setActiveTab] = useState('mission');
  const [counters, setCounters] = useState({
    jobSeekers: 0,
    companies: 0,
    placements: 0,
    successRate: 0
  });

  const videoRef = useRef(null);

  useEffect(() => {
    setIsVisible(true);
    
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll);

    // Animate counters
    const animateCounters = () => {
      const targets = { jobSeekers: 50000, companies: 5000, placements: 25000, successRate: 98 };
      const duration = 2000;
      const steps = 60;
      const increment = duration / steps;

      let step = 0;
      const timer = setInterval(() => {
        const progress = Math.min(step / steps, 1);
        setCounters({
          jobSeekers: Math.floor(targets.jobSeekers * progress),
          companies: Math.floor(targets.companies * progress),
          placements: Math.floor(targets.placements * progress),
          successRate: Math.floor(targets.successRate * progress)
        });
        
        if (progress >= 1) clearInterval(timer);
        step++;
      }, increment);
    };

    setTimeout(animateCounters, 500);

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const stats = [
    { number: counters.jobSeekers.toLocaleString() + '+', label: 'Active Job Seekers', icon: Users, color: '#4ade80', desc: 'Professionals actively searching for opportunities' },
    { number: counters.companies.toLocaleString() + '+', label: 'Partner Companies', icon: Briefcase, color: '#60a5fa', desc: 'Verified employers across all industries' },
    { number: counters.placements.toLocaleString() + '+', label: 'Successful Placements', icon: CheckCircle, color: '#f59e0b', desc: 'Career transitions we\'ve facilitated' },
    { number: counters.successRate + '%', label: 'Match Success Rate', icon: TrendingUp, color: '#ec4899', desc: 'Candidates who find their ideal role' }
  ];

  const timeline = [
    {
      year: '2020',
      quarter: 'Q1',
      title: 'The Vision',
      description: 'Founded by a team of former tech executives and AI researchers who experienced firsthand the inefficiencies of traditional recruitment.',
      icon: Lightbulb,
      metrics: 'Initial concept development'
    },
    {
      year: '2020',
      quarter: 'Q4',
      title: 'MVP Launch',
      description: 'Released our first AI-powered matching algorithm with 100 beta users and 10 partner companies.',
      icon: Rocket,
      metrics: '100 users, 10 companies'
    },
    {
      year: '2021',
      quarter: 'Q2',
      title: 'Rapid Growth',
      description: 'Expanded to 1,000+ job seekers and 100+ companies. Introduced video interviews and skill assessments.',
      icon: TrendingUp,
      metrics: '1K+ users, 100+ companies'
    },
    {
      year: '2022',
      quarter: 'Q3',
      title: 'AI Revolution',
      description: 'Launched our proprietary machine learning models that analyze personality, culture fit, and career aspirations.',
      icon: Zap,
      metrics: '10K+ users, 500+ companies'
    },
    {
      year: '2023',
      quarter: 'Q1',
      title: 'Global Expansion',
      description: 'Extended our platform to support remote work globally, partnering with companies across 25+ countries.',
      icon: Globe,
      metrics: '25K+ users, 2K+ companies'
    },
    {
      year: '2024',
      quarter: 'Q4',
      title: 'Industry Leader',
      description: 'Achieved market leadership with advanced AI, real-time matching, and comprehensive career development tools.',
      icon: Trophy,
      metrics: '50K+ users, 5K+ companies'
    }
  ];

  const values = [
    {
      icon: Target,
      title: 'Precision Matching',
      description: 'Our advanced AI doesn\'t just match skills—it understands personality, culture fit, career goals, and growth potential to create perfect synergies.',
      features: ['AI-powered personality analysis', 'Culture compatibility scoring', 'Career trajectory prediction', 'Skill gap identification'],
      color: '#4ade80'
    },
    {
      icon: Zap,
      title: 'Lightning Speed',
      description: 'From application to interview in under 48 hours. Our streamlined process eliminates the waiting game that plagues traditional recruitment.',
      features: ['Instant application processing', 'Real-time notifications', 'Automated screening', '48-hour response guarantee'],
      color: '#60a5fa'
    },
    {
      icon: Shield,
      title: 'Trust & Transparency',
      description: 'Every interaction is built on transparency. We verify all companies, provide salary insights, and ensure fair hiring practices.',
      features: ['Company verification process', 'Salary transparency', 'Bias-free algorithms', 'Fair hiring practices'],
      color: '#f59e0b'
    },
    {
      icon: Heart,
      title: 'Human-Centric',
      description: 'Technology serves humanity, not the other way around. We prioritize human connection and meaningful career growth over mere job placement.',
      features: ['Personal career coaching', 'Mental health support', 'Work-life balance focus', 'Long-term career planning'],
      color: '#ec4899'
    }
  ];

  const team = [
    {
      name: 'Sarah Chen',
      role: 'CEO & Co-Founder',
      bio: 'Former VP of Engineering at Google, Sarah led teams of 200+ engineers. She holds a PhD in Computer Science from Stanford and has 15+ years of experience in AI and talent acquisition.',
      image: '👩‍💼',
      specialties: ['AI/ML Strategy', 'Product Vision', 'Team Leadership'],
      linkedin: '#',
      achievements: ['Forbes 30 Under 30', 'MIT Technology Review Innovator', 'TEDx Speaker']
    },
    {
      name: 'Marcus Rodriguez',
      role: 'CTO & Co-Founder',
      bio: 'Previously Principal Engineer at Netflix, Marcus architected recommendation systems serving 200M+ users. MIT graduate with expertise in distributed systems and machine learning.',
      image: '👨‍💻',
      specialties: ['Machine Learning', 'System Architecture', 'Data Science'],
      linkedin: '#',
      achievements: ['ACM Distinguished Scientist', 'IEEE Fellow', '20+ Patents']
    },
    {
      name: 'Priya Patel',
      role: 'Head of Operations',
      bio: 'Former McKinsey consultant and Uber operations lead, Priya scaled operations across 50+ cities. MBA from Wharton, specializing in organizational psychology.',
      image: '👩‍💼',
      specialties: ['Operations Excellence', 'User Experience', 'Growth Strategy'],
      linkedin: '#',
      achievements: ['Operations Excellence Award', 'Wharton Alumni Achievement', 'Industry Speaker']
    },
    {
      name: 'David Kim',
      role: 'Head of AI Research',
      bio: 'PhD in Machine Learning from Carnegie Mellon, former research scientist at OpenAI. Pioneered breakthrough algorithms in natural language processing and computer vision.',
      image: '👨‍🔬',
      specialties: ['AI Research', 'NLP', 'Computer Vision'],
      linkedin: '#',
      achievements: ['NeurIPS Best Paper', '50+ Publications', 'AI Research Excellence']
    },
    {
      name: 'Lisa Wang',
      role: 'VP of Customer Success',
      bio: 'Former Head of Customer Experience at Airbnb, Lisa built customer success programs that achieved 95+ NPS scores. Expert in user psychology and experience design.',
      image: '👩‍💻',
      specialties: ['Customer Success', 'User Experience', 'Community Building'],
      linkedin: '#',
      achievements: ['Customer Experience Award', 'UX Design Recognition', 'Community Leadership']
    },
    {
      name: 'Ahmed Hassan',
      role: 'Head of Global Partnerships',
      bio: 'Former Director of Strategic Partnerships at LinkedIn, Ahmed built relationships with Fortune 500 companies. Fluent in 5 languages with deep international business expertise.',
      image: '👨‍💼',
      specialties: ['Strategic Partnerships', 'International Business', 'Relationship Building'],
      linkedin: '#',
      achievements: ['Partnership Excellence', 'Global Business Leader', 'Cultural Bridge Award']
    }
  ];

  const achievements = [
    { title: 'Best AI Innovation', year: '2024', org: 'Tech Innovation Awards' },
    { title: 'Fastest Growing Startup', year: '2023', org: 'Forbes' },
    { title: 'Best Workplace Culture', year: '2023', org: 'Glassdoor' },
    { title: 'Top 10 EdTech Solutions', year: '2022', org: 'EdTech Breakthrough' }
  ];

  const missionTabs = {
    mission: {
      title: 'Our Mission',
      content: 'To democratize access to meaningful career opportunities by leveraging AI to create perfect matches between talent and organizations, fostering a world where everyone can thrive in their ideal role.',
      icon: Compass,
      stats: { impact: '50K+ careers transformed', reach: '25+ countries', satisfaction: '98% user satisfaction' }
    },
    vision: {
      title: 'Our Vision',
      content: 'A future where finding the perfect job is as simple as finding the perfect match on a dating app—intelligent, instant, and deeply personal. We envision a world without unemployment, underemployment, or career dissatisfaction.',
      icon: Eye,
      stats: { goal: '1M+ placements by 2030', expansion: '100+ countries', innovation: 'Leading AI recruitment' }
    },
    impact: {
      title: 'Our Impact',
      content: 'Beyond job placement, we\'re creating economic mobility, reducing hiring bias, and building more diverse, inclusive workplaces. Every match we make ripples through families, communities, and economies.',
      icon: Sparkles,
      stats: { diversity: '40% increase in diverse hires', mobility: '60% salary increase average', retention: '85% job retention rate' }
    }
  };

  return (
    <>
    <Navbar/>
    <div className="about-container">

      {/* Floating Particles */}
      <div className="floating-particles">
        <div className="particle"></div>
        <div className="particle"></div>
        <div className="particle"></div>
        <div className="particle"></div>
        <div className="particle"></div>
      </div>

      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-content">
          <div className="hero-badge">
            <Star size={16} />
            Transforming Careers Since 2020
          </div>
          <h1 className="hero-title">Redefining the Future of Work</h1>
          <p className="hero-subtitle">Where AI Meets Human Potential</p>
          <p className="hero-description">
            We're not just another job board. WorkVerse is an intelligent career ecosystem that understands your unique potential, 
            matches you with opportunities that align with your values, and accelerates your professional growth through cutting-edge AI technology.
          </p>
          <div className="hero-cta">
            <button className="cta-primary">
              Discover Your Dream Job
              <ArrowRight size={20} />
            </button>
            <button className="cta-secondary">
              <Play size={18} />
              Watch Our Story
            </button>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="stats-section">
        <div className="stats-container">
          <div className="stats-header">
            <h2 className="stats-title">Our Impact in Numbers</h2>
            <p className="stats-subtitle">
              Every statistic represents a life changed, a career transformed, and a dream realized through our platform.
            </p>
          </div>
          <div className="stats-grid">
            {stats.map((stat, index) => (
              <div key={index} className="stat-card">
                <div className="stat-icon" style={{ color: stat.color }}>
                  <stat.icon size={32} />
                </div>
                <div className="stat-number">{stat.number}</div>
                <div className="stat-label">{stat.label}</div>
                <div className="stat-description">{stat.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Mission/Vision/Impact Section */}
      <section className="mission-section">
        <div className="mission-tabs">
          {Object.entries(missionTabs).map(([key, tab]) => (
            <button
              key={key}
              className={`mission-tab ${activeTab === key ? 'active' : ''}`}
              onClick={() => setActiveTab(key)}
            >
              <tab.icon size={20} />
              {tab.title}
            </button>
          ))}
        </div>
        <div className="mission-content">
          <p className="mission-text">{missionTabs[activeTab].content}</p>
          <div className="mission-stats">
            {Object.entries(missionTabs[activeTab].stats).map(([key, value]) => (
              <div key={key} className="mission-stat">
                <div className="mission-stat-value">{value}</div>
                <div className="mission-stat-label">{key.charAt(0).toUpperCase() + key.slice(1)}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Timeline Section */}
      <section className="timeline-section">
        <div className="timeline-container">
          <div className="timeline-header">
            <h2 className="section-title">Our Journey</h2>
            <p className="section-subtitle">
              From a bold idea to industry leadership—discover the milestones that shaped WorkVerse into the platform it is today.
            </p>
          </div>
          <div className="timeline">
            {timeline.map((item, index) => (
              <div 
                key={index} 
                className={`timeline-item ${activeTimeline === index ? 'active' : ''}`}
                onClick={() => setActiveTimeline(index)}
              >
                <div className="timeline-content">
                  <div className="timeline-year">{item.year} {item.quarter}</div>
                  <h3 className="timeline-title">{item.title}</h3>
                  <p className="timeline-description">{item.description}</p>
                  <div className="timeline-metrics">{item.metrics}</div>
                </div>
                <div className="timeline-icon">
                  <item.icon size={24} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="values-section">
        <div className="values-container">
          <div className="timeline-header">
            <h2 className="section-title">Our Core Values</h2>
            <p className="section-subtitle">
              The principles that guide every decision we make and every feature we build—because technology should serve humanity.
            </p>
          </div>
          <div className="values-grid">
            {values.map((value, index) => (
              <div 
                key={index} 
                className={`value-card ${activeCard === index ? 'active' : ''}`}
                onMouseEnter={() => setActiveCard(index)}
                onMouseLeave={() => setActiveCard(null)}
              >
                <div className="value-header">
                  <div className="value-icon" style={{ color: value.color }}>
                    <value.icon size={32} />
                  </div>
                  <h3 className="value-title">{value.title}</h3>
                </div>
                <p className="value-description">{value.description}</p>
                <ul className="value-features">
                  {value.features.map((feature, idx) => (
                    <li key={idx}>{feature}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="team-section">
        <div className="team-container">
          <div className="timeline-header">
            <h2 className="section-title">Meet the Visionaries</h2>
            <p className="section-subtitle">
              The brilliant minds behind WorkVerse—experienced leaders, innovative thinkers, and passionate advocates for your career success.
            </p>
          </div>
          <div className="team-grid">
            {team.map((member, index) => (
              <div key={index} className="team-card">
                <div className="team-avatar">{member.image}</div>
                <h3 className="team-name">{member.name}</h3>
                <p className="team-role">{member.role}</p>
                <p className="team-bio">{member.bio}</p>
                <div className="team-specialties">
                  {member.specialties.map((specialty, idx) => (
                    <span key={idx} className="specialty-tag">{specialty}</span>
                  ))}
                </div>
                <div className="team-achievements">
                  <h4>Key Achievements</h4>
                  <div className="achievements-list">
                    {member.achievements.map((achievement, idx) => (
                      <div key={idx} className="achievement-item">{achievement}</div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Achievements Section */}
      <section className="achievements-section">
        <div className="achievements-container">
          <h2 className="section-title">Recognition & Awards</h2>
          <p className="section-subtitle">
            Industry recognition for our innovation, impact, and commitment to transforming the future of work.
          </p>
          <div className="achievements-grid">
            {achievements.map((achievement, index) => (
              <div key={index} className="achievement-card">
                <div className="achievement-title">{achievement.title}</div>
                <div className="achievement-year">{achievement.year}</div>
                <div className="achievement-org">{achievement.org}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Culture Section */}
      <section className="culture-section">
        <div className="culture-container">
          <div className="timeline-header">
            <h2 className="section-title">Our Culture</h2>
            <p className="section-subtitle">
              The values and principles that make WorkVerse not just a great product, but a great place to work and grow.
            </p>
          </div>
          <div className="culture-grid">
            <div className="culture-card">
              <div className="culture-icon">🚀</div>
              <h3 className="culture-title">Innovation First</h3>
              <p className="culture-description">
                We push boundaries, challenge conventions, and constantly explore new ways to solve complex problems.
              </p>
            </div>
            <div className="culture-card">
              <div className="culture-icon">🤝</div>
              <h3 className="culture-title">Collaboration</h3>
              <p className="culture-description">
                Great ideas come from diverse perspectives working together toward common goals.
              </p>
            </div>
            <div className="culture-card">
              <div className="culture-icon">📈</div>
              <h3 className="culture-title">Growth Mindset</h3>
              <p className="culture-description">
                We embrace challenges, learn from failures, and continuously evolve both personally and professionally.
              </p>
            </div>
            <div className="culture-card">
              <div className="culture-icon">🌍</div>
              <h3 className="culture-title">Global Impact</h3>
              <p className="culture-description">
                Our work affects millions of lives worldwide, and we take that responsibility seriously.
              </p>
            </div>
            <div className="culture-card">
              <div className="culture-icon">⚖️</div>
              <h3 className="culture-title">Ethical AI</h3>
              <p className="culture-description">
                We build AI systems that are fair, transparent, and designed to eliminate bias in hiring.
              </p>
            </div>
            <div className="culture-card">
              <div className="culture-icon">💪</div>
              <h3 className="culture-title">Empowerment</h3>
              <p className="culture-description">
                We believe in empowering every individual to reach their full potential and achieve their dreams.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="final-cta-section">
        <div className="floating-elements">
          <Briefcase className="floating-element" size={40} />
          <Users className="floating-element" size={35} />
          <Target className="floating-element" size={30} />
        </div>
        <div className="final-cta-content">
          <h2 className="final-cta-title">Ready to Transform Your Future?</h2>
          <p className="final-cta-text">
            Join the revolution in career discovery. Whether you're a job seeker ready to find your dream role 
            or a company looking to discover exceptional talent, WorkVerse is your gateway to success.
          </p>
          <div className="final-cta-buttons">
            <button className="cta-button-large">
              <Users size={24} />
              Find Your Dream Job
            </button>
            <button className="cta-button-large">
              <Building2 size={24} />
              Hire Top Talent
            </button>
          </div>
        </div>
      </section>
    </div>
    <Footer/>
    </>
  );
};

export default AboutUs;