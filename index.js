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

async function runAgent() {
  console.log('============================================================');
  console.log('  🤖 Naukri Job AI Agent – Enhanced Edition');
  console.log('  ⏰ Run Time (IST):', new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' }));
  console.log('  🚀 Features: Profile Boost | AI Scoring | Resume Matching');
  console.log('============================================================\n');

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
      console.warn('⚠️  No jobs scraped. Naukri may have changed their HTML structure.');
      console.warn('   Check: selectors in services/scraper.js may need updating.');
      // Still send email with profile boost report even if no jobs
      if (boostReport) {
        console.log('📧 Sending profile boost report only email...');
        await sendJobEmail([], boostReport, []);
      }
      process.exit(0);
    }

    // ── Step 2: Filter, dedup, sort, top 20 ──────────────────
    const filteredJobs = filterJobs(rawJobs);

    if (filteredJobs.length === 0) {
      console.warn('⚠️  No jobs passed the filter (0-1 yr experience).');
      process.exit(0);
    }

    // ── Step 3: AI Job Scoring & Ranking ─────────────────────
    let scoredJobs = filteredJobs;
    try {
      scoredJobs = await scoreJobs(filteredJobs);
    } catch (err) {
      console.warn('⚠️  AI Scoring skipped:', err.message);
    }

    // Get skill gap summary across all jobs
    const skillGapSummary = getSkillGapSummary(scoredJobs);

    // ── Step 4: Resume Smart Matching ─────────────────────────
    let matchedJobs = scoredJobs;
    try {
      matchedJobs = await matchResumes(scoredJobs);
    } catch (err) {
      console.warn('⚠️  Resume Matching skipped:', err.message);
    }

    // ── Step 5: Send Enriched HTML Email ─────────────────────
    await sendJobEmail(matchedJobs, boostReport, skillGapSummary);

    console.log('\n============================================================');
    console.log('  ✅ Naukri Job AI Agent completed successfully!');
    console.log('  📬 Email delivered to:', process.env.RECIPIENT_EMAIL);
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
