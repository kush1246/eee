import express from 'express';
import Candidate from '../models/Candidate.js';

const router = express.Router();

router.post('/', async (req, res) => {
  try {
    const { requiredSkills, minExperience } = req.body;
    
    if (!requiredSkills || requiredSkills.length === 0) {
      return res.status(400).json({ error: 'Required skills are mandatory' });
    }

    const candidates = await Candidate.find();

    const matchedCandidates = candidates.map(candidate => {
      const normalizedReqSkills = requiredSkills.map(s => s.toLowerCase());
      const normalizedCandSkills = candidate.skills.map(s => s.toLowerCase());
      
      const matchedSkills = normalizedCandSkills.filter(skill => 
        normalizedReqSkills.includes(skill)
      );
      
      let matchScore = matchedSkills.length / requiredSkills.length;
      
      // If candidate has less experience than required, penalize the score or filter out
      if (minExperience && candidate.experience < minExperience) {
         matchScore = matchScore * 0.5; // Penalize score by half if experience is lower
      }

      return {
        ...candidate.toObject(),
        matchScore: matchScore * 100, // percentage
        matchedSkills
      };
    }).filter(c => c.matchScore > 0) // only return candidates with at least some match
      .sort((a, b) => b.matchScore - a.matchScore);

    res.json(matchedCandidates);
  } catch (error) {
    res.status(500).json({ error: 'Failed to match candidates', details: error.message });
  }
});

export default router;
