// ============================================================
// services/profileBoost.js
// Feature 1 – Daily Profile Boost Automation
// Generates: Profile completeness score, ATS tips,
//            Trending keyword gaps, Recruiter signals
// No Naukri login required – safe & reliable
// ============================================================

const { USER_PROFILE, TRENDING_SKILLS_2025, ATS_GENERAL_KEYWORDS } = require('../config/userProfile');

// ─── ATS-Friendly Profile Tips ────────────────────────────────────────────────
const ATS_TIPS = [
  'Use exact job title keywords in your profile headline (e.g., "React.js Developer")',
  'Add industry-standard skill names – "JavaScript" not "JS", "Python" not "Py"',
  'Include quantifiable achievements: "Built X that improved Y by Z%"',
  'Keep your resume in ATS-friendly format: .pdf or .docx, no tables/columns',
  'Add a professional summary with target role + top 3 skills + years of experience',
  'List skills in order of proficiency and industry demand',
  'Use action verbs: Developed, Designed, Built, Implemented, Optimized',
  'Include relevant certifications – even free ones (Google, Meta, Coursera)',
  'Mention popular frameworks by full name: "React.js" instead of just "React"',
  'Use the exact phrase "0-1 years experience" in your profile if you are a fresher',
  'Add GitHub profile link on Naukri – recruiters actively check it',
  'Keep your profile 100% complete – Naukri boosts complete profiles in search',
  'Update your "Notice Period" to "Immediate" to rank higher in recruiter searches',
  'Set expected salary realistic range – profiles with salary preferences get more calls',
  'Add preferred work mode: Remote / Hybrid – many recruiters filter by this',
  'Add IT Skills section with all tech stack: recruiter keyword filters look here',
  'Keep your "Last Active" status fresh – log in daily or set to "Active"',
  'Upload a professional photo – profiles with photos get 4x more views',
  'Add all 10–15 key skills in the skills section, not just 3–5',
  'Mention internships, academic projects, personal projects as "Work Experience"',
  'Include your GPA/CGPA if above 7.0 – many freshers miss this',
  'Add keywords from the job descriptions you are applying to',
  'Use line breaks and bullets in your summary – not one giant paragraph',
  'Mention soft skills like "Team Player", "Problem Solver", "Agile" naturally',
  'Keep your headline under 10 words but highly specific (e.g., "React.js & Node.js Fresher | 2024 Grad")',
];

// ─── Recruiter Engagement Tips ────────────────────────────────────────────────
const RECRUITER_SIGNALS = [
  'Search for jobs daily – Naukri tracks "active seekers" and shows them first',
  'Apply to at least 3-5 jobs per day to stay in active seeker pool',
  'Save jobs and unsave them – this signals browsing activity to algorithm',
  'Update even 1 word in your profile daily to trigger "Profile Updated" boost',
  'Change your resume title slightly and re-upload to refresh resume activity',
  'Respond to recruiter messages within 24 hours to maintain response rate score',
  'Follow companies you wish to join – Naukri shows your interest to their HRs',
  'Set Job Alerts for your target roles – this signals intent to the algorithm',
  'Complete Naukri assessments/tests – adds credibility and boosts ranking',
  'Add rchilli verified education/experience – verification badge helps ranking',
];

// ─── Calculate Profile Completeness Score ─────────────────────────────────────
function calculateProfileScore() {
  const sections = USER_PROFILE.profileSections;
  const weights = {
    photo:              10,
    headline:           10,
    summary:            10,
    experience:         8,
    education:          10,
    skills:             10,
    projects:           10,
    resumeUploaded:     10,
    certifications:     5,
    languages:          5,
    preferredLocations: 5,
    expectedSalary:     3,
    keySkills:          2,
    itSkills:           2,
  };

  let score = 0;
  let totalWeight = 0;
  const missing = [];
  const completed = [];

  for (const [key, weight] of Object.entries(weights)) {
    totalWeight += weight;
    if (sections[key]) {
      score += weight;
      completed.push(key);
    } else {
      missing.push(key);
    }
  }

  const percentage = Math.round((score / totalWeight) * 100);
  return { percentage, missing, completed, score, totalWeight };
}

// ─── Analyze Keyword Gaps ─────────────────────────────────────────────────────
function analyzeKeywordGaps() {
  const userSkillsLower = USER_PROFILE.allSkills;
  const gaps = {};

  for (const [domain, trendingSkills] of Object.entries(TRENDING_SKILLS_2025)) {
    const domainGaps = trendingSkills.filter(
      (skill) => !userSkillsLower.includes(skill.toLowerCase())
    );
    gaps[domain] = domainGaps;
  }

  return gaps;
}

