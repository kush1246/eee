import React from 'react';
import { Award, User, Sparkles } from 'lucide-react';

const ShortlistedDisplay = ({ candidates, loading, error, isAiMode }) => {
  if (loading) {
    return (
      <div className="glass-card" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '300px' }}>
        <div style={{ textAlign: 'center', color: 'var(--accent-primary)' }}>
          <Sparkles className="animate-fade-in" size={40} style={{ animation: 'fadeIn 1s infinite alternate' }} />
          <p style={{ marginTop: '1rem' }}>Analyzing candidates...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="glass-card" style={{ borderLeft: '4px solid var(--accent-danger)' }}>
        <h3 style={{ color: 'var(--accent-danger)' }}>Error</h3>
        <p>{error}</p>
      </div>
    );
  }

  if (!candidates) {
    return (
      <div className="glass-card" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '300px', textAlign: 'center' }}>
        <div>
          <SearchIcon size={48} style={{ color: 'rgba(255,255,255,0.2)', marginBottom: '1rem' }} />
          <p>Run a search to see shortlisted candidates here.</p>
        </div>
      </div>
    );
  }

  if (candidates.length === 0) {
    return (
      <div className="glass-card">
        <h3>No Matches Found</h3>
        <p>No candidates matched your criteria. Try adjusting your requirements.</p>
      </div>
    );
  }

  return (
    <div className="glass-card animate-fade-in">
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.5rem' }}>
        {isAiMode ? <Sparkles color="#d946ef" /> : <Award color="var(--accent-primary)" />}
        <h2 style={{ margin: 0 }}>
          {isAiMode ? "AI Shortlisted Candidates" : "Top Matches"}
        </h2>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {candidates.map((candidate, index) => (
          <div key={candidate._id} style={{ 
            padding: '1.5rem', 
            background: 'rgba(15, 23, 42, 0.4)', 
            borderRadius: 'var(--border-radius)',
            border: index === 0 ? '1px solid rgba(59, 130, 246, 0.5)' : '1px solid transparent',
            position: 'relative',
            overflow: 'hidden'
          }}>
            {index === 0 && (
              <div style={{ 
                position: 'absolute', 
                top: 0, 
                right: 0, 
                background: isAiMode ? 'linear-gradient(135deg, #8b5cf6, #d946ef)' : 'var(--accent-primary)',
                padding: '0.25rem 1rem',
                borderBottomLeftRadius: '8px',
                fontSize: '0.8rem',
                fontWeight: 'bold',
                color: 'white'
              }}>
                Top Pick
              </div>
            )}
            
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <div style={{ background: 'rgba(255,255,255,0.1)', padding: '0.5rem', borderRadius: '50%' }}>
                  <User size={20} />
                </div>
                <div>
                  <h3 style={{ margin: 0, fontSize: '1.2rem' }}>{candidate.name}</h3>
                  <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>{candidate.experience} years exp</p>
                </div>
              </div>
              
              {!isAiMode && candidate.matchScore !== undefined && (
                <div 
                  className="match-score-circle" 
                  style={{ '--score': candidate.matchScore }}
                >
                  <span className="match-score-value">{Math.round(candidate.matchScore)}%</span>
                </div>
              )}

              {isAiMode && candidate.aiRank && (
                <div style={{ 
                  background: 'rgba(139, 92, 246, 0.2)', 
                  border: '1px solid rgba(139, 92, 246, 0.5)',
                  color: '#c4b5fd',
                  width: '40px',
                  height: '40px',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 'bold'
                }}>
                  #{candidate.aiRank}
                </div>
              )}
            </div>

            <div style={{ marginBottom: '1rem' }}>
              <strong style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Skills:</strong>
              <div style={{ marginTop: '0.5rem' }}>
                {candidate.skills.map((skill, i) => {
                  // highlight matched skills if in basic mode
                  const isMatched = !isAiMode && candidate.matchedSkills && candidate.matchedSkills.includes(skill.toLowerCase());
                  return (
                    <span key={i} className={`badge ${isMatched ? 'success' : ''}`}>
                      {skill}
                    </span>
                  );
                })}
              </div>
            </div>

            {isAiMode && candidate.aiExplanation && (
              <div className="ai-recommendation animate-fade-in">
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem', color: '#c4b5fd' }}>
                  <Sparkles size={16} />
                  <strong style={{ fontSize: '0.9rem' }}>AI Insight</strong>
                </div>
                <p style={{ fontSize: '0.95rem', margin: 0, color: 'var(--text-primary)' }}>
                  {candidate.aiExplanation}
                </p>
              </div>
            )}

          </div>
        ))}
      </div>
    </div>
  );
};

// Simple SearchIcon component since we didn't import it at the top
const SearchIcon = ({ size, style }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={style}>
    <circle cx="11" cy="11" r="8"></circle>
    <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
  </svg>
);

export default ShortlistedDisplay;
