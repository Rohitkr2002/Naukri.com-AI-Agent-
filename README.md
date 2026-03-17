# 🤖 Naukri Job AI Agent

## 📌 Project Overview

**Naukri Job AI Agent** is an automated job monitoring system built using **Node.js automation and web scraping techniques**.

The agent runs automatically every day at **9:00 AM IST**, collects the latest job postings related to **Software Development and Data Analysis (0–1 year experience)**, filters the most relevant opportunities, and sends a **structured HTML email with job links**.

This project demonstrates real-world skills in **automation, scraping, scheduling, and email notification systems**.

---

## 🎯 Project Objectives

* Automate job search process
* Fetch latest job opportunities daily
* Filter domain-specific fresher jobs
* Remove duplicate job listings
* Send curated job list via email
* Build production-ready automation workflow

---

## 🧰 Tech Stack

* Node.js
* Axios
* Cheerio
* Nodemailer
* Dotenv
* GitHub Actions (Scheduler)

---

## 📁 Project Structure

```
naukri-ai-agent/
│
├── index.js
├── services/
│     ├── scraper.js
│     ├── filter.js
│     ├── mail.js
│
├── utils/
│     ├── formatter.js
│
├── .env
├── .env.example
├── package.json
├── .gitignore
└── .github/workflows/daily.yml
```

---

## ⚙️ Features

* Daily automated execution
* Job scraping from Naukri search pages
* Domain filtering:

  * Software Developer
  * Frontend Developer
  * Python Developer
  * Data Analyst
* Experience filtering (0–1 year)
* Duplicate job removal
* Sorting by latest job posted
* Top 15 job recommendations
* Beautiful responsive HTML email notification
* Secure credentials using GitHub Secrets

---

## 🔄 Execution Flow

1. Scrape job listings from Naukri search results
2. Extract job title, company, experience, location, salary, job URL
3. Filter jobs based on domain and experience
4. Remove duplicate job entries
5. Sort jobs by most recently posted
6. Select top 15 relevant jobs
7. Generate HTML email template
8. Send email notification
9. Run automatically via GitHub Actions scheduler

---

## ⏰ Automation Schedule

The agent runs daily using GitHub Actions cron:

```
3:30 AM UTC = 9:00 AM IST
```

---

## 🔐 Environment Variables

Create `.env` file:

```
GMAIL_USER=your_email@gmail.com
GMAIL_PASS=your_app_password
```

---

## 🚀 How to Run Locally

```
npm install
node index.js
```

---

## ✅ Testing Results

* Jobs successfully scraped from multiple sources
* Domain-specific filtering applied
* Top 15 jobs selected
* Email notification delivered successfully
* GitHub Actions scheduler verified

---

## 💡 Future Improvements

* Add LinkedIn job scraping
* Add AI job relevance scoring
* Add Telegram / WhatsApp notification
* Add dashboard UI
* Add database job history tracking

---

## 👨‍💻 Author

**Rohit Kumar Singh**
Aspiring Software Developer & Data Analyst
