import React, { useState, useEffect } from 'react';
import axios from 'axios';

function RecruiterDashboard() {
  const [candidates, setCandidates] = useState([]);

  useEffect(() => {
    fetchCandidates();
  }, []);

  const fetchCandidates = async () => {
    try {
      const response = await axios.get('http://127.0.0.1:8000/candidates');
      setCandidates(response.data);
    } catch (error) {
      console.error("Error fetching candidates:", error);
    }
  };

  const updateStatus = async (id, newStatus) => {
    try {
      await axios.put(`http://127.0.0.1:8000/candidates/${id}/status`, { status: newStatus });
      fetchCandidates();
    } catch (error) {
      console.error("Error updating status:", error);
    }
  };

  const stages = ['Applied', 'Reviewed', 'Interviewing', 'Hired', 'Rejected'];

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <h2>Recruiter Kanban Pipeline</h2>
      <div style={{ display: 'flex', gap: '15px', overflowX: 'auto', paddingBottom: '20px' }}>
        {stages.map(stage => (
          <div key={stage} style={{ background: '#f4f5f7', borderRadius: '6px', minWidth: '250px', padding: '15px', border: '1px solid #ddd' }}>
            <h3 style={{ borderBottom: '2px solid #007BFF', paddingBottom: '5px' }}>{stage}</h3>
            {candidates.filter(c => c.status === stage).map(candidate => (
              <div key={candidate.id} style={{ background: 'white', padding: '10px', margin: '10px 0', borderRadius: '4px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
                <strong>{candidate.name}</strong><br />
                <small>{candidate.email}</small><br />
                <div style={{ marginTop: '10px' }}>
                  <select 
                    value={candidate.status} 
                    onChange={(e) => updateStatus(candidate.id, e.target.value)}
                    style={{ width: '100%', padding: '4px' }}
                  >
                    {stages.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

export default RecruiterDashboard;