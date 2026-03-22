// ============================================================
// services/scraper.js
// Direct Naukri.com Scraper – Puppeteer Headless Browser
// Cities: Bangalore, Delhi, Pune, Kolkata
// Domains: Software Developer, Frontend Dev, Python Dev,
//          Data Analyst, Web Developer
// Experience: Fresher / 0-1 year
// ============================================================

const puppeteer = require('puppeteer-core');

// ─── Try to get Chromium path ─────────────────────────────────────────────────
let chromium;
try {
  chromium = require('@sparticuz/chromium');
} catch (_) {
  chromium = null;
}

// ─── Target cities ────────────────────────────────────────────────────────────
const CITIES = ['bangalore', 'delhi', 'pune', 'kolkata', 'mumbai', 'hyderabad', 'chennai', 'gurgaon', 'noida', 'ahmedabad'];

const CITY_LABELS = {
  bangalore: 'Bangalore',
  delhi:     'Delhi',
  pune:      'Pune',
  kolkata:   'Kolkata',
  mumbai:    'Mumbai',
  hyderabad: 'Hyderabad',
  chennai:   'Chennai',
  gurgaon:   'Gurgaon',
  noida:     'Noida',
  ahmedabad: 'Ahmedabad'
};

// ─── Job roles ────────────────────────────────────────────────────────────────
const ROLES = [
  { keyword: 'software-developer', label: 'Software Developer' },
  { keyword: 'frontend-developer', label: 'Frontend Developer' },
  { keyword: 'python-developer',   label: 'Python Developer'   },
  { keyword: 'data-analyst',       label: 'Data Analyst'       },
  { keyword: 'web-developer',      label: 'Web Developer'      },
];

// ─── Delay helper ─────────────────────────────────────────────────────────────
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

// ─── Get Chromium executable path ────────────────────────────────────────────
async function getExecutablePath() {
  // Lambda/CI environment – use @sparticuz/chromium
  if (chromium && process.env.AWS_LAMBDA_FUNCTION_NAME) {
    return await chromium.executablePath();
  }
  // GitHub Actions (ubuntu-latest)
  const fs   = require('fs');
  const ciPaths = [
    '/usr/bin/google-chrome',
    '/usr/bin/google-chrome-stable',
    '/usr/bin/chromium-browser',
    '/usr/bin/chromium',
    '/snap/bin/chromium',
  ];
  for (const p of ciPaths) {
    if (fs.existsSync(p)) {
      console.log(`   ℹ️  Using Chrome at: ${p}`);
      return p;
    }
  }
  // Local Windows / macOS – use bundled Chromium from puppeteer
  try {
    // puppeteer (not puppeteer-core) bundles Chromium
    const pup = require('puppeteer');
    return pup.executablePath();
  } catch (_) {}

  // Fallback: common local paths
  const localPaths = [
    'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    'C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe',
    '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
  ];
  for (const p of localPaths) {
    const fs = require('fs');
    if (fs.existsSync(p)) return p;
  }
  return null;
}

// ─── Launch browser ───────────────────────────────────────────────────────────
async function launchBrowser() {
  const execPath = await getExecutablePath();

  const launchArgs = {
    headless: 'new',
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--disable-blink-features=AutomationControlled',
      '--disable-dev-shm-usage',
      '--disable-gpu',
      '--window-size=1280,900',
    ],
    ignoreDefaultArgs: ['--enable-automation'],
  };

  if (execPath) {
    launchArgs.executablePath = execPath;
  } else if (chromium) {
    launchArgs.executablePath = await chromium.executablePath();
    launchArgs.args = [...(await chromium.args), ...launchArgs.args];
  }

  return puppeteer.launch(launchArgs);
}