// ─── Get Label for Completeness Score ─────────────────────────────────────────
function getScoreLabel(pct) {
  if (pct >= 90) return { label: 'Excellent', color: '#22c55e', emoji: '🏆' };
  if (pct >= 75) return { label: 'Good',      color: '#84cc16', emoji: '✅' };
  if (pct >= 60) return { label: 'Average',   color: '#f59e0b', emoji: '⚠️' };
  return              { label: 'Needs Work',  color: '#ef4444', emoji: '🔴' };
}

// ─── Shuffle & pick N items from array ────────────────────────────────────────
function pickRandom(arr, n) {
  const shuffled = [...arr].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, n);
}

// ─── Main export ───────────────────────────────────────────────────────────────
async function runProfileBoost() {
  console.log('\n🚀 Feature 1: Running Daily Profile Boost Analysis...');
  console.log('─'.repeat(56));

  // 1. Profile Completeness Score
  const profileScore = calculateProfileScore();
  const scoreLabel   = getScoreLabel(profileScore.percentage);
  console.log(`   📊 Profile Completeness: ${profileScore.percentage}% (${scoreLabel.label})`);

  if (profileScore.missing.length > 0) {
    console.log(`   Missing sections: ${profileScore.missing.join(', ')}`);
  }

  // 2. Keyword Gap Analysis
  const keywordGaps   = analyzeKeywordGaps();
  const topDomainGaps = {};
  for (const domain of USER_PROFILE.targetRole) {
    if (keywordGaps[domain]) {
      topDomainGaps[domain] = keywordGaps[domain].slice(0, 6); // top 6 gaps per domain
    }
  }
  console.log(`   🔍 Keyword gap analysis complete for ${Object.keys(topDomainGaps).length} domains`);

  // 3. Pick today's ATS tips (rotate daily)
  const dayOfYear   = Math.floor((Date.now() - new Date(new Date().getFullYear(), 0, 0)) / 86400000);
  const tipStartIdx = (dayOfYear * 3) % ATS_TIPS.length;
  const todaysTips  = [
    ATS_TIPS[tipStartIdx % ATS_TIPS.length],
    ATS_TIPS[(tipStartIdx + 1) % ATS_TIPS.length],
    ATS_TIPS[(tipStartIdx + 2) % ATS_TIPS.length],
    ATS_TIPS[(tipStartIdx + 3) % ATS_TIPS.length],
    ATS_TIPS[(tipStartIdx + 4) % ATS_TIPS.length],
  ];

  // 4. Today's recruiter signals
  const todaysSignals = pickRandom(RECRUITER_SIGNALS, 3);

  // 5. Profile actions checklist — each with direct Naukri link
  const todaysActions = [
    {
      step: 1,
      text: `Skills reorder karo — "${USER_PROFILE.skills.languages[0]}" ko #1 pe le jao`,
      url:  'https://www.naukri.com/mnjuser/profile?id=&altresid',
      btn:  'Skills Edit Karo →',
    },
    {
      step: 2,
      text: 'Headline update karo — ek trending keyword add karo',
      url:  'https://www.naukri.com/mnjuser/profile?id=&altresid',
      btn:  'Headline Edit Karo →',
    },
    {
      step: 3,
      text: 'Resume re-upload karo (aaj ki date ke saath)',
      url:  'https://www.naukri.com/mnjuser/homepage#resume',
      btn:  'Resume Upload Karo →',
    },
    {
      step: 4,
      text: '"Software developer fresher" search karo Naukri pe (activity signal)',
      url:  'https://www.naukri.com/software-developer-fresher-jobs?experience=0',
      btn:  'Naukri Open Karo →',
    },
    {
      step: 5,
      text: '5 matching jobs save karo — recruiter visibility badhti hai',
      url:  'https://www.naukri.com/software-developer-jobs?experience=0',
      btn:  'Jobs Dekho & Save Karo →',
    },
  ];


  const result = {
    profileScore,
    scoreLabel,
    keywordGaps: topDomainGaps,
    todaysTips,
    todaysSignals,
    todaysActions,
  };

  console.log(`✅ Profile Boost report ready (score: ${profileScore.percentage}%)\n`);
  return result;
}

module.exports = { runProfileBoost };
