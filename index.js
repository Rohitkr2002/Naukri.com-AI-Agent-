// ============================================================
// index.js – Main Orchestrator
// Naukri Job Monitoring AI Agent – Enhanced Edition
//
// Flow:
//   Step 0: 🚀 Profile Boost Analysis  (Feature 1)
//   Step 1: 🔍 Scrape jobs from Naukri.com
//   Step 2: 🔧 Filter (0-1 yr exp, dedup, sort, top 20)
//   Step 3: 🤖 AI Job Scoring & Ranking (Feature 2)
//   Step 4: 📄 Resume Smart Matching   (Feature 3)
//   Step 5: 📧 Send enriched email
// ============================================================

require('dotenv').config();

const { scrapeAllJobs }  = require('./services/scraper');
const { filterJobs }     = require('./services/filter');
const { sendJobEmail }   = require('./services/mail');
const { runProfileBoost }= require('./services/profileBoost');
const { scoreJobs, getSkillGapSummary } = require('./services/aiScorer');
const { matchResumes }   = require('./services/resumeMatcher');
const { processAutoApplies } = require('./services/autoApply');
const { generateTailoredResumes } = require('./services/resumeGenerator');
const { sendDailyJobAlerts }     = require('./services/whatsapp');
const fs = require('fs');
const path = require('path');

