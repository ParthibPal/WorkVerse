import React, { useState, useEffect } from 'react';
import { Users, Briefcase, Eye, FileText, Download, MoreVertical, Shield, UserCheck } from 'lucide-react';
import {useNavigate} from "react-router-dom";
const Dashboard = () => {
  const [userRole, setUserRole] = useState('admin'); // admin or recruiter
  const [isMobile, setIsMobile] = useState(false);
  const navigate = useNavigate();
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Mock data
  const adminStats = [
    { icon: Briefcase, label: 'Total Jobs', value: '347', change: '+15%' },
    { icon: Users, label: 'All Users', value: '2,458', change: '+8%' },
    { icon: UserCheck, label: 'Recruiters', value: '156', change: '+12%' },
    { icon: Eye, label: 'Platform Views', value: '45,892', change: '+23%' }
  ];

  const recruiterStats = [
    { icon: Briefcase, label: 'My Jobs', value: '12', change: '+2%' },
    { icon: Users, label: 'Candidates', value: '284', change: '+18%' },
    { icon: FileText, label: 'CVs Received', value: '156', change: '+25%' },
    { icon: Eye, label: 'Job Views', value: '3,247', change: '+11%' }
  ];

  const jobPosts = [
    { id: 1, title: 'Senior React Developer', company: 'TechCorp', recruiter: 'John Smith', applications: 45, status: 'Active' },
    { id: 2, title: 'UI/UX Designer', company: 'CreativeLab', recruiter: 'Sarah Wilson', applications: 32, status: 'Active' },
    { id: 3, title: 'Product Manager', company: 'StartupXYZ', recruiter: 'Mike Johnson', applications: 67, status: 'Paused' },
    { id: 4, title: 'Data Scientist', company: 'DataHub', recruiter: 'Emma Davis', applications: 23, status: 'Active' }
  ];

  const candidates = [
    { id: 1, name: 'Alex Thompson', role: 'Frontend Developer', experience: '3 years', skills: 'React, TypeScript', status: 'Available' },
    { id: 2, name: 'Maria Garcia', role: 'UX Designer', experience: '5 years', skills: 'Figma, Sketch', status: 'Interviewing' },
    { id: 3, name: 'David Chen', role: 'Full Stack Developer', experience: '4 years', skills: 'Node.js, Python', status: 'Available' },
    { id: 4, name: 'Lisa Johnson', role: 'Product Manager', experience: '6 years', skills: 'Agile, Analytics', status: 'Hired' }
  ];

  const users = [
    { id: 1, name: 'John Smith', email: 'john@techcorp.com', role: 'Recruiter', company: 'TechCorp', status: 'Active' },
    { id: 2, name: 'Sarah Wilson', email: 'sarah@creative.com', role: 'Recruiter', company: 'CreativeLab', status: 'Active' },
    { id: 3, name: 'Alex Thompson', email: 'alex@email.com', role: 'Candidate', company: '-', status: 'Active' },
    { id: 4, name: 'Maria Garcia', email: 'maria@email.com', role: 'Candidate', company: '-', status: 'Active' }
  ];

  const StatCard = ({ stat, index }) => (
    <div
      key={index}
      style={{
        background: 'rgba(255, 255, 255, 0.1)',
        backdropFilter: 'blur(20px)',
        border: '1px solid rgba(255, 255, 255, 0.15)',
        borderRadius: '16px',
        padding: isMobile ? '1rem' : '1.25rem',
        transition: 'all 0.3s ease',
        cursor: 'pointer',
        minWidth: '0',
        boxSizing: 'border-box'
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = 'translateY(-4px)';
        e.currentTarget.style.boxShadow = '0 8px 32px rgba(0, 0, 0, 0.2)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'translateY(0)';
        e.currentTarget.style.boxShadow = 'none';
      }}
    >
      <div style={{ 
        display: 'flex', 
        alignItems: 'flex-start', 
        gap: '1rem'
      }}>
        <div style={{
          padding: '0.75rem',
          borderRadius: '12px',
          background: 'linear-gradient(135deg, rgba(252, 210, 159, 0.2), rgba(212, 160, 86, 0.2))',
          color: '#fcd29f',
          flexShrink: 0
        }}>
          <stat.icon size={20} />
        </div>
        <div style={{ flex: 1, minWidth: '0' }}>
          <p style={{ 
            margin: '0 0 0.25rem 0', 
            fontSize: '0.875rem', 
            color: '#ccc',
            fontWeight: '500'
          }}>
            {stat.label}
          </p>
          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: '0.75rem',
            flexWrap: 'wrap'
          }}>
            <h3 style={{ 
              margin: 0, 
              fontSize: isMobile ? '1.5rem' : '1.75rem', 
              fontWeight: '700',
              lineHeight: '1.2',
              color: '#f5f5f5'
            }}>
              {stat.value}
            </h3>
            <span style={{
              fontSize: '0.75rem',
              color: '#4ade80',
              background: 'rgba(74, 222, 128, 0.15)',
              padding: '0.25rem 0.5rem',
              borderRadius: '6px',
              fontWeight: '600'
            }}>
              {stat.change}
            </span>
          </div>
        </div>
      </div>
    </div>
  );

  const AdminView = () => (
    <div style={{ width: '100%', maxWidth: '100%', overflow: 'hidden' }}>
      {/* Stats Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: isMobile ? '1fr' : 'repeat(auto-fit, minmax(280px, 1fr))',
        gap: '1rem',
        marginBottom: '2rem'
      }}>
        {adminStats.map((stat, index) => (
          <StatCard key={index} stat={stat} index={index} />
        ))}
      </div>

      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', 
        gap: '1.5rem',
        width: '100%'
      }}>
        {/* All Job Posts */}
        <div style={{
          background: 'rgba(255, 255, 255, 0.1)',
          backdropFilter: 'blur(20px)',
          border: '1px solid rgba(255, 255, 255, 0.15)',
          borderRadius: '16px',
          padding: '1.5rem',
          width: '100%',
          boxSizing: 'border-box'
        }}>
          <h3 style={{ 
            margin: '0 0 1.5rem', 
            fontSize: '1.25rem', 
            fontWeight: '700',
            color: '#f5f5f5'
          }}>
            All Job Posts
          </h3>
          <div style={{ 
            maxHeight: '400px', 
            overflowY: 'auto',
            paddingRight: '0.5rem'
          }}>
            {jobPosts.map((job) => (
              <div key={job.id} style={{
                background: '#2c3e50',
                borderRadius: '12px',
                padding: '1rem',
                marginBottom: '0.75rem',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                transition: 'all 0.3s ease'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'rgba(44, 62, 80, 0.8)';
                e.currentTarget.style.transform = 'translateY(-2px)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = '#2c3e50';
                e.currentTarget.style.transform = 'translateY(0)';
              }}>
                <div style={{ 
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  alignItems: 'flex-start',
                  gap: '1rem',
                  flexWrap: isMobile ? 'wrap' : 'nowrap'
                }}>
                  <div style={{ flex: 1, minWidth: '0' }}>
                    <h4 style={{ 
                      margin: '0 0 0.5rem 0', 
                      fontSize: '1rem', 
                      fontWeight: '600',
                      lineHeight: '1.4',
                      color: '#f5f5f5'
                    }}>
                      {job.title}
                    </h4>
                    <p style={{ 
                      margin: '0', 
                      fontSize: '0.875rem', 
                      color: '#ccc',
                      lineHeight: '1.4'
                    }}>
                      {job.company} • by {job.recruiter}
                    </p>
                  </div>
                  <div style={{ 
                    display: 'flex',
                    flexDirection: isMobile ? 'row' : 'column',
                    alignItems: isMobile ? 'center' : 'flex-end',
                    gap: '0.5rem',
                    flexShrink: 0
                  }}>
                    <span style={{
                      fontSize: '0.75rem',
                      color: job.status === 'Active' ? '#4ade80' : '#ccc',
                      background: job.status === 'Active' ? 'rgba(74, 222, 128, 0.15)' : 'rgba(255, 255, 255, 0.1)',
                      padding: '0.25rem 0.75rem',
                      borderRadius: '8px',
                      fontWeight: '600'
                    }}>
                      {job.status}
                    </span>
                    <span style={{ 
                      fontSize: '0.875rem', 
                      color: '#fcd29f',
                      fontWeight: '600'
                    }}>
                      {job.applications} apps
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* All Users */}
        <div style={{
          background: 'rgba(255, 255, 255, 0.1)',
          backdropFilter: 'blur(20px)',
          border: '1px solid rgba(255, 255, 255, 0.15)',
          borderRadius: '16px',
          padding: '1.5rem',
          width: '100%',
          boxSizing: 'border-box'
        }}>
          <h3 style={{ 
            margin: '0 0 1.5rem', 
            fontSize: '1.25rem', 
            fontWeight: '700',
            color: '#f5f5f5'
          }}>
            All Users
          </h3>
          <div style={{ 
            maxHeight: '400px', 
            overflowY: 'auto',
            paddingRight: '0.5rem'
          }}>
            {users.map((user) => (
              <div key={user.id} style={{
                background: '#2c3e50',
                borderRadius: '12px',
                padding: '1rem',
                marginBottom: '0.75rem',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                transition: 'all 0.3s ease'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'rgba(44, 62, 80, 0.8)';
                e.currentTarget.style.transform = 'translateY(-2px)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = '#2c3e50';
                e.currentTarget.style.transform = 'translateY(0)';
              }}>
                <div style={{ 
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  alignItems: 'flex-start',
                  gap: '1rem',
                  flexWrap: isMobile ? 'wrap' : 'nowrap'
                }}>
                  <div style={{ flex: 1, minWidth: '0' }}>
                    <h4 style={{ 
                      margin: '0 0 0.25rem 0', 
                      fontSize: '1rem', 
                      fontWeight: '600',
                      color: '#f5f5f5'
                    }}>
                      {user.name}
                    </h4>
                    <p style={{ 
                      margin: '0 0 0.25rem 0', 
                      fontSize: '0.875rem', 
                      color: '#ccc',
                      wordBreak: 'break-word'
                    }}>
                      {user.email}
                    </p>
                    <p style={{ 
                      margin: '0', 
                      fontSize: '0.875rem', 
                      color: '#fcd29f',
                      fontWeight: '500'
                    }}>
                      {user.role} {user.company !== '-' && `• ${user.company}`}
                    </p>
                  </div>
                  <span style={{
                    fontSize: '0.75rem',
                    color: '#4ade80',
                    background: 'rgba(74, 222, 128, 0.15)',
                    padding: '0.25rem 0.75rem',
                    borderRadius: '8px',
                    fontWeight: '600',
                    flexShrink: 0
                  }}>
                    {user.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  const RecruiterView = () => (
    <div style={{ width: '100%', maxWidth: '100%', overflow: 'hidden' }}>
      {/* Stats Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: isMobile ? '1fr' : 'repeat(auto-fit, minmax(280px, 1fr))',
        gap: '1rem',
        marginBottom: '2rem'
      }}>
        {recruiterStats.map((stat, index) => (
          <StatCard key={index} stat={stat} index={index} />
        ))}
      </div>

      {/* Candidates Section */}
      <div style={{
        background: 'rgba(255, 255, 255, 0.1)',
        backdropFilter: 'blur(20px)',
        border: '1px solid rgba(255, 255, 255, 0.15)',
        borderRadius: '16px',
        padding: '1.5rem',
        width: '100%',
        boxSizing: 'border-box'
      }}>
        <h3 style={{ 
          margin: '0 0 1.5rem', 
          fontSize: '1.25rem', 
          fontWeight: '700',
          color: '#f5f5f5'
        }}>
          Registered Candidates
        </h3>
        
        {/* Mobile Card View */}
        {isMobile ? (
          <div>
            {candidates.map((candidate) => (
              <div key={candidate.id} style={{
                background: '#2c3e50',
                borderRadius: '12px',
                padding: '1.25rem',
                marginBottom: '1rem',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                transition: 'all 0.3s ease'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'rgba(44, 62, 80, 0.8)';
                e.currentTarget.style.transform = 'translateY(-2px)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = '#2c3e50';
                e.currentTarget.style.transform = 'translateY(0)';
              }}>
                <div style={{ 
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  alignItems: 'flex-start',
                  marginBottom: '1rem'
                }}>
                  <div style={{ flex: 1 }}>
                    <h4 style={{ 
                      margin: '0 0 0.25rem 0', 
                      fontSize: '1.1rem', 
                      fontWeight: '600',
                      color: '#f5f5f5'
                    }}>
                      {candidate.name}
                    </h4>
                    <p style={{ 
                      margin: '0', 
                      fontSize: '0.9rem', 
                      color: '#ccc'
                    }}>
                      {candidate.role} • {candidate.experience}
                    </p>
                  </div>
                  <span style={{
                    fontSize: '0.75rem',
                    color: candidate.status === 'Available' ? '#4ade80' : 
                           candidate.status === 'Hired' ? '#fcd29f' : '#60a5fa',
                    background: candidate.status === 'Available' ? 'rgba(74, 222, 128, 0.15)' : 
                               candidate.status === 'Hired' ? 'rgba(252, 210, 159, 0.15)' : 'rgba(96, 165, 250, 0.15)',
                    padding: '0.35rem 0.75rem',
                    borderRadius: '8px',
                    fontWeight: '600'
                  }}>
                    {candidate.status}
                  </span>
                </div>
                
                <div style={{ 
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  alignItems: 'center',
                  gap: '1rem'
                }}>
                  <p style={{ 
                    margin: 0, 
                    fontSize: '0.875rem', 
                    color: '#fcd29f',
                    flex: 1,
                    fontWeight: '500'
                  }}>
                    Skills: {candidate.skills}
                  </p>
                  <button style={{
                    background: 'linear-gradient(to right, #fbd7a1, #c9953e)',
                    border: 'none',
                    borderRadius: '10px',
                    padding: '0.6rem 1rem',
                    color: '#000',
                    fontSize: '0.8rem',
                    fontWeight: '700',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    flexShrink: 0,
                    transition: 'all 0.3s ease'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'scale(1.05)';
                    e.currentTarget.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.2)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'scale(1)';
                    e.currentTarget.style.boxShadow = 'none';
                  }}>
                    <Download size={14} />
                    CV
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          /* Desktop Table View */
          <div style={{ 
            overflowX: 'auto'
          }}>
            <table style={{ 
              width: '100%', 
              borderCollapse: 'collapse', 
              minWidth: '700px'
            }}>
              <thead>
                <tr style={{ borderBottom: '2px solid rgba(255, 255, 255, 0.2)' }}>
                  <th style={{ 
                    padding: '1rem', 
                    textAlign: 'left', 
                    fontSize: '0.875rem', 
                    color: '#ccc',
                    fontWeight: '600'
                  }}>
                    Name
                  </th>
                  <th style={{ 
                    padding: '1rem', 
                    textAlign: 'left', 
                    fontSize: '0.875rem', 
                    color: '#ccc',
                    fontWeight: '600'
                  }}>
                    Role
                  </th>
                  <th style={{ 
                    padding: '1rem', 
                    textAlign: 'left', 
                    fontSize: '0.875rem', 
                    color: '#ccc',
                    fontWeight: '600'
                  }}>
                    Experience
                  </th>
                  <th style={{ 
                    padding: '1rem', 
                    textAlign: 'left', 
                    fontSize: '0.875rem', 
                    color: '#ccc',
                    fontWeight: '600'
                  }}>
                    Skills
                  </th>
                  <th style={{ 
                    padding: '1rem', 
                    textAlign: 'left', 
                    fontSize: '0.875rem', 
                    color: '#ccc',
                    fontWeight: '600'
                  }}>
                    Status
                  </th>
                  <th style={{ 
                    padding: '1rem', 
                    textAlign: 'center', 
                    fontSize: '0.875rem', 
                    color: '#ccc',
                    fontWeight: '600'
                  }}>
                    CV
                  </th>
                </tr>
              </thead>
              <tbody>
                {candidates.map((candidate) => (
                  <tr key={candidate.id} style={{
                    borderBottom: '1px solid rgba(255, 255, 255, 0.2)',
                    transition: 'all 0.3s ease'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = '#2c3e50';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = 'transparent';
                  }}>
                    <td style={{ padding: '1rem' }}>
                      <div style={{ 
                        fontWeight: '600', 
                        fontSize: '0.9rem',
                        color: '#f5f5f5'
                      }}>
                        {candidate.name}
                      </div>
                    </td>
                    <td style={{ 
                      padding: '1rem', 
                      fontSize: '0.875rem', 
                      color: '#ccc'
                    }}>
                      {candidate.role}
                    </td>
                    <td style={{ 
                      padding: '1rem', 
                      fontSize: '0.875rem', 
                      color: '#ccc'
                    }}>
                      {candidate.experience}
                    </td>
                    <td style={{ 
                      padding: '1rem', 
                      fontSize: '0.875rem', 
                      color: '#fcd29f',
                      fontWeight: '500'
                    }}>
                      {candidate.skills}
                    </td>
                    <td style={{ padding: '1rem' }}>
                      <span style={{
                        fontSize: '0.75rem',
                        color: candidate.status === 'Available' ? '#4ade80' : 
                               candidate.status === 'Hired' ? '#fcd29f' : '#60a5fa',
                        background: candidate.status === 'Available' ? 'rgba(74, 222, 128, 0.15)' : 
                                   candidate.status === 'Hired' ? 'rgba(252, 210, 159, 0.15)' : 'rgba(96, 165, 250, 0.15)',
                        padding: '0.4rem 0.8rem',
                        borderRadius: '8px',
                        fontWeight: '600'
                      }}>
                        {candidate.status}
                      </span>
                    </td>
                    <td style={{ padding: '1rem', textAlign: 'center' }}>
                      <button style={{
                        background: 'linear-gradient(to right, #fbd7a1, #c9953e)',
                        border: 'none',
                        borderRadius: '10px',
                        padding: '0.5rem 1rem',
                        color: '#000',
                        fontSize: '0.8rem',
                        fontWeight: '700',
                        cursor: 'pointer',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '0.4rem',
                        transition: 'all 0.3s ease'
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.transform = 'scale(1.05)';
                        e.currentTarget.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.2)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.transform = 'scale(1)';
                        e.currentTarget.style.boxShadow = 'none';
                      }}>
                        <Download size={14} />
                        CV
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #0f2027, #203a43, #2c5364)',
      color: '#f5f5f5',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      width: '100%',
      overflow: 'hidden'
    }}>
      {/* Header */}
      <header style={{
        background: 'rgba(255, 255, 255, 0.1)',
        backdropFilter: 'blur(20px)',
        borderBottom: '1px solid rgba(255, 255, 255, 0.2)',
        padding: isMobile ? '1rem' : '1.5rem 2rem',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        position: 'sticky',
        top: 0,
        zIndex: 100,
        flexWrap: isMobile ? 'wrap' : 'nowrap',
        gap: '1rem'
      }}>
        <h1 onClick={() => navigate("/postjob")} style={{
          fontSize: isMobile ? '1.5rem' : '2rem',
          fontWeight: '800',
        //   background: 'linear-gradient(135deg, #fcd29f, #d4a056)',
          WebkitBackgroundClip: 'text',
        //   WebkitTextFillColor: 'transparent',
          margin: 0,
          flexShrink: 0,
          color:'#fcd29f'
        }}>
          WorkVerse
        </h1>
        
        <div style={{ 
          display: 'flex', 
          alignItems: 'center', 
          gap: isMobile ? '0.75rem' : '1.5rem',
          flexWrap: 'wrap'
        }}>
          <select
            value={userRole}
            onChange={(e) => setUserRole(e.target.value)}
            style={{
              background: 'rgba(255, 255, 255, 0.1)',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              borderRadius: '12px',
              padding: '0.75rem 1rem',
              color: '#f5f5f5',
              fontSize: '0.9rem',
              fontWeight: '500'
            }}
          >
            <option value="admin" style={{ background: '#203a43', color: '#f5f5f5' }}>Admin Dashboard</option>
            <option value="recruiter" style={{ background: '#203a43', color: '#f5f5f5' }}>Recruiter Dashboard</option>
          </select>
          
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            color: '#fcd29f',
            background: 'rgba(252, 210, 159, 0.1)',
            padding: '0.75rem 1rem',
            borderRadius: '12px',
            border: '1px solid rgba(252, 210, 159, 0.2)'
          }}>
            {userRole === 'admin' ? <Shield size={18} /> : <UserCheck size={18} />}
            <span style={{ fontSize: '0.9rem', fontWeight: '600' }}>
              {userRole === 'admin' ? 'Admin' : 'Recruiter'}
            </span>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main style={{ 
        padding: isMobile ? '1rem' : '2rem',
        width: '100%',
        maxWidth: '100%',
        boxSizing: 'border-box'
      }}>
        {userRole === 'admin' ? <AdminView /> : <RecruiterView />}
      </main>
    </div>
  );
};

export default Dashboard;