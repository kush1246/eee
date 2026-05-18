import express from 'express';
import Candidate from '../models/Candidate.js';

const router = express.Router();

// Add a candidate
router.post('/', async (req, res) => {
  try {
    const { name, email, skills, experience, projects } = req.body;
    const newCandidate = new Candidate({
      name,
      email,
      skills,
      experience,
      projects
    });
    await newCandidate.save();
    res.status(201).json({ message: 'Candidate added successfully', candidate: newCandidate });
  } catch (error) {
    res.status(500).json({ error: 'Failed to add candidate', details: error.message });
  }
});

// Get all candidates
router.get('/', async (req, res) => {
  try {
    const candidates = await Candidate.find().sort({ createdAt: -1 });
    res.json(candidates);
  } catch (error) {
    res.status(500).json({ error: 'Failed to get candidates', details: error.message });
  }
});

export default router;