async function runAgent() {
  console.log('============================================================');
  console.log('  🤖 Naukri Job AI Agent – Enhanced Edition');
  console.log('  ⏰ Run Time (IST):', new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' }));
  console.log('  🚀 Features: Multi-Platform | AI Scoring | Resume Matching');
  console.log('============================================================\n');

  const historyPath = path.join(__dirname, 'sent_jobs.json');
  let sentHistory = [];
  if (fs.existsSync(historyPath)) {
    try {
      sentHistory = JSON.parse(fs.readFileSync(historyPath, 'utf8'));
    } catch (e) {
      console.warn('⚠️  Could not read sent_jobs.json, starting fresh history.');
    }
  }

  try {
    // ── Step 0: Daily Profile Boost Analysis ─────────────────
    let boostReport = null;
    try {
      boostReport = await runProfileBoost();
    } catch (err) {
      console.warn('⚠️  Profile Boost skipped:', err.message);
    }

    // ── Step 1: Scrape jobs from Naukri.com ──────────────────
    const rawJobs = await scrapeAllJobs();

    if (rawJobs.length === 0) {
      console.warn('⚠️  No jobs scraped. Naukri may have changed their HTML structure or blocked the request.');
      console.warn('   Check: selectors in services/scraper.js may need updating.');
    }

    // ── Step 2: Filter, dedup (and skip history), sort, top 20 ─────────
    const filteredJobs = rawJobs.length > 0 ? filterJobs(rawJobs, sentHistory) : [];

    if (rawJobs.length > 0 && filteredJobs.length === 0) {
      console.warn('⚠️  No NEW jobs found (or all filtered by experience/history).');
    }

    // ── Step 3: AI Job Scoring & Ranking ─────────────────────
    let scoredJobs = filteredJobs;
    if (filteredJobs.length > 0) {
      try {
        scoredJobs = await scoreJobs(filteredJobs);
      } catch (err) {
        console.warn('⚠️  AI Scoring skipped:', err.message);
      }
    }

    // Get skill gap summary across all jobs
    const skillGapSummary = getSkillGapSummary(scoredJobs);

    // ── Step 4: Resume Smart Matching ─────────────────────────
    let matchedJobs = scoredJobs;
    if (scoredJobs.length > 0) {
      try {
        matchedJobs = await matchResumes(scoredJobs);
      } catch (err) {
        console.warn('⚠️  Resume Matching skipped:', err.message);
      }
    }

    // ── Step 5: Send Enriched HTML Email ─────────────────────
    // Identify run mode (Scheduled vs Manual)
    const runMode = process.env.GITHUB_EVENT_NAME === 'schedule' ? 'Scheduled' : 'Manual';

    await sendJobEmail(matchedJobs, boostReport, skillGapSummary, runMode);
    
    // ── Step 6: RUN AUTO-APPLY SYSTEM (Simulated) ─────────────
    let applyResults = [];
    if (matchedJobs.length > 0) {
      try {
        applyResults = await processAutoApplies(matchedJobs, 5);
      } catch (err) {
        console.warn('⚠️  Auto-Apply skipped:', err.message);
      }
    }

    // ── Step 7: GENERATE AI TAILORED RESUMES (PDF) ─────────────
    if (matchedJobs.length > 0) {
      try {
        await generateTailoredResumes(matchedJobs);
      } catch (err) {
        console.warn('⚠️  AI Resume Generation skipped:', err.message);
      }
    }

    // ── Step 8: SEND WHATSAPP ALERTS (Feature 3) ─────────────
    if (matchedJobs.length > 0) {
      try {
        await sendDailyJobAlerts(matchedJobs);
      } catch (err) {
        console.warn('⚠️  WhatsApp Alert skipped:', err.message);
      }
    }

    // ─── Step 9: Export Data & Save History ──────────────────
    const dashboardData = {
      lastUpdated: new Date().toISOString(),
      runMode,
      stats: {
        totalJobs: matchedJobs.length,
        naukri: matchedJobs.filter(j => (j.source || 'Naukri') === 'Naukri').length,
        linkedIn: matchedJobs.filter(j => j.source === 'LinkedIn').length,
        indeed: matchedJobs.filter(j => j.source === 'Indeed').length,
        topScore: matchedJobs[0]?.aiScore?.score || 0
      },
      jobs: matchedJobs,
      applyResults,
      boostReport,
      skillGapSummary
    };

    // Save history to prevent duplicates next time
    const newHistory = [...new Set([...sentHistory, ...matchedJobs.map(j => j.url), ...matchedJobs.map(j => `${j.title}||${j.company}`)])];
    fs.writeFileSync(historyPath, JSON.stringify(newHistory.slice(-500), null, 2)); // keep last 500
    
    const dashboardDataPath = path.join(__dirname, 'dashboard', 'src', 'data', 'jobs.json');
    const dashboardDataDir = path.dirname(dashboardDataPath);
    if (!fs.existsSync(dashboardDataDir)) fs.mkdirSync(dashboardDataDir, { recursive: true });
    fs.writeFileSync(dashboardDataPath, JSON.stringify(dashboardData, null, 2));
    console.log('  📊 Data exported to dashboard & history updated.');

    console.log('\n============================================================');
    console.log('  ✅ Naukri Job AI Agent completed successfully!');
    console.log('  📬 Email delivered to:', process.env.RECIPIENT_EMAIL);
    console.log(`  🕒 Run Mode: ${runMode}`);
    console.log('  📊 Platforms:');
    console.log(`     🔹 Naukri:   ${dashboardData.stats.naukri} jobs`);
    console.log(`     🔹 LinkedIn: ${dashboardData.stats.linkedIn} jobs`);
    console.log(`     🔹 Indeed:   ${dashboardData.stats.indeed} jobs`);
    console.log('  📊 Features ran:');
    console.log(`     🚀 Profile Boost:  ${boostReport ? '✅ Done (Score: ' + boostReport.profileScore.percentage + '%)' : '⚠️  Skipped'}`);
    console.log(`     🤖 AI Scoring:     ✅ Done (${scoredJobs.length} jobs scored)`);
    console.log(`     📄 Resume Match:   ✅ Done (cover letter generated)`);
    console.log('============================================================\n');

  } catch (err) {
    console.error('\n❌ Agent encountered a fatal error:');
    console.error('   ', err.message);
    console.error('\nStack Trace:');
    console.error(err.stack);
    process.exit(1);
  }
}

// Run immediately
runAgent();
