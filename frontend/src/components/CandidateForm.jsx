import React, { useState } from 'react';
import { Save } from 'lucide-react';

const CandidateForm = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    skills: '',
    experience: '',
    projects: ''
  });
  const [status, setStatus] = useState(null);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Parse skills from comma separated string
    const skillsArray = formData.skills.split(',').map(skill => skill.trim()).filter(s => s);

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/candidates`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          skills: skillsArray,
          experience: Number(formData.experience)
        })
      });

      if (response.ok) {
        setStatus({ type: 'success', message: 'Candidate added successfully!' });
        setFormData({ name: '', email: '', skills: '', experience: '', projects: '' });
      } else {
        const data = await response.json();
        setStatus({ type: 'error', message: data.error || 'Failed to add candidate.' });
      }
    } catch (error) {
      setStatus({ type: 'error', message: 'Network error. Is the backend running?' });
    }
  };

  return (
    <div className="glass-card" style={{ maxWidth: '600px', margin: '0 auto' }}>
      <h2>Add New Candidate</h2>
      {status && (
        <div style={{
          padding: '1rem', 
          marginBottom: '1rem', 
          borderRadius: '8px',
          backgroundColor: status.type === 'success' ? 'rgba(16, 185, 129, 0.2)' : 'rgba(239, 68, 68, 0.2)',
          color: status.type === 'success' ? '#6ee7b7' : '#fca5a5'
        }}>
          {status.message}
        </div>
      )}
      
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Full Name</label>
          <input 
            type="text" 
            name="name" 
            value={formData.name} 
            onChange={handleChange} 
            required 
            placeholder="e.g. Rahul Sharma"
          />
        </div>
        
        <div className="form-group">
          <label>Email Address</label>
          <input 
            type="email" 
            name="email" 
            value={formData.email} 
            onChange={handleChange} 
            required 
            placeholder="e.g. rahul@example.com"
          />
        </div>

        <div className="form-group">
          <label>Skills (comma separated)</label>
          <input 
            type="text" 
            name="skills" 
            value={formData.skills} 
            onChange={handleChange} 
            required 
            placeholder="e.g. React, Node.js, MongoDB"
          />
        </div>

        <div className="form-group">
          <label>Years of Experience</label>
          <input 
            type="number" 
            name="experience" 
            value={formData.experience} 
            onChange={handleChange} 
            required 
            min="0"
            step="0.5"
            placeholder="e.g. 2"
          />
        </div>

        <div className="form-group">
          <label>Projects / Bio (Optional)</label>
          <textarea 
            name="projects" 
            value={formData.projects} 
            onChange={handleChange} 
            rows="4"
            placeholder="Brief bio or links to projects..."
          />
        </div>

        <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>
          <Save size={18} /> Save Candidate
        </button>
      </form>
    </div>
  );
};

export default CandidateForm;
