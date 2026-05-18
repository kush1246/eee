import React, { useState, useEffect } from 'react';
import { User } from 'lucide-react';

const CandidateList = () => {
  const [candidates, setCandidates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCandidates = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/candidates`);
        if (!response.ok) throw new Error('Failed to fetch');
        const data = await response.json();
        setCandidates(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchCandidates();
  }, []);

  if (loading) return <div className="glass-card">Loading candidates...</div>;
  if (error) return <div className="glass-card" style={{ color: '#fca5a5' }}>Error: {error}</div>;

  return (
    <div className="glass-card">
      <h2>All Candidates</h2>
      {candidates.length === 0 ? (
        <p>No candidates found. Add some candidates to get started.</p>
      ) : (
        <div className="grid-2">
          {candidates.map((candidate) => (
            <div key={candidate._id} className="glass-card" style={{ padding: '1.5rem', background: 'rgba(15, 23, 42, 0.4)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
                <div style={{ background: 'var(--accent-primary)', padding: '0.5rem', borderRadius: '50%' }}>
                  <User size={24} color="white" />
                </div>
                <div>
                  <h3 style={{ margin: 0 }}>{candidate.name}</h3>
                  <p style={{ fontSize: '0.9rem' }}>{candidate.email}</p>
                </div>
              </div>
              
              <div style={{ marginBottom: '1rem' }}>
                <p style={{ fontSize: '0.9rem', marginBottom: '0.5rem' }}><strong>Experience:</strong> {candidate.experience} years</p>
                <div>
                  {candidate.skills.map((skill, index) => (
                    <span key={index} className="badge">{skill}</span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CandidateList;
