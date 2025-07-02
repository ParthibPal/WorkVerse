import React, { useState, useEffect } from 'react';
import { Users, Briefcase, Eye, FileText, Download, MoreVertical, Shield, UserCheck, LogOut } from 'lucide-react';
import {useNavigate} from "react-router-dom";
import { useAuth } from '../context/AuthContext';

const Dashboard = () => {
  const { user, getUserType, logout, token } = useAuth();
  const [isMobile, setIsMobile] = useState(false);
  const navigate = useNavigate();
  
  // Get user role from context
  const userRole = getUserType();
  const isAdmin = user?.isAdmin || false;
  
  // Real recruiter jobs and applicants
  const [recruiterJobs, setRecruiterJobs] = useState([]);
  const [jobsLoading, setJobsLoading] = useState(true);
  const [jobsError, setJobsError] = useState('');
  const [jobApplicants, setJobApplicants] = useState({});
  const [selectedJobId, setSelectedJobId] = useState(null);
  const [actionLoading, setActionLoading] = useState({});
  const [actionError, setActionError] = useState({});
  
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Handle logout
  const handleLogout = () => {
    logout();
    navigate('/');
  };

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

  const users = [
    { id: 1, name: 'John Smith', email: 'john@techcorp.com', role: 'Recruiter', company: 'TechCorp', status: 'Active' },
    { id: 2, name: 'Sarah Wilson', email: 'sarah@creative.com', role: 'Recruiter', company: 'CreativeLab', status: 'Active' },
    { id: 3, name: 'Alex Thompson', email: 'alex@email.com', role: 'Candidate', company: '-', status: 'Active' },
    { id: 4, name: 'Maria Garcia', email: 'maria@email.com', role: 'Candidate', company: '-', status: 'Active' }
  ];

  // Fetch recruiter's jobs on mount (if recruiter)
  useEffect(() => {
    if (userRole === 'employer') {
      fetchRecruiterJobs();
    }
    // eslint-disable-next-line
  }, [userRole]);

  const fetchRecruiterJobs = async () => {
    setJobsLoading(true);
    setJobsError('');
    try {
      const res = await fetch('http://localhost:5000/api/jobs/employer/my-jobs', {
        headers: { 'Authorization': `Bearer ${user?.token || token}` }
      });
      if (!res.ok) throw new Error('Failed to fetch jobs');
      const data = await res.json();
      setRecruiterJobs(data.data.jobs || []);
      if (data.data.jobs && data.data.jobs.length > 0) {
        setSelectedJobId(data.data.jobs[0]._id);
      }
    } catch (err) {
      setJobsError(err.message);
    } finally {
      setJobsLoading(false);
    }
  };

  // Fetch applicants for a job when the recruiterJobs are loaded
  useEffect(() => {
    if (selectedJobId) {
      fetchApplicantsForJob(selectedJobId);
    }
    // eslint-disable-next-line
  }, [selectedJobId]);

  const fetchApplicantsForJob = async (jobId) => {
    setJobApplicants(prev => ({ ...prev, [jobId]: { loading: true, error: '', applicants: [] } }));
    try {
      const res = await fetch(`http://localhost:5000/api/applications/job/${jobId}`, {
        headers: { 'Authorization': `Bearer ${user?.token || token}` }
      });
      if (!res.ok) throw new Error('Failed to fetch applicants');
      const data = await res.json();
      setJobApplicants(prev => ({ ...prev, [jobId]: { loading: false, error: '', applicants: data.data.applications || [] } }));
    } catch (err) {
      setJobApplicants(prev => ({ ...prev, [jobId]: { loading: false, error: err.message, applicants: [] } }));
    }
  };

  // Handler to delete a job
  const handleDeleteJob = async (jobId) => {
    if (!window.confirm('Are you sure you want to delete this job?')) return;
    setActionLoading(prev => ({ ...prev, [jobId]: true }));
    setActionError(prev => ({ ...prev, [jobId]: '' }));
    try {
      const res = await fetch(`http://localhost:5000/api/jobs/${jobId}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${user?.token || token}` }
      });
      if (!res.ok) throw new Error('Failed to delete job');
      await fetchRecruiterJobs();
    } catch (err) {
      setActionError(prev => ({ ...prev, [jobId]: err.message }));
    } finally {
      setActionLoading(prev => ({ ...prev, [jobId]: false }));
    }
  };

  // Handler to update job status
  const handleUpdateStatus = async (jobId, newStatus) => {
    setActionLoading(prev => ({ ...prev, [jobId]: true }));
    setActionError(prev => ({ ...prev, [jobId]: '' }));
    try {
      const res = await fetch(`http://localhost:5000/api/jobs/${jobId}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${user?.token || token}`
        },
        body: JSON.stringify({ jobStatus: newStatus })
      });
      const data = await res.json();
      if (!res.ok || !data.success) throw new Error(data.message || 'Failed to update status');
      await fetchRecruiterJobs(); // Refresh jobs
    } catch (err) {
      setActionError(prev => ({ ...prev, [jobId]: err.message }));
    } finally {
      setActionLoading(prev => ({ ...prev, [jobId]: false }));
    }
  };

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
                      color: '#f5f5f5'
                    }}>
                      {job.title}
                    </h4>
                    <p style={{ 
                      margin: '0 0 0.25rem 0', 
                      fontSize: '0.875rem', 
                      color: '#ccc'
                    }}>
                      {job.company} • {job.recruiter}
                    </p>
                    <div style={{ 
                      display: 'flex', 
                      alignItems: 'center', 
                      gap: '1rem',
                      flexWrap: 'wrap'
                    }}>
                      <span style={{
                        fontSize: '0.75rem',
                        color: '#fcd29f',
                        background: 'rgba(252, 210, 159, 0.15)',
                        padding: '0.25rem 0.5rem',
                        borderRadius: '6px',
                        fontWeight: '500'
                      }}>
                        {job.applications} applications
                      </span>
                      <span style={{
                        fontSize: '0.75rem',
                        color: job.status === 'Active' ? '#4ade80' : '#fcd29f',
                        background: job.status === 'Active' ? 'rgba(74, 222, 128, 0.15)' : 'rgba(252, 210, 159, 0.15)',
                        padding: '0.25rem 0.5rem',
                        borderRadius: '6px',
                        fontWeight: '500'
                      }}>
                        {job.status}
                      </span>
                    </div>
                  </div>
                  <button style={{
                    background: 'none',
                    border: 'none',
                    color: '#ccc',
                    cursor: 'pointer',
                    padding: '0.25rem',
                    borderRadius: '4px',
                    transition: 'all 0.3s ease'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.color = '#fcd29f';
                    e.currentTarget.style.background = 'rgba(252, 210, 159, 0.1)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.color = '#ccc';
                    e.currentTarget.style.background = 'none';
                  }}>
                    <MoreVertical size={16} />
                  </button>
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
                      margin: '0 0 0.5rem 0', 
                      fontSize: '1rem', 
                      fontWeight: '600',
                      color: '#f5f5f5'
                    }}>
                      {user.name}
                    </h4>
                    <p style={{ 
                      margin: '0 0 0.25rem 0', 
                      fontSize: '0.875rem', 
                      color: '#ccc'
                    }}>
                      {user.email}
                    </p>
                    <div style={{ 
                      display: 'flex', 
                      alignItems: 'center', 
                      gap: '1rem',
                      flexWrap: 'wrap'
                    }}>
                      <span style={{
                        fontSize: '0.75rem',
                        color: '#fcd29f',
                        background: 'rgba(252, 210, 159, 0.15)',
                        padding: '0.25rem 0.5rem',
                        borderRadius: '6px',
                        fontWeight: '500'
                      }}>
                        {user.role}
                      </span>
                      <span style={{
                        fontSize: '0.75rem',
                        color: '#ccc',
                        background: 'rgba(255, 255, 255, 0.1)',
                        padding: '0.25rem 0.5rem',
                        borderRadius: '6px',
                        fontWeight: '500'
                      }}>
                        {user.company}
                      </span>
                      <span style={{
                        fontSize: '0.75rem',
                        color: user.status === 'Active' ? '#4ade80' : '#f44336',
                        background: user.status === 'Active' ? 'rgba(74, 222, 128, 0.15)' : 'rgba(244, 67, 54, 0.15)',
                        padding: '0.25rem 0.5rem',
                        borderRadius: '6px',
                        fontWeight: '500'
                      }}>
                        {user.status}
                      </span>
                    </div>
                  </div>
                  <button style={{
                    background: 'none',
                    border: 'none',
                    color: '#ccc',
                    cursor: 'pointer',
                    padding: '0.25rem',
                    borderRadius: '4px',
                    transition: 'all 0.3s ease'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.color = '#fcd29f';
                    e.currentTarget.style.background = 'rgba(252, 210, 159, 0.1)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.color = '#ccc';
                    e.currentTarget.style.background = 'none';
                  }}>
                    <MoreVertical size={16} />
                  </button>
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
      {/* Stats Grid (optional, can use real stats if available) */}
      {/* ... keep your StatCard and stats grid if you want ... */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr',
        gap: '1.5rem',
        width: '100%'
      }}>
        {/* My Job Posts (left) */}
        <div style={{
          background: 'rgba(255, 255, 255, 0.1)',
          backdropFilter: 'blur(20px)',
          border: '1px solid rgba(255, 255, 255, 0.15)',
          borderRadius: '16px',
          padding: '1.5rem',
          width: '100%',
          boxSizing: 'border-box',
          minHeight: '350px'
        }}>
          <h3 style={{
            margin: '0 0 1.5rem',
            fontSize: '1.25rem',
            fontWeight: '700',
            color: '#f5f5f5'
          }}>
            My Job Posts
          </h3>
          {jobsLoading ? (
            <div>Loading jobs...</div>
          ) : jobsError ? (
            <div style={{ color: 'red' }}>{jobsError}</div>
          ) : recruiterJobs.length === 0 ? (
            <div>No jobs found.</div>
          ) : (
            <div style={{ maxHeight: '400px', overflowY: 'auto', paddingRight: '0.5rem' }}>
              {recruiterJobs.map((job) => (
                <div
                  key={job._id}
                  style={{
                    background: selectedJobId === job._id ? '#2c3e50' : 'rgba(44, 62, 80, 0.8)',
                    borderRadius: '12px',
                    padding: '1rem',
                    marginBottom: '0.75rem',
                    border: selectedJobId === job._id ? '2px solid #fcd29f' : '1px solid rgba(255, 255, 255, 0.2)',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease'
                  }}
                  onClick={() => setSelectedJobId(job._id)}
                >
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
                        color: '#f5f5f5'
                      }}>{job.jobTitle}</h4>
                      <p style={{
                        margin: '0 0 0.25rem 0',
                        fontSize: '0.875rem',
                        color: '#ccc'
                      }}>{job.companyName}</p>
                      <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '1rem',
                        flexWrap: 'wrap'
                      }}>
                        <span style={{
                          fontSize: '0.75rem',
                          color: '#fcd29f',
                          background: 'rgba(252, 210, 159, 0.15)',
                          padding: '0.25rem 0.5rem',
                          borderRadius: '6px',
                          fontWeight: '500'
                        }}>{job.jobStatus}</span>
                        <span style={{
                          fontSize: '0.75rem',
                          color: '#4ade80',
                          background: 'rgba(74, 222, 128, 0.15)',
                          padding: '0.25rem 0.5rem',
                          borderRadius: '6px',
                          fontWeight: '500'
                        }}>{job.totalApplications || 0} applications</span>
                      </div>
                    </div>
                  </div>
                  {/* Action Buttons */}
                  <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.75rem', flexWrap: 'wrap' }} onClick={e => e.stopPropagation()}>
                    {/* Activate/Inactive Button */}
                    {job.jobStatus === 'paused' && (
                      <button
                        style={{
                          background: 'linear-gradient(to right, #fbd7a1, #c9953e)',
                          border: 'none',
                          borderRadius: '8px',
                          padding: '0.4rem 0.9rem',
                          color: '#000',
                          fontWeight: '700',
                          cursor: 'pointer',
                          fontSize: '0.85rem',
                          transition: 'all 0.2s',
                          opacity: actionLoading[job._id] ? 0.7 : 1
                        }}
                        disabled={actionLoading[job._id]}
                        onClick={() => handleUpdateStatus(job._id, 'active')}
                      >
                        {actionLoading[job._id] ? 'Activating...' : 'Activate'}
                      </button>
                    )}
                    {job.jobStatus === 'active' && (
                      <button
                        style={{
                          background: 'rgba(231, 76, 60, 0.15)',
                          border: '1px solid #e74c3c',
                          borderRadius: '8px',
                          padding: '0.4rem 0.9rem',
                          color: '#e74c3c',
                          fontWeight: '700',
                          cursor: 'pointer',
                          fontSize: '0.85rem',
                          transition: 'all 0.2s',
                          opacity: actionLoading[job._id] ? 0.7 : 1
                        }}
                        disabled={actionLoading[job._id]}
                        onClick={() => handleUpdateStatus(job._id, 'paused')}
                      >
                        {actionLoading[job._id] ? 'Pausing...' : 'Mark Inactive'}
                      </button>
                    )}
                    {/* Activate button for closed jobs */}
                    {job.jobStatus === 'closed' && (
                      <button
                        style={{
                          background: 'linear-gradient(to right, #fbd7a1, #c9953e)',
                          border: 'none',
                          borderRadius: '8px',
                          padding: '0.4rem 0.9rem',
                          color: '#000',
                          fontWeight: '700',
                          cursor: 'pointer',
                          fontSize: '0.85rem',
                          transition: 'all 0.2s',
                          opacity: actionLoading[job._id] ? 0.7 : 1
                        }}
                        disabled={actionLoading[job._id]}
                        onClick={() => handleUpdateStatus(job._id, 'active')}
                      >
                        {actionLoading[job._id] ? 'Activating...' : 'Activate'}
                      </button>
                    )}
                    {/* Position Filled Button (always show unless already closed) */}
                    {job.jobStatus !== 'closed' && (
                      <button
                        style={{
                          background: 'linear-gradient(to right, #b6b6b6, #e0c07c)',
                          border: 'none',
                          borderRadius: '8px',
                          padding: '0.4rem 0.9rem',
                          color: '#333',
                          fontWeight: '700',
                          cursor: 'pointer',
                          fontSize: '0.85rem',
                          transition: 'all 0.2s',
                          opacity: actionLoading[job._id] ? 0.7 : 1
                        }}
                        disabled={actionLoading[job._id]}
                        onClick={() => handleUpdateStatus(job._id, 'closed')}
                      >
                        {actionLoading[job._id] ? 'Filling...' : 'Position Filled'}
                      </button>
                    )}
                  </div>
                  {actionError[job._id] && <div style={{ color: 'red', marginTop: '0.3rem', fontSize: '0.85rem' }}>{actionError[job._id]}</div>}
                </div>
              ))}
            </div>
          )}
        </div>
        {/* Applicants for selected job (right) */}
        <div style={{
          background: 'rgba(255, 255, 255, 0.1)',
          backdropFilter: 'blur(20px)',
          border: '1px solid rgba(255, 255, 255, 0.15)',
          borderRadius: '16px',
          padding: '1.5rem',
          width: '100%',
          boxSizing: 'border-box',
          minHeight: '350px'
        }}>
          <h3 style={{
            margin: '0 0 1.5rem',
            fontSize: '1.25rem',
            fontWeight: '700',
            color: '#f5f5f5'
          }}>
            Applicants
          </h3>
          {!selectedJobId ? (
            <div>Select a job to view applicants.</div>
          ) : jobApplicants[selectedJobId]?.loading ? (
            <div>Loading applicants...</div>
          ) : jobApplicants[selectedJobId]?.error ? (
            <div style={{ color: 'red' }}>{jobApplicants[selectedJobId].error}</div>
          ) : (jobApplicants[selectedJobId]?.applicants?.length === 0 ? (
            <div style={{ color: '#aaa' }}>No applicants for this job.</div>
          ) : (
            <div style={{ maxHeight: '400px', overflowY: 'auto', paddingRight: '0.5rem' }}>
              {(jobApplicants[selectedJobId]?.applicants || []).map((app) => (
                <div key={app._id} style={{
                  background: '#2c3e50',
                  borderRadius: '10px',
                  padding: '0.75rem 1rem',
                  marginBottom: '0.7rem',
                  border: '1px solid rgba(255,255,255,0.10)',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.3rem',
                  transition: 'box-shadow 0.2s'
                }}>
                  <div style={{ fontWeight: '600', fontSize: '0.95rem', color: '#4ade80' }}>{app.applicantName}</div>
                  <div style={{ color: '#ccc', fontSize: '0.9rem' }}>{app.applicantEmail}</div>
                  {app.cvFile?.fileUrl && (
                    <a href={app.cvFile.fileUrl} target="_blank" rel="noopener noreferrer" style={{
                      color: '#fcd29f',
                      textDecoration: 'underline',
                      fontSize: '0.9rem',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '0.3rem',
                      marginTop: '0.2rem'
                    }}>
                      <Download size={14} />
                      Download CV
                    </a>
                  )}
                  <div style={{ color: '#aaa', fontSize: '0.85rem' }}>Status: {app.status}</div>
                  <div style={{ color: '#aaa', fontSize: '0.85rem' }}>Applied: {new Date(app.appliedAt).toLocaleString()}</div>
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const JobseekerView = () => (
    <div style={{ padding: '2rem', textAlign: 'center' }}>
      <h2>Welcome to your Dashboard!</h2>
      <p>Here you will see your job applications, saved jobs, and personalized recommendations soon.</p>
      <p>Stay tuned for more features!</p>
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
          color:'#fcd29f',
          margin: 0,
          flexShrink: 0,
          cursor: 'pointer'
        }}>
          WorkVerse
        </h1>
        
        <div style={{ 
          display: 'flex', 
          alignItems: 'center', 
          gap: isMobile ? '0.75rem' : '1.5rem',
          flexWrap: 'wrap'
        }}>
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
            {isAdmin ? <Shield size={18} /> : <UserCheck size={18} />}
            <span style={{ fontSize: '0.9rem', fontWeight: '600' }}>
              {isAdmin ? 'Admin' : 'Recruiter'}
            </span>
          </div>
          
          {/* Logout Button */}
          <button
            onClick={handleLogout}
            style={{
              background: 'rgba(231, 76, 60, 0.1)',
              border: '1px solid rgba(231, 76, 60, 0.3)',
              color: '#e74c3c',
              padding: '0.75rem 1rem',
              borderRadius: '12px',
              fontSize: '0.9rem',
              fontWeight: '600',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              transition: 'all 0.3s ease',
              fontFamily: 'inherit'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'rgba(231, 76, 60, 0.2)';
              e.currentTarget.style.borderColor = 'rgba(231, 76, 60, 0.5)';
              e.currentTarget.style.transform = 'translateY(-2px)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'rgba(231, 76, 60, 0.1)';
              e.currentTarget.style.borderColor = 'rgba(231, 76, 60, 0.3)';
              e.currentTarget.style.transform = 'translateY(0)';
            }}
          >
            <LogOut size={16} />
            {!isMobile && 'Logout'}
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main style={{ 
        padding: isMobile ? '1rem' : '2rem',
        width: '100%',
        maxWidth: '100%',
        boxSizing: 'border-box'
      }}>
        {isAdmin ? <AdminView /> : <RecruiterView />}
      </main>
    </div>
  );
};

export default Dashboard;