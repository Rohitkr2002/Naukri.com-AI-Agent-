// ============================================================
// services/mail.js
// Premium HTML Email – Naukri Job Alert
// Design: Dark mode, gradient header, city-grouped cards,
//         glassmorphism effects, professional badges
// ============================================================

const nodemailer = require('nodemailer');

// ─── Gmail SMTP transporter ───────────────────────────────────────────────────
function createTransporter() {
  return nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.GMAIL_USER,
      pass: process.env.GMAIL_PASS,
    },
  });
}

// ─── City accent colors ───────────────────────────────────────────────────────
const CITY_THEME = {
  'Bangalore': { color: '#f97316', bg: '#431407', light: '#fed7aa', emoji: '🏙️' },
  'Delhi':     { color: '#ef4444', bg: '#450a0a', light: '#fecaca', emoji: '🕌' },
  'Pune':      { color: '#a855f7', bg: '#3b0764', light: '#e9d5ff', emoji: '🏯' },
  'Kolkata':   { color: '#14b8a6', bg: '#042f2e', light: '#99f6e4', emoji: '🌉' },
};

// ─── Domain tag colors ────────────────────────────────────────────────────────
const DOMAIN_COLORS = {
  'Software Developer': { bg: '#1e3a5f', color: '#93c5fd' },
  'Frontend Developer': { bg: '#1c2a1e', color: '#86efac' },
  'Python Developer':   { bg: '#2d1f3e', color: '#c4b5fd' },
  'Data Analyst':       { bg: '#1f2d3e', color: '#7dd3fc' },
  'Web Developer':      { bg: '#2d2a1a', color: '#fde68a' },
};

// ─── Truncate helper ──────────────────────────────────────────────────────────
function trunc(str, n) {
  if (!str) return '';
  return str.length > n ? str.slice(0, n) + '…' : str;
}

// ─── Format salary ────────────────────────────────────────────────────────────
function fmtSalary(s) {
  if (!s || s === 'Not Disclosed' || s === 'N/A') return 'Not Disclosed';
  return s;
}

// ─── Render one job card ──────────────────────────────────────────────────────
function renderJobCard(job, index, cityColor) {
  const domainStyle = DOMAIN_COLORS[job.domain] || { bg: '#1e293b', color: '#94a3b8' };
  const salary      = fmtSalary(job.salary);
  const company     = trunc(job.company, 40);
  const title       = trunc(job.title, 60);
  const posted      = job.posted || 'Recently';
  const applyUrl    = job.url || 'https://www.naukri.com';

  return `
  <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:14px;">
    <tr>
      <td style="
        background: linear-gradient(135deg, #131c2e 0%, #1a2540 100%);
        border: 1px solid #1e2d45;
        border-left: 4px solid ${cityColor};
        border-radius: 12px;
        padding: 18px 20px;
      ">
        <!-- Top Row: Number + Domain tag + Posted -->
        <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:10px;">
          <tr>
            <td>
              <span style="
                background: ${cityColor};
                color: #000;
                font-size: 10px;
                font-weight: 800;
                padding: 3px 10px;
                border-radius: 20px;
                letter-spacing: 0.8px;
                text-transform: uppercase;
                font-family: 'Segoe UI', Arial, sans-serif;
              ">#${String(index + 1).padStart(2, '0')}</span>
              &nbsp;
              <span style="
                background: ${domainStyle.bg};
                color: ${domainStyle.color};
                font-size: 10px;
                font-weight: 700;
                padding: 3px 10px;
                border-radius: 20px;
                font-family: 'Segoe UI', Arial, sans-serif;
                letter-spacing: 0.5px;
              ">${job.domain}</span>
            </td>
            <td align="right">
              <span style="color:#475569; font-size:11px; font-family:'Segoe UI', Arial, sans-serif;">
                🕐 ${posted}
              </span>
            </td>
          </tr>
        </table>

        <!-- Job Title -->
        <a href="${applyUrl}" target="_blank" style="
          color: #f1f5f9;
          font-size: 16px;
          font-weight: 700;
          text-decoration: none;
          display: block;
          margin-bottom: 4px;
          line-height: 1.4;
          font-family: 'Segoe UI', Arial, sans-serif;
        ">${title}</a>

        <!-- Company -->
        <p style="
          color: #64748b;
          font-size: 13px;
          margin: 0 0 14px;
          font-family: 'Segoe UI', Arial, sans-serif;
        ">🏢 <span style="color:#94a3b8;">${company}</span></p>

        <!-- Info Chips -->
        <table cellpadding="0" cellspacing="0" style="margin-bottom:16px;">
          <tr>
            <td style="padding-right:8px; padding-bottom:6px;">
              <span style="
                background: #1e3a5f;
                color: #93c5fd;
                padding: 5px 12px;
                border-radius: 20px;
                font-size: 11px;
                font-weight: 600;
                font-family: 'Segoe UI', Arial, sans-serif;
                white-space: nowrap;
              ">💼 ${job.exp || '0-1 Yrs'}</span>
            </td>
            <td style="padding-right:8px; padding-bottom:6px;">
              <span style="
                background: #1a3a2a;
                color: #86efac;
                padding: 5px 12px;
                border-radius: 20px;
                font-size: 11px;
                font-weight: 600;
                font-family: 'Segoe UI', Arial, sans-serif;
                white-space: nowrap;
              ">📍 ${job.location || 'India'}</span>
            </td>
            <td style="padding-bottom:6px;">
              <span style="
                background: #2d1f3e;
                color: #c4b5fd;
                padding: 5px 12px;
                border-radius: 20px;
                font-size: 11px;
                font-weight: 600;
                font-family: 'Segoe UI', Arial, sans-serif;
                white-space: nowrap;
              ">💰 ${salary}</span>
            </td>
          </tr>
        </table>

        <!-- Apply Button -->
        <a href="${applyUrl}" target="_blank" style="
          display: inline-block;
          background: linear-gradient(135deg, ${cityColor} 0%, #818cf8 100%);
          color: #000000;
          font-size: 12px;
          font-weight: 800;
          padding: 10px 22px;
          border-radius: 8px;
          text-decoration: none;
          letter-spacing: 0.5px;
          font-family: 'Segoe UI', Arial, sans-serif;
          text-transform: uppercase;
        ">Apply on Naukri →</a>

      </td>
    </tr>
  </table>`;
}

