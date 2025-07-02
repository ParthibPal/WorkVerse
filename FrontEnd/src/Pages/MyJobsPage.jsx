import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Briefcase } from 'lucide-react';

const MyJobsPage = () => {
  const { user, token, getUserType } = useAuth();
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const userRole = getUserType();
  const [actionLoading, setActionLoading] = useState({});
  const [actionError, setActionError] = useState({});

  useEffect(() => {
    if (userRole === 'employer') {
      fetchMyJobs();
    } else {
      setLoading(false);
      setError('You are not authorized to view this page.');
    }
    // eslint-disable-next-line
  }, [userRole]);

  const fetchMyJobs = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await fetch('http://localhost:5000/api/jobs/employer/my-jobs', {
        headers: { 'Authorization': `Bearer ${user?.token || token}` }
      });
      if (!res.ok) throw new Error('Failed to fetch jobs');
      const data = await res.json();
      setJobs(data.data.jobs || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

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
      await fetchMyJobs();
    } catch (err) {
      setActionError(prev => ({ ...prev, [jobId]: err.message }));
    } finally {
      setActionLoading(prev => ({ ...prev, [jobId]: false }));
    }
  };

  const handleUpdateStatus = async (jobId, status) => {
    setActionLoading(prev => ({ ...prev, [jobId]: true }));
    setActionError(prev => ({ ...prev, [jobId]: '' }));
    try {
      const res = await fetch(`http://localhost:5000/api/jobs/${jobId}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${user?.token || token}`
        },
        body: JSON.stringify({ jobStatus: status })
      });
      if (!res.ok) throw new Error('Failed to update job status');
      await fetchMyJobs();
    } catch (err) {
      setActionError(prev => ({ ...prev, [jobId]: err.message }));
    } finally {
      setActionLoading(prev => ({ ...prev, [jobId]: false }));
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #0f2027, #203a43, #2c5364)',
      color: '#f5f5f5',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      width: '100%',
      padding: '2rem',
      boxSizing: 'border-box'
    }}>
      <h1 style={{ fontSize: '2rem', fontWeight: '800', color: '#fcd29f', marginBottom: '2rem' }}>
        <Briefcase size={28} style={{ marginRight: '0.5rem', verticalAlign: 'middle' }} />
        My Job Posts
      </h1>
      {loading ? (
        <div>Loading your jobs...</div>
      ) : error ? (
        <div style={{ color: 'red' }}>{error}</div>
      ) : jobs.length === 0 ? (
        <div>You have not posted any jobs yet.</div>
      ) : (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          gap: '1.5rem',
          width: '100%'
        }}>
          {jobs.map(job => (
            <div key={job._id} style={{
              background: '#2c3e50',
              borderRadius: '16px',
              padding: '1.5rem',
              border: '1px solid rgba(255,255,255,0.15)',
              boxShadow: '0 4px 24px rgba(0,0,0,0.12)',
              display: 'flex',
              flexDirection: 'column',
              gap: '0.5rem'
            }}>
              <h2 style={{ color: '#fcd29f', fontSize: '1.25rem', fontWeight: '700', margin: 0 }}>{job.title}</h2>
              <div style={{ color: '#ccc', fontSize: '1rem', marginBottom: '0.5rem' }}>{job.companyName}</div>
              <div style={{ color: '#aaa', fontSize: '0.95rem' }}>Status: <span style={{ color: '#4ade80' }}>{job.jobStatus}</span></div>
              <div style={{ color: '#aaa', fontSize: '0.9rem' }}>Posted: {new Date(job.createdAt).toLocaleDateString()}</div>
              <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.5rem' }}>
                <button
                  type="button"
                  className="btn btn-danger"
                  disabled={actionLoading[job._id]}
                  onClick={() => handleDeleteJob(job._id)}
                  style={{ background: '#e74c3c', color: '#fff', border: 'none', borderRadius: '6px', padding: '0.4rem 0.8rem', cursor: 'pointer' }}
                >
                  {actionLoading[job._id] ? 'Removing...' : 'Remove'}
                </button>
                <button
                  type="button"
                  className="btn btn-secondary"
                  disabled={actionLoading[job._id]}
                  onClick={() => handleUpdateStatus(job._id, job.jobStatus === 'paused' ? 'active' : 'paused')}
                  style={{ background: '#fcd29f', color: '#222', border: 'none', borderRadius: '6px', padding: '0.4rem 0.8rem', cursor: 'pointer' }}
                >
                  {actionLoading[job._id] ? (job.jobStatus === 'paused' ? 'Activating...' : 'Pausing...') : (job.jobStatus === 'paused' ? 'Activate' : 'Mark Inactive')}
                </button>
                <button
                  type="button"
                  className="btn btn-secondary"
                  disabled={actionLoading[job._id]}
                  onClick={() => handleUpdateStatus(job._id, 'closed')}
                  style={{ background: '#4ade80', color: '#222', border: 'none', borderRadius: '6px', padding: '0.4rem 0.8rem', cursor: 'pointer' }}
                >
                  {actionLoading[job._id] ? 'Filling...' : 'Position Filled'}
                </button>
              </div>
              {actionError[job._id] && <div style={{ color: 'red', marginTop: '0.3rem' }}>{actionError[job._id]}</div>}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyJobsPage; 