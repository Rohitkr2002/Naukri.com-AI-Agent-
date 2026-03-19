// ============================================================
// services/whatsapp.js
// Feature 3 – WhatsApp Smart Notifications (Twilio)
// ============================================================

const https = require('https');

/**
 * Send WhatsApp message via Twilio
 */
async function sendWhatsApp(message) {
    const sid   = process.env.TWILIO_SID;
    const token = process.env.TWILIO_AUTH_TOKEN;
    const from  = process.env.TWILIO_PHONE; // format: whatsapp:+14155238886
    const to    = process.env.USER_PHONE;   // format: whatsapp:+91xxxxxxxxxx

    if (!sid || !token || !from || !to) {
        console.log('\n💬 [WHATSAPP] Skipped: TWILIO_SID/TOKEN/PHONE not set in .env');
        console.log('   (Note: Use Twilio Sandbox for free testing)');
        return { success: false, error: 'MISSING_CREDENTIALS' };
    }

    const auth = Buffer.from(`${sid}:${token}`).toString('base64');
    const body = new URLSearchParams({
        From: from,
        To:   to,
        Body: message
    }).toString();

    return new Promise((resolve) => {
        const options = {
            hostname: 'api.twilio.com',
            path:     `/2010-04-01/Accounts/${sid}/Messages.json`,
            method:   'POST',
            headers:  {
                'Authorization':  `Basic ${auth}`,
                'Content-Type':   'application/x-www-form-urlencoded',
                'Content-Length': Buffer.byteLength(body)
            }
        };

        const req = https.request(options, (res) => {
            let data = '';
            res.on('data', (c) => data += c);
            res.on('end', () => {
                const success = res.statusCode >= 200 && res.statusCode < 300;
                if (!success) console.warn('   ⚠️  WhatsApp failed:', data);
                resolve({ success, data });
            });
        });

        req.on('error', (e) => {
            console.error('   ❌ WhatsApp Request Error:', e.message);
            resolve({ success: false, error: e.message });
        });

        req.write(body);
        req.end();
    });
}

/**
 * Format and send daily job alerts to WhatsApp
 */
async function sendDailyJobAlerts(jobs) {
    console.log(`\n💬 Feature 3: Preparing WhatsApp Job Alerts...`);
    
    if (jobs.length === 0) return;

    const topJobs = jobs.slice(0, 3);
    let message = `🚀 *Naukri AI Daily Alerts*\n\nTop matches for you today:\n\n`;

    topJobs.forEach((job, i) => {
        message += `${i+1}. *${job.title}*\n`;
        message += `📍 ${job.company} (${job.city})\n`;
        message += `🎯 Match: ${job.aiScore?.score}%\n`;
        message += `🔗 [Apply Now](${job.url})\n\n`;
    });

    message += `View all ${jobs.length} jobs on your local dashboard: http://localhost:5173`;

    const result = await sendWhatsApp(message);
    if (result.success) {
        console.log('   ✅ WhatsApp alert delivered successfully!');
    }
    return result;
}

module.exports = { sendDailyJobAlerts };
