// ============================================================
// config/userProfile.js
// Rohit Kumar Singh — Personal Profile Configuration
// Primary Target: Software Development | Secondary: Data Analysis
// ============================================================

const USER_PROFILE = {
  // ─── Basic Info ─────────────────────────────────────────────
  name: 'Rohit Kumar Singh',
  targetRole: [
    'Software Developer',
    'Frontend Developer',
    'Web Developer',
    'Data Analyst',
    'Python Developer',
  ],
  experienceYears: 0,  // Fresher – internship experience
  currentLocation: 'Patna, Bihar, India',
  preferredLocations: ['Bangalore', 'Delhi', 'Pune', 'Kolkata', 'Remote', 'Patna'],

  // ─── Contact ────────────────────────────────────────────────
  contact: {
    email:    'rajputrohitsingh998@gmail.com',
    phone:    '9065039396',
    linkedin: 'linkedin.com/in/rohit-kumar-singh',
    github:   'github.com/Rohitkr2002',
  },

  // ─── Education ──────────────────────────────────────────────
  education: {
    degree: 'B.Tech',
    field:  'Electronics and Communication Engineering',
    institute: 'Haldia Institute of Technology',
    year:   2025,
    cgpa:   '7.33',
  },

  // ─── Experience ─────────────────────────────────────────────
  experience: [
    {
      role:     'Web Development Intern',
      company:  'Rinex',
      duration: 'July 2022 – August 2022',
      type:     'Remote Internship',
      highlights: [
        'Developed 5+ responsive web pages using HTML5, CSS3, and JavaScript',
        'Ensured 100% mobile responsiveness and cross-browser compatibility',
        'Improved page load time by 30% by optimizing CSS stylesheets',
      ],
    },
  ],

  // ─── Core Technical Skills ──────────────────────────────────
  skills: {
    languages: ['JavaScript', 'Python', 'SQL', 'HTML5', 'CSS3'],
    frontend:  [
      'HTML5', 'CSS3', 'JavaScript', 'Bootstrap',
      'Responsive Design', 'Flexbox', 'CSS Grid', 'DOM Manipulation',
    ],
    backend:   ['Node.js'],
    database:  ['SQL', 'MySQL'],
    dataTools: ['NumPy', 'Pandas', 'Matplotlib', 'Seaborn', 'Chart.js', 'Power BI', 'Excel'],
    tools:     ['Git', 'GitHub', 'VS Code', 'Jupyter Notebook', 'Google Colab', 'Linux'],
    concepts:  [
      'Object-Oriented Programming', 'Problem Solving', 'Debugging',
      'Data Visualization', 'EDA', 'Data Cleaning',
    ],
  },

  // ─── All skills as flat list (auto-generated) ───────────────
  get allSkills() {
    return [
      ...this.skills.languages,
      ...this.skills.frontend,
      ...this.skills.backend,
      ...this.skills.database,
      ...this.skills.dataTools,
      ...this.skills.tools,
      ...this.skills.concepts,
    ].map(s => s.toLowerCase());
  },

  // ─── Projects ───────────────────────────────────────────────
  projects: [
    {
      name: 'Personal Portfolio Website',
      tech: ['HTML5', 'CSS3', 'JavaScript'],
      date: 'Aug 2022',
      description: 'Responsive portfolio website with dark/light theme toggle, typing animation, and 6+ completed projects. Improved mobile compatibility by 50%.',
    },
    {
      name: 'Blood Bank Management System',
      tech: ['Python', 'Tkinter', 'Matplotlib'],
      date: 'June 2025',
      description: 'GUI-based blood bank system managing donor records and blood stock for 8 blood groups. Improved data handling efficiency by 60%.',
    },
    {
      name: 'Smart To-Do List',
      tech: ['HTML', 'CSS', 'JavaScript', 'Chart.js'],
      date: 'May 2025',
      description: 'Feature-rich task management app with scheduling, priority filtering, and real-time task status visualization. 40% improvement in organization efficiency.',
    },
    {
      name: 'FNP Sales Analysis Dashboard',
      tech: ['Microsoft Excel', 'Pivot Tables', 'SUMIFS', 'COUNTIFS'],
      date: 'Sep 2025',
      description: 'Analyzed 1,000+ orders generating 35.2 Lakh revenue using advanced Excel. Built interactive dashboard with Pivot Tables, Charts, and Slicers. Reduced manual effort by 80%.',
    },
    {
      name: 'HR Dashboard Using Power BI',
      tech: ['Power BI', 'Power Query', 'DAX', 'Excel'],
      date: 'Oct 2025',
      description: 'Interactive HR Analytics Dashboard for 1,000+ employees tracking attrition, salary, and retention trends. Used DAX measures and Power Query transformations.',
    },
  ],

  // ─── Leadership / Extracurricular ───────────────────────────
  leadership: [
    {
      role:     'Treasurer',
      org:      'Computer Society of India (CSI)',
      institute:'Haldia Institute of Technology',
      duration: 'Jun 2024 – Jun 2025',
      highlights: [
        'Managed Rs.50,000+ budget with 100% financial transparency',
        'Led 10+ seminars and coding workshops on web development and ML',
        'Increased student participation by 40%',
      ],
    },
  ],

  // ─── Profile Completeness Sections ──────────────────────────
  // Set each to true if you have completed it on Naukri profile
  profileSections: {
    photo:              true,
    headline:           true,
    summary:            true,
    experience:         true,   // Rinex internship added
    education:          true,
    skills:             true,
    projects:           true,
    resumeUploaded:     true,
    certifications:     false,  // Add Coursera/freeCodeCamp certs
    languages:          true,
    preferredLocations: true,
    expectedSalary:     false,  // Add expected salary on Naukri
    keySkills:          true,
    itSkills:           true,
  },

  // ─── Resume Paths ────────────────────────────────────────────
  resumes: {
    software: './resumes/resume_software.txt',  // SW Dev, Frontend, Web Dev
    data:     './resumes/resume_data.txt',       // Data Analyst, Python Dev
  },
};

