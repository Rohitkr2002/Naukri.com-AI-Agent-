// ============================================================
// config/userProfile.js
// Your personal profile – Edited this to match YOUR actual skills!
// Used by: AI Scorer (Feature 2) & Resume Matcher (Feature 3)
// ============================================================

const USER_PROFILE = {
  // ─── Basic Info ─────────────────────────────────────────────
  name: 'Rohit Singh Rajput',
  targetRole: ['Software Developer', 'Frontend Developer', 'Data Analyst', 'Web Developer', 'Python Developer'],
  experienceYears: 0,  // 0 = fresher
  currentLocation: 'India',
  preferredLocations: ['Bangalore', 'Delhi', 'Pune', 'Kolkata', 'Remote'],

  // ─── Education ──────────────────────────────────────────────
  education: {
    degree: 'B.Tech / B.E.',
    field: 'Computer Science / Information Technology',
    year: 2024,
    cgpa: '7.5+',
  },

  // ─── Core Technical Skills ──────────────────────────────────
  skills: {
    languages: ['JavaScript', 'Python', 'HTML', 'CSS', 'SQL'],
    frontend:  ['React.js', 'Node.js', 'Tailwind CSS', 'Bootstrap'],
    backend:   ['Node.js', 'Express.js', 'REST APIs'],
    database:  ['MySQL', 'MongoDB'],
    tools:     ['Git', 'GitHub', 'VS Code', 'Puppeteer', 'Postman'],
    cloud:     ['GitHub Actions', 'Vercel'],
    aiml:      ['Gemini API', 'AI Agents', 'Web Scraping', 'Automation'],
  },

  // ─── All skills as flat list (auto-generated) ───────────────
  get allSkills() {
    return [
      ...this.skills.languages,
      ...this.skills.frontend,
      ...this.skills.backend,
      ...this.skills.database,
      ...this.skills.tools,
      ...this.skills.cloud,
      ...this.skills.aiml,
    ].map(s => s.toLowerCase());
  },

  // ─── Projects / Portfolio ───────────────────────────────────
  projects: [
    {
      name: 'Naukri Job AI Agent',
      tech: ['Node.js', 'Puppeteer', 'GitHub Actions', 'Nodemailer', 'Gemini API'],
      description: 'Automated job monitoring agent that scrapes Naukri.com and emails curated job listings daily',
    },
    {
      name: 'Web Scraper Bot',
      tech: ['Python', 'BeautifulSoup', 'Selenium'],
      description: 'Automated data extraction and reporting tool',
    },
  ],

  // ─── Profile Completeness Sections ──────────────────────────
  // Set each to true if you have it completed on Naukri profile
  profileSections: {
    photo: true,
    headline: true,
    summary: true,
    experience: false,       // fresher – set true if you added internships
    education: true,
    skills: true,
    projects: true,
    resumeUploaded: true,
    certifications: false,   // set true if you have any
    languages: true,
    preferredLocations: true,
    expectedSalary: false,
    keySkills: true,
    itSkills: true,
  },

  // ─── Resume Paths ────────────────────────────────────────────
  resumes: {
    software: './resumes/resume_software.txt',  // for SW Dev, Frontend, Web Dev
    data:     './resumes/resume_data.txt',       // for Data Analyst, Python Dev
  },
};

// ─── Trending 2025 Tech Skills (for keyword optimization) ────
const TRENDING_SKILLS_2025 = {
  'Software Developer': [
    'ReactJS', 'Node.js', 'TypeScript', 'REST API', 'Microservices',
    'Docker', 'Kubernetes', 'AWS', 'System Design', 'DSA', 'Spring Boot',
    'GraphQL', 'CI/CD', 'Agile', 'Redis', 'PostgreSQL',
  ],
  'Frontend Developer': [
    'React.js', 'Next.js', 'TypeScript', 'Tailwind CSS', 'Redux',
    'Figma', 'Web Performance', 'GraphQL', 'PWA', 'Testing (Jest)',
    'Responsive Design', 'CSS Grid', 'Web Components', 'Vite',
  ],
  'Data Analyst': [
    'Python', 'Pandas', 'NumPy', 'SQL', 'Power BI', 'Tableau',
    'Excel (Advanced)', 'Machine Learning', 'Data Visualization',
    'Statistics', 'ETL', 'BigQuery', 'Spark', 'Alteryx',
  ],
  'Python Developer': [
    'Python', 'Django', 'FastAPI', 'Flask', 'REST API', 'Pandas',
    'NumPy', 'PostgreSQL', 'Docker', 'Celery', 'Redis',
    'Asyncio', 'Pytest', 'SQLAlchemy', 'Pydantic',
  ],
  'Web Developer': [
    'JavaScript', 'React.js', 'HTML5', 'CSS3', 'Node.js',
    'MongoDB', 'Express.js', 'REST API', 'TypeScript',
    'Git', 'Responsive Design', 'Bootstrap', 'SEO Basics',
  ],
};

// ─── ATS Keywords (general, non-domain) ─────────────────────
const ATS_GENERAL_KEYWORDS = [
  'problem-solving', 'team player', 'communication', 'agile',
  'cross-functional', 'deadline-oriented', 'self-motivated',
  'analytical thinking', 'attention to detail',
];

module.exports = { USER_PROFILE, TRENDING_SKILLS_2025, ATS_GENERAL_KEYWORDS };
