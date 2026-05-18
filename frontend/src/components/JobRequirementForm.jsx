import React, { useState } from 'react';
import { Search, Sparkles } from 'lucide-react';

const JobRequirementForm = ({ onSearch, loading }) => {
  const [formData, setFormData] = useState({
    requiredSkills: '',
    minExperience: ''
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleBasicSearch = (e) => {
    e.preventDefault();
    const skillsArray = formData.requiredSkills.split(',').map(s => s.trim()).filter(s => s);
    onSearch({ requiredSkills: skillsArray, minExperience: Number(formData.minExperience) }, false);
  };

  const handleAiSearch = (e) => {
    e.preventDefault();
    const skillsArray = formData.requiredSkills.split(',').map(s => s.trim()).filter(s => s);
    onSearch({ requiredSkills: skillsArray, minExperience: Number(formData.minExperience) }, true);
  };

  return (
    <div className="glass-card" style={{ height: 'fit-content' }}>
      <h2>Job Requirements</h2>
      <p style={{ marginBottom: '1.5rem' }}>Enter the job requirements to find the best matching candidates.</p>
      
      <form>
        <div className="form-group">
          <label>Required Skills (comma separated)</label>
          <input 
            type="text" 
            name="requiredSkills" 
            value={formData.requiredSkills} 
            onChange={handleChange} 
            placeholder="e.g. React, Node.js"
            required
          />
        </div>
        
        <div className="form-group">
          <label>Minimum Experience (Years)</label>
          <input 
            type="number" 
            name="minExperience" 
            value={formData.minExperience} 
            onChange={handleChange} 
            placeholder="e.g. 2"
            min="0"
            step="0.5"
            required
          />
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginTop: '2rem' }}>
          <button 
            type="button" 
            className="btn btn-secondary" 
            onClick={handleBasicSearch}
            disabled={loading || !formData.requiredSkills}
          >
            <Search size={18} /> Basic Match
          </button>
          
          <button 
            type="button" 
            className="btn btn-primary" 
            onClick={handleAiSearch}
            disabled={loading || !formData.requiredSkills}
            style={{ background: 'linear-gradient(to right, #8b5cf6, #d946ef)', border: 'none' }}
          >
            <Sparkles size={18} /> AI Smart Shortlist
          </button>
        </div>
      </form>
    </div>
  );
};

export default JobRequirementForm;
