import React, { useState } from 'react';
import JobRequirementForm from './JobRequirementForm';
import ShortlistedDisplay from './ShortlistedDisplay';

const MatchPage = () => {
  const [shortlistedCandidates, setShortlistedCandidates] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isAiMode, setIsAiMode] = useState(false);

  const handleSearch = async (requirements, useAi) => {
    setLoading(true);
    setError(null);
    setIsAiMode(useAi);

    try {
      const endpoint = useAi ? '/api/ai/shortlist' : '/api/match';
      const response = await fetch(`http://localhost:5000${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(requirements)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to match candidates');
      }

      const data = await response.json();
      setShortlistedCandidates(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="grid-2">
      <JobRequirementForm onSearch={handleSearch} loading={loading} />
      <ShortlistedDisplay candidates={shortlistedCandidates} loading={loading} error={error} isAiMode={isAiMode} />
    </div>
  );
};

export default MatchPage;
