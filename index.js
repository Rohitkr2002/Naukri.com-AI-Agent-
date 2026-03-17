// ============================================================
// index.js – Main Orchestrator
// Naukri Job Monitoring AI Agent
// Flow: Scrape → Filter → Format → Send Email
// ============================================================

require('dotenv').config();

const { scrapeAllJobs } = require('./services/scraper');
const { filterJobs }    = require('./services/filter');
const { sendJobEmail }  = require('./services/mail');

async function runAgent() {
  console.log('============================================================');
  console.log('  🤖 Naukri Job AI Agent – Starting...');
  console.log('  ⏰ Run Time (IST):', new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' }));
  console.log('============================================================\n');

  try {
    // ── Step 1: Scrape jobs from Naukri.com ──────────────────
    const rawJobs = await scrapeAllJobs();

    if (rawJobs.length === 0) {
      console.warn('⚠️  No jobs scraped. Naukri may have changed their HTML structure.');
      console.warn('   Check: selectors in services/scraper.js may need updating.');
      process.exit(0);
    }

    // ── Step 2: Filter, dedup, sort, top 15 ──────────────────
    const filteredJobs = filterJobs(rawJobs);

    if (filteredJobs.length === 0) {
      console.warn('⚠️  No jobs passed the filter (0-1 yr experience).');
      console.warn('   All scraped jobs may have been above the experience threshold.');
      process.exit(0);
    }

    // ── Step 3: Send HTML Email ───────────────────────────────
    await sendJobEmail(filteredJobs);

    console.log('\n============================================================');
    console.log('  ✅ Naukri Job AI Agent completed successfully!');
    console.log('  📬 Email delivered to:', process.env.RECIPIENT_EMAIL);
    console.log('============================================================\n');

  } catch (err) {
    console.error('\n❌ Agent encountered a fatal error:');
    console.error('   ', err.message);
    console.error('\nStack Trace:');
    console.error(err.stack);
    process.exit(1); // Non-zero exit makes GitHub Actions mark the run as failed
  }
}

// Run immediately
runAgent();