// ─── Scrape one role+city combination ────────────────────────────────────────
async function scrapeNaukriPage(page, role, city) {
  const url = `https://www.naukri.com/${role.keyword}-jobs-in-${city}?experience=0`;
  console.log(`🔍 [Naukri] ${role.label} → ${CITY_LABELS[city]}`);

  try {
    await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 30000 });

    // Wait for job cards to appear (Naukri lazy-loads them)
    await page.waitForSelector(
      'article.jobTuple, div.cust-job-tuple, div[class*="jobTuple"], div[class*="srp-jobtuple"]',
      { timeout: 12000 }
    ).catch(() => {}); // ignore timeout — page may still have results

    await sleep(1500); // give JS time to paint

    // Extract job data from page DOM
    const jobs = await page.evaluate((cityLabel, roleLabel) => {
      const results = [];

      // Naukri uses different class names — we handle multiple versions
      const cards = document.querySelectorAll(
        'article.jobTuple, div.cust-job-tuple, div[class*="jobTupleHeader"], ' +
        'div[class*="srp-jobtuple-wrapper"], article[class*="jobTuple"]'
      );

      cards.forEach((card) => {
        // Title & URL
        const titleEl  = card.querySelector('a.title, a[class*="title"], h2 a, a[class*="jobTitle"]');
        const title    = titleEl?.innerText?.trim() || '';
        const rawHref  = titleEl?.getAttribute('href') || '';
        const jobUrl   = rawHref.startsWith('http') ? rawHref : `https://www.naukri.com${rawHref}`;

        // Company
        const company  = card.querySelector('a.comp-name, a[class*="comp-name"], span[class*="comp-name"]')
                            ?.innerText?.trim() || 'N/A';

        // Experience
        const exp      = card.querySelector('li.exp, span[class*="experience"], li[class*="exp"], span[class*="exp"]')
                            ?.innerText?.trim() || '0-1 Yrs';

        // Location shown on card
        const locEl    = card.querySelector('li.loc, span[class*="loc"], li[class*="loc"]');
        const location = locEl?.innerText?.trim() || cityLabel;

        // Salary
        const salary   = card.querySelector('li.salary, span[class*="salary"]')
                            ?.innerText?.trim() || 'Not Disclosed';

        // Posted
        const posted   = card.querySelector('span.job-post-day, span[class*="post"], time')
                            ?.innerText?.trim() || 'Recently';

        // Applicants (Competition)
        const appEl    = card.querySelector('span.applicants, span[class*="applicants"], span[class*="applied"]');
        const appText  = appEl?.innerText?.trim() || '0';
        const appCount = parseInt(appText.replace(/[^0-9]/g, '')) || 5; // Default to 5 if not shown

        // Competition Logic
        let competition = 'Low';
        if (appCount > 150) competition = 'High';
        else if (appCount > 60) competition = 'Medium';

        if (title) {
          results.push({ 
            title, company, exp, 
            location: `${cityLabel}, India`, 
            salary, posted, url: jobUrl, 
            domain: roleLabel, city: cityLabel,
            competition,
            applicants: appCount
          });
        }
      });

      return results;
    }, CITY_LABELS[city], role.label);

    console.log(`   ✅ ${jobs.length} jobs found`);
    return jobs;

  } catch (err) {
    console.warn(`   ⚠️  ${role.label}/${city}: ${err.message}`);
    return [];
  }
}

// ─── LinkedIn Scraper (Guest Search) ──────────────────────────────────────────
async function scrapeLinkedIn(page, role, city) {
  const url = `https://www.linkedin.com/jobs/search?keywords=${role.keyword}&location=${city}&f_TPR=r86400&f_E=1`; // Past 24h, Entry Level
  console.log(`🔍 [LinkedIn] ${role.label} → ${CITY_LABELS[city]}`);
  
  try {
    await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 35000 });
    await page.waitForSelector('.base-search-card__title, .job-search-card', { timeout: 10000 }).catch(() => {});
    await sleep(2000);

    const jobs = await page.evaluate((cityLabel, roleLabel) => {
        const results = [];
        const cards = document.querySelectorAll('div.base-card, li > div[class*="job-search-card"], .base-search-card--clickable');
        cards.forEach(card => {
            const titleEl = card.querySelector('h3.base-search-card__title, .base-search-card__title');
            const compEl = card.querySelector('h4.base-search-card__subtitle, .base-search-card__subtitle');
            const linkEl = card.querySelector('a.base-card__full-link, .base-card__full-link');
            
            const title = titleEl?.innerText?.trim();
            const company = compEl?.innerText?.trim();
            const link = linkEl?.href;

            if (title && link) {
                results.push({ 
                    title, company: company || 'N/A', location: cityLabel, url: link, 
                    domain: roleLabel, city: cityLabel, source: 'LinkedIn',
                    competition: 'Medium', applicants: 45
                });
            }
        });
        return results;
    }, CITY_LABELS[city], role.label);

    console.log(`   ✅ ${jobs.length} jobs found`);
    return jobs;
  } catch (err) {
    console.warn(`   ⚠️  LinkedIn Error: ${err.message}`);
    return [];
  }
}

