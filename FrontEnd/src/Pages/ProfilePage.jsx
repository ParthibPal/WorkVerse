import React, { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { FileText, Upload, CheckCircle, XCircle, Loader2, ArrowLeft } from 'lucide-react';
import '../Css/ProfilePage.css';

const ProfilePage = () => {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [editMode, setEditMode] = useState(false);
  const [form, setForm] = useState({});
  const [missingFields, setMissingFields] = useState([]);
  const [completion, setCompletion] = useState(0);
  const [isComplete, setIsComplete] = useState(false);
  const [cvUploading, setCvUploading] = useState(false);
  const [cvFile, setCvFile] = useState(null);
  const fileInputRef = useRef();
  const [myJobs, setMyJobs] = useState([]);
  const [jobApplicants, setJobApplicants] = useState({});

  // Fetch profile on mount
  useEffect(() => {
    if (!isAuthenticated()) {
      navigate('/login');
      return;
    }
    fetchProfile();
  }, [user]);

  // Fetch jobs for recruiters
  useEffect(() => {
    if (user && user.userType === 'employer') {
      fetchMyJobs();
    }
  }, [user]);

  const fetchProfile = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/profiles/me', {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      if (res.status === 404) {
        setProfile(null);
        setEditMode(true);
        setLoading(false);
        fetchCompletion();
        return;
      }
      const data = await res.json();
      setProfile(data.data.profile);
      setForm({
        ...data.data.profile,
        skills: Array.isArray(data.data.profile.skills) ? data.data.profile.skills.join(', ') : ''
      });
      setLoading(false);
      fetchCompletion();
    } catch (err) {
      setError('Failed to load profile');
      setLoading(false);
    }
  };

  const fetchCompletion = async () => {
    try {
      const res = await fetch('/api/profiles/completion-status', {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      const data = await res.json();
      setCompletion(data.data.completion);
      setIsComplete(data.data.isComplete);
      setMissingFields(data.data.missingFields);
    } catch (err) {
      setCompletion(0);
      setIsComplete(false);
      setMissingFields([]);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    // Handle nested object fields like education.degree
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setForm((prev) => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: value
        }
      }));
    } else {
      setForm((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    try {
      const formToSave = {
        ...form,
        skills: form.skills ? form.skills.split(',').map(s => s.trim()).filter(Boolean) : []
      };
      const res = await fetch('/api/profiles', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(formToSave)
      });
      const data = await res.json();
      if (!data.success) {
        setError(data.message || 'Failed to save profile');
        return;
      }
      setProfile(data.data.profile);
      setEditMode(false);
      setSuccess('Profile updated successfully!');
      fetchCompletion();
    } catch (err) {
      setError('Failed to save profile');
    }
  };

  const handleCvChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setCvFile(e.target.files[0]);
    }
  };

  const handleCvUpload = async () => {
    if (!cvFile) return;
    setCvUploading(true);
    setError('');
    setSuccess('');
    try {
      const formData = new FormData();
      formData.append('cv', cvFile);
      const res = await fetch('/api/profiles/upload-cv', {
        method: 'POST',
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        body: formData
      });
      const data = await res.json();
      if (!data.success) {
        setError(data.message || 'Failed to upload CV');
        setCvUploading(false);
        return;
      }
      setProfile((prev) => ({ ...prev, cvFile: data.data.cvFile }));
      setSuccess('CV uploaded successfully!');
      setCvUploading(false);
      setCvFile(null);
      fetchCompletion();
    } catch (err) {
      setError('Failed to upload CV');
      setCvUploading(false);
    }
  };

  const handleBack = () => {
    navigate(-1); // Go back to previous page
  };

  const fetchMyJobs = async () => {
    try {
      const res = await fetch('/api/jobs/employer/my-jobs', {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      const data = await res.json();
      if (data.success) {
        setMyJobs(data.data.jobs);
        // Fetch applicants for each job
        data.data.jobs.forEach(job => fetchApplicantsForJob(job._id));
      }
    } catch (err) {
      // Optionally handle error
    }
  };

  const fetchApplicantsForJob = async (jobId) => {
    try {
      const res = await fetch(`/api/applications/job/${jobId}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      const data = await res.json();
      if (data.success) {
        setJobApplicants(prev => ({ ...prev, [jobId]: data.data.applications }));
      }
    } catch (err) {
      // Optionally handle error
    }
  };

  if (loading) {
    return <div className="profile-page"><Loader2 className="spin" /> Loading...</div>;
  }

  return (
    <div className="profile-page" style={{ maxWidth: 700, margin: '2rem auto', background: 'rgba(255,255,255,0.05)', borderRadius: 16, padding: 32, boxShadow: '0 4px 24px rgba(0,0,0,0.08)' }}>
      {/* Header with Back Button */}
      <div style={{ display: 'flex', alignItems: 'center', marginBottom: '2rem', gap: '1rem' }}>
        <button 
          onClick={handleBack}
          style={{
            background: 'rgba(252, 210, 159, 0.2)',
            border: '1px solid rgba(252, 210, 159, 0.3)',
            borderRadius: '8px',
            padding: '0.5rem',
            color: '#fcd29f',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transition: 'all 0.3s ease'
          }}
          onMouseEnter={(e) => {
            e.target.style.background = 'rgba(252, 210, 159, 0.3)';
            e.target.style.transform = 'translateX(-2px)';
          }}
          onMouseLeave={(e) => {
            e.target.style.background = 'rgba(252, 210, 159, 0.2)';
            e.target.style.transform = 'translateX(0)';
          }}
        >
          <ArrowLeft size={20} />
        </button>
        <h2 style={{ fontWeight: 700, fontSize: '2rem', margin: 0, flex: 1 }}>My Profile</h2>
      </div>
      <div style={{ marginBottom: 16, color: isComplete ? '#4ade80' : '#f59e0b', fontWeight: 600 }}>
        Profile Completion: <span>{completion}%</span>
        {isComplete ? <CheckCircle size={18} style={{ marginLeft: 8, color: '#4ade80' }} /> : <XCircle size={18} style={{ marginLeft: 8, color: '#f59e0b' }} />}
      </div>
      {!isComplete && missingFields.length > 0 && (
        <div style={{ background: '#fffbe6', color: '#b45309', borderRadius: 8, padding: 12, marginBottom: 16 }}>
          <b>Complete your profile to apply for jobs!</b>
          <ul style={{ margin: 0, paddingLeft: 20 }}>
            {missingFields.map((field, idx) => <li key={idx}>{field}</li>)}
          </ul>
        </div>
      )}
      {error && <div style={{ color: '#ef4444', marginBottom: 12 }}>{error}</div>}
      {success && <div style={{ color: '#22c55e', marginBottom: 12 }}>{success}</div>}
      <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        <div style={{ display: 'flex', gap: 16 }}>
          <div style={{ flex: 1 }}>
            <label>First Name *</label>
            <input name="firstName" value={form.firstName || ''} onChange={handleChange} required disabled={!editMode} />
          </div>
          <div style={{ flex: 1 }}>
            <label>Last Name *</label>
            <input name="lastName" value={form.lastName || ''} onChange={handleChange} required disabled={!editMode} />
          </div>
        </div>
        <div style={{ display: 'flex', gap: 16 }}>
          <div style={{ flex: 1 }}>
            <label>Phone</label>
            <input name="phone" value={form.phone || ''} onChange={handleChange} disabled={!editMode} />
          </div>
          <div style={{ flex: 1 }}>
            <label>Headline</label>
            <input name="headline" value={form.headline || ''} onChange={handleChange} disabled={!editMode} />
          </div>
        </div>
        <div>
          <label>Summary</label>
          <textarea name="summary" value={form.summary || ''} onChange={handleChange} rows={3} disabled={!editMode} />
        </div>
        <div style={{ display: 'flex', gap: 16 }}>
          <div style={{ flex: 1 }}>
            <label>Skills (comma separated)</label>
            <input name="skills" value={form.skills || ''} onChange={handleChange} disabled={!editMode} />
          </div>
          <div style={{ flex: 1 }}>
            <label>LinkedIn</label>
            <input name="linkedin" value={form.linkedin || ''} onChange={handleChange} disabled={!editMode} />
          </div>
        </div>
        <div style={{ display: 'flex', gap: 16 }}>
          <div style={{ flex: 1 }}>
            <label>GitHub</label>
            <input name="github" value={form.github || ''} onChange={handleChange} disabled={!editMode} />
          </div>
          <div style={{ flex: 1 }}>
            <label>Portfolio</label>
            <input name="portfolio" value={form.portfolio || ''} onChange={handleChange} disabled={!editMode} />
          </div>
        </div>
        <div style={{ display: 'flex', gap: 16 }}>
          <div style={{ flex: 1 }}>
            <label>Degree</label>
            <input name="education.degree" value={form.education?.degree || ''} onChange={handleChange} disabled={!editMode} />
          </div>
          <div style={{ flex: 1 }}>
            <label>Institution</label>
            <input name="education.institution" value={form.education?.institution || ''} onChange={handleChange} disabled={!editMode} />
          </div>
        </div>
        <div style={{ display: 'flex', gap: 16 }}>
          <div style={{ flex: 1 }}>
            <label>Graduation Year</label>
            <input name="education.graduationYear" type="number" value={form.education?.graduationYear || ''} onChange={handleChange} disabled={!editMode} />
          </div>
          <div style={{ flex: 1 }}>
            <label>Field of Study</label>
            <input name="education.fieldOfStudy" value={form.education?.fieldOfStudy || ''} onChange={handleChange} disabled={!editMode} />
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <div style={{ flex: 1 }}>
            <label>CV/Resume</label>
            {profile && profile.cvFile && profile.cvFile.fileUrl ? (
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <a href={profile.cvFile.fileUrl} target="_blank" rel="noopener noreferrer" style={{ color: '#2563eb', textDecoration: 'underline' }}>
                  <FileText size={18} /> {profile.cvFile.fileName}
                </a>
                <span style={{ color: '#888', fontSize: 12 }}>({(profile.cvFile.fileSize / 1024).toFixed(1)} KB)</span>
              </div>
            ) : (
              <span style={{ color: '#888', fontSize: 12 }}>No CV uploaded</span>
            )}
          </div>
          <div style={{ flex: 1 }}>
            <input type="file" accept=".pdf,.doc,.docx" style={{ display: 'none' }} ref={fileInputRef} onChange={handleCvChange} />
            <button type="button" onClick={() => fileInputRef.current.click()} disabled={!editMode || cvUploading} style={{ background: '#fcd29f', color: '#222', border: 'none', borderRadius: 6, padding: '0.5rem 1rem', fontWeight: 600, cursor: 'pointer' }}>
              <Upload size={16} style={{ marginRight: 6 }} /> Upload CV
            </button>
            {cvFile && (
              <span style={{ marginLeft: 8 }}>{cvFile.name} <button type="button" onClick={() => setCvFile(null)} style={{ color: '#ef4444', border: 'none', background: 'none', cursor: 'pointer' }}>x</button></span>
            )}
            {cvFile && (
              <button type="button" onClick={handleCvUpload} disabled={cvUploading} style={{ marginLeft: 8, background: '#4ade80', color: '#222', border: 'none', borderRadius: 6, padding: '0.5rem 1rem', fontWeight: 600, cursor: 'pointer' }}>
                {cvUploading ? <Loader2 className="spin" size={16} /> : 'Upload'}
              </button>
            )}
          </div>
        </div>
        <div style={{ display: 'flex', gap: 16, marginTop: 16 }}>
          {editMode ? (
            <>
              <button type="submit" style={{ background: '#4ade80', color: '#222', border: 'none', borderRadius: 6, padding: '0.75rem 2rem', fontWeight: 700, cursor: 'pointer' }}>Save</button>
              <button type="button" onClick={() => { setEditMode(false); setForm(profile); setError(''); setSuccess(''); }} style={{ background: '#fcd29f', color: '#222', border: 'none', borderRadius: 6, padding: '0.75rem 2rem', fontWeight: 700, cursor: 'pointer' }}>Cancel</button>
            </>
          ) : (
            <button type="button" onClick={() => setEditMode(true)} style={{ background: '#fcd29f', color: '#222', border: 'none', borderRadius: 6, padding: '0.75rem 2rem', fontWeight: 700, cursor: 'pointer' }}>Edit Profile</button>
          )}
        </div>
      </form>
      {user && user.userType === 'employer' && (
        <div style={{ marginTop: 32 }}>
          <h2 style={{ fontWeight: 700, fontSize: '1.5rem', marginBottom: 16 }}>My Posted Jobs & Applicants</h2>
          {myJobs.length === 0 ? (
            <div style={{ color: '#888' }}>You have not posted any jobs yet.</div>
          ) : (
            myJobs.map(job => (
              <div key={job._id} style={{ marginBottom: 32, padding: 16, border: '1px solid #fcd29f', borderRadius: 8, background: 'rgba(252,210,159,0.05)' }}>
                <div style={{ fontWeight: 600, fontSize: '1.1rem', marginBottom: 8 }}>{job.jobTitle}</div>
                <div style={{ color: '#888', marginBottom: 8 }}>{job.jobLocation} | {job.jobType}</div>
                <div style={{ fontWeight: 500, marginBottom: 8 }}>Applicants:</div>
                {jobApplicants[job._id] && jobApplicants[job._id].length > 0 ? (
                  <ul style={{ paddingLeft: 20 }}>
                    {jobApplicants[job._id].map(app => (
                      <li key={app._id} style={{ marginBottom: 8 }}>
                        <span style={{ fontWeight: 500 }}>{app.applicantId?.firstName} {app.applicantId?.lastName}</span>
                        {app.applicantId?.email && <span style={{ color: '#888', marginLeft: 8 }}>({app.applicantId.email})</span>}
                        {app.cvFile && app.cvFile.fileUrl && (
                          <a href={app.cvFile.fileUrl} target="_blank" rel="noopener noreferrer" style={{ marginLeft: 12, color: '#2563eb', textDecoration: 'underline' }}>CV</a>
                        )}
                        <span style={{ color: '#888', marginLeft: 8 }}>Status: {app.status}</span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <div style={{ color: '#aaa' }}>No applicants yet.</div>
                )}
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default ProfilePage; 