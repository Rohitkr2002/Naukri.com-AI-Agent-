// ============================================================
// services/filter.js
// Filters, deduplicates, sorts and caps job listings
// Rules: 0-1 yr experience only, no duplicates, top 20
// ============================================================

// Experience keywords that indicate 0-1 year range
const VALID_EXP_PATTERNS = [
  /0\s*-\s*1/i,
  /fresher/i,
  /entry.?level/i,
  /\b0\s*yr/i,
  /\b1\s*yr/i,
  /^0$/,
  /^1$/,
  /less than 1/i,
  /0 to 1/i,
];

// Check if a job's experience field matches 0-1 year range
function isValidExperience(expText) {
  if (!expText || expText === 'N/A') return true; // include if exp not specified
  return VALID_EXP_PATTERNS.some((pattern) => pattern.test(expText));
}

// Generate a unique key for deduplication
function dedupKey(job) {
  const title   = (job.title || '').toLowerCase().replace(/\s+/g, ' ').trim();
  const company = (job.company || '').toLowerCase().replace(/\s+/g, ' ').trim();
  return `${title}||${company}`;
}

// Sort jobs by how recently they were posted
// Naukri uses text like "Just Now", "Few Minutes Ago", "2 Hrs Ago", "1 Day Ago"
function postedScore(postedText) {
  const text = (postedText || '').toLowerCase();
  if (text.includes('just') || text.includes('minute') || text.includes('min')) return 0;
  if (text.includes('hour') || text.includes('hr'))  return 1;
  if (text.includes('today'))                        return 2;
  if (text.includes('1 day') || text.includes('yesterday')) return 3;
  if (text.includes('day'))                          return 4;
  if (text.includes('week'))                         return 5;
  return 6; // older / unknown
}

// Main filter function
function filterJobs(rawJobs) {
  console.log(`🔧 Filtering ${rawJobs.length} raw jobs...\n`);

  // Step 1: Filter by 0-1 year experience
  const expFiltered = rawJobs.filter((job) => isValidExperience(job.exp));
  console.log(`   → After experience filter: ${expFiltered.length} jobs`);

  // Step 2: Remove duplicates
  const seen    = new Set();
  const deduped = expFiltered.filter((job) => {
    const key = dedupKey(job);
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
  console.log(`   → After deduplication:     ${deduped.length} jobs`);

  // Step 3: Sort by most recently posted
  deduped.sort((a, b) => postedScore(a.posted) - postedScore(b.posted));

  // Step 4: Pick top 20
  const top20 = deduped.slice(0, 20);
  console.log(`   → Final top jobs selected: ${top20.length} jobs\n`);

  return top20;
}

module.exports = { filterJobs };
