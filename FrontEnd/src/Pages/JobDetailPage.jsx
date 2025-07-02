import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { DollarSign, MapPin, Clock, Building, Users, ArrowRight } from 'lucide-react';

const JobDetailPage = () => {
  const { jobId } = useParams();
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showApplyModal, setShowApplyModal] = useState(false);
  const [cvFile, setCvFile] = useState(null);
  const [coverLetter, setCoverLetter] = useState('');
  const [applyLoading, setApplyLoading] = useState(false);
  const [applyError, setApplyError] = useState('');
  const [applySuccess, setApplySuccess] = useState('');
  const [applied, setApplied] = useState(false);

  useEffect(() => {
    const fetchJob = async () => {
      setLoading(true);
      setError('');
      try {
        const res = await fetch(`http://localhost:5000/api/jobs/${jobId}`);
        const data = await res.json();
        if (!res.ok) throw new Error(data.message || 'Failed to fetch job');
        setJob(data.data.job);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchJob();
  }, [jobId]);

  const openApplyModal = () => {
    setShowApplyModal(true);
    setCvFile(null);
    setCoverLetter('');
    setApplyError('');
    setApplySuccess('');
  };
  const closeApplyModal = () => {
    setShowApplyModal(false);
    setCvFile(null);
    setCoverLetter('');
    setApplyError('');
    setApplySuccess('');
  };
  const handleCvChange = (e) => {
    setCvFile(e.target.files[0]);
  };
  const handleApplySubmit = async (e) => {
    e.preventDefault();
    if (!cvFile) {
      setApplyError('Please upload your CV.');
      return;
    }
    setApplyLoading(true);
    setApplyError('');
    setApplySuccess('');
    try {
      const formData = new FormData();
      formData.append('jobId', job._id);
      formData.append('coverLetter', coverLetter);
      formData.append('cv', cvFile);
      const res = await fetch('http://localhost:5000/api/applications', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: formData
      });
      const result = await res.json();
      if (!res.ok) throw new Error(result.message || 'Failed to apply');
      setApplySuccess('Application submitted successfully!');
      setApplied(true);
      setTimeout(() => closeApplyModal(), 2000);
    } catch (err) {
      setApplyError(err.message);
    } finally {
      setApplyLoading(false);
    }
  };

  if (loading) return <div style={{ padding: '2rem', textAlign: 'center' }}>Loading...</div>;
  if (error) return <div style={{ padding: '2rem', color: 'red', textAlign: 'center' }}>{error}</div>;
  if (!job) return null;

  return (
    <div style={{ maxWidth: 800, margin: '2rem auto', background: '#181f2a', borderRadius: 16, padding: 32, color: '#f5f5f5', boxShadow: '0 4px 24px rgba(0,0,0,0.12)' }}>
      <h1 style={{ fontWeight: 800, fontSize: '2.2rem', marginBottom: 8 }}>{job.jobTitle}</h1>
      <div style={{ color: '#fcd29f', fontWeight: 600, marginBottom: 8 }}><Building size={18} /> {job.companyName}</div>
      <div style={{ display: 'flex', gap: 16, marginBottom: 16 }}>
        <span><MapPin size={16} /> {job.jobLocation}</span>
        <span><Clock size={16} /> {job.jobType}</span>
        <span><DollarSign size={16} /> {job.salaryRange && job.salaryRange.isSalaryVisible ? `${job.salaryRange.currency} ${job.salaryRange.minSalary} - ${job.salaryRange.maxSalary}` : 'Not disclosed'}</span>
      </div>
      <div style={{ marginBottom: 24 }}>
        <strong>Description:</strong>
        <p style={{ marginTop: 8 }}>{job.jobDescription}</p>
      </div>
      <div style={{ marginBottom: 24 }}>
        <strong>Required Skills:</strong>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginTop: 8 }}>
          {job.requiredSkills && job.requiredSkills.map((skill, idx) => (
            <span key={idx} style={{ background: '#232c3d', color: '#fcd29f', padding: '0.3rem 1rem', borderRadius: 12, fontWeight: 500 }}>{skill}</span>
          ))}
        </div>
      </div>
      <div style={{ marginBottom: 24 }}>
        <strong>Applicants:</strong> <Users size={16} /> {job.totalApplications || 0}
      </div>
      <button
        className="apply-btn"
        onClick={openApplyModal}
        disabled={applied}
      >
        {applied ? 'Applied' : 'Apply Now'} <ArrowRight size={18} />
      </button>
      {showApplyModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <button onClick={closeApplyModal} className="modal-close">&times;</button>
            <h2>Apply for: {job.jobTitle}</h2>
            <form onSubmit={handleApplySubmit}>
              <div>
                <label>Upload CV (PDF/DOC):</label>
                <input type="file" accept=".pdf,.doc,.docx" onChange={handleCvChange} required />
              </div>
              <div>
                <label>Cover Letter (optional):</label>
                <textarea
                  value={coverLetter}
                  onChange={e => setCoverLetter(e.target.value)}
                  rows={4}
                  placeholder="Write a short message..."
                />
              </div>
              {applyError && <div style={{ color: 'red', marginBottom: '0.5rem' }}>{applyError}</div>}
              {applySuccess && <div style={{ color: '#4ade80', marginBottom: '0.5rem' }}>{applySuccess}</div>}
              <button
                type="submit"
                disabled={applyLoading}
                className="apply-btn"
              >
                {applyLoading ? 'Submitting...' : 'Submit Application'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default JobDetailPage; 