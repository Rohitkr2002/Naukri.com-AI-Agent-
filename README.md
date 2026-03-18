<div align="center">

<!-- Animated Banner -->
<img src="https://capsule-render.vercel.app/api?type=waving&color=gradient&customColorList=6,11,20&height=200&section=header&text=Naukri%20Job%20AI%20Agent&fontSize=50&fontColor=fff&animation=twinkling&fontAlignY=35&desc=Automated%20Daily%20Job%20Alerts%20from%20Naukri.com&descAlignY=55&descSize=18" width="100%"/>

<!-- Badges Row 1 -->
<p>
  <img src="https://img.shields.io/badge/Node.js-20-339933?style=for-the-badge&logo=node.js&logoColor=white"/>
  <img src="https://img.shields.io/badge/Puppeteer-Headless_Browser-40B5A4?style=for-the-badge&logo=googlechrome&logoColor=white"/>
  <img src="https://img.shields.io/badge/GitHub_Actions-Automated-2088FF?style=for-the-badge&logo=githubactions&logoColor=white"/>
  <img src="https://img.shields.io/badge/Gmail-SMTP_Email-EA4335?style=for-the-badge&logo=gmail&logoColor=white"/>
</p>

<!-- Badges Row 2 -->
<p>
  <img src="https://img.shields.io/badge/Schedule-9:00_AM_IST_Daily-orange?style=flat-square&logo=clockify&logoColor=white"/>
  <img src="https://img.shields.io/badge/Source-Naukri.com-blue?style=flat-square&logo=naukri&logoColor=white"/>
  <img src="https://img.shields.io/badge/Jobs-Top_20_Freshers-brightgreen?style=flat-square"/>
  <img src="https://img.shields.io/badge/License-MIT-yellow?style=flat-square"/>
</p>

<!-- Animated typing -->
<a href="https://git.io/typing-svg">
  <img src="https://readme-typing-svg.demolab.com?font=Fira+Code&size=18&pause=1000&color=38BDF8&center=true&vCenter=true&width=600&lines=🤖+Automated+Job+Monitoring+Agent;📍+Bangalore+%7C+Delhi+%7C+Pune+%7C+Kolkata;🎯+Top+20+Fresh+Jobs+Every+Morning;⏰+Delivered+at+9%3A00+AM+IST+Daily;🚀+Built+with+Node.js+%2B+Puppeteer" alt="Typing SVG" />
</a>

</div>

---

## 🌟 What This Project Does

<table>
<tr>
<td width="50%">

### 🔍 Scrapes Naukri.com Directly
Uses **Puppeteer headless browser** to open Naukri.com like a real user — bypasses anti-bot restrictions and scrapes JS-rendered pages.

### 🎯 Smart Filtering
Filters for **0–1 year experience**, removes duplicates, sorts by recency, and picks the **Top 20** best jobs.

</td>
<td width="50%">

### 📧 Premium Email Design
Sends a **dark-mode HTML email** with city-grouped job cards, color-coded themes, salary, location & direct apply links.

### ☁️ 100% Automated
Runs on **GitHub Actions** every day at **9 AM IST** — no server needed, completely free.

</td>
</tr>
</table>

---

## 🏙️ Cities & Roles Covered

<div align="center">

| 🔶 Bangalore | 🔴 Delhi | 🟣 Pune | 🟢 Kolkata |
|:---:|:---:|:---:|:---:|
| Software Developer | Software Developer | Software Developer | Software Developer |
| Frontend Developer | Frontend Developer | Frontend Developer | Frontend Developer |
| Python Developer | Python Developer | Python Developer | Python Developer |
| Data Analyst | Data Analyst | Data Analyst | Data Analyst |
| Web Developer | Web Developer | Web Developer | Web Developer |

</div>

---

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────────────┐
│              GitHub Actions  (9:00 AM IST / 3:30 AM UTC)    │
│                    cron: '30 3 * * *'                        │
└────────────────────────┬────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────┐
│                    index.js  (Orchestrator)                  │
└──────┬─────────────────────────────────────────────────┬────┘
       │                                                 │
       ▼                                                 ▼
┌──────────────────────────┐             ┌───────────────────────────┐
│      scraper.js          │             │       filter.js            │
│                          │             │                            │
│  Puppeteer launches      │  ~800 jobs  │  • 0–1 yr exp filter       │
│  headless Chrome         │ ──────────► │  • Deduplicate             │
│                          │             │  • Sort by recency          │
│  4 Cities × 5 Roles      │             │  • Pick Top 20             │
│  = 20 Naukri.com pages   │             │                            │
└──────────────────────────┘             └────────────┬──────────────┘
                                                      │ 20 best jobs
                                                      ▼
                                         ┌────────────────────────────┐
                                         │        mail.js              │
                                         │                             │
                                         │  • Premium HTML template    │
                                         │  • City-grouped cards       │
                                         │  • Direct Naukri.com links  │
                                         │  • Send via Gmail SMTP      │
                                         └────────────┬───────────────┘
                                                      │
                                                      ▼
                                              📬 Your Inbox!