// ─── Render a city section header ─────────────────────────────────────────────
function renderCitySection(cityName, jobs) {
  const theme = CITY_THEME[cityName] || { color: '#38bdf8', bg: '#0f2027', light: '#bae6fd', emoji: '📍' };

  const cards = jobs.map((job, i) => renderJobCard(job, i, theme.color)).join('');

  return `
  <!-- CITY SECTION: ${cityName} -->
  <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom: 8px;">
    <tr>
      <td style="
        background: linear-gradient(90deg, ${theme.bg} 0%, #0d1b2a 100%);
        border-radius: 10px;
        padding: 14px 20px;
        margin-bottom: 12px;
        border-left: 5px solid ${theme.color};
        margin-bottom: 16px;
      ">
        <span style="
          color: ${theme.color};
          font-size: 18px;
          font-weight: 800;
          font-family: 'Segoe UI', Arial, sans-serif;
          letter-spacing: -0.3px;
        ">${theme.emoji} ${cityName}</span>
        <span style="
          color: #475569;
          font-size: 12px;
          font-family: 'Segoe UI', Arial, sans-serif;
          margin-left: 10px;
        ">${jobs.length} job${jobs.length > 1 ? 's' : ''} found</span>
      </td>
    </tr>
  </table>
  ${cards}`;
}

