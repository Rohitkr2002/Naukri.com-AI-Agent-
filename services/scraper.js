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
const CITIES = ['bangalore', 'delhi', 'pune', 'kolkata'];

const CITY_LABELS = {
  bangalore: 'Bangalore',
  delhi:     'Delhi',
  pune:      'Pune',
  kolkata:   'Kolkata',
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

        if (title) {
          results.push({ title, company, exp, location: `${cityLabel}, India`, salary, posted, url: jobUrl, domain: roleLabel, city: cityLabel });
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

// ─── Main export ──────────────────────────────────────────────────────────────
async function scrapeAllJobs() {
  console.log('\n🚀 Starting Naukri.com Direct Scraper (Headless Browser)...');
  console.log('   Cities : Bangalore | Delhi | Pune | Kolkata');
  console.log('   Roles  : Software Dev | Frontend | Python | Data Analyst | Web Dev\n');

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

    for (const city of CITIES) {
      console.log(`\n📍 City: ${CITY_LABELS[city]}`);
      console.log('─'.repeat(48));

      for (const role of ROLES) {
        const jobs = await scrapeNaukriPage(page, role, city);
        allJobs.push(...jobs);
        await sleep(1200); // polite delay
      }
    }

  } catch (err) {
    console.error('❌ Browser error:', err.message);
  } finally {
    if (browser) await browser.close();
  }

  console.log(`\n📊 Total raw jobs collected: ${allJobs.length}`);
  console.log(`   From Naukri.com across 4 cities × 5 roles\n`);

  return allJobs;
}

module.exports = { scrapeAllJobs };
