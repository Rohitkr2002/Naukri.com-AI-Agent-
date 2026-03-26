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
const { extractEmailFromUrl }   = require('./services/emailExtractor');
const { generateColdEmail }     = require('./services/draftGenerator');
const { sendDailyJobAlerts }     = require('./services/whatsapp');
const { generateWeeklyInsights } = require('./services/analytics');
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

    // ── Step 2: Filter, dedup (and skip history), sort ───────────────
    // Handle both old string history and new object history
    const sentUrls = sentHistory.map(item => typeof item === 'string' ? item : item.url);
    const sentTitles = sentHistory.map(item => {
      if (typeof item === 'string') {
        return item; // old format was Title||Company usually, or URL
      }
      return `${(item.title || '').toLowerCase().replace(/\\s+/g, ' ').trim()}||${(item.company || '').toLowerCase().replace(/\\s+/g, ' ').trim()}`;
    });
    
    // Combine URLs and title||company keys to ensure we catch duplicate postings with new URLs
    const sentHistoryForFilter = [...new Set([...sentUrls, ...sentTitles])];
    
    const filteredJobs = rawJobs.length > 0 ? filterJobs(rawJobs, sentHistoryForFilter) : [];

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

    // ── Step 5: Generate Weekly Market Insights ─────────────
    const weeklyInsights = generateWeeklyInsights(sentHistory);

    // ── Step 6: Send Enriched HTML Email ─────────────────────
    // Identify run mode (Scheduled vs Manual)
    const runMode = process.env.GITHUB_EVENT_NAME === 'schedule' ? 'Scheduled' : 'Manual';

    await sendJobEmail(matchedJobs, boostReport, skillGapSummary, runMode, weeklyInsights);
    
    // ── Step 7: RUN AUTO-APPLY SYSTEM (Simulated) ─────────────
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

    // ── Step 7.5: AUTO-DRAFT COLD EMAILS FOR HRs ──────────────
    if (matchedJobs.length > 0) {
      try {
        console.log('\n✉️  Feature 5: Auto-Drafting Cold Emails for Top Matches...');
        const draftHistoryPath = path.join(__dirname, 'draft_history.json');
        let draftHistory = [];
        if (fs.existsSync(draftHistoryPath)) {
          try { draftHistory = JSON.parse(fs.readFileSync(draftHistoryPath, 'utf8')); } catch(e){}
        }

        const topJobsForDraft = matchedJobs.filter(j => (j.aiScore?.score || 0) >= 70).slice(0, 5);
        for (const job of topJobsForDraft) {
            // Prevent duplicate drafts to the exact same company
            if (draftHistory.includes(job.company)) continue;

            const hrEmail = await extractEmailFromUrl(job.url);
            if (hrEmail) {
                console.log(`   🔍 HR Email found for ${job.company}: ${hrEmail}`);
                const draft = await generateColdEmail(job, hrEmail);
                if (draft) {
                    job.draftEmail = { hrEmail, subject: draft.subject, body: draft.body };
                    draftHistory.push(job.company);
                    console.log(`   ✅ Draft generated successfully!`);
                }
            }
        }
        fs.writeFileSync(draftHistoryPath, JSON.stringify(draftHistory.slice(-100), null, 2));
      } catch (err) {
        console.warn('⚠️  Auto-Draft skipped:', err.message);
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

    // Save history with metadata for analytics
    const newJobsHistory = matchedJobs.map(j => ({
      id: j.id,
      url: j.url,
      title: j.title,
      company: j.company,
      source: j.source || 'Naukri',
      score: j.aiScore?.score || 0,
      timestamp: new Date().toISOString(),
      domain: j.domain
    }));

    // Merge and keep the most recent 1000 items (expanded for analytics)
    const combinedHistory = [...sentHistory, ...newJobsHistory];
    
    // Simple URL-based dedup for history storage
    const uniqueHistory = [];
    const seenUrls = new Set();
    
    for (let i = combinedHistory.length - 1; i >= 0; i--) {
      const item = combinedHistory[i];
      const url = typeof item === 'string' ? item : item.url;
      if (!seenUrls.has(url)) {
        uniqueHistory.push(item);
        seenUrls.add(url);
      }
    }

    fs.writeFileSync(historyPath, JSON.stringify(uniqueHistory.reverse().slice(-1000), null, 2));
    
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
