// ============================================================
// services/resumeMatcher.js
// Feature 3 – Resume Smart Matching System
// Auto-detects domain → selects best resume → generates
// cover letter via Gemini + resume improvement suggestions
// ============================================================

const fs   = require('fs');
const path = require('path');
const https = require('https');
const { USER_PROFILE } = require('../config/userProfile');

// ─── Gemini API Config ────────────────────────────────────────────────────────
const GEMINI_MODEL = 'gemini-2.5-flash';
const GEMINI_URL   = `https://generativelanguage.googleapis.com/v1/models/${GEMINI_MODEL}:generateContent`;

// ─── Domain detection keywords ────────────────────────────────────────────────
const DATA_DOMAIN_KEYWORDS = [
  'data analyst', 'data analysis', 'data science', 'business analyst',
  'python developer', 'python', 'machine learning', 'ml engineer',
  'power bi', 'tableau', 'sql analyst', 'analytics', 'bi developer',
  'etl', 'data engineer', 'pandas', 'numpy', 'statistics',
];

const SOFTWARE_DOMAIN_KEYWORDS = [
  'software developer', 'software engineer', 'frontend', 'backend',
  'full stack', 'web developer', 'react', 'node', 'java developer',
  'javascript', 'angular', 'vue', 'mobile developer', 'api developer',
  'devops', 'cloud engineer', 'ui developer',
];

// ─── ATS Resume Improvement Tips ─────────────────────────────────────────────
const RESUME_TIPS = {
  software: [
    'Add GitHub link at the top of resume – recruiters WILL check it',
    'List tech stack per project: "Built with React.js, Node.js, MongoDB"',
    'Use numbers: "Reduced load time by 30%" not "Improved performance"',
    'Add a "Technical Skills" dedicated section above experience',
    'Keep resume to 1 page – freshers with 2-page resumes are ignored',
    'Use ATS-safe fonts: Arial, Calibri, or Times New Roman',
    'Avoid tables and columns – ATS parsers cannot read them correctly',
    'List all frameworks with version hints: "React.js 18, Node.js 20"',
    'Add "Open Source Contributions" section even if small (1-2 PRs)',
    'Put your strongest project first with full tech stack + impact',
  ],
  data: [
    'List tools clearly: Python, Pandas, NumPy, SQL, Power BI, Tableau',
    'Add a "Data Projects" section with dataset size: "Analyzed 50,000+ rows"',
    'Include your Kaggle profile URL if you have any notebooks',
    'Mention SQL proficiency level: "Advanced SQL – CTEs, Window Functions"',
    'Add certifications: Google Data Analytics, IBM Data Science (Coursera)',
    'List visualization tools used: "Created 15+ dashboards in Power BI"',
    'Include any internship/freelance analytics work with business impact',
    'Add "Key Insights" for each project: what did the data reveal?',
    'Mention Excel skills specifically: "Pivot Tables, VLOOKUP, Power Query"',
    'Use terms recruiters search: ETL, Data Pipeline, Analytics, BI Reports',
  ],
};

// ─── Detect job domain ────────────────────────────────────────────────────────
function detectDomain(job) {
  const text = `${job.title} ${job.domain || ''}`.toLowerCase();

  const dataScore = DATA_DOMAIN_KEYWORDS.filter((kw) => text.includes(kw)).length;
  const swScore   = SOFTWARE_DOMAIN_KEYWORDS.filter((kw) => text.includes(kw)).length;

  if (dataScore > swScore) return 'data';
  return 'software'; // default to software
}

// ─── Load resume text ────────────────────────────────────────────────────────
function loadResume(type) {
  const resumePath = path.resolve(USER_PROFILE.resumes[type]);
  try {
    if (fs.existsSync(resumePath)) {
      return fs.readFileSync(resumePath, 'utf-8').trim();
    }
  } catch (_) {}
  return null;
}

// ─── HTTP helper for Gemini API ───────────────────────────────────────────────
function callGeminiAPI(prompt) {
  return new Promise((resolve, reject) => {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) return reject(new Error('NO_API_KEY'));

    const body = JSON.stringify({
      contents: [{ parts: [{ text: prompt }] }],
      generationConfig: { temperature: 0.6, maxOutputTokens: 700 },
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
      res.on('data', (c) => (data += c));
      res.on('end', () => {
        try {
          const parsed = JSON.parse(data);
          if (parsed.error) {
            reject(new Error(`GEMINI_${parsed.error.code}: ${parsed.error.message?.slice(0, 80)}`));
            return;
          }
          // gemini-2.5-flash thinking model: filter out thought parts, get actual text
          const parts = parsed?.candidates?.[0]?.content?.parts || [];
          const text  = parts.filter((p) => p.text && !p.thought).map((p) => p.text).join('') || '';
          resolve(text.trim());
        } catch (e) { reject(e); }
      });
    });
    req.on('error', reject);
    req.setTimeout(30000, () => { req.destroy(); reject(new Error('TIMEOUT')); });
    req.write(body);
    req.end();
  });
}

