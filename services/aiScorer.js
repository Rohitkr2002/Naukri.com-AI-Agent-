// ============================================================
// services/aiScorer.js
// Feature 2 – AI Job Scoring & Ranking
// Uses Gemini API to score jobs (0–100%) against your profile
// Falls back to smart keyword heuristic if no API key
// ============================================================

const https = require('https');
const { USER_PROFILE } = require('../config/userProfile');

// ─── Gemini API Config ────────────────────────────────────────────────────────
const GEMINI_MODEL  = 'gemini-1.5-flash';
const GEMINI_URL    = `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent`;

// ─── Skill → domain keyword map for fallback scoring ─────────────────────────
const DOMAIN_KEYWORDS = {
  'Software Developer':  ['software', 'java', 'spring', 'backend', 'api', 'microservice', 'node', 'developer', 'engineer', 'full stack'],
  'Frontend Developer':  ['frontend', 'react', 'angular', 'vue', 'html', 'css', 'javascript', 'ui', 'ux', 'typescript', 'next.js'],
  'Python Developer':    ['python', 'django', 'flask', 'fastapi', 'pandas', 'numpy', 'scripting', 'automation', 'celery'],
  'Data Analyst':        ['data analyst', 'sql', 'excel', 'power bi', 'tableau', 'data visualization', 'statistics', 'analytics', 'etl'],
  'Web Developer':       ['web developer', 'html', 'css', 'javascript', 'wordpress', 'php', 'bootstrap', 'responsive', 'mern'],
};

// ─── Skill gap learning resources ─────────────────────────────────────────────
const LEARNING_PATHS = {
  TypeScript:      'TypeScript for Beginners – freeCodeCamp (YouTube)',
  Docker:          'Docker Crash Course – TechWorld with Nana (YouTube)',
  Kubernetes:      'Kubernetes for Beginners – KodeKloud (free tier)',
  MySQL:           'MySQL Full Course – Programming with Mosh (YouTube)',
  PostgreSQL:      'PostgreSQL Tutorial – freeCodeCamp (YouTube)',
  'Power BI':      'Power BI Full Course – Simplilearn (YouTube)',
  Tableau:         'Tableau for Beginners – Edureka (YouTube)',
  'React.js':      'React Full Course – Dave Gray (YouTube)',
  'Next.js':       'Next.js 14 Course – Vercel Docs + freeCodeCamp',
  Django:          'Django Crash Course – Traversy Media (YouTube)',
  FastAPI:         'FastAPI Full Course – Bitfumes (YouTube)',
  Redis:           'Redis Tutorial – Redis University (free)',
  AWS:             'AWS Cloud Practitioner – free tier + FreeCodeCamp',
  'System Design': 'System Design Primer – GitHub (Alex Xu)',
  DSA:             'DSA Course – Abdul Bari (YouTube), LeetCode 75',
  GraphQL:         'GraphQL Tutorial – The Net Ninja (YouTube)',
};

// ─── HTTP helper for Gemini API call ─────────────────────────────────────────
function callGeminiAPI(prompt) {
  return new Promise((resolve, reject) => {
    const apiKey  = process.env.GEMINI_API_KEY;
    if (!apiKey) return reject(new Error('NO_API_KEY'));

    const body = JSON.stringify({
      contents: [{ parts: [{ text: prompt }] }],
      generationConfig: { temperature: 0.2, maxOutputTokens: 512 },
    });

    const url = new URL(`${GEMINI_URL}?key=${apiKey}`);
    const options = {
      hostname: url.hostname,
      path:     url.pathname + url.search,
      method:   'POST',
      headers:  { 'Content-Type': 'application/json', 'Content-Length': Buffer.byteLength(body) },
    };

    const req = https.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => (data += chunk));
      res.on('end', () => {
        try {
          const parsed = JSON.parse(data);
          const text   = parsed?.candidates?.[0]?.content?.parts?.[0]?.text || '';
          resolve(text.trim());
        } catch (e) {
          reject(e);
        }
      });
    });

    req.on('error', reject);
    req.setTimeout(15000, () => { req.destroy(); reject(new Error('TIMEOUT')); });
    req.write(body);
    req.end();
  });
}

// ─── Parse JSON safely from Gemini response ───────────────────────────────────
function extractJSON(text) {
  try {
    // Strip markdown code blocks if present
    const cleaned = text.replace(/```json|```/g, '').trim();
    const jsonMatch = cleaned.match(/\{[\s\S]*\}/);
    if (jsonMatch) return JSON.parse(jsonMatch[0]);
  } catch (_) {}
  return null;
}

