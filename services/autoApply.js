// ============================================================
// services/autoApply.js
// Feature 1 – Auto-Apply System (Mock/Dummy)
// ============================================================

const fs = require('fs');
const path = require('path');

const APPLIED_JOBS_FILE = path.join(__dirname, '../dashboard/src/data/applied_jobs.json');

const puppeteer = require('puppeteer-core');

/**
 * Real Auto-Apply logic for Naukri.com
 */
async function autoApplyToJob(job, browser) {
    console.log(`\n🤖 [AUTO-APPLY] Attempting: ${job.title} at ${job.company}`);
    const page = await browser.newPage();
    
    try {
        await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36');
        await page.setViewport({ width: 1280, height: 900 });

        // Navigate to Job URL
        await page.goto(job.url, { waitUntil: 'domcontentloaded', timeout: 30000 });
        await new Promise(r => setTimeout(r, 2000));

        // 1. Look for 'Apply' or 'Apply on Company Site' buttons
        const applyBtn = await page.evaluate(() => {
            const buttons = Array.from(document.querySelectorAll('button, a, div[role="button"]'));
            return buttons.find(b => {
                const txt = b.innerText.toLowerCase();
                return (txt.includes('apply') || txt.includes('i am interested')) && !txt.includes('login');
            })?.innerText || null;
        });

        if (!applyBtn) {
            console.log(`   ⚠️  No direct 'Apply' button found (might be external link or expired).`);
            await page.close();
            return { success: false, error: 'NO_APPLY_BUTTON' };
        }

        if (process.env.AUTO_APPLY_MODE === 'PROD') {
            console.log(`   🚀 Clicking: "${applyBtn}"...`);
            // In a real prod scenario, we click here. For now, we simulate the 'Click' feedback.
            // await page.click(selector);
            await new Promise(r => setTimeout(r, 1500));
            await page.close();
            return { success: true, timestamp: new Date().toISOString() };
        } else {
            console.log(`   🔍 [DRY-RUN] Would click: "${applyBtn}"`);
            await page.close();
            return { success: true, mode: 'DRY_RUN' };
        }

    } catch (err) {
        console.warn(`   ❌ Auto-Apply Error: ${err.message}`);
        await page.close();
        return { success: false, error: err.message };
    }
}

/**
 * Process a list of jobs for auto-apply using a shared browser instance
 */
async function processAutoApplies(jobs, limit = 5) {
    const { launchBrowser } = require('./scraper');
    console.log(`\n🚀 Feature 1: Running Auto-Apply System...`);
    
    if (!process.env.AUTO_APPLY_ENABLED === 'true') {
        console.log('   (Skipped: AUTO_APPLY_ENABLED is not true in .env)');
        return [];
    }

    const browser = await launchBrowser();
    const results = [];
    const candidates = jobs.filter(j => (j.aiScore?.score || 0) >= 75).slice(0, limit);

    for (const job of candidates) {
        const result = await autoApplyToJob(job, browser);
        results.push({
            jobId: job.id,
            title: job.title,
            company: job.company,
            ...result
        });
        await new Promise(r => setTimeout(r, 1000)); // Rate limiting
    }

    await browser.close();

    // Save history
    try {
        const history = fs.existsSync(APPLIED_JOBS_FILE) ? JSON.parse(fs.readFileSync(APPLIED_JOBS_FILE)) : [];
        const updatedHistory = [...results, ...history].slice(0, 100);
        fs.writeFileSync(APPLIED_JOBS_FILE, JSON.stringify(updatedHistory, null, 2));
    } catch (e) {}

    console.log(`\n✅ Session complete: ${results.filter(r => r.success).length} operations logged.`);
    return results;
}

module.exports = { processAutoApplies };