// ─── Indeed Scraper ───────────────────────────────────────────────────────────
async function scrapeIndeed(page, role, city) {
  const url = `https://in.indeed.com/jobs?q=${role.keyword}&l=${city}&fromage=1`;
  console.log(`🔍 [Indeed] ${role.label} → ${CITY_LABELS[city]}`);

  try {
    await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 35000 });
    await page.waitForSelector('.job_seen_beacon, #mosaic-provider-jobcards', { timeout: 10000 }).catch(() => {});
    await sleep(2000);

    const jobs = await page.evaluate((cityLabel, roleLabel) => {
        const results = [];
        const cards = document.querySelectorAll('div.job_seen_beacon, .job_seen_beacon');
        cards.forEach(card => {
            const titleEl = card.querySelector('h2.jobTitle span, [id^="jobTitle"], .jobTitle');
            const compEl = card.querySelector('span.companyName, .companyName, .provider-code-96v6a7');
            const linkEl = card.querySelector('a[id^="job_"], a.jcs-JobTitle');
            
            const title = titleEl?.innerText?.trim();
            const company = compEl?.innerText?.trim();
            const link = linkEl?.href;

            if (title) {
                results.push({ 
                    title, company: company || 'N/A', location: cityLabel, url: link || '', 
                    domain: roleLabel, city: cityLabel, source: 'Indeed',
                    competition: 'Low', applicants: 15
                });
            }
        });
        return results;
    }, CITY_LABELS[city], role.label);
    console.log(`   ✅ ${jobs.length} jobs found`);
    return jobs;
  } catch (err) {
    console.warn(`   ⚠️  Indeed Error: ${err.message}`);
    return [];
  }
}

// ─── Main export ──────────────────────────────────────────────────────────────
async function scrapeAllJobs() {
  const cityNames = CITIES.map(c => CITY_LABELS[c]).join(' | ');
  console.log('\n🚀 Starting Multi-Platform AI Scraper (Headless Browser)...');
  console.log('   Platforms: Naukri | LinkedIn | Indeed');
  console.log(`   Cities   : ${cityNames}`);
  console.log('   Roles    : Software Dev | Frontend | Python | Data Analyst | Web Dev\n');

  let browser;
  const allJobs = [];

  try {
    browser = await launchBrowser();
    const page = await browser.newPage();

    // Stealth: set real user-agent & viewport
    await page.setUserAgent(
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36'
    );
    await page.setViewport({ width: 1280, height: 900 });
    // Disable navigator.webdriver flag (basic anti-bot)
    await page.evaluateOnNewDocument(() => {
      Object.defineProperty(navigator, 'webdriver', { get: () => false });
    });

    // ─── Optional LinkedIn Login ──────────────────────────────────────────────
    if (process.env.LINKEDIN_EMAIL && process.env.LINKEDIN_PASS) {
      console.log('🔐 Attempting LinkedIn Login...');
      try {
        await page.goto('https://www.linkedin.com/login', { waitUntil: 'networkidle2' });
        await page.type('#username', process.env.LINKEDIN_EMAIL, { delay: 100 });
        await page.type('#password', process.env.LINKEDIN_PASS, { delay: 100 });
        await page.click('button[type="submit"]');
        await page.waitForNavigation({ waitUntil: 'networkidle2', timeout: 15000 });
        console.log('   ✅ LinkedIn Login successful!');
      } catch (err) {
        console.warn('   ⚠️  LinkedIn Login failed (likely CAPTCHA/2FA). Continuing as Guest.');
      }
    }

    for (const city of CITIES) {
      console.log(`\n📍 City: ${CITY_LABELS[city]}`);
      console.log('─'.repeat(48));

      for (const role of ROLES) {
        // 1. Naukri (Primary)
        const naukriJobs = await scrapeNaukriPage(page, role, city);
        allJobs.push(...naukriJobs);

        // 2. LinkedIn (Secondary)
        const linkedInJobs = await scrapeLinkedIn(page, role, city);
        allJobs.push(...linkedInJobs);

        // 3. Indeed (Tertiary)
        const indeedJobs = await scrapeIndeed(page, role, city);
        allJobs.push(...indeedJobs);

        await sleep(2000); // polite delay between role swaps
      }
    }

  } catch (err) {
    console.error('❌ Browser error:', err.message);
  } finally {
    if (browser) await browser.close();
  }

  console.log(`\n📊 Total raw jobs collected: ${allJobs.length}`);
  console.log(`   From 3 platforms across 4 cities × 5 roles\n`);

  return allJobs;
}

module.exports = { scrapeAllJobs, launchBrowser, ROLES };