// ─── Generate cover letter with Gemini ────────────────────────────────────────
async function generateCoverLetter(job, domainType) {
  const candidateName = USER_PROFILE.name;
  const skills        = USER_PROFILE.allSkills.slice(0, 12).join(', ');
  const education     = `${USER_PROFILE.education.degree} in ${USER_PROFILE.education.field}`;

  const prompt = `Write a short, professional, ATS-optimized cover letter (max 180 words) for a fresher applying to this job.

Job Title: ${job.title}
Company: ${job.company}
Domain: ${job.domain}

Candidate:
- Name: ${candidateName}
- Education: ${education} (${USER_PROFILE.education.year} graduate)
- Skills: ${skills}
- Top Project: ${USER_PROFILE.projects[0]?.name} – ${USER_PROFILE.projects[0]?.description}

Requirements:
- Start with "Dear Hiring Manager,"
- Mention the specific job title and company name
- Highlight 2-3 most relevant skills
- Mention the top project briefly
- End with a confident call to action
- Keep it under 180 words, professional tone
- Do NOT use any placeholders like [Your Name]`;

  try {
    const letter = await callGeminiAPI(prompt);
    return letter || generateFallbackCoverLetter(job);
  } catch (_) {
    return generateFallbackCoverLetter(job);
  }
}

// ─── Fallback cover letter template ──────────────────────────────────────────
function generateFallbackCoverLetter(job) {
  const { name, education, skills, projects } = USER_PROFILE;
  const topSkills = [
    ...skills.languages.slice(0, 2),
    ...skills.frontend.slice(0, 1),
  ].join(', ');
  return `Dear Hiring Manager,

I am excited to apply for the ${job.title} position at ${job.company}. As a ${education.degree} graduate in ${education.field} (${education.year}), I possess a strong foundation in ${topSkills} and a genuine passion for building impactful software solutions.

During my academic journey, I developed the "${projects[0]?.name}" — ${projects[0]?.description}. This project sharpened my ability to design, build, and deploy production-ready applications independently.

I am a fast learner, highly motivated, and eager to contribute meaningfully to your team. I would welcome the opportunity to discuss how my skills align with your requirements.

Warm regards,
${name}`;
}

// ─── Match resume and generate for a single job ───────────────────────────────
async function matchOneJob(job, generateCoverForTop = false) {
  const domainType    = detectDomain(job);
  const resumeContent = loadResume(domainType);
  const tips          = RESUME_TIPS[domainType];

  let coverLetterPreview = null;
  if (generateCoverForTop) {
    console.log(`   📝 Generating cover letter for: ${job.title} @ ${job.company}...`);
    coverLetterPreview = await generateCoverLetter(job, domainType);
  }

  return {
    ...job,
    resumeMatch: {
      domainType,
      resumeFile: domainType === 'data' ? 'resume_data.txt' : 'resume_software.txt',
      resumeLabel: domainType === 'data'
        ? '📊 Data Analyst Resume'
        : '💻 Software Developer Resume',
      hasResume: !!resumeContent,
      tips: tips.slice(0, 4), // top 4 tips for the email
    },
    coverLetterPreview,
  };
}

// ─── Main export: match resumes for all jobs ──────────────────────────────────
async function matchResumes(jobs) {
  console.log(`\n📄 Feature 3: Resume Smart Matching System...`);
  console.log(`   Matching resumes for ${jobs.length} jobs...`);

  const hasGemini = !!process.env.GEMINI_API_KEY;
  console.log(`   Cover Letter: ${hasGemini ? '✨ Gemini AI generation' : '📝 Using professional template'}\n`);

  const result = [];

  for (let i = 0; i < jobs.length; i++) {
    const isTop = i === 0; // Generate cover letter only for top job
    const matched = await matchOneJob(jobs[i], isTop);
    result.push(matched);

    // Small delay if using Gemini
    if (hasGemini && isTop) {
      await new Promise((r) => setTimeout(r, 500));
    }
  }

  const swCount   = result.filter((j) => j.resumeMatch.domainType === 'software').length;
  const dataCount = result.filter((j) => j.resumeMatch.domainType === 'data').length;
  console.log(`   ✅ Resume matching complete!`);
  console.log(`   💻 Software Resume: ${swCount} jobs | 📊 Data Resume: ${dataCount} jobs\n`);

  return result;
}

module.exports = { matchResumes };
