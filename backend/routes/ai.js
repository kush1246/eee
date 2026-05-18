import express from 'express';
import Candidate from '../models/Candidate.js';

const router = express.Router();

router.post('/shortlist', async (req, res) => {
  try {
    const { requiredSkills, minExperience } = req.body;

    if (!requiredSkills || requiredSkills.length === 0) {
      return res.status(400).json({ error: 'Required skills are mandatory' });
    }

    const candidates = await Candidate.find();
    
    if (candidates.length === 0) {
      return res.status(404).json({ error: 'No candidates available to match' });
    }

    // Format candidates for the prompt
    const candidatesText = candidates.map((c, index) => {
      return `${index + 1}. ${c.name} - Skills: ${c.skills.join(', ')} - ${c.experience} years`;
    }).join('\n');

    const prompt = `
Job requires: ${requiredSkills.join(', ')} (minimum ${minExperience || 0} years experience)

Candidates:
${candidatesText}

Rank the candidates based on how well they fit the job requirements.
For each candidate, explain why they are suitable or not suitable.
Return the result in JSON format like this:
[
  {
    "name": "Candidate Name",
    "rank": 1,
    "explanation": "Why this candidate is ranked 1"
  }
]
IMPORTANT: Only output the raw JSON array. Do not include markdown code blocks like \`\`\`json.
`;

    // Call OpenRouter API
    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.OPENROUTER_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "openai/gpt-4o-mini", // fallback to a commonly available model
        messages: [
          { role: "system", content: "You are an expert technical recruiter." },
          { role: "user", content: prompt }
        ]
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("OpenRouter API Error:", errorText);
      return res.status(response.status).json({ error: "Failed to fetch AI recommendation", details: errorText });
    }

    const data = await response.json();
    let aiContent = data.choices[0].message.content.trim();
    
    // Clean up potential markdown blocks
    if (aiContent.startsWith('```json')) {
      aiContent = aiContent.replace(/```json/g, '').replace(/```/g, '').trim();
    } else if (aiContent.startsWith('```')) {
      aiContent = aiContent.replace(/```/g, '').trim();
    }

    try {
      const aiRanking = JSON.parse(aiContent);
      
      // Merge AI ranking with original candidate data
      const mergedResults = aiRanking.map(aiRec => {
        const originalCandidate = candidates.find(c => c.name.toLowerCase() === aiRec.name.toLowerCase());
        return {
          ...originalCandidate?.toObject(),
          aiRank: aiRec.rank,
          aiExplanation: aiRec.explanation
        };
      }).filter(c => c._id); // filter out if not found

      // Sort by AI rank
      mergedResults.sort((a, b) => a.aiRank - b.aiRank);

      res.json(mergedResults);
    } catch (parseError) {
      console.error("Error parsing AI response:", aiContent);
      res.status(500).json({ error: 'AI returned invalid JSON format', content: aiContent });
    }

  } catch (error) {
    res.status(500).json({ error: 'Failed to perform AI shortlisting', details: error.message });
  }
});

export default router;
