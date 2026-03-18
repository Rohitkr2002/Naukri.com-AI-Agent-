# 🤖 Naukri Job AI Agent

> **An automated job monitoring agent that scrapes Naukri.com daily and delivers curated fresher job listings directly to your inbox every morning at 9:00 AM IST.**

![Node.js](https://img.shields.io/badge/Node.js-20-green?logo=node.js)
![GitHub Actions](https://img.shields.io/badge/GitHub_Actions-Automated-blue?logo=githubactions)
![Puppeteer](https://img.shields.io/badge/Puppeteer-Headless_Browser-orange?logo=googlechrome)
![License](https://img.shields.io/badge/License-MIT-yellow)

---

## 📌 What This Project Does

This project is a **fully automated AI-powered job agent** that:

1. **Scrapes Naukri.com** directly using a headless Chrome browser (Puppeteer)
2. **Filters jobs** for freshers (0–1 year experience) across 4 major Indian cities
3. **Deduplicates & ranks** listings by recency
4. **Sends a beautifully formatted HTML email** with the top 15 jobs every day at **9:00 AM IST**
5. **Runs automatically via GitHub Actions** — no server or hosting required

---

## 🏙️ Covered Cities & Job Roles

| Cities | Job Roles |
|--------|-----------|
| 📍 Bangalore | Software Developer |
| 📍 Delhi | Frontend Developer |
| 📍 Pune | Python Developer |
| 📍 Kolkata | Data Analyst |
| | Web Developer |

---

## 🏗️ Project Architecture

```
Naukri.com/
├── index.js                   # Main orchestrator – runs the full pipeline
├── services/
│   ├── scraper.js             # Puppeteer-based Naukri.com scraper
│   ├── filter.js              # Experience filter, dedup, sort, top-15 logic
│   └── mail.js                # HTML email builder + Nodemailer sender
├── .github/
│   └── workflows/
│       └── daily.yml          # GitHub Actions – runs daily at 9 AM IST
├── .env                       # Local credentials (never committed to Git)
├── .env.example               # Template for setting up credentials
└── package.json
```

### Pipeline Flow

```
GitHub Actions (Cron 9AM IST)
        │
        ▼
  index.js (Orchestrator)
        │
        ▼
  scraper.js ──► Puppeteer opens Naukri.com
        │         4 cities × 5 roles = 20 searches
        │         ~800 raw jobs collected
        ▼
  filter.js ───► Experience filter (0–1 yr)
        │         Deduplication
        │         Sort by recency
        │         → Top 15 jobs selected
        ▼
  mail.js ─────► Build HTML email
                  Send via Gmail SMTP
                  📬 Delivered to inbox!
```

---

## ⚙️ Tech Stack

| Technology | Purpose |
|------------|---------|
| **Node.js** | Runtime environment |
| **Puppeteer-core** | Headless Chrome browser for JS-rendered scraping |
| **Cheerio** | HTML parsing (fallback) |
| **Axios** | HTTP client |
| **Nodemailer** | Email delivery via Gmail SMTP |
| **GitHub Actions** | Free cloud automation (cron scheduler) |
| **dotenv** | Environment variable management |

---

## 🚀 How to Run Locally

### 1. Clone the Repository

```bash
git clone https://github.com/Rohitkr2002/Naukri.com-AI-Agent-.git
cd Naukri.com-AI-Agent-
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Setup Environment Variables

```bash
cp .env.example .env
```

Edit `.env` with your credentials:

```env
GMAIL_USER=your-email@gmail.com
GMAIL_PASS=your-16-char-app-password   # No spaces!
RECIPIENT_EMAIL=receiver@gmail.com
RAPIDAPI_KEY=your-rapidapi-key         # Optional
```

> **How to get Gmail App Password:**
> Google Account → Security → 2-Step Verification → App Passwords → Generate

### 4. Run the Agent

```bash
node index.js
```

That's it! Jobs will be scraped and emailed instantly.

---

## ☁️ Automated Deployment (GitHub Actions)

The agent runs **for free** on GitHub's cloud infrastructure using GitHub Actions.

### Setup Steps

1. Push this repo to GitHub
2. Go to: `Settings → Secrets and variables → Actions`
3. Add these **4 Repository Secrets**:

| Secret Name | Value |
|-------------|-------|
| `GMAIL_USER` | Your Gmail address |
| `GMAIL_PASS` | 16-char App Password (no spaces) |
| `RECIPIENT_EMAIL` | Email to receive job alerts |
| `RAPIDAPI_KEY` | RapidAPI key (optional) |

4. The workflow runs automatically every day at **9:00 AM IST (3:30 AM UTC)**
5. You can also trigger it manually from the **Actions** tab → **Run workflow**

### Cron Schedule

```yaml
schedule:
  - cron: '30 3 * * *'   # 3:30 AM UTC = 9:00 AM IST
```

---

## 📧 Email Output Sample

The email includes for each job:

- 🏢 **Company Name**
- 💼 **Job Title** (clickable link → opens directly on Naukri.com)
- 📍 **City** (Bangalore / Delhi / Pune / Kolkata)
- 🎓 **Experience Required** (0–1 Yrs)
- 💰 **Salary** (if disclosed)
- 🕐 **Posted Time** (e.g., "2 hrs ago")

---

## 🔒 Security Practices

- `.env` is in `.gitignore` — credentials are **never committed** to Git
- GitHub Secrets are **encrypted at rest** and only exposed during workflow runs
- No hardcoded credentials anywhere in the codebase

---

## 🛠️ Key Technical Decisions

### Why Puppeteer instead of plain HTTP?
Naukri.com is a **React-based Single Page Application (SPA)**. Its job listings are rendered dynamically via JavaScript. Plain HTTP requests (`axios + cheerio`) only get an empty HTML shell. Puppeteer launches a real headless Chrome browser that executes JavaScript, loads the full page, and then extracts the data.

### Why GitHub Actions for scheduling?
GitHub Actions provides **free cloud compute** (2,000 minutes/month on free tier) with built-in cron scheduling. This eliminates the need for any paid server or hosting to run a daily task.

### Why Gmail SMTP + Nodemailer?
Gmail's SMTP with App Passwords is a **zero-cost, reliable** email delivery method that works without any third-party email service subscription.

---

## 📁 File Descriptions

| File | Description |
|------|-------------|
| `index.js` | Entry point — orchestrates scrape → filter → email pipeline |
| `services/scraper.js` | Launches Puppeteer, visits Naukri.com for each city+role combination, extracts job data |
| `services/filter.js` | Filters by 0–1 yr experience, removes duplicates, sorts by recency, picks top 15 |
| `services/mail.js` | Builds responsive HTML email template, sends via Nodemailer + Gmail |
| `.github/workflows/daily.yml` | GitHub Actions workflow with Chrome install + Node.js setup + cron trigger |

---

## 🤝 Contributing

Pull requests are welcome! For major changes, please open an issue first.

---

## 👤 Author

**Rohit Kumar Rajput**
- GitHub: [@Rohitkr2002](https://github.com/Rohitkr2002)

---

## 📄 License

This project is licensed under the **MIT License**.

---

*Built with ❤️ to automate the boring parts of job hunting.*
