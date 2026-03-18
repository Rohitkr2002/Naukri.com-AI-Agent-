<div align="center">

# 🤖 Naukri Job AI Agent
### *Enhanced Edition — Powered by Google Gemini AI*

<br/>

[![Node.js](https://img.shields.io/badge/Node.js-20.x-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)](https://nodejs.org)
[![Puppeteer](https://img.shields.io/badge/Puppeteer-Headless%20Chrome-40B5A4?style=for-the-badge&logo=googlechrome&logoColor=white)](https://pptr.dev)
[![Gemini AI](https://img.shields.io/badge/Gemini%20AI-2.0%20Flash-4285F4?style=for-the-badge&logo=google&logoColor=white)](https://aistudio.google.com)
[![GitHub Actions](https://img.shields.io/badge/GitHub%20Actions-Auto%209AM%20IST-2088FF?style=for-the-badge&logo=githubactions&logoColor=white)](https://github.com/features/actions)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=for-the-badge)](LICENSE)

<br/>

> **A fully automated, AI-powered job monitoring agent that scrapes Naukri.com every day, scores each job using Google Gemini AI, matches the best resume, and delivers a stunning dark-mode email report to your inbox at 9:00 AM IST — zero manual effort required.**

<br/>

```
📅 Runs Daily at 9:00 AM IST  ·  🔍 4 Cities  ·  💼 5 Job Roles  ·  🤖 AI-Powered  ·  📬 Premium Email
```

</div>

---

## 📌 Table of Contents

- [🎯 What Is This?](#-what-is-this)
- [⚡ Features Overview](#-features-overview)
- [🚀 Feature 1 — Daily Profile Boost](#-feature-1--daily-profile-boost-automation)
- [🤖 Feature 2 — AI Job Scoring](#-feature-2--ai-job-scoring--ranking)
- [📄 Feature 3 — Resume Smart Matching](#-feature-3--resume-smart-matching-system)
- [📧 Premium Email Design](#-premium-email-design)
- [🔄 How It Works](#-how-it-works--5-step-pipeline)
- [📁 Project Structure](#-project-structure)
- [🛠️ Tech Stack](#️-tech-stack)
- [⚙️ Installation & Setup](#️-installation--setup)
- [🔑 GitHub Actions Setup](#-github-actions-setup-automated-daily-run)
- [🎨 Customization Guide](#-customization-guide)
- [🔧 Troubleshooting](#-troubleshooting)
- [📊 Stats & Performance](#-stats--performance)

---

## 🎯 What Is This?

**Naukri Job AI Agent** is a production-grade, self-running automation system built for freshers and early-career developers. It solves the single biggest problem in job hunting — **consistency**.

Instead of manually checking Naukri.com every day, browsing hundreds of irrelevant listings, and copy-pasting the same cover letter — this agent does **everything automatically**:

| ❌ Without Agent | ✅ With Agent |
|------------------|--------------|
| Manually check Naukri every day | Automated daily scrape at 9 AM IST |
| Browse 100+ irrelevant jobs | Only top 20 freshers jobs, filtered & ranked |
| Guess which jobs match you | AI scores each job 0–100% against your skills |
| Send same resume everywhere | Correct resume auto-selected per job domain |
| Write cover letters manually | AI-generated personalized cover letter |
| Forget to update your profile | Daily ATS tips + profile boost report |

---

## ⚡ Features Overview

```
┌─────────────────────────────────────────────────────────────┐
│                  NAUKRI JOB AI AGENT                        │
├─────────────────┬───────────────────────────────────────────┤
│  🔍 SCRAPER     │ Puppeteer headless browser · 4 cities     │
│                 │ 5 job roles · Anti-bot stealth             │
├─────────────────┼───────────────────────────────────────────┤
│  🔧 FILTER      │ 0-1 yr exp · Deduplication · Sort fresh   │
├─────────────────┼───────────────────────────────────────────┤
│  🚀 BOOST       │ Profile completeness · ATS tips · Gaps    │
├─────────────────┼───────────────────────────────────────────┤
│  🤖 AI SCORER   │ Gemini AI · 0-100% match · Skill gaps     │
├─────────────────┼───────────────────────────────────────────┤
│  📄 RESUME      │ Domain detect · Best resume · Cover letter│
├─────────────────┼───────────────────────────────────────────┤
│  📧 EMAIL       │ Dark mode · Premium design · Job cards    │
└─────────────────┴───────────────────────────────────────────┘
```

---

## 🚀 Feature 1 — Daily Profile Boost Automation

> *Make your Naukri profile the first one recruiters see — every single day*

### 📊 Profile Completeness Scoring

Scores your profile out of **100%** across **14 weighted sections**:

| Section | Weight | Description |
|---------|--------|-------------|
| Photo | 10% | Professional profile picture |
| Headline | 10% | Keyword-rich professional title |
| Summary | 10% | Strong, ATS-optimized bio |
| Education | 10% | Degree, CGPA, graduation year |
| Skills | 10% | Key skills + IT skills sections |
| Projects | 10% | Portfolio projects with tech stack |
| Resume | 10% | Uploaded, up-to-date resume |
| Experience | 8% | Internships / work experience |
| Languages | 5% | Language proficiency |
| Preferred Locations | 5% | City preferences |
| Certifications | 5% | Online courses & certificates |
| Expected Salary | 3% | Salary expectations |
| Key Skills | 2% | Tagged skills for search |
| IT Skills | 2% | Technical tool proficiency |

### 🔍 Keyword Gap Analysis

Compares **your current skills** against **2025 trending skills** per domain and identifies what's missing:

```
Software Developer gaps:  TypeScript, Docker, Kubernetes, System Design, Redis
Frontend Developer gaps:  Next.js, Redux, GraphQL, PWA, Web Performance
Data Analyst gaps:        Power BI, Tableau, ETL, Spark, Alteryx
Python Developer gaps:    FastAPI, Celery, SQLAlchemy, Asyncio, Pytest
Web Developer gaps:       TypeScript, GraphQL, PWA, SEO Basics
```

### 💡 ATS-Friendly Tips — 25 Rotating Daily Tips

Different 5 tips every day — covering:
- Resume formatting for ATS parsers
- Keyword placement strategies
- Recruiter search optimization
- Profile activity signals
- Portfolio & GitHub optimization

### ⚡ Daily Action Checklist

5 specific actions each morning to boost recruiter visibility:
1. Re-order top skill to position #1
2. Edit headline with one trending keyword
3. Re-upload resume with today's date
4. Search for "software developer fresher" on Naukri
5. Save 5 jobs to boost engagement signals

---

## 🤖 Feature 2 — AI Job Scoring & Ranking

> *Google Gemini AI reads every job description and tells you exactly how well you match*

### How Scoring Works

**With Gemini API Key (AI Mode):**
```
For each job → Send to Gemini AI:
  ├── Job Title + Company + Domain + Requirements
  └── Your Skills + Education + Projects + Target Roles

Gemini returns:
  ├── Match Score (0–100%)
  ├── Why it's a good/bad match (1 sentence)
  ├── Top 3 skills that matched
  ├── Skill gaps (what you're missing)
  └── Learning recommendation (free resource)
```

**Without API Key (Heuristic Mode — fallback):**
```
Domain relevance score  → max 40 points
Skill keyword match     → max 50 points
Fresher bonus           → 10 points
────────────────────────────────────────
Total                   → 0-100%
```

> Agent **never crashes** — always falls back to heuristic mode gracefully

### 📈 Score Color System in Email

| Score | Color | Label | Meaning |
|-------|-------|-------|---------|
| 80–100% | 🟢 Green | Excellent | Apply immediately |
| 65–79% | 🔵 Blue | Good | Strong candidate |
| 50–64% | 🟠 Orange | Fair | Worth applying |
| 0–49% | 🔴 Red | Low | Skill gap exists |

### 📚 Skill Gap Learning Resources

When gaps are detected, the agent suggests **free** learning resources:

```
TypeScript    → TypeScript for Beginners – freeCodeCamp (YouTube)
Docker        → Docker Crash Course – TechWorld with Nana (YouTube)
Power BI      → Power BI Full Course – Simplilearn (YouTube)
System Design → System Design Primer – GitHub (Alex Xu)
AWS           → AWS Cloud Practitioner – freeCodeCamp
Next.js       → Next.js 14 Course – Vercel Docs + freeCodeCamp
... and 10+ more
```

---

## 📄 Feature 3 — Resume Smart Matching System

> *Always send the right resume — automatically*

### 🎯 Domain Auto-Detection

The system analyzes each job's title and domain using keyword matching:

```
Job: "Data Analyst at Infosys"       → 📊 DATA domain detected
Job: "React Developer at TCS"        → 💻 SOFTWARE domain detected
Job: "Python Developer at Wipro"     → 📊 DATA domain detected
Job: "Frontend Engineer at Accenture"→ 💻 SOFTWARE domain detected
```

### 📋 Dual Resume System

| Resume | Used For | File |
|--------|----------|------|
| 💻 Software Developer Resume | Software Dev · Frontend · Web Dev · Full Stack | `resumes/resume_software.txt` |
| 📊 Data Analyst Resume | Data Analyst · Python Dev · ML Engineer · BI Developer | `resumes/resume_data.txt` |

### ✉️ AI-Generated Cover Letter

For the **top-ranked job**, a personalized cover letter is generated:

- **With Gemini API**: Fully customized, mentions your specific project, skills, and the exact company/role
- **Without API**: Professional template with your real name, education, skills, and top project auto-filled

**Cover Letter includes:**
- Specific job title and company name
- Your most relevant 2–3 skills for that role
- Brief mention of your best project with impact
- Confident call-to-action closing
- Kept under 180 words (recruiter attention span)

### 🛠️ ATS Resume Improvement Tips

**10 tips per resume type**, top 4 shown in email:

```
Software Resume Tips:
  → Add GitHub link at top — recruiters WILL check it
  → List tech stack per project: "Built with React.js, Node.js, MongoDB"
  → Use numbers: "Reduced load time by 30%" not "Improved performance"
  → Keep to 1 page — freshers with 2-page resumes are ignored

Data Resume Tips:
  → List tools clearly: Python, Pandas, NumPy, SQL, Power BI, Tableau
  → Add dataset size: "Analyzed 50,000+ rows"
  → Include Kaggle profile URL if you have notebooks
  → Mention SQL level: "Advanced SQL – CTEs, Window Functions"
```

---

## 📧 Premium Email Design

Every morning, a beautifully crafted dark-mode HTML email lands in your inbox:

### Email Structure

```
┌──────────────────────────────────────────────┐
│         💼  NAUKRI JOB ALERT                 │
│    📅 Date  ·  ⏰ 9:00 AM IST               │
│    🎯 Top N Fresh Jobs · 0-1 Yr Experience   │
├───────────┬───────────┬──────────┬───────────┤
│ TOTAL     │  CITIES   │ DOMAINS  │  AI SCORE │
│  JOBS     │           │          │           │
├──────────────────────────────────────────────┤
│         🚀 PROFILE BOOST REPORT              │
│   Completeness: ████████░░ 84%  (Good)       │
│   Keyword Gaps: TypeScript · Docker · ...    │
│   Today's Tips: 1. ... 2. ... 3. ...        │
│   Today's Actions: Step 1, Step 2, Step 3   │
├──────────────────────────────────────────────┤
│         🤖 AI JOB MATCH ANALYSIS             │
│   Top: 78% | Avg: 62% | High Match: 8 jobs  │
│   🏆 Best Job: Software Engineer @ TCS       │
│   📚 Skill Gaps to Close: TypeScript, Docker │
├──────────────────────────────────────────────┤
│         📄 RESUME SMART MATCHING             │
│   💻 Software Resume → 14 jobs              │
│   📊 Data Resume → 6 jobs                  │
│   ✉️ Cover Letter Preview for Top Job       │
├──────────────────────────────────────────────┤
│         💼 TODAY'S JOB LISTINGS              │
│  🏙️ BANGALORE                               │
│  ┌─────────────────────────────────────┐    │
│  │ #01 · Software Developer · 🤖 78%  │    │
│  │ Senior React Developer              │    │
│  │ 🏢 TCS  🕐 Just Now               │    │
│  │ 💼 0-1 Yrs  📍 Bangalore  💰 3-5L │    │
│  │       [ Apply on Naukri → ]         │    │
│  └─────────────────────────────────────┘    │
│  ... more job cards ...                      │
├──────────────────────────────────────────────┤
│     🚀 Explore All Jobs on Naukri.com        │
├──────────────────────────────────────────────┤
│  🤖 Automated by Naukri Job AI Agent         │
│  Runs daily · GitHub Actions · Gemini AI     │
└──────────────────────────────────────────────┘
```

### Design Features
- **Dark mode** background (`#070d1a`) — easy on eyes
- **City-themed accent colors** — Bangalore 🟠, Delhi 🔴, Pune 🟣, Kolkata 🩵
- **AI score color badges** — green/blue/orange/red per percentage
- **Glassmorphism** job cards with gradient borders
- **Mobile responsive** layout
- **ATS skill gap tips** embedded in each job card

---

## 🔄 How It Works — 5-Step Pipeline

```
╔══════════════════════════════════════════════════════════════╗
║                    DAILY PIPELINE (9 AM IST)                 ║
╠══════════════════════════════════════════════════════════════╣
║                                                              ║
║  STEP 0  🚀 Profile Boost Analysis                          ║
║          ├── Load userProfile.js config                      ║
║          ├── Calculate completeness score (14 sections)      ║
║          ├── Compare skills vs trending 2025 stack           ║
║          ├── Select today's 5 ATS tips (daily rotation)      ║
║          └── Generate action checklist + recruiter signals   ║
║                                                              ║
║  STEP 1  🔍 Scrape Naukri.com                               ║
║          ├── Launch headless Chromium (Puppeteer)            ║
║          ├── Navigate 4 cities × 5 roles = 20 URLs           ║
║          ├── Extract: title, company, exp, salary, location  ║
║          ├── Anti-bot: real user-agent, viewport, delays     ║
║          └── Collect all raw job listings                    ║
║                                                              ║
║  STEP 2  🔧 Filter & Rank                                   ║
║          ├── Keep only 0-1 year experience jobs              ║
║          ├── Remove duplicate listings                       ║
║          ├── Sort by posting freshness (Just Now → Week Ago) ║
║          └── Cap at top 20 unique jobs                       ║
║                                                              ║
║  STEP 3  🤖 AI Scoring (Gemini or Heuristic)                ║
║          ├── For each job → call Gemini API (or heuristic)   ║
║          ├── Get match score, reason, gaps, learning tip     ║
║          ├── Sort all jobs by AI score descending            ║
║          └── Aggregate skill gap summary across all jobs     ║
║                                                              ║
║  STEP 4  📄 Resume Matching                                  ║
║          ├── Detect domain for each job (software/data)      ║
║          ├── Assign correct resume file                      ║
║          ├── Generate cover letter for top-ranked job        ║
║          └── Add ATS tips per resume type                    ║
║                                                              ║
║  STEP 5  📧 Send Premium Email                               ║
║          ├── Build full HTML email with all sections         ║
║          ├── Inject: boost report, AI scores, resume match   ║
║          ├── Group jobs by city with themed cards            ║
║          └── Send via Gmail SMTP (Nodemailer)                ║
║                                                              ║
╚══════════════════════════════════════════════════════════════╝
```

---

## 📁 Project Structure

```
Nukari.com/
│
├── 📂 .github/
│   └── 📂 workflows/
│       └── 📄 daily.yml          # GitHub Actions cron (9 AM IST = 3:30 AM UTC)
│
├── 📂 config/
│   └── 📄 userProfile.js         # ⚙️ YOUR profile config — EDIT THIS FIRST!
│                                  #    (skills, education, projects, sections)
│
├── 📂 resumes/
│   ├── 📄 resume_software.txt    # 💻 Resume for Software/Frontend/Web roles
│   └── 📄 resume_data.txt        # 📊 Resume for Data Analyst/Python roles
│
├── 📂 services/
│   ├── 📄 scraper.js             # Naukri.com headless browser scraper (Puppeteer)
│   ├── 📄 filter.js              # Experience filter, dedup, freshness sort
│   ├── 📄 profileBoost.js        # Feature 1: Completeness score, ATS tips, gaps
│   ├── 📄 aiScorer.js            # Feature 2: Gemini AI scoring + fallback
│   ├── 📄 resumeMatcher.js       # Feature 3: Domain detect, resume assign, cover letter
│   └── 📄 mail.js                # HTML email builder (dark-mode, premium design)
│
├── 📂 utils/
│   └── 📄 formatter.js           # Utility formatting helpers
│
├── 📄 index.js                   # Main orchestrator — runs 5-step pipeline
├── 📄 package.json               # Dependencies
├── 📄 .env                       # Local secrets (NOT committed to git)
├── 📄 .env.example               # Environment variable template
└── 📄 .gitignore                 # Excludes .env and node_modules
```

---

## 🛠️ Tech Stack

| Layer | Technology | Purpose |
|-------|-----------|---------|
| **Runtime** | Node.js 20 LTS | Core execution environment |
| **Scraper** | Puppeteer-core | Headless browser automation |
| **Browser** | @sparticuz/chromium | Chromium for CI/CD environments |
| **AI Engine** | Google Gemini 2.0 Flash Lite | Job scoring + cover letter generation |
| **HTTP Client** | Native `https` module | Gemini API calls (no extra dependency) |
| **Email** | Nodemailer + Gmail SMTP | HTML email delivery |
| **HTML Parsing** | Cheerio | DOM parsing fallback |
| **HTTP Requests** | Axios | API request utility |
| **Scheduler** | GitHub Actions Cron | Daily 9 AM IST automation |
| **Config** | dotenv | Environment variable management |

---

## ⚙️ Installation & Setup

### Prerequisites

- Node.js 18+ installed
- Gmail account with 2-Step Verification enabled
- Google Gemini API key (free at [aistudio.google.com](https://aistudio.google.com/apikey))

### Step 1 — Clone & Install

```bash
git clone https://github.com/Rohitkr2002/Naukri.com-AI-Agent-.git
cd Naukri.com-AI-Agent-
npm install
```

### Step 2 — Create Gmail App Password

1. Go to [myaccount.google.com/security](https://myaccount.google.com/security)
2. Enable **2-Step Verification**
3. Search for **"App Passwords"**
4. Create password for **"Mail"**
5. Copy the 16-character password (no spaces)

### Step 3 — Get Gemini API Key (Free)

1. Go to [aistudio.google.com/apikey](https://aistudio.google.com/apikey)
2. Click **"Create API key"**
3. Copy the key (starts with `AIza...`)

### Step 4 — Configure Environment

```bash
cp .env.example .env
```

Edit `.env` with your actual values:

```env
# ─── Gmail Credentials ──────────────────────────
GMAIL_USER=your_email@gmail.com
GMAIL_PASS=abcd efgh ijkl mnop    # 16-char App Password

# ─── Where to send the daily report ─────────────
RECIPIENT_EMAIL=your_email@gmail.com

# ─── RapidAPI (optional) ─────────────────────────
RAPIDAPI_KEY=your_rapidapi_key

# ─── Gemini AI (FREE — highly recommended) ───────
GEMINI_API_KEY=AIzaSy...your_key
```

### Step 5 — Personalize Your Profile

Open `config/userProfile.js` and update with **your actual details**:

```js
const USER_PROFILE = {
  name: 'Your Full Name',
  targetRole: ['Software Developer', 'Frontend Developer'],
  experienceYears: 0,  // 0 for fresher

  skills: {
    languages: ['JavaScript', 'Python', 'HTML', 'CSS'],
    frontend:  ['React.js', 'Tailwind CSS'],
    backend:   ['Node.js', 'Express.js'],
    database:  ['MySQL', 'MongoDB'],
    tools:     ['Git', 'VS Code', 'Postman'],
  },

  education: {
    degree: 'B.Tech',
    field: 'Computer Science',
    year: 2024,
    cgpa: '8.0',
  },

  projects: [
    {
      name: 'My Best Project',
      tech: ['React.js', 'Node.js'],
      description: 'What it does and its impact',
    },
  ],

  // Set true for sections you have completed on Naukri
  profileSections: {
    photo: true,
    headline: true,
    summary: true,
    experience: false,  // set true if you have internship
    education: true,
    skills: true,
    projects: true,
    resumeUploaded: true,
    certifications: false,
    // ...
  },
};
```

### Step 6 — Update Your Resumes

Edit the resume files in `resumes/` folder with **your actual information**:
- `resumes/resume_software.txt` — for Software/Frontend/Web jobs
- `resumes/resume_data.txt` — for Data Analyst/Python jobs

### Step 7 — Test Run

```bash
node index.js
```

Check your email inbox — you should receive the full report!

---

## 🔑 GitHub Actions Setup (Automated Daily Run)

### Add Repository Secrets

Go to: **GitHub → Your Repo → Settings → Secrets and variables → Actions → New repository secret**

| Secret Name | Value | Required |
|-------------|-------|----------|
| `GMAIL_USER` | Your Gmail address | ✅ Required |
| `GMAIL_PASS` | 16-char Gmail App Password | ✅ Required |
| `RECIPIENT_EMAIL` | Email to receive reports | ✅ Required |
| `RAPIDAPI_KEY` | RapidAPI key | ⚡ Optional |
| `GEMINI_API_KEY` | Gemini AI key (free) | ⭐ Recommended |

### Workflow Schedule

The agent runs at **3:30 AM UTC = 9:00 AM IST** every day:

```yaml
on:
  schedule:
    - cron: '30 3 * * *'   # 9:00 AM IST
  workflow_dispatch:         # Manual trigger available
```

### Manual Trigger

Go to: **Actions tab → "Naukri Job AI Agent – Daily 9AM IST" → Run workflow → Run workflow**

---

## 🎨 Customization Guide

### Add More Job Roles

Edit `services/scraper.js`:

```js
const ROLES = [
  { keyword: 'software-developer',  label: 'Software Developer'  },
  { keyword: 'frontend-developer',  label: 'Frontend Developer'  },
  { keyword: 'python-developer',    label: 'Python Developer'    },
  { keyword: 'data-analyst',        label: 'Data Analyst'        },
  { keyword: 'web-developer',       label: 'Web Developer'       },
  // ADD NEW ROLE HERE:
  { keyword: 'java-developer',      label: 'Java Developer'      },
  { keyword: 'ui-ux-designer',      label: 'UI/UX Designer'      },
];
```

### Add More Cities

Edit `services/scraper.js`:

```js
const CITIES = ['bangalore', 'delhi', 'pune', 'kolkata'];
// Add: 'hyderabad', 'mumbai', 'chennai', 'noida'
```

### Change Experience Filter

Edit `services/filter.js` — modify `VALID_EXP_PATTERNS` for different experience ranges.

### Change Email Schedule

Edit `.github/workflows/daily.yml`:

```yaml
- cron: '30 3 * * *'     # 9:00 AM IST
# Change to 12:00 PM IST:
- cron: '30 6 * * *'     # 12:00 PM IST
```

### Add Your Own ATS Tips

Edit `services/profileBoost.js` — add to the `ATS_TIPS` array.

---

## 🔧 Troubleshooting

### ❌ No jobs scraped

```
⚠️  No jobs scraped. Naukri may have changed their HTML structure.
```
**Fix:** Naukri.com occasionally changes their HTML. Update the CSS selectors in `services/scraper.js`.

### ❌ Email not sending

```
❌ Missing GMAIL_USER or GMAIL_PASS
```
**Fix:** Check `.env` file — make sure `GMAIL_PASS` is the **App Password** (16 chars), not your regular Gmail password.

### ❌ Gemini API failing

```
⚠️  Gemini API failed – using heuristic fallback
```
**Causes:**
- New API key — quota activates in 10–30 minutes, try again later
- Invalid key — must start with `AIza`
- Rate limit — `gemini-2.0-flash-lite` allows 30 requests/minute on free tier

**Fix:** Agent automatically falls back to heuristic scoring. No action needed — Gemini mode turns on automatically when quota is available.

### ❌ GitHub Actions failing

Check the Actions tab for logs. Common causes:
- Missing GitHub Secret (add all 5 secrets)
- Chrome installation failed (usually transient — retry)

---

## 📊 Stats & Performance

| Metric | Value |
|--------|-------|
| Cities scraped | 4 (Bangalore, Delhi, Pune, Kolkata) |
| Job roles | 5 (SD, Frontend, Python, Data, Web) |
| Max URLs visited | 20 per run |
| Jobs collected | ~60–120 raw |
| After filtering | Top 20 (0-1 yr, unique, fresh) |
| Email delivery time | ~3–4 mins total run |
| Gemini API calls | Max 20/run (well within free tier) |
| GitHub Actions minutes | ~5–8 min/day (well within free 2000 min/month) |
| Cost | **₹0 — Completely Free** |

---

## 🤝 Contributing

Pull requests are welcome! Here's how to contribute:

1. Fork the repository
2. Create your feature branch: `git checkout -b feature/your-feature`
3. Commit your changes: `git commit -m 'feat: Add your feature'`
4. Push to the branch: `git push origin feature/your-feature`
5. Open a Pull Request

**Ideas for contributions:**
- Add more city support
- Add LinkedIn/Indeed scraping
- Add Telegram/WhatsApp notification support
- Add job application tracking
- Add interview prep tips per job

---

## 📄 License

This project is licensed under the **MIT License** — free to use, modify, and distribute for personal and commercial use.

---

<div align="center">

### 🌟 Built with passion by [Rohit Singh Rajput](https://github.com/Rohitkr2002)

**Using:** Node.js · Puppeteer · Google Gemini AI · Nodemailer · GitHub Actions

---

*If this project helped you land a job or saved you time, please ⭐ star the repo!*

</div>
