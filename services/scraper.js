// ============================================================
// services/scraper.js
// Multi-source Job Scraper (No extra sign-up required)
// Sources:
//   1. JSearch via RapidAPI (if subscribed)
//   2. Remotive API – free, no auth (remote tech jobs)
//   3. Arbeitnow API – free, no auth (global tech jobs)
// ============================================================

const axios = require('axios');

// Job domains for filtering
const DOMAINS = [
  'software developer',
  'frontend developer',
  'web developer',
  'python developer',
  'data analyst',
  'fresher developer',
];

const JSEARCH_QUERIES = [
  { keyword: 'software developer fresher 0 1 year India', label: 'Software Developer' },
  { keyword: 'frontend developer fresher India entry level',  label: 'Frontend Developer' },
  { keyword: 'python developer fresher India 0 year',         label: 'Python Developer' },
  { keyword: 'data analyst fresher India entry level',        label: 'Data Analyst' },
];

// ─── Delay helper ─────────────────────────────────────────────────────────────
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

// ─── SOURCE 1: JSearch (RapidAPI) ─────────────────────────────────────────────
async function scrapeJSearch() {
  const jobs = [];
  if (!process.env.RAPIDAPI_KEY) return jobs;

  for (const q of JSEARCH_QUERIES) {
    try {
      console.log(`🔍 [JSearch] ${q.label}`);
      const resp = await axios.get('https://jsearch.p.rapidapi.com/search', {
        headers: {
          'x-rapidapi-host': 'jsearch.p.rapidapi.com',
          'x-rapidapi-key': process.env.RAPIDAPI_KEY,
        },
        params: {
          query:     q.keyword,
          page:      '1',
          num_pages: '1',
          date_posted: 'today',
          country:   'in',
        },
        timeout: 20000,
      });

      (resp.data?.data || []).forEach((item) => {
        const title   = item.job_title      || '';
        const company = item.employer_name  || 'N/A';
        const jobUrl  = item.job_apply_link || '';
        const location= [item.job_city, item.job_state].filter(Boolean).join(', ') || 'India';
        const salary  = item.job_min_salary ? `₹${item.job_min_salary}–₹${item.job_max_salary}` : 'Not Disclosed';
        const posted  = item.job_posted_at_datetime_utc ? relativeTime(item.job_posted_at_datetime_utc) : 'Recently';

        if (title) jobs.push({ title, company, exp: '0–1 Yrs', location, salary, posted, url: jobUrl, domain: q.label });
      });

      console.log(`   ✅ JSearch: ${jobs.filter(j=>j.domain===q.label).length} results`);
    } catch (e) {
      const status = e.response?.status;
      if (status === 403) console.warn(`   ⚠️  [JSearch] Not subscribed – visit https://rapidapi.com/letscrape-6bRBa3QguO5/api/jsearch and click Subscribe`);
      else if (status === 429) console.warn('   ⚠️  [JSearch] Rate limit hit');
      else console.warn(`   ⚠️  [JSearch] ${q.label}: ${e.message}`);
    }
    await sleep(1000);
  }
  return jobs;
}

// ─── SOURCE 2: Remotive API (free, no auth) ───────────────────────────────────
async function scrapeRemotive() {
  const jobs  = [];
  const tags  = ['software', 'frontend', 'python', 'data-analyst', 'web'];

  console.log('\n🔍 [Remotive] Fetching remote tech jobs...');
  try {
    for (const tag of tags) {
      const resp = await axios.get(`https://remotive.com/api/remote-jobs`, {
        params: { category: 'software-dev', search: tag, limit: 10 },
        timeout: 15000,
      });

      (resp.data?.jobs || []).forEach((item) => {
        const title   = item.title          || '';
        const company = item.company_name   || 'N/A';
        const jobUrl  = item.url            || '';
        const location= item.candidate_required_location || 'Remote / India';
        const salary  = item.salary         || 'Not Disclosed';
        const posted  = item.publication_date ? relativeTime(item.publication_date) : 'Recently';
        const label   = matchDomain(title);

        if (title && label) {
          jobs.push({ title, company, exp: '0–1 Yrs', location, salary, posted, url: jobUrl, domain: label });
        }
      });
      await sleep(500);
    }
    console.log(`   ✅ Remotive: ${jobs.length} results`);
  } catch (e) {
    console.warn(`   ⚠️  [Remotive] ${e.message}`);
  }
  return jobs;
}

// ─── SOURCE 3: Arbeitnow API (free, no auth, global jobs) ─────────────────────
async function scrapeArbeitnow() {
  const jobs = [];
  const searches = ['software developer', 'python developer', 'data analyst', 'web developer'];

  console.log('🔍 [Arbeitnow] Fetching global tech jobs...');
  try {
    for (const q of searches) {
      const resp = await axios.get('https://www.arbeitnow.com/api/job-board-api', {
        params: { search: q, page: 1 },
        timeout: 15000,
      });

      (resp.data?.data || []).forEach((item) => {
        const title   = item.title    || '';
        const company = item.company_name || 'N/A';
        const jobUrl  = item.url      || '';
        const location= item.location || 'Remote';
        const posted  = item.created_at ? relativeTime(new Date(item.created_at * 1000).toISOString()) : 'Recently';
        const label   = matchDomain(title);

        if (title && label) {
          jobs.push({ title, company, exp: '0–1 Yrs', location, salary: 'Not Disclosed', posted, url: jobUrl, domain: label });
        }
      });
      await sleep(500);
    }
    console.log(`   ✅ Arbeitnow: ${jobs.length} results`);
  } catch (e) {
    console.warn(`   ⚠️  [Arbeitnow] ${e.message}`);
  }
  return jobs;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────
function relativeTime(isoString) {
  try {
    const diffMs  = Date.now() - new Date(isoString).getTime();
    const mins    = Math.floor(diffMs / 60000);
    const hrs     = Math.floor(diffMs / 3600000);
    const days    = Math.floor(diffMs / 86400000);
    if (mins < 60)  return `${mins} mins ago`;
    if (hrs  < 24)  return `${hrs} hrs ago`;
    return `${days} day${days > 1 ? 's' : ''} ago`;
  } catch (_) { return 'Recently'; }
}

function matchDomain(title) {
  const t = title.toLowerCase();
  if (t.includes('python'))                              return 'Python Developer';
  if (t.includes('frontend') || t.includes('front-end')) return 'Frontend Developer';
  if (t.includes('data analyst'))                        return 'Data Analyst';
  if (t.includes('web developer'))                       return 'Web Developer';
  if (t.includes('software') || t.includes('developer')) return 'Software Developer';
  return null;
}

// ─── Main export ──────────────────────────────────────────────────────────────
async function scrapeAllJobs() {
  console.log('\n🚀 Starting Multi-Source Job Scraper...\n');

  // Run all sources in parallel
  const [jsearchJobs, remotiveJobs, arbeitnowJobs] = await Promise.all([
    scrapeJSearch(),
    scrapeRemotive(),
    scrapeArbeitnow(),
  ]);

  const allJobs = [...jsearchJobs, ...remotiveJobs, ...arbeitnowJobs];
  console.log(`\n📊 Total raw jobs collected: ${allJobs.length}`);
  console.log(`   JSearch: ${jsearchJobs.length} | Remotive: ${remotiveJobs.length} | Arbeitnow: ${arbeitnowJobs.length}\n`);

  return allJobs;
}

module.exports = { scrapeAllJobs };