// ─── Trending 2025 Tech Skills (for keyword gap analysis) ────
const TRENDING_SKILLS_2025 = {
  'Software Developer': [
    'ReactJS', 'Node.js', 'TypeScript', 'REST API', 'MongoDB',
    'Docker', 'AWS', 'System Design', 'DSA', 'Spring Boot',
    'GraphQL', 'CI/CD', 'Agile', 'Redis', 'PostgreSQL',
  ],
  'Frontend Developer': [
    'React.js', 'Next.js', 'TypeScript', 'Tailwind CSS', 'Redux',
    'Figma', 'Web Performance', 'GraphQL', 'PWA', 'Testing (Jest)',
    'CSS Animation', 'Vite', 'Web Components',
  ],
  'Data Analyst': [
    'Power BI', 'Tableau', 'SQL (Advanced)', 'Python (Advanced)',
    'Machine Learning', 'Statistics', 'ETL', 'BigQuery',
    'Spark', 'Alteryx', 'Data Storytelling', 'R Language',
  ],
  'Python Developer': [
    'Django', 'FastAPI', 'Flask', 'REST API', 'PostgreSQL',
    'Docker', 'Celery', 'Redis', 'Asyncio', 'Pytest',
    'SQLAlchemy', 'Pydantic',
  ],
  'Web Developer': [
    'React.js', 'Node.js', 'TypeScript', 'MongoDB', 'Express.js',
    'REST API', 'GraphQL', 'Tailwind CSS', 'Responsive Design', 'SEO',
  ],
};

// ─── ATS General Keywords ────────────────────────────────────
const ATS_GENERAL_KEYWORDS = [
  'problem-solving', 'team player', 'communication', 'agile',
  'deadline-oriented', 'self-motivated', 'analytical thinking',
  'attention to detail', 'leadership',
];

module.exports = { USER_PROFILE, TRENDING_SKILLS_2025, ATS_GENERAL_KEYWORDS };
