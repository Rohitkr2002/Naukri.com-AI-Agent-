# 💼 Naukri Job AI Agent

> **Automated daily job alert system** — sends top 15 fresh fresher jobs to your email every morning at **9:00 AM IST** ⏰

![GitHub Actions](https://img.shields.io/badge/GitHub_Actions-Automated-2088FF?style=for-the-badge&logo=githubactions&logoColor=white)
![Node.js](https://img.shields.io/badge/Node.js-20.x-339933?style=for-the-badge&logo=nodejs&logoColor=white)
![Nodemailer](https://img.shields.io/badge/Nodemailer-Email-0078D4?style=for-the-badge&logo=gmail&logoColor=white)
![License](https://img.shields.io/badge/License-MIT-yellow?style=for-the-badge)

---

## 🎯 What It Does

- 🔍 Searches **multiple job sources** every day automatically
- 🎛️ Filters for **0–1 Year Experience (Freshers)** only
- 🧹 Removes duplicate job listings
- 📊 Picks **Top 15 most recent** jobs
- 📩 Sends a **beautiful HTML email** straight to your inbox
- ⏰ Runs daily at **9:00 AM IST** via **GitHub Actions** (zero manual effort)

---

## 🧑‍💻 Job Domains Covered

| Domain |
|--------|
| Software Developer |
| Frontend Developer |
| Web Developer |
| Python Developer |
| Data Analyst |
| Junior Data Analyst |

---

## 📁 Project Structure

```
naukri-job-ai-agent/
│
├── index.js                     ← Main orchestrator
├── services/
│     ├── scraper.js             ← Multi-source job scraper
│     ├── filter.js              ← Dedup, sort, top-15 filter
│     └── mail.js                ← HTML email sender (Nodemailer)
├── utils/
│     └── formatter.js           ← Time & salary formatter
├── .env.example                 ← Credentials template
├── package.json
├── .gitignore
└── .github/workflows/daily.yml  ← Auto-scheduler (9 AM IST)
```

---

## 🧰 Tech Stack

| Tool | Purpose |
|------|---------|
| **Node.js** | Runtime |
| **Axios** | HTTP requests |
| **Cheerio** | HTML parsing |
| **Nodemailer** | Gmail email sending |
| **Remotive API** | Free job listings (no auth) |
| **Arbeitnow API** | Free job listings (no auth) |
| **JSearch (RapidAPI)** | Premium job listings (optional) |
| **GitHub Actions** | Daily cron automation |
| **dotenv** | Secrets management |

---

## ⚙️ Setup & Installation

### 1. Clone the repository

```bash
git clone https://github.com/Rohitkr2002/Naukri.com-AI-Agent-.git
cd Naukri.com-AI-Agent-
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure credentials

```bash
cp .env.example .env
```

Edit `.env` and fill in your values:

```env
GMAIL_USER=your_gmail@gmail.com
GMAIL_PASS=your_16_char_app_password
RECIPIENT_EMAIL=your_gmail@gmail.com
RAPIDAPI_KEY=your_rapidapi_key_here     # Optional
```

> **Gmail App Password:** Google Account → Security → 2-Step Verification → App Passwords → Generate

### 4. Run locally

```bash
node index.js
```

---

## ☁️ Deploy with GitHub Actions (Auto 9 AM IST)

### Step 1: Push to GitHub

```bash
git add .
git commit -m "Deploy Naukri Job Agent"
git push origin main
```

### Step 2: Add GitHub Secrets

Go to: **Settings → Secrets and variables → Actions → New repository secret**

| Secret Name | Value |
|-------------|-------|
| `GMAIL_USER` | Your Gmail address |
| `GMAIL_PASS` | Gmail App Password |
| `RECIPIENT_EMAIL` | Where to receive alerts |
| `RAPIDAPI_KEY` | RapidAPI key (optional) |

### Step 3: Manual Test

GitHub → **Actions** tab → Select workflow → **Run workflow**

---

## ⏰ Schedule

| Timezone | Time |
|----------|------|
| IST | 9:00 AM |
| UTC (cron) | 3:30 AM |
| Cron expression | `30 3 * * *` |

---

## 📩 Email Preview

The daily alert email includes:

- 🏷️ **Job Title** (clickable link)
- 🏢 **Company Name**
- 💼 **Experience Required**
- 📍 **Location**
- 💰 **Salary** (if available)
- 🟢 **Posted Time** (freshness indicator)
- 🚀 **Apply Now** button

---

## 🔐 Security

- `.env` file is **gitignored** — credentials never exposed
- GitHub Secrets used for Actions deployment
- App Password used instead of main Gmail password

---

## 📄 License

MIT © [Rohit Kumar Singh](https://github.com/Rohitkr2002)

---

<div align="center">
  <sub>Built with ❤️ using Node.js + GitHub Actions</sub>
</div>
