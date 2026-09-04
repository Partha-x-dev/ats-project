import React, { useState, useEffect } from 'react';
import axios from 'axios';

function Analytics() {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    axios.get('http://127.0.0.1:8000/analytics')
      .then(response => setStats(response.data))
      .catch(error => console.error("Error fetching analytics:", error));
  }, []);

  if (!stats) return <div style={{ padding: '20px' }}>Loading analytics...</div>;

  return (
    <div style={{ maxWidth: '800px', margin: '40px auto', fontFamily: 'Arial, sans-serif', padding: '20px', border: '1px solid #ddd', borderRadius: '8px' }}>
      <h2>Recruitment Analytics & Insights</h2>
      
      <div style={{ display: 'flex', gap: '20px', margin: '20px 0' }}>
        <div style={{ background: '#f4f5f7', padding: '20px', borderRadius: '6px', flex: 1, textAlign: 'center' }}>
          <h3>Avg Days to Hire</h3>
          <p style={{ fontSize: '24px', fontWeight: 'bold', color: '#007BFF' }}>{stats.average_days_to_hire} Days</p>
        </div>
        <div style={{ background: '#f4f5f7', padding: '20px', borderRadius: '6px', flex: 1, textAlign: 'center' }}>
          <h3>Candidate Drop-Off Rate</h3>
          <p style={{ fontSize: '24px', fontWeight: 'bold', color: '#DC3545' }}>{stats.drop_off_rate_percentage}%</p>
        </div>
      </div>

      <h3>Role Applicant Volume</h3>
      <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '10px' }}>
        <thead>
          <tr style={{ background: '#333', color: 'white' }}>
            <th style={{ padding: '10px', textAlign: 'left' }}>Job Title</th>
            <th style={{ padding: '10px', textAlign: 'center' }}>Total Applicants</th>
          </tr>
        </thead>
        <tbody>
          {stats.role_velocity.map((role, index) => (
            <tr key={index} style={{ borderBottom: '1px solid #ddd' }}>
              <td style={{ padding: '10px' }}>{role.title}</td>
              <td style={{ padding: '10px', textAlign: 'center' }}>{role.total_applicants}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default Analytics;