```

---

## ⚙️ Tech Stack

<div align="center">

| Technology | Role | Why? |
|:---:|:---:|:---|
| ![Node.js](https://img.shields.io/badge/Node.js-339933?logo=node.js&logoColor=white&style=flat-square) | Runtime | Fast, async, perfect for scraping |
| ![Puppeteer](https://img.shields.io/badge/Puppeteer-40B5A4?logo=googlechrome&logoColor=white&style=flat-square) | Scraper | Handles JS-rendered React pages |
| ![Nodemailer](https://img.shields.io/badge/Nodemailer-EA4335?logo=gmail&logoColor=white&style=flat-square) | Email | Zero-cost SMTP delivery |
| ![GitHub Actions](https://img.shields.io/badge/GitHub_Actions-2088FF?logo=githubactions&logoColor=white&style=flat-square) | Scheduler | Free cloud cron — no server needed |
| ![Axios](https://img.shields.io/badge/Axios-5A29E4?logo=axios&logoColor=white&style=flat-square) | HTTP | HTTP client for API fallbacks |
| ![dotenv](https://img.shields.io/badge/dotenv-ECD53F?logo=dotenv&logoColor=black&style=flat-square) | Config | Secure credential management |

</div>

---

## 📧 Email Preview

<div align="center">

> **Dark-mode Premium Design sent every morning** 🌙

</div>

| Section | Design |
|---------|--------|
| **Header** | Gradient dark-blue with job count badge |
| **Stats Bar** | Total Jobs · Cities · Domains (3-column) |
| **City Labels** | Color-coded pills — 🔶Orange · 🔴Red · 🟣Purple · 🟢Teal |
| **Job Cards** | Role badge · Company · Salary chip · Location chip · Apply button |
| **CTA Banner** | "Explore All Jobs on Naukri.com" full-width button |
| **Footer** | Auto-sent badge · Powered by GitHub Actions |

---

## 🚀 Quick Start

<details>
<summary><b>📦 Step 1 — Clone & Install</b></summary>

```bash
git clone https://github.com/Rohitkr2002/Naukri.com-AI-Agent-.git
cd Naukri.com-AI-Agent-
npm install
```
</details>

<details>
<summary><b>🔑 Step 2 — Setup Credentials</b></summary>

```bash
cp .env.example .env
```

Edit `.env`:

```env
GMAIL_USER=your-email@gmail.com
GMAIL_PASS=your16charpassword    # ⚠️ No spaces!
RECIPIENT_EMAIL=receiver@gmail.com
```

> 💡 **Get Gmail App Password:**
> Google Account → Security → 2-Step Verification → App Passwords

</details>

<details>
<summary><b>▶️ Step 3 — Run Locally</b></summary>

```bash
node index.js
```

You'll see:
```
🚀 Starting Naukri.com Direct Scraper...
📍 City: Bangalore → 45 jobs found
📍 City: Delhi     → 43 jobs found
📍 City: Pune      → 40 jobs found
📍 City: Kolkata   → 40 jobs found
📊 Total: 816 raw → 20 filtered
📧 Email sent! ✅
```

</details>

<details>
<summary><b>☁️ Step 4 — Deploy to GitHub Actions (Free!)</b></summary>

Go to your repo → `Settings` → `Secrets and variables` → `Actions` → `New repository secret`

| Secret | Value |
|--------|-------|
| `GMAIL_USER` | your-email@gmail.com |
| `GMAIL_PASS` | 16-char app password (no spaces) |
| `RECIPIENT_EMAIL` | where to receive alerts |
| `RAPIDAPI_KEY` | optional |

The agent will now **auto-run every day at 9:00 AM IST** 🎉

</details>

---

## 📁 Project Structure

```
📦 Naukri.com-AI-Agent
 ┣ 📂 services
 ┃ ┣ 📜 scraper.js     ── Puppeteer bot → scrapes Naukri.com
 ┃ ┣ 📜 filter.js      ── Experience filter → dedup → top 20
 ┃ ┗ 📜 mail.js        ── Premium HTML email → Gmail SMTP
 ┣ 📂 .github
 ┃ ┗ 📂 workflows
 ┃   ┗ 📜 daily.yml    ── GitHub Actions cron trigger
 ┣ 📜 index.js         ── Main orchestrator
 ┣ 📜 .env.example     ── Credential template
 ┗ 📜 package.json
```

---

## 🔒 Security

> ⚠️ **Your credentials are never exposed.**

- `.env` is listed in `.gitignore` — **never committed** to Git
- GitHub Secrets are **AES-256 encrypted** at rest
- Secrets are only injected **at runtime** during Actions execution
- **Zero hardcoded credentials** anywhere in the codebase

---

## 🛠️ Technical Decisions

<details>
<summary><b>Why Puppeteer over plain HTTP?</b></summary>

Naukri.com is a **React SPA** — all job cards are injected by JavaScript after page load. A plain `axios.get()` returns an empty shell with no jobs. Puppeteer launches a real Chrome browser, waits for the JS to execute, and then reads the fully rendered DOM.

</details>

<details>
<summary><b>Why GitHub Actions over a server?</b></summary>

GitHub Actions gives **2,000 free minutes/month** with built-in cron scheduling. No VPS, no cloud bills, no maintenance. Just push → it runs every morning automatically.

</details>

<details>
<summary><b>Why Gmail SMTP over SendGrid/Mailgun?</b></summary>

Gmail App Password + Nodemailer = **completely free, zero sign-ups**, and works reliably. No monthly limits for personal use, no third-party dependency.

</details>

---

<div align="center">

## 👤 Author

**Rohit Kumar Rajput**

[![GitHub](https://img.shields.io/badge/GitHub-Rohitkr2002-181717?style=for-the-badge&logo=github)](https://github.com/Rohitkr2002)

---

<img src="https://capsule-render.vercel.app/api?type=waving&color=gradient&customColorList=6,11,20&height=100&section=footer" width="100%"/>

*Built with ❤️ to automate the boring parts of job hunting.*

</div>
