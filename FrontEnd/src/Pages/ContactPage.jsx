import React, { useState } from 'react';
import { Mail, Phone, MapPin, Send, Clock, Users, Briefcase, MessageCircle, HeadphonesIcon, Globe, ChevronDown, ChevronUp, CheckCircle, AlertCircle, HelpCircle, Shield, Zap, Award } from 'lucide-react';
import Navbar from '../Components/Navbar';
import Footer from '../Components/Footer';
const ContactPage = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        subject: '',
        message: ''
    });
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [expandedFaq, setExpandedFaq] = useState(null);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setIsSubmitted(true);
        setTimeout(() => setIsSubmitted(false), 3000);
        setFormData({ name: '', email: '', subject: '', message: '' });
    };

    const contactOptions = [
        {
            icon: <Users size={24} />,
            title: "Job Seekers",
            description: "Career guidance, resume optimization, interview preparation, salary negotiation tips, and personalized job matching assistance",
            email: "careers@workverse.com",
            details: "Our career specialists have helped over 50,000 professionals land their dream jobs"
        },
        {
            icon: <Briefcase size={24} />,
            title: "Employers",
            description: "Premium talent acquisition, bulk job postings, employer branding solutions, and dedicated account management",
            email: "employers@workverse.com",
            details: "Trusted by Fortune 500 companies and growing startups across 50+ industries"
        },
        {
            icon: <HeadphonesIcon size={24} />,
            title: "Support",
            description: "Technical assistance, account management, billing inquiries, and platform navigation help available 24/7",
            email: "support@workverse.com",
            details: "Average response time: 15 minutes during business hours, 2 hours after hours"
        }
    ];

    const features = [
        {
            icon: <Shield size={20} />,
            title: "Secure & Private",
            description: "Your data is protected with enterprise-grade security and privacy standards"
        },
        {
            icon: <Zap size={20} />,
            title: "Lightning Fast",
            description: "Get responses within 2 hours during business hours, 24/7 emergency support available"
        },
        {
            icon: <Award size={20} />,
            title: "Expert Team",
            description: "Our certified career coaches and technical specialists are here to help you succeed"
        }
    ];

    const faqs = [
        {
            question: "How do I reset my password?",
            answer: "Click 'Forgot Password' on the login page, enter your email, and follow the reset link sent to your inbox. If you don't receive it within 5 minutes, check your spam folder or contact support.",
            category: "Account Issues"
        },
        {
            question: "Why isn't my job application going through?",
            answer: "Common issues include incomplete profile information, missing required documents, or browser compatibility. Ensure your profile is 100% complete, all required fields are filled, and try using Chrome or Firefox browsers.",
            category: "Job Applications"
        },
        {
            question: "How can I make my profile more visible to employers?",
            answer: "Complete all profile sections, add relevant keywords to your summary, upload a professional photo, get skill endorsements, and keep your profile active by logging in regularly.",
            category: "Profile Optimization"
        },
        {
            question: "What's included in the premium employer package?",
            answer: "Premium includes unlimited job postings, priority placement in search results, advanced candidate filtering, dedicated account manager, and detailed analytics dashboard.",
            category: "Employer Services"
        },
        {
            question: "How do I cancel my subscription?",
            answer: "Go to Account Settings > Billing > Manage Subscription. You can cancel anytime and retain access until your current billing period ends. Need help? Contact support for immediate assistance.",
            category: "Billing"
        },
        {
            question: "Why am I not receiving job alerts?",
            answer: "Check your notification settings in Account Preferences, ensure job alert criteria aren't too specific, verify your email settings, and check spam folder. Try creating a new job alert with broader criteria.",
            category: "Notifications"
        }
    ];

    const toggleFaq = (index) => {
        setExpandedFaq(expandedFaq === index ? null : index);
    };

    return (
        <>
            <Navbar />
            <style>{`
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        @keyframes slideInLeft {
          from { opacity: 0; transform: translateX(-30px); }
          to { opacity: 1; transform: translateX(0); }
        }
        
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-8px); }
        }
        
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.7; }
        }
        
        .contact-input::placeholder { color: #aaa; }
        .animate-fadeIn { animation: fadeInUp 0.8s ease-out; }
        .animate-slideIn { animation: slideInLeft 0.8s ease-out; }
        .animate-float { animation: float 3s ease-in-out infinite; }
        
        .contact-card {
          transition: all 0.3s ease;
        }
        
        .contact-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 12px 40px rgba(0, 0, 0, 0.3);
        }
        
        .contact-select option {
          background: #2c3e50;
          color: #f5f5f5;
        }
        
        .faq-item {
          transition: all 0.3s ease;
        }
        
        .faq-item:hover {
          background: rgba(255, 255, 255, 0.05);
        }
      `}</style>

            <div style={{
                minHeight: '100vh',
                background: 'linear-gradient(135deg, #0f2027, #203a43, #2c5364)',
                padding: '2rem 1rem',
                fontFamily: 'system-ui, -apple-system, sans-serif',
                marginTop: '7vh'
            }}>

                {/* Header Section */}
                <div className="animate-fadeIn" style={{
                    textAlign: 'center',
                    marginBottom: '3rem',
                    maxWidth: '900px',
                    margin: '0 auto 3rem auto'
                }}>
                    <div className="animate-float" style={{ marginBottom: '1rem', marginTop: '7vh' }}>
                        <h1 style={{
                            color: '#fcd29f',
                            fontSize: '2.8rem',
                            fontWeight: '700',
                            margin: '0 0 0.5rem 0'
                        }}>Connect with WorkVerse</h1>
                    </div>
                    <p style={{
                        color: '#ccc',
                        fontSize: '1.2rem',
                        lineHeight: '1.6',
                        // margin: '0 0 2rem 0',
                        maxWidth: '700px',
                        margin: '0 auto 2rem auto'
                    }}>
                        Your career journey deserves personalized support. Whether you're taking the next step in your career,
                        building an exceptional team, or need technical assistance, our dedicated experts are here to guide you
                        toward success with tailored solutions and industry insights.
                    </p>

                    {/* Features */}
                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                        gap: '1rem',
                        marginBottom: '2rem'
                    }}>
                        {features.map((feature, index) => (
                            <div key={index} style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '0.75rem',
                                background: 'rgba(252, 210, 159, 0.1)',
                                padding: '1rem',
                                borderRadius: '12px',
                                border: '1px solid rgba(252, 210, 159, 0.2)'
                            }}>
                                <div style={{ color: '#d4a056' }}>
                                    {feature.icon}
                                </div>
                                <div style={{ textAlign: 'left' }}>
                                    <div style={{ color: '#fcd29f', fontSize: '0.9rem', fontWeight: '600' }}>
                                        {feature.title}
                                    </div>
                                    <div style={{ color: '#ccc', fontSize: '0.8rem', lineHeight: '1.3' }}>
                                        {feature.description}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '0.5rem',
                        background: 'rgba(252, 210, 159, 0.1)',
                        padding: '0.75rem 1.5rem',
                        borderRadius: '25px',
                        border: '1px solid rgba(252, 210, 159, 0.2)'
                    }}>
                        <Clock size={18} style={{ color: '#d4a056' }} />
                        <span style={{ color: '#fcd29f', fontSize: '1rem', fontWeight: '500' }}>
                            Average Response Time: 2 Hours | 24/7 Emergency Support Available
                        </span>
                    </div>
                </div>

                {/* Contact Options */}
                <div className="animate-slideIn" style={{
                    maxWidth: '1200px',
                    margin: '0 auto 4rem auto',
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
                    gap: '2rem'
                }}>
                    {contactOptions.map((option, index) => (
                        <div
                            key={index}
                            className="contact-card"
                            style={{
                                background: 'rgba(255, 255, 255, 0.1)',
                                backdropFilter: 'blur(10px)',
                                border: '1px solid rgba(255, 255, 255, 0.15)',
                                borderRadius: '16px',
                                padding: '2rem',
                                textAlign: 'center',
                                animationDelay: `${index * 0.2}s`
                            }}
                        >
                            <div style={{
                                color: '#d4a056',
                                marginBottom: '1rem',
                                display: 'flex',
                                justifyContent: 'center'
                            }}>
                                {option.icon}
                            </div>
                            <h3 style={{
                                color: '#fcd29f',
                                fontSize: '1.3rem',
                                fontWeight: '600',
                                margin: '0 0 1rem 0'
                            }}>{option.title}</h3>
                            <p style={{
                                color: '#ccc',
                                fontSize: '1rem',
                                margin: '0 0 1rem 0',
                                lineHeight: '1.5'
                            }}>{option.description}</p>
                            <p style={{
                                color: '#aaa',
                                fontSize: '0.85rem',
                                margin: '0 0 1.5rem 0',
                                fontStyle: 'italic'
                            }}>{option.details}</p>
                            <a
                                href={`mailto:${option.email}`}
                                style={{
                                    display: 'inline-flex',
                                    alignItems: 'center',
                                    gap: '0.5rem',
                                    background: 'linear-gradient(to right, #fbd7a1, #c9953e)',
                                    color: '#2c3e50',
                                    textDecoration: 'none',
                                    padding: '0.75rem 1.5rem',
                                    borderRadius: '8px',
                                    fontSize: '0.9rem',
                                    fontWeight: '600',
                                    transition: 'all 0.3s ease'
                                }}
                                onMouseOver={(e) => {
                                    e.target.style.transform = 'translateY(-2px)';
                                    e.target.style.boxShadow = '0 6px 20px rgba(251, 215, 161, 0.4)';
                                }}
                                onMouseOut={(e) => {
                                    e.target.style.transform = 'translateY(0)';
                                    e.target.style.boxShadow = 'none';
                                }}
                            >
                                <Mail size={16} />
                                {option.email}
                            </a>
                        </div>
                    ))}
                </div>

                {/* FAQ Section */}
                <div className="animate-fadeIn" style={{
                    maxWidth: '1200px',
                    margin: '0 auto 4rem auto',
                    animationDelay: '0.4s'
                }}>
                    <div style={{
                        textAlign: 'center',
                        marginBottom: '2rem'
                    }}>
                        <h2 style={{
                            color: '#fcd29f',
                            fontSize: '2rem',
                            fontWeight: '600',
                            margin: '0 0 0.5rem 0'
                        }}>Frequently Asked Questions</h2>
                        <p style={{
                            color: '#ccc',
                            fontSize: '1rem',
                            margin: 0
                        }}>Quick solutions to common questions - find your answer instantly</p>
                    </div>

                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))',
                        gap: '1rem'
                    }}>
                        {faqs.map((faq, index) => (
                            <div
                                key={index}
                                className="faq-item"
                                style={{
                                    background: 'rgba(255, 255, 255, 0.1)',
                                    backdropFilter: 'blur(10px)',
                                    border: '1px solid rgba(255, 255, 255, 0.15)',
                                    borderRadius: '12px',
                                    overflow: 'hidden'
                                }}
                            >
                                <button
                                    onClick={() => toggleFaq(index)}
                                    style={{
                                        width: '100%',
                                        background: 'none',
                                        border: 'none',
                                        padding: '1.5rem',
                                        textAlign: 'left',
                                        cursor: 'pointer',
                                        display: 'flex',
                                        justifyContent: 'space-between',
                                        alignItems: 'center',
                                        gap: '1rem'
                                    }}
                                >
                                    <div>
                                        <div style={{
                                            color: '#d4a056',
                                            fontSize: '0.8rem',
                                            fontWeight: '500',
                                            marginBottom: '0.5rem'
                                        }}>{faq.category}</div>
                                        <div style={{
                                            color: '#f5f5f5',
                                            fontSize: '1rem',
                                            fontWeight: '500',
                                            lineHeight: '1.3'
                                        }}>{faq.question}</div>
                                    </div>
                                    <div style={{ color: '#d4a056', flexShrink: 0 }}>
                                        {expandedFaq === index ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                                    </div>
                                </button>

                                {expandedFaq === index && (
                                    <div style={{
                                        padding: '0 1.5rem 1.5rem 1.5rem',
                                        borderTop: '1px solid rgba(255, 255, 255, 0.1)',
                                        animation: 'fadeInUp 0.3s ease-out'
                                    }}>
                                        <p style={{
                                            color: '#ccc',
                                            fontSize: '0.9rem',
                                            lineHeight: '1.5',
                                            margin: '1rem 0 0 0'
                                        }}>{faq.answer}</p>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>

                {/* Main Contact Section */}
                <div style={{
                    maxWidth: '1200px',
                    margin: '0 auto',
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
                    gap: '2rem',
                    alignItems: 'start'
                }}>


                    {/* Contact Info */}
                    <div className="animate-fadeIn" style={{
                        background: 'rgba(255, 255, 255, 0.1)',
                        backdropFilter: 'blur(10px)',
                        border: '1px solid rgba(255, 255, 255, 0.15)',
                        borderRadius: '16px',
                        padding: '2.5rem',
                        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.2)',
                        animationDelay: '0.6s',

                    }}>
                        <h2 style={{
  color: '#fcd29f',
  marginBottom: '2rem',
  fontSize: '1.8rem',
  fontWeight: '600'
}}>Contact Information</h2>

<div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>

  {/* Email */}
  <div>
    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.75rem' }}>
      <Mail size={22} style={{ color: '#d4a056' }} />
      <span style={{ color: '#f5f5f5', fontWeight: '600', fontSize: '1.1rem' }}>Email Support</span>
    </div>
    <p style={{ color: '#ccc', fontSize: '1rem', marginLeft: '2.2rem', lineHeight: '1.6' }}>
      <strong style={{ color: '#fcd29f' }}>hello@workverse.com</strong><br />
      Replies in 2–4 hrs (business hours). Next day for after-hours.
    </p>
  </div>

  {/* Phone */}
  <div>
    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.75rem' }}>
      <Phone size={22} style={{ color: '#d4a056' }} />
      <span style={{ color: '#f5f5f5', fontWeight: '600', fontSize: '1.1rem' }}>Phone Support</span>
    </div>
    <p style={{ color: '#ccc', fontSize: '1rem', marginLeft: '2.2rem', lineHeight: '1.6' }}>
      <strong style={{ color: '#fcd29f' }}>+1 (555) 123-WORK</strong><br />
      Mon–Fri: 9AM–6PM | Sat: 10AM–2PM EST<br />
      24/7 for premium users | Toll-free in 15+ countries
    </p>
  </div>

  {/* HQ */}
  <div>
    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.75rem' }}>
      <MapPin size={22} style={{ color: '#d4a056' }} />
      <span style={{ color: '#f5f5f5', fontWeight: '600', fontSize: '1.1rem' }}>Headquarters</span>
    </div>
    <p style={{ color: '#ccc', fontSize: '1rem', marginLeft: '2.2rem', lineHeight: '1.6' }}>
      <strong style={{ color: '#fcd29f' }}>WorkVerse HQ</strong><br />
      Innovation District, San Francisco, CA<br />
      Meetings by appointment: Mon–Fri 9AM–5PM
    </p>
  </div>

  {/* Global */}
  <div>
    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.75rem' }}>
      <Globe size={22} style={{ color: '#d4a056' }} />
      <span style={{ color: '#f5f5f5', fontWeight: '600', fontSize: '1.1rem' }}>Global Presence</span>
    </div>
    <p style={{ color: '#ccc', fontSize: '1rem', marginLeft: '2.2rem', lineHeight: '1.6' }}>
      Serving <strong style={{ color: '#fcd29f' }}>50+ countries</strong><br />
      Support in EN, ES, FR, DE, ZH<br />
      Teams in NYC, London, Toronto, Sydney
    </p>
  </div>
</div>

{/* Help Center Box */}
<div style={{
  marginTop: '2.5rem',
  padding: '2rem',
  background: 'rgba(212, 160, 86, 0.1)',
  borderRadius: '16px',
  border: '1px solid rgba(212, 160, 86, 0.2)',
  textAlign: 'center'
}}>
  <MessageCircle size={28} style={{ color: '#d4a056', marginBottom: '0.5rem' }} />
  <p style={{
    color: '#fcd29f',
    fontSize: '1.1rem',
    fontWeight: '600',
    marginBottom: '0.75rem'
  }}>Need Help Fast?</p>
  <p style={{
    color: '#ccc',
    fontSize: '0.95rem',
    margin: 0,
    lineHeight: '1.5'
  }}>
    Visit our Help Center with 500+ articles & videos, or start a live chat with our team.
  </p>
</div>
</div>

                    {/* Contact Form */}
                    <div className="animate-fadeIn" style={{
                        background: 'rgba(255, 255, 255, 0.1)',
                        backdropFilter: 'blur(10px)',
                        border: '1px solid rgba(255, 255, 255, 0.15)',
                        borderRadius: '16px',
                        padding: '2.5rem',
                        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.2)',
                        animationDelay: '0.8s'
                    }}>
                        <h2 style={{
                            color: '#fcd29f',
                            marginBottom: '1rem',
                            fontSize: '1.8rem',
                            fontWeight: '600'
                        }}>Send us a Message</h2>

                        <p style={{
                            color: '#ccc',
                            fontSize: '1rem',
                            marginBottom: '2rem',
                            lineHeight: '1.6'
                        }}>
                            Have a specific question, need personalized career advice, or want to discuss custom solutions for your organization?
                            Fill out the form below with as much detail as possible, and our expert team will provide you with a comprehensive,
                            tailored response within 2-4 hours.
                        </p>

                        {isSubmitted && (
                            <div style={{
                                background: 'rgba(74, 222, 128, 0.1)',
                                border: '1px solid #4ade80',
                                borderRadius: '12px',
                                padding: '1.5rem',
                                marginBottom: '2rem',
                                color: '#4ade80',
                                fontSize: '1rem',
                                textAlign: 'center',
                                animation: 'fadeInUp 0.5s ease-out',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                gap: '0.5rem'
                            }}>
                                <CheckCircle size={20} />
                                Thank you! Your message has been sent successfully. We'll respond within 2-4 hours with personalized assistance.
                            </div>
                        )}

                        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
                                <input
                                    type="text"
                                    name="name"
                                    placeholder="Your Full Name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    required
                                    className="contact-input"
                                    style={{
                                        background: '#2c3e50',
                                        border: '1px solid rgba(255, 255, 255, 0.2)',
                                        borderRadius: '12px',
                                        padding: '1rem',
                                        color: '#f5f5f5',
                                        fontSize: '1rem',
                                        outline: 'none',
                                        transition: 'all 0.3s ease'
                                    }}
                                    onFocus={(e) => {
                                        e.target.style.borderColor = '#d4a056';
                                        e.target.style.transform = 'translateY(-2px)';
                                        e.target.style.boxShadow = '0 4px 12px rgba(212, 160, 86, 0.2)';
                                    }}
                                    onBlur={(e) => {
                                        e.target.style.borderColor = 'rgba(255, 255, 255, 0.2)';
                                        e.target.style.transform = 'translateY(0)';
                                        e.target.style.boxShadow = 'none';
                                    }}
                                />

                                <input
                                    type="email"
                                    name="email"
                                    placeholder="Your Email Address"
                                    value={formData.email}
                                    onChange={handleChange}
                                    required
                                    className="contact-input"
                                    style={{
                                        background: '#2c3e50',
                                        border: '1px solid rgba(255, 255, 255, 0.2)',
                                        borderRadius: '12px',
                                        padding: '1rem',
                                        color: '#f5f5f5',
                                        fontSize: '1rem',
                                        outline: 'none',
                                        transition: 'all 0.3s ease'
                                    }}
                                    onFocus={(e) => {
                                        e.target.style.borderColor = '#d4a056';
                                        e.target.style.transform = 'translateY(-2px)';
                                        e.target.style.boxShadow = '0 4px 12px rgba(212, 160, 86, 0.2)';
                                    }}
                                    onBlur={(e) => {
                                        e.target.style.borderColor = 'rgba(255, 255, 255, 0.2)';
                                        e.target.style.transform = 'translateY(0)';
                                        e.target.style.boxShadow = 'none';
                                    }}
                                />
                            </div>

                            <select
                                name="subject"
                                value={formData.subject}
                                onChange={handleChange}
                                required
                                className="contact-select"
                                style={{
                                    background: '#2c3e50',
                                    border: '1px solid rgba(255, 255, 255, 0.2)',
                                    borderRadius: '12px',
                                    padding: '1rem',
                                    color: '#f5f5f5',
                                    fontSize: '1rem',
                                    outline: 'none',
                                    transition: 'all 0.3s ease'
                                }}
                                onFocus={(e) => {
                                    e.target.style.borderColor = '#d4a056';
                                    e.target.style.transform = 'translateY(-2px)';
                                    e.target.style.boxShadow = '0 4px 12px rgba(212, 160, 86, 0.2)';
                                }}
                                onBlur={(e) => {
                                    e.target.style.borderColor = 'rgba(255, 255, 255, 0.2)';
                                    e.target.style.transform = 'translateY(0)';
                                    e.target.style.boxShadow = 'none';
                                }}
                            >
                                <option value="">What can we help you with today?</option>
                                <option value="job-search">Job Search & Career Guidance</option>
                                <option value="resume-review">Resume & Profile Optimization</option>
                                <option value="interview-prep">Interview Preparation & Tips</option>
                                <option value="employer-services">Employer & Hiring Solutions</option>
                                <option value="technical-support">Technical Support & Troubleshooting</option>
                                <option value="account-issues">Account & Billing Questions</option>
                                <option value="partnership">Partnership & Business Opportunities</option>
                                <option value="feedback">Feedback & Feature Suggestions</option>
                                <option value="other">Other Custom Inquiry</option>
                            </select>

                            <textarea
                                name="message"
                                placeholder="Please provide detailed information about your inquiry, including any specific challenges you're facing, your current situation, and how we can best assist you. The more context you provide, the more personalized and helpful our response will be..."
                                value={formData.message}
                                onChange={handleChange}
                                required
                                rows={6}
                                className="contact-input"
                                style={{
                                    background: '#2c3e50',
                                    border: '1px solid rgba(255, 255, 255, 0.2)',
                                    borderRadius: '12px',
                                    padding: '1rem',
                                    color: '#f5f5f5',
                                    fontSize: '1rem',
                                    outline: 'none',
                                    transition: 'all 0.3s ease',
                                    resize: 'vertical',
                                    fontFamily: 'inherit'
                                }}
                                onFocus={(e) => {
                                    e.target.style.borderColor = '#d4a056';
                                    e.target.style.transform = 'translateY(-2px)';
                                    e.target.style.boxShadow = '0 4px 12px rgba(212, 160, 86, 0.2)';
                                }}
                                onBlur={(e) => {
                                    e.target.style.borderColor = 'rgba(255, 255, 255, 0.2)';
                                    e.target.style.transform = 'translateY(0)';
                                    e.target.style.boxShadow = 'none';
                                }}
                            />

                            <button
                                type="submit"
                                style={{
                                    background: 'linear-gradient(to right, #fbd7a1, #c9953e)',
                                    border: 'none',
                                    borderRadius: '12px',
                                    padding: '1rem 2.5rem',
                                    color: '#2c3e50',
                                    fontSize: '1.1rem',
                                    fontWeight: '600',
                                    cursor: 'pointer',
                                    transition: 'all 0.3s ease',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    gap: '0.75rem',
                                    marginTop: '1rem'
                                }}
                                onMouseOver={(e) => {
                                    e.target.style.transform = 'translateY(-3px)';
                                    e.target.style.boxShadow = '0 8px 25px rgba(251, 215, 161, 0.4)';
                                }}
                                onMouseOut={(e) => {
                                    e.target.style.transform = 'translateY(0)';
                                    e.target.style.boxShadow = 'none';
                                }}
                            >
                                <Send size={20} />
                                Send Message & Get Expert Help
                            </button>
                        </form>

                        <div style={{
                            marginTop: '2rem',
                            padding: '1.5rem',
                            background: 'rgba(255, 255, 255, 0.05)',
                            borderRadius: '12px',
                            border: '1px solid rgba(255, 255, 255, 0.1)'
                        }}>
                            <div style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '0.5rem',
                                marginBottom: '0.75rem'
                            }}>
                                <AlertCircle size={16} style={{ color: '#d4a056' }} />
                                <span style={{
                                    color: '#fcd29f',
                                    fontSize: '0.9rem',
                                    fontWeight: '600'
                                }}>Privacy & Security Notice</span>
                            </div>
                            <p style={{
                                color: '#aaa',
                                fontSize: '0.85rem',
                                lineHeight: '1.5',
                                margin: 0
                            }}>
                                By submitting this form, you agree to our Privacy Policy and Terms of Service.
                                We use enterprise-grade encryption to protect your data and will never share your
                                personal information with third parties. All communications are confidential and
                                handled by our certified support specialists.
                            </p>
                        </div>
                    </div>
                </div>

                {/* Bottom CTA Section */}
                <div className="animate-fadeIn" style={{
                    maxWidth: '800px',
                    margin: '4rem auto 0 auto',
                    textAlign: 'center',
                    background: 'rgba(255, 255, 255, 0.1)',
                    backdropFilter: 'blur(10px)',
                    border: '1px solid rgba(255, 255, 255, 0.15)',
                    borderRadius: '20px',
                    padding: '3rem 2rem',
                    animationDelay: '1s'
                }}>
                    <HelpCircle size={48} style={{ color: '#d4a056', marginBottom: '1rem' }} />
                    <h3 style={{
                        color: '#fcd29f',
                        fontSize: '1.5rem',
                        fontWeight: '600',
                        margin: '0 0 1rem 0'
                    }}>Still Have Questions?</h3>
                    <p style={{
                        color: '#ccc',
                        fontSize: '1rem',
                        lineHeight: '1.6',
                        margin: '0 0 2rem 0'
                    }}>
                        Our comprehensive Help Center contains detailed guides, video tutorials, and answers to over 500 common questions.
                        You can also schedule a free 15-minute consultation with one of our career specialists.
                    </p>
                    <div style={{
                        display: 'flex',
                        gap: '1rem',
                        justifyContent: 'center',
                        flexWrap: 'wrap'
                    }}>
                        <button style={{
                            background: 'transparent',
                            border: '2px solid #d4a056',
                            borderRadius: '12px',
                            padding: '0.75rem 1.5rem',
                            color: '#d4a056',
                            fontSize: '1rem',
                            fontWeight: '600',
                            cursor: 'pointer',
                            transition: 'all 0.3s ease'
                        }}
                            onMouseOver={(e) => {
                                e.target.style.background = '#d4a056';
                                e.target.style.color = '#2c3e50';
                                e.target.style.transform = 'translateY(-2px)';
                            }}
                            onMouseOut={(e) => {
                                e.target.style.background = 'transparent';
                                e.target.style.color = '#d4a056';
                                e.target.style.transform = 'translateY(0)';
                            }}>
                            Visit Help Center
                        </button>
                        <button style={{
                            background: 'linear-gradient(to right, #fbd7a1, #c9953e)',
                            border: 'none',
                            borderRadius: '12px',
                            padding: '0.75rem 1.5rem',
                            color: '#2c3e50',
                            fontSize: '1rem',
                            fontWeight: '600',
                            cursor: 'pointer',
                            transition: 'all 0.3s ease'
                        }}
                            onMouseOver={(e) => {
                                e.target.style.transform = 'translateY(-2px)';
                                e.target.style.boxShadow = '0 6px 20px rgba(251, 215, 161, 0.4)';
                            }}
                            onMouseOut={(e) => {
                                e.target.style.transform = 'translateY(0)';
                                e.target.style.boxShadow = 'none';
                            }}>
                            Schedule Free Consultation
                        </button>
                    </div>
                </div>
            </div>
            <Footer/>
        </>
    );
};

export default ContactPage;