// ─── Score ONE job with Gemini API ───────────────────────────────────────────
async function scoreWithGemini(job) {
  const userSkills = USER_PROFILE.allSkills.join(', ');
  const prompt = `You are an expert HR AI system. Score this job match for a fresher candidate.

JOB:
Title: ${job.title}
Company: ${job.company}
Domain: ${job.domain}
Experience Required: ${job.exp || '0-1 years'}

CANDIDATE PROFILE:
Skills: ${userSkills}
Target Roles: ${USER_PROFILE.targetRole.join(', ')}
Experience: Fresher (0 years)
Education: ${USER_PROFILE.education.degree} in ${USER_PROFILE.education.field}

Analyze the match and return ONLY a valid JSON object (no markdown):
{
  "score": <integer 0-100>,
  "matchReason": "<1 sentence why this is a good/bad match>",
  "topMatchingSkills": ["skill1", "skill2", "skill3"],
  "skillGaps": ["missing1", "missing2"],
  "learningTip": "<1 short learning recommendation>"
}`;

  const response = await callGeminiAPI(prompt);
  const parsed   = extractJSON(response);

  if (parsed && typeof parsed.score === 'number') {
    return {
      score:             Math.min(100, Math.max(0, parsed.score)),
      matchReason:       parsed.matchReason       || 'Good match for your profile',
      topMatchingSkills: parsed.topMatchingSkills || [],
      skillGaps:         parsed.skillGaps         || [],
      learningTip:       parsed.learningTip       || '',
      source:            'gemini',
    };
  }
  throw new Error('Invalid Gemini response');
}

// ─── Fallback: Keyword Heuristic Scoring ─────────────────────────────────────
function scoreWithHeuristic(job) {
  const titleLower   = (job.title + ' ' + job.domain).toLowerCase();
  const userSkillsL  = USER_PROFILE.allSkills;

  // Domain relevance (max 40 points)
  let domainScore  = 0;
  const domainKeys = DOMAIN_KEYWORDS[job.domain] || [];
  const matchedDomainKeys = domainKeys.filter((k) => titleLower.includes(k));
  domainScore = Math.min(40, matchedDomainKeys.length * 10);

  // Skill match (max 50 points)
  const titleWords = titleLower.split(/[\s,.-]+/);
  const matchedSkills = userSkillsL.filter((skill) =>
    titleWords.some((word) => word.includes(skill) || skill.includes(word))
  );
  const skillScore = Math.min(50, matchedSkills.length * 12);

  // Fresher bonus (10 points always since we filter for 0-1 yr)
  const fresherBonus = 10;

  const total = domainScore + skillScore + fresherBonus;

  // Determine skill gaps from domain trending list
  const { TRENDING_SKILLS_2025 } = require('../config/userProfile');
  const trendingForDomain = TRENDING_SKILLS_2025[job.domain] || [];
  const gaps = trendingForDomain
    .filter((s) => !userSkillsL.includes(s.toLowerCase()))
    .slice(0, 3);

  const tip = gaps[0] ? (LEARNING_PATHS[gaps[0]] || `Learn ${gaps[0]} – search on YouTube/freeCodeCamp`) : 'Keep your GitHub active and updated';

  return {
    score:             Math.min(100, total),
    matchReason:       total > 60 ? 'Strong keyword and domain match' : 'Partial match – consider upskilling',
    topMatchingSkills: matchedSkills.slice(0, 3),
    skillGaps:         gaps,
    learningTip:       tip,
    source:            'heuristic',
  };
}

// ─── Score a single job (Gemini with fallback) ────────────────────────────────
async function scoreOneJob(job) {
  try {
    if (process.env.GEMINI_API_KEY) {
      return await scoreWithGemini(job);
    }
  } catch (err) {
    if (err.message !== 'NO_API_KEY') {
      console.warn(`   ⚠️  Gemini API failed for "${job.title}" – using heuristic fallback`);
    }
  }
  return scoreWithHeuristic(job);
}

// ─── Score & rank ALL jobs ────────────────────────────────────────────────────
async function scoreJobs(jobs) {
  const useGemini = !!process.env.GEMINI_API_KEY;
  console.log(`\n🤖 Feature 2: AI Job Scoring & Ranking...`);
  console.log(`   Mode: ${useGemini ? '✨ Gemini AI' : '🔢 Keyword Heuristic (set GEMINI_API_KEY for AI mode)'}`);
  console.log(`   Scoring ${jobs.length} jobs...\n`);

  const scored = [];

  for (let i = 0; i < jobs.length; i++) {
    const job    = jobs[i];
    const result = await scoreOneJob(job);
    scored.push({ ...job, aiScore: result });

    // Small delay for Gemini API rate limits
    if (useGemini && i < jobs.length - 1) {
      await new Promise((r) => setTimeout(r, 300));
    }
  }

  // Sort by AI score descending
  scored.sort((a, b) => b.aiScore.score - a.aiScore.score);

  const topScore  = scored[0]?.aiScore?.score  || 0;
  const avgScore  = Math.round(scored.reduce((s, j) => s + j.aiScore.score, 0) / scored.length);
  const highMatch = scored.filter((j) => j.aiScore.score >= 70).length;

  console.log(`   ✅ Scoring complete!`);
  console.log(`   📊 Top Score: ${topScore}% | Avg: ${avgScore}% | High Match (≥70%): ${highMatch} jobs\n`);

  return scored;
}

// ─── Generate overall skill gap summary for email ─────────────────────────────
function getSkillGapSummary(scoredJobs) {
  const allGaps = {};
  scoredJobs.forEach((job) => {
    (job.aiScore?.skillGaps || []).forEach((gap) => {
      allGaps[gap] = (allGaps[gap] || 0) + 1;
    });
  });

  // Sort by frequency
  return Object.entries(allGaps)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([skill, count]) => ({
      skill,
      count,
      resource: LEARNING_PATHS[skill] || `Learn ${skill} – search on YouTube`,
    }));
}

module.exports = { scoreJobs, getSkillGapSummary };
