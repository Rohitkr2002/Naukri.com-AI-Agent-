<div align="center">

<img src="https://capsule-render.vercel.app/api?type=waving&color=0:0d1b2a,100:1e3a5f&height=200&section=header&text=🤖%20Naukri%20Job%20AI%20Agent&fontSize=42&fontColor=ffffff&animation=fadeIn&fontAlignY=38&desc=AI-Powered%20Daily%20Job%20Monitor%20|%20Built%20by%20Rohit%20Kumar%20Singh&descAlignY=55&descSize=18" alt="Header"/>

<br/>

[![Node.js](https://img.shields.io/badge/Node.js-20.x-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)](https://nodejs.org)
[![Puppeteer](https://img.shields.io/badge/Puppeteer-Headless%20Chrome-40B5A4?style=for-the-badge&logo=googlechrome&logoColor=white)](https://pptr.dev)
[![Gemini AI](https://img.shields.io/badge/Google%20Gemini-AI%20Powered-4285F4?style=for-the-badge&logo=google&logoColor=white)](https://aistudio.google.com)
[![GitHub Actions](https://img.shields.io/badge/GitHub%20Actions-Auto%20Daily-2088FF?style=for-the-badge&logo=githubactions&logoColor=white)](https://github.com/features/actions)
[![Nodemailer](https://img.shields.io/badge/Nodemailer-Email%20Engine-009688?style=for-the-badge&logo=gmail&logoColor=white)](https://nodemailer.com)
[![License: MIT](https://img.shields.io/badge/License-MIT-F5A623?style=for-the-badge)](LICENSE)

<br/>

> ### 🧠 *"Job dhundhna band karo, agent karne do."*
> **A fully automated, self-running AI Agent that scrapes Naukri.com daily, scores every job using Google Gemini AI, selects your best resume, generates a cover letter — and delivers it all to your inbox at 9:00 AM IST every morning. Zero manual effort.**

<br/>

```
╔══════════════════════════════════════════════════════════════════════╗
║   🔍 Scrapes Naukri.com  →  🤖 AI Scores Jobs  →  📄 Matches Resume  ║
║         →  ✉️ Cover Letter  →  📧 Premium Email @ 9 AM IST           ║
╚══════════════════════════════════════════════════════════════════════╝
```

<br/>

</div>

---

## 📌 Quick Index

| Section | Description |
|---------|-------------|
| [🎯 Problem Statement](#-problem-statement) | Why this project was built |
| [💡 Solution](#-solution--what-this-agent-does) | What the agent does |
| [🏗️ Architecture](#️-system-architecture) | How it all connects |
| [🚀 Feature 1 – Profile Boost](#-feature-1--daily-profile-boost-automation) | Daily profile optimizer |
| [🤖 Feature 2 – AI Job Scoring](#-feature-2--ai-job-scoring--ranking) | Gemini AI match scoring |
| [📄 Feature 3 – Resume Matching](#-feature-3--resume-smart-matching--cover-letter) | Smart resume selector |
| [🔍 Core Engine – Scraper](#-core-engine--naukricom-scraper) | Headless browser scraper |
| [📧 Email Engine](#-email-engine--premium-dark-mode-design) | Premium HTML email |
| [⚙️ Setup & Installation](#️-setup--installation) | Get it running in 10 min |
| [🔑 GitHub Actions](#-github-actions--automated-daily-run) | Automate daily runs |
| [🎨 Customization](#-customization-guide) | Make it your own |
| [🔧 Troubleshooting](#-troubleshooting) | Common fixes |

---

## 🎯 Problem Statement

Every fresher faces the same daily grind:

```
😤 Wake up → Open Naukri → Scroll through 200+ jobs → 180 not relevant
   → 15 expired → 5 require 2 years experience → 0 good matches
   → Apply with same generic resume → Get 0 callbacks → Repeat tomorrow
```

**Why this happens:**
- ❌ Manually checking Naukri.com every day is tedious and inconsistent
- ❌ No way to know WHICH jobs actually match YOUR skills
- ❌ Sending the same resume to every job — software jobs need a different resume than data analyst jobs
- ❌ Cover letters are time-consuming to write for every application
- ❌ Profile ranking drops when you're not "active" on Naukri

---

## 💡 Solution — What This Agent Does

```
✅ Automatically scrapes Naukri.com at 9 AM every day (0 manual effort)
✅ Filters out irrelevant jobs (keeps only 0-1 yr experience)
✅ AI scores each job against YOUR exact skills (0-100% match)
✅ Ranks jobs best-to-worst before sending
✅ Auto-selects the right resume (Software or Data) per job
✅ Generates a personalized cover letter for your top match
✅ Sends a beautiful email report with everything you need
✅ Shows profile gaps + ATS tips to improve your Naukri ranking
```

| | Without Agent | With Agent |
|-|--------------|------------|
| Time spent daily | 60–90 min | 0 min (check email) |
| Job relevance | ~5% relevant | ~80% relevant (filtered) |
| Resume used | Same for all | Best-fit per domain |
| Cover letter | Manual, 20 min | AI-generated, personalized |
| Profile ranking | Drops if inactive | Daily tips to stay active |
| Best match visibility | Manual guessing | AI Match Score 0-100% |

---

## 🏗️ System Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                     GITHUB ACTIONS (Cron)                       │
│                  Every day at 9:00 AM IST                       │
└─────────────────────────┬───────────────────────────────────────┘
                          │ triggers
                          ▼
┌─────────────────────────────────────────────────────────────────┐
│                        index.js                                 │
│                   MAIN ORCHESTRATOR                             │
└──┬──────────┬────────────┬───────────────┬──────────────┬───────┘
   │          │            │               │              │
   ▼          ▼            ▼               ▼              ▼
┌──────┐  ┌────────┐  ┌─────────┐   ┌──────────┐  ┌──────────┐
│PROFI-│  │SCRAPER │  │ FILTER  │   │ AI SCORER│  │ RESUME   │
│LE    │  │        │  │         │   │          │  │ MATCHER  │
│BOOST │  │Puppeteer  │0-1yr exp│   │Gemini AI │  │+Cover Ltr│
│      │  │4 cities│  │Dedup    │   │OR Heurist│  │          │
│ATS   │  │5 roles │  │Sort     │   │0-100%    │  │Software  │
│Tips  │  │20 URLs │  │Top 20   │   │Rank jobs │  │or Data   │
└──┬───┘  └───┬────┘  └────┬────┘   └────┬─────┘  └────┬─────┘
   │          │            │              │              │
   └──────────┴────────────┴──────────────┴──────────────┘
                                │
                                ▼
              ┌─────────────────────────────────┐
              │          mail.js                │
              │     PREMIUM EMAIL BUILDER       │
              │   Dark Mode · Glassmorphism     │
              │   City Cards · AI Badges        │
              └──────────────┬──────────────────┘
                             │
                             ▼
              ┌─────────────────────────────────┐
              │       Gmail SMTP                │
              │   📬 Inbox at 9:00 AM IST       │
              └─────────────────────────────────┘
```

### Data Flow

```
Naukri.com  ──[Puppeteer]──▶  Raw Jobs (60-120)
            ──[Filter]──────▶  Clean Jobs (20)
            ──[Gemini AI]───▶  Scored & Ranked Jobs
            ──[Resume Match]▶  Best Resume + Cover Letter
            ──[Email]───────▶  📬 Your Inbox
```

---

## 🚀 Feature 1 — Daily Profile Boost Automation

> *"Naukri ka algorithm active profiles ko pehle dikhata hai — agar roz update nahi kiya toh ranking drop ho jaati hai!"*

### What It Does

Every day, the agent generates a **complete profile health report** so you know exactly what to do to stay at the top of recruiter search results.

### 📊 Profile Completeness Scoring System

14 sections, each with a weight — your total score = your **Naukri ranking health**:

```
Section               Weight    Your Status
──────────────────────────────────────────
📸 Profile Photo        10%     ✅ Complete
📝 Headline             10%     ✅ Complete
📋 Professional Summary 10%     ✅ Complete
🎓 Education            10%     ✅ Complete
💡 Skills Section       10%     ✅ Complete
🛠️ Projects Portfolio   10%     ✅ Complete
📄 Resume Uploaded      10%     ✅ Complete
💼 Work Experience       8%     ✅ Rinex Internship
🌍 Preferred Locations   5%     ✅ Set
🗣️ Languages             5%     ✅ Set
📜 Certifications        5%     ⚠️ Add Coursera certs
💰 Expected Salary       3%     ⚠️ Add to profile
🔑 Key Skills            2%     ✅ Set
💻 IT Skills             2%     ✅ Set
──────────────────────────────────────────
TOTAL                         ~84% (Good)
```

### 🔍 Keyword Gap Analysis

Trending 2025 skills your profile/resume is missing:

```
Software Developer: TypeScript, Docker, React.js, System Design, DSA
Data Analyst:       Power BI (adv), Tableau, ETL, BigQuery, Spark
Frontend Developer: Next.js, Redux, Tailwind CSS, GraphQL, Jest
```

### 💡 ATS Tip Rotation System

**25 curated tips**, 5 shown every day (rotating) — so you learn something new each day:

```
Day 1:  Use exact job title keywords in your headline
        Add GitHub link — recruiters actively check it
        Keep resume to 1 page as a fresher
        ...

Day 2:  Use action verbs: Built, Developed, Optimized...
        Add quantifiable numbers to every achievement
        ...
```

### ⚡ Daily Action Checklist (5 steps, visible in email)

```
STEP 1  → Re-order your top skill to position #1
STEP 2  → Edit headline: add one trending keyword from gaps
STEP 3  → Re-upload resume with today's date
STEP 4  → Search "software developer fresher" on Naukri
STEP 5  → Save 5 jobs to boost engagement signals
```

---

## 🤖 Feature 2 — AI Job Scoring & Ranking

> *"Not all jobs are equal. Gemini AI reads each JD and tells you exactly where you stand."*

### Scoring with Google Gemini AI

When `GEMINI_API_KEY` is configured, for **each job** the agent sends:

```
TO GEMINI:
──────────────────────────────────────────
JOB:
  Title:      Software Engineer
  Company:    TCS
  Domain:     Software Developer
  Experience: 0-1 Years

CANDIDATE (Rohit Kumar Singh):
  Skills:     JavaScript, Python, HTML5, CSS3, SQL,
              NumPy, Pandas, Power BI, Chart.js...
  Education:  B.Tech ECE – Haldia Inst of Technology
  Target:     Software Dev, Frontend, Web, Data Analyst
  Projects:   Portfolio, Blood Bank, Smart To-Do, FNP Dashboard...
──────────────────────────────────────────

GEMINI RETURNS:
  Score:             78%
  Match Reason:      "Strong JavaScript & Python match for this role"
  Top Skills Match:  ["JavaScript", "HTML5", "Python"]
  Skill Gaps:        ["TypeScript", "React.js"]
  Learning Tip:      "React Full Course – Dave Gray (YouTube)"
```

### 🔢 Heuristic Fallback (No API Key Needed)

If Gemini key is not set or quota is exhausted, a smart keyword fallback runs:

```
Domain keyword match  →  0 to 40 points
Your skill match      →  0 to 50 points
Fresher bonus         →  10 points
─────────────────────────────────────────
Final Score           →  0–100%
```

> ✅ **Agent never crashes** — fallback mode ensures email always gets sent

### 🎨 Score Badge Colors in Email

| Score Range | Badge Color | Action |
|-------------|-------------|--------|
| **80–100%** | 🟢 `#4ade80` Green | **Apply First!** |
| **65–79%** | 🔵 `#60a5fa` Blue | Strong match — apply |
| **50–64%** | 🟠 `#fb923c` Orange | Fair — worth applying |
| **0–49%** | 🔴 `#f87171` Red | Skill gap — consider skipping |

### 📚 Skill Gap Learning Resources (Free Only)

```
TypeScript   →  freeCodeCamp YouTube Course
Docker       →  TechWorld with Nana (YouTube)
React.js     →  Dave Gray Full Course (YouTube)
Next.js      →  Vercel Official Docs + freeCodeCamp
Power BI     →  Simplilearn YouTube Course
System Design→  Alex Xu's GitHub Primer (free)
AWS          →  freeCodeCamp Cloud Practitioner
DSA          →  Abdul Bari (YouTube) + LeetCode 75
```

---

## 📄 Feature 3 — Resume Smart Matching & Cover Letter

> *"Sending a software resume for a Data Analyst job = automatic rejection. This feature fixes that."*

### 🎯 Domain Auto-Detection Logic

The agent analyzes each job's title + domain keyword against two keyword banks:

```javascript
// Data domain keywords
['data analyst', 'python', 'power bi', 'tableau', 'sql analyst',
 'machine learning', 'analytics', 'etl', 'data engineer'...]

// Software domain keywords
['software developer', 'frontend', 'react', 'backend',
 'web developer', 'javascript', 'full stack', 'node'...]

// Higher match count wins → Software or Data resume selected
```

### 📋 Dual Resume System

#### 💻 Software Developer Resume → `resumes/resume_software.txt`
**Used for:** Software Developer · Frontend Developer · Web Developer · Full Stack

**Highlights shown:**
```
✅ Personal Portfolio    – HTML5, CSS3, JS (dark/light theme, 6+ projects)
✅ Blood Bank System     – Python, Tkinter (60% efficiency improvement)
✅ Smart To-Do List      – JS, Chart.js (40% task org. improvement)
✅ Rinex Internship      – 30% page load improvement
✅ CSI Treasurer         – Rs.50,000+ budget, 10+ workshops
```

#### 📊 Data Analyst Resume → `resumes/resume_data.txt`
**Used for:** Data Analyst · Python Developer · Business Analyst · BI Developer

**Highlights shown:**
```
✅ FNP Sales Dashboard   – Excel, 1,000+ orders, Rs.35.2L revenue, 80% effort reduction
✅ HR Power BI Dashboard – DAX, Power Query, 1,000+ employees, 40% reporting improvement
✅ Blood Bank System     – Python data management, Matplotlib visualization
✅ Rinex Internship      – data-driven UI components
✅ CSI Treasurer         – Rs.50,000+ financial data management
```

### ✉️ AI-Generated Cover Letter

For the **top AI-ranked job**, a fully personalized cover letter is generated:

**With Gemini AI (sample output):**
```
Dear Hiring Manager,

I am excited to apply for the Software Engineer position at TCS.
As a B.Tech graduate from Haldia Institute of Technology (2025, CGPA: 7.33),
I bring strong hands-on experience in JavaScript, Python, and web development.

One of my notable projects — "Blood Bank Management System" — demonstrates
my ability to design and deploy real-world Python applications, improving
data handling efficiency by 60%. I also built a responsive Smart To-Do List
with real-time Chart.js visualizations used by peers and rated highly.

I am a fast learner, highly motivated, and eager to contribute meaningfully
to your engineering team.

Warm regards,
Rohit Kumar Singh
```

**Without API key:** A professional template auto-fills with Rohit's real name, education, skills, and top project.

---

## 🔍 Core Engine — Naukri.com Scraper

> *"The agent uses an army of headless Chrome browsers to read Naukri like a human would — but 100x faster."*

### How It Works

```javascript
// For each of 20 URLs (4 cities × 5 roles):
page.goto('https://www.naukri.com/software-developer-jobs-in-bangalore?experience=0')
  → Wait for job cards to load
  → Extract data from DOM elements
  → Return structured job objects
```

### Target Coverage

```
Cities  ×  Roles  =  URLs Visited Per Day
──────────────────────────────────────────────
Bangalore     Software Developer      → 1 URL
Bangalore     Frontend Developer      → 1 URL
Bangalore     Python Developer        → 1 URL
Bangalore     Data Analyst            → 1 URL
Bangalore     Web Developer           → 1 URL
Delhi         [same 5 roles]          → 5 URLs
Pune          [same 5 roles]          → 5 URLs
Kolkata       [same 5 roles]          → 5 URLs
──────────────────────────────────────────────
TOTAL:        20 pages scraped/day
```

### Data Extracted Per Job

```json
{
  "title":    "Software Engineer",
  "company":  "TCS",
  "exp":      "0-1 Yrs",
  "salary":   "Not Disclosed",
  "location": "Bangalore, India",
  "posted":   "Just Now",
  "url":      "https://www.naukri.com/job/...",
  "domain":   "Software Developer",
  "city":     "Bangalore"
}
```

### Anti-Bot Stealth Techniques

```javascript
// Real browser fingerprint to bypass detection
setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64)...')
setViewport({ width: 1280, height: 900 })
evaluateOnNewDocument(() => {
  Object.defineProperty(navigator, 'webdriver', { get: () => false })
})
// Polite delays between requests (1.2s gap)
```

### Intelligent Filtering Pipeline

```
Raw Jobs (~60-120)
  → Step 1: Keep only 0-1 yr experience jobs
  → Step 2: Remove exact duplicate title+company
  → Step 3: Sort by freshness (Just Now > Hours > Today > Days > Weeks)
  → Step 4: Take top 20 only
Final Jobs (~15-20, all fresh and relevant)
```

---

## 📧 Email Engine — Premium Dark Mode Design

> *"Your daily email looks like a product dashboard, not a plain text alert."*

### Email Layout (What You See Every Morning)

```
╔════════════════════════════════════════════════════╗
║  💼  NAUKRI JOB ALERT                              ║
║  📅  Wednesday, 18 March 2026  ·  ⏰ 9:00 AM IST  ║
║  🎯  Top 18 Fresh Jobs · 0-1 Year Experience       ║
╠════════════════╦══════════════╦════════════════════╣
║   18 TOTAL     ║    4 CITIES  ║   5 DOMAINS        ║
║    JOBS        ║              ║                    ║
╠════════════════╩══════════════╩════════════════════╣
║                                                    ║
║  🚀 PROFILE BOOST REPORT                           ║
║  ┌──────────────────────────────────────────────┐  ║
║  │  Completeness: ████████░░  84%  (Good ✅)   │  ║
║  │  Keyword Gaps: TypeScript · React · Docker  │  ║
║  │                                              │  ║
║  │  💡 Today's ATS Tips:                       │  ║
║  │   ✦ Use exact job title in your headline    │  ║
║  │   ✦ Add GitHub link at top of resume        │  ║
║  │   ✦ List tech stack per project             │  ║
║  │   ✦ Keep resume to 1 page                   │  ║
║  │                                              │  ║
║  │  ⚡ Today's Actions:                         │  ║
║  │   STEP 1  Re-order top skill                │  ║
║  │   STEP 2  Add trending keyword to headline  │  ║
║  │   STEP 3  Re-upload resume with today's date│  ║
║  └──────────────────────────────────────────────┘  ║
║                                                    ║
║  🤖 AI JOB MATCH ANALYSIS                          ║
║  ┌──────────────────────────────────────────────┐  ║
║  │  Top: 82%  │  Avg: 61%  │  High Match: 7     │  ║
║  │                                              │  ║
║  │  🏆 Best Match:                              │  ║
║  │     Frontend Developer @ Infosys             │  ║
║  │     "Strong JS + HTML match for this role"  │  ║
║  │                                              │  ║
║  │  📚 Skill Gaps to Close:                    │  ║
║  │     TypeScript → freeCodeCamp YouTube       │  ║
║  │     Docker → TechWorld with Nana (YouTube)  │  ║
║  └──────────────────────────────────────────────┘  ║
║                                                    ║
║  📄 RESUME SMART MATCHING                          ║
║  ┌──────────────────────────────────────────────┐  ║
║  │  💻 Software Resume → 12 jobs               │  ║
║  │  📊 Data Resume     → 6  jobs               │  ║
║  │                                              │  ║
║  │  🛠️ Resume Tips:                             │  ║
║  │   ● Add GitHub at top of resume             │  ║
║  │   ● List tech stack per project             │  ║
║  │   ● Use numbers in achievements             │  ║
║  │                                              │  ║
║  │  ✉️ Cover Letter (for Backend Dev @ TCS):   │  ║
║  │  "Dear Hiring Manager, I am excited to...   │  ║
║  │   As a B.Tech grad from Haldia Institute... │  ║
║  └──────────────────────────────────────────────┘  ║
║                                                    ║
║  💼 TODAY'S JOB LISTINGS                           ║
║                                                    ║
║  🏙️ BANGALORE  (7 jobs)                           ║
║  ┌──────────────────────────────────────────────┐  ║
║  │ 🏆 #01  Software Developer  🤖 82% Match    │  ║
║  │                                              │  ║
║  │  Frontend Developer                          │  ║
║  │  🏢 Infosys  🕐 Just Now                    │  ║
║  │                                              │  ║
║  │  💼 0-1 Yrs  📍 Bangalore  💰 3-5 LPA       │  ║
║  │  💡 Gaps: TypeScript, Next.js                │  ║
║  │                                              │  ║
║  │  [ APPLY ON NAUKRI → ]                       │  ║
║  └──────────────────────────────────────────────┘  ║
║  ... (more job cards)                              ║
╠════════════════════════════════════════════════════╣
║   🚀 EXPLORE ALL JOBS ON NAUKRI.COM                ║
╠════════════════════════════════════════════════════╣
║  🤖 Naukri Job AI Agent · Runs daily @ 9 AM IST   ║
║  Gemini AI · Puppeteer · GitHub Actions            ║
╚════════════════════════════════════════════════════╝
```

### Design Highlights

- **Background:** Deep navy `#070d1a` — easy on eyes
- **Job Cards:** Glassmorphism with gradient borders
- **City Themes:** Bangalore 🟠 Orange · Delhi 🔴 Red · Pune 🟣 Purple · Kolkata 🩵 Teal
- **AI Badge:** Color changes by score (green/blue/orange/red)
- **Top Pick:** 🏆 Gold badge + glow effect on best job
- **Mobile Responsive:** Works perfectly on phone too

---

## 📁 Project Structure (Every File Explained)

```
Nukari.com/                           ← Project root
│
├── 📂 .github/
│   └── 📂 workflows/
│       └── 📄 daily.yml              ← GitHub Actions cron job
│                                       Runs at 3:30 AM UTC = 9:00 AM IST
│
├── 📂 config/
│   └── 📄 userProfile.js             ← ⭐ YOUR PROFILE (edit this!)
│                                       Skills, education, projects,
│                                       Naukri section status, resume paths
│
├── 📂 resumes/
│   ├── 📄 resume_software.txt        ← 💻 Software Dev / Frontend resume
│   │                                   Used for: SW Dev, Frontend, Web Dev
│   └── 📄 resume_data.txt            ← 📊 Data Analyst resume
│                                       Used for: Data Analyst, Python Dev
│
├── 📂 services/
│   ├── 📄 scraper.js                 ← Puppeteer headless browser scraper
│   │                                   4 cities × 5 roles = 20 URLs/day
│   │
│   ├── 📄 filter.js                  ← Job filtering engine
│   │                                   Keeps 0-1 yr, removes dupes, sorts
│   │
│   ├── 📄 profileBoost.js            ← 🚀 Feature 1: Profile Boost
│   │                                   Completeness score, ATS tips,
│   │                                   keyword gaps, action checklist
│   │
│   ├── 📄 aiScorer.js                ← 🤖 Feature 2: AI Job Scoring
│   │                                   Gemini API + heuristic fallback
│   │                                   Scores 0-100%, finds skill gaps
│   │
│   ├── 📄 resumeMatcher.js           ← 📄 Feature 3: Resume Matching
│   │                                   Domain detection, resume selection,
│   │                                   AI cover letter generation
│   │
│   └── 📄 mail.js                    ← 📧 Premium Email Builder
│                                       Dark mode, city themes, AI badges
│                                       Renders all sections into HTML
│
├── 📂 utils/
│   └── 📄 formatter.js               ← Utility helpers (date, text format)
│
├── 📄 index.js                       ← 🎯 MAIN ENTRYPOINT
│                                       Runs all 5 steps in sequence
│                                       Error handling + summary log
│
├── 📄 package.json                   ← Dependencies & scripts
├── 📄 .env                           ← 🔐 Local secrets (NOT committed)
├── 📄 .env.example                   ← Template for all required variables
└── 📄 .gitignore                     ← Excludes .env + node_modules
```

---

## 🛠️ Tech Stack (Detailed)

| Component | Technology | Version | Why This? |
|-----------|-----------|---------|-----------|
| Runtime | Node.js | 20 LTS | Fast async I/O, npm ecosystem |
| Web Scraper | puppeteer-core | 24.x | Full browser control, JS rendering |
| Chromium | @sparticuz/chromium | 143.x | Lightweight Chromium for CI/CD |
| AI Engine | Google Gemini | 2.0 Flash Lite | Free tier, fast, accurate |
| API Calls | Native `https` | Built-in | Zero extra dependency |
| HTML Parsing | cheerio | 1.x | jQuery-like DOM parsing |
| Email | nodemailer | 6.x | Reliable Gmail SMTP |
| HTTP Client | axios | 1.x | Promise-based HTTP |
| Config | dotenv | 16.x | Secure env variable loading |
| Scheduler | GitHub Actions | - | Free 2000 min/month, reliable |

---

## ⚙️ Setup & Installation

### Prerequisites

- [ ] Node.js 18 or higher
- [ ] Gmail account with 2-Step Verification
- [ ] Google Gemini API key (free)

### 📥 Step 1 — Clone & Install

```bash
git clone https://github.com/Rohitkr2002/Naukri.com-AI-Agent-.git
cd Naukri.com-AI-Agent-
npm install
```

### 🔐 Step 2 — Create Gmail App Password

```
Google Account → Security → 2-Step Verification → App Passwords
Select "Mail" → Generate → Copy 16-character password
```

### 🔑 Step 3 — Get Free Gemini API Key

```
1. Visit: https://aistudio.google.com/apikey
2. Click: "Create API key"
3. Copy the key (starts with AIza...)
```

### ⚙️ Step 4 — Configure .env

```bash
cp .env.example .env
```

```env
# ── Gmail ────────────────────────────────────
GMAIL_USER=your_email@gmail.com
GMAIL_PASS=abcdefghijklmnop       # 16-char App Password

# ── Recipient ────────────────────────────────
RECIPIENT_EMAIL=your_email@gmail.com

# ── Gemini AI (FREE) ─────────────────────────
GEMINI_API_KEY=AIzaSy...your_key

# ── RapidAPI (optional) ──────────────────────
RAPIDAPI_KEY=your_key
```

### 📝 Step 5 — Personalize Your Profile

Open `config/userProfile.js` and update:

```javascript
const USER_PROFILE = {
  name: 'Rohit Kumar Singh',
  skills: {
    languages: ['JavaScript', 'Python', 'SQL'],
    frontend:  ['HTML5', 'CSS3', 'Bootstrap'],
    dataTools: ['NumPy', 'Pandas', 'Power BI', 'Excel'],
    // ... update with YOUR skills
  },
  // Mark which Naukri profile sections you have completed:
  profileSections: {
    photo: true,
    headline: true,
    certifications: false, // will be flagged in profile tips
    // ...
  }
};
```

### 📄 Step 6 — Update Your Resumes

Edit `resumes/resume_software.txt` with your Software Dev resume content.
Edit `resumes/resume_data.txt` with your Data Analyst resume content.

### 🚀 Step 7 — Run & Test

```bash
node index.js
```

**Expected output:**
```
============================================================
  🤖 Naukri Job AI Agent – Enhanced Edition
  ⏰ Run Time (IST): 18/3/2026, 9:00:00 am
  🚀 Features: Profile Boost | AI Scoring | Resume Matching
============================================================

🚀 Feature 1: Running Daily Profile Boost Analysis...
   📊 Profile Completeness: 84% (Good)
   🔍 Keyword gap analysis complete for 5 domains
✅ Profile Boost report ready

🚀 Starting Naukri.com Direct Scraper (Headless Browser)...
   Cities: Bangalore | Delhi | Pune | Kolkata
   Roles:  Software Dev | Frontend | Python | Data Analyst | Web Dev

🤖 Feature 2: AI Job Scoring & Ranking...
   Mode: ✨ Gemini AI
   Scoring 18 jobs...
   ✅ Top Score: 82% | Avg: 61% | High Match: 7 jobs

📄 Feature 3: Resume Smart Matching System...
   ✅ Software Resume: 12 jobs | Data Resume: 6 jobs

📧 Sending email to: rohit@gmail.com
✅ Email sent!

============================================================
  ✅ Agent completed successfully!
  📊 Features: Profile Boost ✅ | AI Scoring ✅ | Resume Match ✅
============================================================
```

---

## 🔑 GitHub Actions — Automated Daily Run

### Add Repository Secrets

```
GitHub → Repo → Settings → Secrets and variables → Actions → New repository secret
```

| Secret Name | Value | Required? |
|-------------|-------|-----------|
| `GMAIL_USER` | your_email@gmail.com | ✅ Required |
| `GMAIL_PASS` | 16-char App Password | ✅ Required |
| `RECIPIENT_EMAIL` | where to send report | ✅ Required |
| `GEMINI_API_KEY` | free Gemini API key | ⭐ Recommended |
| `RAPIDAPI_KEY` | RapidAPI key | ⚡ Optional |

### Workflow File (`.github/workflows/daily.yml`)

```yaml
name: Naukri Job AI Agent – Daily 9AM IST

on:
  schedule:
    - cron: '30 3 * * *'    # 3:30 AM UTC = 9:00 AM IST
  workflow_dispatch:          # Manual trigger from Actions tab

jobs:
  run-job-agent:
    runs-on: ubuntu-latest
    timeout-minutes: 20
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '20'
      - name: Install Chrome
        run: sudo apt-get install -y google-chrome-stable
      - name: Install dependencies
        run: npm install
      - name: Run Agent
        env:
          GMAIL_USER:      ${{ secrets.GMAIL_USER }}
          GMAIL_PASS:      ${{ secrets.GMAIL_PASS }}
          RECIPIENT_EMAIL: ${{ secrets.RECIPIENT_EMAIL }}
          GEMINI_API_KEY:  ${{ secrets.GEMINI_API_KEY }}
          RAPIDAPI_KEY:    ${{ secrets.RAPIDAPI_KEY }}
        run: node index.js
```

### Manual Trigger

```
GitHub → Actions → "Naukri Job AI Agent – Daily 9AM IST" → Run workflow
```

---

## 🎨 Customization Guide

### Add More Job Roles

```javascript
// services/scraper.js
const ROLES = [
  { keyword: 'software-developer', label: 'Software Developer' },
  { keyword: 'data-analyst',       label: 'Data Analyst'       },
  // 👇 Add your role here:
  { keyword: 'java-developer',     label: 'Java Developer'     },
  { keyword: 'devops-engineer',    label: 'DevOps Engineer'    },
];
```

### Add More Cities

```javascript
// services/scraper.js
const CITIES = ['bangalore', 'delhi', 'pune', 'kolkata'];
// 👇 Add more:
// const CITIES = ['bangalore', 'delhi', 'pune', 'kolkata', 'hyderabad', 'mumbai'];
```

### Change Schedule Timing

```yaml
# .github/workflows/daily.yml
- cron: '30 3 * * *'    # 9:00 AM IST (default)
- cron: '30 6 * * *'    # 12:00 PM IST
- cron: '30 1 * * *'    # 7:00 AM IST
```

### Change Max Jobs Returned

```javascript
// services/filter.js
const top20 = deduped.slice(0, 20); // Change 20 to any number
```

---

## 🔧 Troubleshooting

<details>
<summary><b>❌ No jobs scraped — "Naukri may have changed HTML"</b></summary>

Naukri.com occasionally changes their DOM selectors. Update `services/scraper.js`:

```javascript
// Find the new selector using Chrome DevTools on Naukri.com
const cards = document.querySelectorAll('YOUR_NEW_SELECTOR');
```
</details>

<details>
<summary><b>❌ Email not sending — Gmail authentication error</b></summary>

Most common cause: `GMAIL_PASS` is your regular password.

```
Fix: Use Gmail APP PASSWORD (16 chars, no spaces)
     Google Account → Security → 2-Step Verification → App Passwords
```
</details>

<details>
<summary><b>❌ Gemini API failing — using heuristic fallback</b></summary>

```
Cause 1: New key — quota activates in 10-30 minutes, wait and retry
Cause 2: Wrong key format — must start with "AIza"
Cause 3: Rate limit — gemini-2.0-flash-lite allows 30 req/min (free)
```

Note: **Agent still works** — heuristic scoring takes over automatically.
</details>

<details>
<summary><b>❌ GitHub Actions failing</b></summary>

1. Check **Actions tab** for error logs
2. Verify all 5 secrets are set in Repository Settings
3. If Chrome install failed → re-run workflow (usually transient)
</details>

---

## 📊 Performance & Cost

| Metric | Value |
|--------|-------|
| 🌍 Cities scraped | 4 (Bangalore, Delhi, Pune, Kolkata) |
| 💼 Job roles | 5 (Software, Frontend, Python, Data, Web) |
| 🔗 URLs visited | 20 per run |
| 📦 Raw jobs collected | 60–120 |
| ✅ After filtering | 15–20 (0-1 yr, unique, fresh) |
| 🤖 Gemini API calls | Max 20/day (well within free tier of 1500/day) |
| ⏱️ Total runtime | 5–8 minutes |
| 📅 GitHub Actions minutes used | 5–8 min/day vs 2000 min/month free |
| 💸 **Total Cost** | **₹0 — 100% Free** |

---

## 🤝 Contributing

1. Fork the repository
2. Create feature branch: `git checkout -b feature/your-feature`
3. Commit: `git commit -m 'feat: add your feature'`
4. Push: `git push origin feature/your-feature`
5. Open a Pull Request

**Ideas welcome:**
- LinkedIn / Indeed scraper support
- Telegram / WhatsApp notifications
- Job application tracker
- Interview preparation tips per job role
- Multiple recipient email support

---

## 📄 License

MIT License — free to use, fork, and build upon.

---

<div align="center">

<img src="https://capsule-render.vercel.app/api?type=waving&color=0:1e3a5f,100:0d1b2a&height=120&section=footer" alt="Footer"/>

### Built with ❤️ by [Rohit Kumar Singh](https://github.com/Rohitkr2002)

**Haldia Institute of Technology · B.Tech ECE · 2025**

📧 rajputrohitsingh998@gmail.com &nbsp;·&nbsp; 🔗 [LinkedIn](https://linkedin.com/in/rohit-kumar-singh) &nbsp;·&nbsp; 💻 [GitHub](https://github.com/Rohitkr2002)

---

*⭐ If this project helped you land an interview or saved you hours of job hunting — please star the repo! It means a lot.*

</div>
