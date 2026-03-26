// ============================================================
// services/draftGenerator.js
// Uses Gemini 2.5 Flash to automatically draft a highly personalized cold email
// ============================================================

const https = require('https');
const { USER_PROFILE } = require('../config/userProfile');

async function generateColdEmail(job, hrEmail) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) return null;

    const userSkills = USER_PROFILE.allSkills.slice(0, 15).join(', ');
    const degree = USER_PROFILE.education.degree;

    const prompt = `You are an expert career coach writing a cold email for a fresher.
Write a highly personalized, concise cold email to the recruiter/HR at ${job.company} for the "${job.title}" role.
Rule 1: Do NOT use generic openings like "I hope this email finds you well."
Rule 2: Keep it under 100 words.
Rule 3: Start with a strong hook mentioning the role and company.
Rule 4: Highlight 1 specific matching skill from the candidate's profile that fits this role.
Rule 5: Keep the tone professional, humble, and direct.
Rule 6: Format the body cleanly so it can be pasted into Gmail. Do not use markdown backticks in the final values.

Candidate Skills: ${userSkills}
Education: ${degree}
Target HR Email: ${hrEmail}

Output ONLY this exact JSON format (no markdown code blocks surrounding it):
{"subject": "<Professional Subject Line>", "body": "<The full email body text with newlines>"}
`;

    const bodyObj = JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: { temperature: 0.3, maxOutputTokens: 2048 },
    });

    return new Promise((resolve) => {
        const url = `https://generativelanguage.googleapis.com/v1/models/gemini-2.5-flash:generateContent?key=${apiKey}`;
        const req = https.request(url, { method: 'POST', headers: { 'Content-Type': 'application/json' } }, (res) => {
            let data = '';
            res.on('data', c => data += c);
            res.on('end', () => {
                try {
                    const parsed = JSON.parse(data);
                    const text = parsed?.candidates?.[0]?.content?.parts?.[0]?.text || '';
                    // Clean markdown code blocks from the Gemini output
                    let cleaned = text.replace(/```json/gi, '').replace(/```/gi, '').trim();
                    const jsonMatch = cleaned.match(/\{[\s\S]*\}/);
                    if (jsonMatch) {
                        resolve(JSON.parse(jsonMatch[0]));
                    } else {
                        resolve(null);
                    }
                } catch (e) { resolve(null); }
            });
        });
        req.on('error', () => resolve(null));
        req.write(bodyObj);
        req.end();
    });
}

module.exports = { generateColdEmail };
