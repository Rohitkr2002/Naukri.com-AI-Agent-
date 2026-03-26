// ============================================================
// services/emailExtractor.js
// Fetches the raw HTML of a job page to extract HR/Recruiter emails
// ============================================================

const axios = require('axios');
const cheerio = require('cheerio');

const INVALID_EMAILS = ['info@', 'support@', 'careers@', 'admin@', 'no-reply@', 'noreply@', 'hr@', 'sales@'];

function isValidRecruiterEmail(email) {
    const e = email.toLowerCase();
    for (const invalid of INVALID_EMAILS) {
        if (e.startsWith(invalid)) return false; // Basic filter for generic inboxes
    }
    // Strict domain filters could be added here
    return true;
}

async function extractEmailFromUrl(url) {
    try {
        const response = await axios.get(url, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
                'Accept': 'text/html,application/xhtml+xml,application/xml;'
            },
            timeout: 8000
        });

        // Use Cheerio to extract text
        const $ = cheerio.load(response.data);
        const textContent = $('body').text();

        // Regex to hunt for typical email patterns
        const emailRegex = /([a-zA-Z0-9._-]+@[a-zA-Z0-9._-]+\.[a-zA-Z0-9_-]+)/gi;
        const matches = textContent.match(emailRegex);

        if (matches && matches.length > 0) {
            // Find the most likely human recruiter email
            for (const email of matches) {
                if (isValidRecruiterEmail(email)) {
                    return email;
                }
            }
        }
        return null;
    } catch (err) {
        // Soft fail if the page blocks axios (like LinkedIn strict blocks)
        console.warn(`      (Extractor blocked or timeout for ${url.substring(0, 30)}...)`);
        return null;
    }
}

module.exports = { extractEmailFromUrl };
