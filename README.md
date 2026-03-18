# 🤖 Naukri Job AI Agent — Enhanced Edition

<div align="center">

![Node.js](https://img.shields.io/badge/Node.js-20.x-339933?style=for-the-badge&logo=nodedotjs)
![Puppeteer](https://img.shields.io/badge/Puppeteer-Headless-40B5A4?style=for-the-badge&logo=googlechrome)
![Gemini AI](https://img.shields.io/badge/Gemini-AI%20Powered-4285F4?style=for-the-badge&logo=google)
![GitHub Actions](https://img.shields.io/badge/GitHub%20Actions-Daily%209AM-2088FF?style=for-the-badge&logo=githubactions)
![License](https://img.shields.io/badge/License-MIT-green?style=for-the-badge)

**An intelligent, fully automated job monitoring AI agent that scrapes Naukri.com daily, scores jobs with Gemini AI, matches your best resume, and delivers a premium daily email report — every morning at 9:00 AM IST.**

</div>

---

## ✨ Features

### 🚀 Feature 1 — Daily Profile Boost Automation
> Maximizes your visibility in recruiter searches every single day

- **Profile Completeness Scoring** — Scores your Naukri profile out of 100% across 14 weighted sections (photo, headline, skills, projects, etc.)
- **Keyword Gap Analysis** — Compares your skills vs. trending 2025 tech skills per domain (React, TypeScript, Docker, etc.)
- **ATS-Friendly Tips** — 25 curated tips, 5 rotating daily so you learn something new each day
- **Recruiter Engagement Signals** — Tells you exactly what to do today to boost your profile ranking
- **Daily Action Checklist** — 5 specific micro-actions to do each morning before applying

### 🤖 Feature 2 — AI Job Scoring & Ranking
> Powered by Google Gemini AI — finds your best matches automatically

- **AI Match Score (0–100%)** — Each job is analyzed and scored against your skills & experience
- **Gemini AI Mode** — Deep semantic understanding of job descriptions vs your profile
- **Smart Fallback** — Keyword heuristic scoring if no API key (agent never crashes)
- **Job Ranking** — All jobs sorted best-to-worst match before emailing
- **Skill Gap Detection** — Identifies missing skills with free learning resources (YouTube, Coursera)
- **Top Match Highlight** — Best matching job prominently featured in email

### 📄 Feature 3 — Resume Smart Matching System
> Right resume for the right job, every time

- **Domain Auto-Detection** — Automatically detects if a job is Software Dev or Data Analyst
- **Dual Resume Support** — Software resume for Dev/Frontend/Web roles, Data resume for Analyst/Python roles
- **AI-Generated Cover Letter** — Personalized cover letter for your top job via Gemini AI
- **Professional Template Fallback** — Beautiful template cover letter if no API key
- **ATS Improvement Tips** — 10 domain-specific tips per resume type
- **Resume Assignment Report** — Shows which resume goes to which job in the email

### 📧 Premium Daily Email
- Dark mode, glassmorphism design
- **Profile Boost Report section** — score progress bar, gaps, tips
- **AI Match Analysis section** — scores, top pick, skill gaps + courses
- **Resume Matching section** — assignment stats + cover letter preview
- **Job Cards** — with AI score badges, skill gap tips, apply buttons
- City-grouped listings: Bangalore · Delhi · Pune · Kolkata

---

## 🛠️ Tech Stack

| Component | Technology |
|-----------|-----------|
| Runtime | Node.js 20 LTS |
| Web Scraper | Puppeteer (Headless Chrome) |
| AI Engine | Google Gemini 2.0 Flash Lite |
| Email | Nodemailer + Gmail SMTP |
| Scheduler | GitHub Actions (Cron) |
| Domains | Software Dev · Frontend · Python · Data Analyst · Web Dev |
| Cities | Bangalore · Delhi · Pune · Kolkata |

---

## 📁 Project Structure

```
Nukari.com/
├── .github/
│   └── workflows/
│       └── daily.yml          # GitHub Actions scheduler (9 AM IST)
│
├── config/
│   └── userProfile.js         # ⚙️ YOUR skills, education, projects (edit this!)
│
├── resumes/
│   ├── resume_software.txt    # 💻 Software Dev / Frontend resume
│   └── resume_data.txt        # 📊 Data Analyst / Python Dev resume
│
├── services/
│   ├── scraper.js             # Naukri.com headless browser scraper
│   ├── filter.js              # Experience filter + dedup + sorter
│   ├── profileBoost.js        # Feature 1: Profile scoring & ATS tips
│   ├── aiScorer.js            # Feature 2: Gemini AI job scoring
│   ├── resumeMatcher.js       # Feature 3: Resume matching + cover letter
│   └── mail.js                # Premium HTML email builder & sender
│
├── index.js                   # Main orchestrator (5-step pipeline)
├── .env                       # Local secrets (NOT committed)
├── .env.example               # Environment variable template
└── package.json
```

---

## ⚙️ Setup & Installation

### 1. Clone the Repository

```bash
git clone https://github.com/Rohitkr2002/Naukri.com-AI-Agent-.git
cd Naukri.com-AI-Agent-
npm install
```

### 2. Configure Environment Variables

```bash
cp .env.example .env
```

Edit `.env`:

```env
# Gmail Credentials
GMAIL_USER=your_gmail@gmail.com
GMAIL_PASS=your_16_char_app_password   # Google Account → Security → App Passwords

# Recipient
RECIPIENT_EMAIL=where_to_send@gmail.com

# RapidAPI (optional fallback)
RAPIDAPI_KEY=your_rapidapi_key

# Gemini AI (FREE — for AI scoring + cover letter)
GEMINI_API_KEY=your_gemini_api_key     # Get free at aistudio.google.com/apikey
```

### 3. Personalize Your Profile

Edit **`config/userProfile.js`** with your actual skills, education, and projects:

```js
const USER_PROFILE = {
  name: 'Your Name',
  skills: {
    languages: ['JavaScript', 'Python', ...],
    frontend:  ['React.js', 'Node.js', ...],
    // ...
  },
  education: { degree: 'B.Tech', field: 'CS', year: 2024 },
  // ...
};
```

### 4. Update Your Resumes

Edit the resume files in `resumes/` folder:
- `resumes/resume_software.txt` — for Software/Frontend/Web roles
- `resumes/resume_data.txt` — for Data Analyst/Python roles

### 5. Run Locally

```bash
node index.js
```

---

## 🚀 Daily Automation (GitHub Actions)

The agent runs **automatically every day at 9:00 AM IST** via GitHub Actions.

### Add GitHub Secrets

Go to: **Repository → Settings → Secrets and variables → Actions → New repository secret**

| Secret Name | Value |
|-------------|-------|
| `GMAIL_USER` | Your Gmail address |
| `GMAIL_PASS` | Gmail App Password (16 chars) |
| `RECIPIENT_EMAIL` | Email to receive job alerts |
| `RAPIDAPI_KEY` | Your RapidAPI key |
| `GEMINI_API_KEY` | Your Gemini API key (free) |

### Manual Trigger

Go to: **Actions tab → "Naukri Job AI Agent – Daily 9AM IST" → Run workflow**

---

## 🔄 How It Works (5-Step Pipeline)

```
Step 0: 🚀 Profile Boost Analysis
         └─ Score profile, find keyword gaps, generate today's ATS tips

Step 1: 🔍 Scrape Naukri.com
         └─ Headless Puppeteer across 4 cities × 5 roles

Step 2: 🔧 Filter Jobs
         └─ Keep 0-1 yr exp only, remove duplicates, sort by freshness

Step 3: 🤖 AI Job Scoring (Gemini)
         └─ Score each job 0-100%, rank by match, find skill gaps

Step 4: 📄 Resume Smart Matching
         └─ Detect domain, assign resume, generate cover letter

Step 5: 📧 Send Premium Email
         └─ Beautiful dark-mode email with all sections & job cards
```

---

## 📊 What's In Your Daily Email

| Section | Content |
|---------|---------|
| 🚀 Profile Boost Report | Completeness %, keyword gaps, 5 ATS tips, today's actions |
| 🤖 AI Job Match Analysis | Top score, avg score, high-match count, skill gaps + courses |
| 📄 Resume Smart Matching | Resume assignment chart, improvement tips, cover letter |
| 💼 Job Listings | All jobs with AI score badge, exp, salary, location, apply button |

---

## 🔑 Getting Your Free Gemini API Key

1. Go to [aistudio.google.com/apikey](https://aistudio.google.com/apikey)
2. Click **"Create API key"**
3. Select an existing Google project or create a new one
4. Copy the key (starts with `AIza...`)
5. Add to `.env` as `GEMINI_API_KEY=your_key`
6. Add to **GitHub Secrets** for the automated run

> **Without key**: Agent uses smart keyword heuristic scoring — still works perfectly, just not AI-powered.

---

## 🎯 Target Job Roles & Cities

| Job Roles | Cities |
|-----------|--------|
| Software Developer | 🏙️ Bangalore |
| Frontend Developer | 🕌 Delhi |
| Python Developer | 🏯 Pune |
| Data Analyst | 🌉 Kolkata |
| Web Developer | |

**Experience Filter:** 0–1 year (freshers only)

---

## 🤝 Contributing

Pull requests welcome! Feel free to:
- Add more job roles or cities in `services/scraper.js`
- Add more ATS tips to `services/profileBoost.js`
- Improve resume templates in `resumes/`
- Enhance the email design in `services/mail.js`

---

## 📄 License

MIT License — free to use, modify, and distribute.

---

<div align="center">

Built with ❤️ using **Node.js · Puppeteer · Gemini AI · GitHub Actions**

⭐ **Star this repo** if it helped you land a job!

</div>