// ─── Build full HTML email ─────────────────────────────────────────────────────
function buildHtmlEmail(jobs) {
  const today = new Date().toLocaleDateString('en-IN', {
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
    timeZone: 'Asia/Kolkata',
  });

  // Group jobs by city
  const byCity = {};
  jobs.forEach((job) => {
    const city = job.city || (job.location ? job.location.split(',')[0].trim() : 'Other');
    if (!byCity[city]) byCity[city] = [];
    byCity[city].push(job);
  });

  // Render city sections
  let citySections = '';
  let totalRendered = 0;

  // Preferred city order
  const cityOrder = ['Bangalore', 'Delhi', 'Pune', 'Kolkata'];
  const sortedCities = [
    ...cityOrder.filter((c) => byCity[c]),
    ...Object.keys(byCity).filter((c) => !cityOrder.includes(c)),
  ];

  sortedCities.forEach((city) => {
    if (byCity[city] && byCity[city].length > 0) {
      citySections += renderCitySection(city, byCity[city]);
      totalRendered += byCity[city].length;
    }
  });

  // Stats bar
  const cityCount  = Object.keys(byCity).length;
  const domainSet  = [...new Set(jobs.map((j) => j.domain))];

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Naukri Job Alert – ${today}</title>
</head>
<body style="margin:0; padding:0; background:#070d1a; font-family:'Segoe UI',Arial,sans-serif;">

<table width="100%" cellpadding="0" cellspacing="0" style="background:#070d1a;">
  <tr>
    <td align="center" style="padding: 28px 12px;">
    <table width="640" cellpadding="0" cellspacing="0" style="max-width:640px; width:100%;">

      <!-- ═══════════════ HEADER ═══════════════ -->
      <tr>
        <td style="
          background: linear-gradient(135deg, #0d1f3c 0%, #1a2e52 40%, #0d2137 100%);
          border-radius: 20px 20px 0 0;
          padding: 40px 32px 32px;
          text-align: center;
          border-bottom: 2px solid #1e3a5f;
        ">
          <!-- Logo / Icon -->
          <div style="
            display: inline-block;
            background: linear-gradient(135deg, #2563eb, #7c3aed);
            width: 64px;
            height: 64px;
            border-radius: 18px;
            line-height: 64px;
            font-size: 32px;
            margin-bottom: 16px;
          ">💼</div>

          <!-- Title -->
          <h1 style="
            color: #f8fafc;
            font-size: 28px;
            font-weight: 900;
            margin: 0 0 6px;
            letter-spacing: -0.5px;
            line-height: 1.2;
          ">Naukri Job Alert</h1>
          <p style="
            color: #94a3b8;
            font-size: 13px;
            margin: 0 0 20px;
            letter-spacing: 0.3px;
          ">📅 ${today} &nbsp;·&nbsp; ⏰ 9:00 AM IST</p>

          <!-- Badge -->
          <div style="
            display: inline-block;
            background: linear-gradient(135deg, rgba(56,189,248,0.15), rgba(129,140,248,0.15));
            border: 1px solid rgba(56,189,248,0.4);
            border-radius: 50px;
            padding: 10px 28px;
            color: #7dd3fc;
            font-size: 14px;
            font-weight: 700;
            letter-spacing: 0.3px;
          ">🎯 Top ${totalRendered} Fresh Jobs · 0–1 Year Experience</div>
        </td>
      </tr>

      <!-- ═══════════════ STATS BAR ═══════════════ -->
      <tr>
        <td style="background: #0d1526; padding: 0;">
          <table width="100%" cellpadding="0" cellspacing="0">
            <tr>
              <td width="33%" align="center" style="
                padding: 18px 8px;
                border-right: 1px solid #1e293b;
              ">
                <div style="color:#38bdf8; font-size:22px; font-weight:900; line-height:1;">${totalRendered}</div>
                <div style="color:#475569; font-size:11px; letter-spacing:0.5px; margin-top:3px;">TOTAL JOBS</div>
              </td>
              <td width="33%" align="center" style="
                padding: 18px 8px;
                border-right: 1px solid #1e293b;
              ">
                <div style="color:#a78bfa; font-size:22px; font-weight:900; line-height:1;">${cityCount}</div>
                <div style="color:#475569; font-size:11px; letter-spacing:0.5px; margin-top:3px;">CITIES</div>
              </td>
              <td width="33%" align="center" style="padding: 18px 8px;">
                <div style="color:#34d399; font-size:22px; font-weight:900; line-height:1;">${domainSet.length}</div>
                <div style="color:#475569; font-size:11px; letter-spacing:0.5px; margin-top:3px;">DOMAINS</div>
              </td>
            </tr>
          </table>
        </td>
      </tr>

      <!-- ═══════════════ CITIES STRIP ═══════════════ -->
      <tr>
        <td style="background:#0a1120; padding: 12px 20px; border-bottom: 1px solid #1e293b;">
          <table cellpadding="0" cellspacing="0">
            <tr>
              <td style="padding-right:8px;">
                <span style="color:#475569; font-size:11px; letter-spacing:0.5px;">📍 CITIES:</span>
              </td>
              ${sortedCities.map((c) => {
                const t = CITY_THEME[c] || { color: '#94a3b8' };
                return `<td style="padding-right:6px;">
                  <span style="
                    background: ${t.color}22;
                    color: ${t.color};
                    border: 1px solid ${t.color}55;
                    padding: 3px 10px;
                    border-radius: 20px;
                    font-size: 11px;
                    font-weight: 700;
                    white-space:nowrap;
                  ">${c}</span>
                </td>`;
              }).join('')}
            </tr>
          </table>
        </td>
      </tr>

      <!-- ═══════════════ JOB CARDS ═══════════════ -->
      <tr>
        <td style="background: #0a1120; padding: 24px 20px;">
          ${citySections}
        </td>
      </tr>

      <!-- ═══════════════ CTA BANNER ═══════════════ -->
      <tr>
        <td style="
          background: linear-gradient(135deg, #1e3a5f 0%, #2d1f3e 100%);
          padding: 28px 32px;
          text-align: center;
          border-top: 1px solid #1e293b;
        ">
          <p style="color:#94a3b8; font-size:14px; margin:0 0 16px; line-height:1.6;">
            Want more jobs? Visit Naukri.com and explore<br/>thousands of opportunities tailored for freshers.
          </p>
          <a href="https://www.naukri.com/jobs-in-india?experience=0" target="_blank" style="
            display: inline-block;
            background: linear-gradient(135deg, #2563eb 0%, #7c3aed 100%);
            color: #ffffff;
            font-size: 14px;
            font-weight: 800;
            padding: 14px 36px;
            border-radius: 10px;
            text-decoration: none;
            letter-spacing: 0.5px;
            text-transform: uppercase;
          ">🚀 Explore All Jobs on Naukri.com</a>
        </td>
      </tr>

      <!-- ═══════════════ FOOTER ═══════════════ -->
      <tr>
        <td style="
          background: #070d1a;
          border-radius: 0 0 20px 20px;
          padding: 24px 32px;
          text-align: center;
          border-top: 1px solid #0f172a;
        ">
          <div style="
            display: inline-block;
            width: 36px;
            height: 36px;
            background: linear-gradient(135deg, #1e3a5f, #2d1f3e);
            border-radius: 8px;
            line-height: 36px;
            font-size: 18px;
            margin-bottom: 10px;
          ">🤖</div>
          <p style="color:#334155; font-size:12px; margin:0 0 6px;">
            Automated by <strong style="color:#38bdf8;">Naukri Job AI Agent</strong>
          </p>
          <p style="color:#1e293b; font-size:11px; margin:0; line-height:1.6;">
            Runs daily at 9:00 AM IST via GitHub Actions · Jobs sourced from Naukri.com<br/>
            Built with Node.js · Puppeteer · Nodemailer
          </p>
          <div style="margin-top:16px; padding-top:16px; border-top:1px solid #0f172a;">
            <span style="
              background:#0f172a;
              color:#334155;
              font-size:10px;
              padding:4px 12px;
              border-radius:20px;
              letter-spacing:0.5px;
            ">🔒 This email was sent securely. Do not reply.</span>
          </div>
        </td>
      </tr>

    </table>
    </td>
  </tr>
</table>

</body>
</html>`;
}

// ─── Main send function ────────────────────────────────────────────────────────
async function sendJobEmail(jobs) {
  if (!process.env.GMAIL_USER || !process.env.GMAIL_PASS) {
    throw new Error('❌ Missing GMAIL_USER or GMAIL_PASS in .env file!');
  }
  if (!process.env.RECIPIENT_EMAIL) {
    throw new Error('❌ Missing RECIPIENT_EMAIL in .env file!');
  }

  const transporter = createTransporter();
  const htmlContent = buildHtmlEmail(jobs);
  const today       = new Date().toLocaleDateString('en-IN', {
    day: '2-digit', month: 'short', year: 'numeric', timeZone: 'Asia/Kolkata',
  });

  const mailOptions = {
    from:    `"Naukri Job Agent 🤖" <${process.env.GMAIL_USER}>`,
    to:      process.env.RECIPIENT_EMAIL,
    subject: `💼 ${jobs.length} Fresh Jobs – ${today} | Bangalore · Delhi · Pune · Kolkata`,
    html:    htmlContent,
  };

  console.log(`\n📧 Sending email to: ${process.env.RECIPIENT_EMAIL}`);
  const info = await transporter.sendMail(mailOptions);
  console.log(`✅ Email sent! Message ID: ${info.messageId}`);
}

module.exports = { sendJobEmail };
