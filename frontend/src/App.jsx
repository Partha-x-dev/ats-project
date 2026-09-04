import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import axios from 'axios';
import RecruiterDashboard from './components/RecruiterDashboard';
import Analytics from './components/Analytics';
import './App.css';

function ApplicationForm() {
  const [jobs, setJobs] = useState([]);
  const [formData, setFormData] = useState({
    job_id: '',
    name: '',
    email: '',
    resume: null
  });
  const [message, setMessage] = useState('');

  useEffect(() => {
    axios.get('http://127.0.0.1:8000/jobs')
      .then(response => {
        setJobs(response.data);
        if (response.data.length > 0) {
          setFormData(prev => ({ ...prev, job_id: response.data[0].id }));
        }
      })
      .catch(error => console.error("Error fetching jobs:", error));
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    setFormData({ ...formData, resume: e.target.files[0] });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = new FormData();
    data.append('job_id', formData.job_id);
    data.append('name', formData.name);
    data.append('email', formData.email);
    data.append('resume', formData.resume);

    try {
      const response = await axios.post('http://127.0.0.1:8000/apply', data, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      setMessage(response.data.message);
    } catch (error) {
      console.error("Submission error:", error);
      setMessage("Failed to submit application.");
    }
  };

  return (
    <div style={{ maxWidth: '600px', margin: '40px auto', fontFamily: 'Arial, sans-serif', padding: '20px', border: '1px solid #ddd', borderRadius: '8px' }}>
      <h2>Enterprise Job Application Portal</h2>
      {message && <p style={{ color: 'green', fontWeight: 'bold' }}>{message}</p>}
      
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
        <div>
          <label>Select Role:</label><br />
          <select name="job_id" value={formData.job_id} onChange={handleChange} style={{ width: '100%', padding: '8px', marginTop: '5px' }}>
            {jobs.map(job => (
              <option key={job.id} value={job.id}>{job.title} ({job.department})</option>
            ))}
          </select>
        </div>

        <div>
          <label>Full Name:</label><br />
          <input type="text" name="name" value={formData.name} onChange={handleChange} required style={{ width: '100%', padding: '8px', marginTop: '5px' }} />
        </div>

        <div>
          <label>Email Address:</label><br />
          <input type="email" name="email" value={formData.email} onChange={handleChange} required style={{ width: '100%', padding: '8px', marginTop: '5px' }} />
        </div>

        <div>
          <label>Resume (PDF):</label><br />
          <input type="file" accept=".pdf" onChange={handleFileChange} required style={{ width: '100%', marginTop: '5px' }} />
        </div>

        <button type="submit" style={{ padding: '10px', background: '#007BFF', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '16px' }}>
          Submit Application
        </button>
      </form>
    </div>
  );
}

function App() {
  return (
    <Router>
      <nav style={{ background: '#333', padding: '15px', color: 'white', display: 'flex', gap: '20px' }}>
        <Link to="/" style={{ color: 'white', textDecoration: 'none', fontWeight: 'bold' }}>Candidate Portal</Link>
        <Link to="/dashboard" style={{ color: 'white', textDecoration: 'none', fontWeight: 'bold' }}>Recruiter Dashboard</Link>
        <Link to="/analytics" style={{ color: 'white', textDecoration: 'none', fontWeight: 'bold' }}>Analytics</Link>
      </nav>
      <Routes>
        <Route path="/" element={<ApplicationForm />} />
        <Route path="/dashboard" element={<RecruiterDashboard />} />
        <Route path="/analytics" element={<Analytics />} />
      </Routes>
    </Router>
  );
}

export default App;