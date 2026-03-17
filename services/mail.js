// ============================================================
// services/mail.js
// Sends a beautiful HTML job alert email via Gmail + Nodemailer
// ============================================================

const nodemailer  = require('nodemailer');
const { formatPostedTime, formatSalary, truncate } = require('../utils/formatter');

// Create Gmail SMTP transporter using App Password
function createTransporter() {
  return nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.GMAIL_USER,
      pass: process.env.GMAIL_PASS,
    },
  });
}

// Generate one job card block for the HTML email
function renderJobCard(job, index) {
  const postedLabel = formatPostedTime(job.posted);
  const salaryLabel = formatSalary(job.salary);
  const location    = truncate(job.location, 50);
  const company     = truncate(job.company, 45);

  // Alternating card colors for visual variety
  const cardColors  = ['#1e293b', '#0f2027', '#1a1a2e', '#0d1b2a', '#12213b'];
  const cardBg      = cardColors[index % cardColors.length];
  const domainColor = '#38bdf8';

  return `
    <div style="
      background: ${cardBg};
      border: 1px solid #334155;
      border-left: 4px solid ${domainColor};
      border-radius: 12px;
      padding: 20px 24px;
      margin-bottom: 16px;
      font-family: 'Segoe UI', Arial, sans-serif;
    ">
      <!-- Job Number Badge -->
      <div style="display:flex; align-items:center; gap:10px; margin-bottom:10px;">
        <span style="
          background: ${domainColor};
          color: #0f172a;
          font-weight: 700;
          font-size: 11px;
          padding: 2px 10px;
          border-radius: 20px;
          letter-spacing: 0.5px;
        ">#${index + 1} · ${job.domain}</span>
        <span style="color:#94a3b8; font-size:12px;">${postedLabel}</span>
      </div>

      <!-- Job Title -->
      <a href="${job.url}" style="
        color: #f1f5f9;
        font-size: 18px;
        font-weight: 700;
        text-decoration: none;
        line-height: 1.3;
        display: block;
        margin-bottom: 6px;
      " target="_blank">${job.title}</a>

      <!-- Company -->
      <p style="color:#94a3b8; font-size:14px; margin:0 0 12px;">🏢 ${company}</p>

      <!-- Details Grid -->
      <div style="
        display: flex;
        flex-wrap: wrap;
        gap: 8px;
        margin-bottom: 16px;
      ">
        <span style="background:#1e3a5f; color:#93c5fd; padding:4px 12px; border-radius:20px; font-size:12px;">
          💼 ${job.exp}
        </span>
        <span style="background:#1a3a2a; color:#86efac; padding:4px 12px; border-radius:20px; font-size:12px;">
          📍 ${location}
        </span>
        <span style="background:#2d1f3e; color:#c4b5fd; padding:4px 12px; border-radius:20px; font-size:12px;">
          💰 ${salaryLabel}
        </span>
      </div>

      <!-- Apply Button -->
      <a href="${job.url}" target="_blank" style="
        display: inline-block;
        background: linear-gradient(135deg, #38bdf8, #818cf8);
        color: #0f172a;
        font-weight: 700;
        font-size: 13px;
        padding: 10px 24px;
        border-radius: 8px;
        text-decoration: none;
        letter-spacing: 0.3px;
      ">🚀 Apply Now →</a>
    </div>
  `;
}

// Build the full HTML email document
function buildHtmlEmail(jobs) {
  const today     = new Date().toLocaleDateString('en-IN', {
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
    timeZone: 'Asia/Kolkata',
  });
  const jobCards  = jobs.map((job, i) => renderJobCard(job, i)).join('');
  const jobCount  = jobs.length;

  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Naukri Job Alert – ${today}</title>
</head>
<body style="
  margin: 0; padding: 0;
  background: #0a0f1e;
  font-family: 'Segoe UI', Arial, sans-serif;
">
  <table width="100%" cellpadding="0" cellspacing="0">
    <tr>
      <td align="center" style="padding: 32px 16px;">
        <table width="640" cellpadding="0" cellspacing="0" style="max-width:640px; width:100%;">

          <!-- HEADER -->
          <tr>
            <td style="
              background: linear-gradient(135deg, #0f2027, #203a43, #2c5364);
              border-radius: 16px 16px 0 0;
              padding: 36px 32px 28px;
              text-align: center;
            ">
              <div style="font-size:40px; margin-bottom:8px;">💼</div>
              <h1 style="
                color: #f1f5f9;
                font-size: 26px;
                font-weight: 800;
                margin: 0 0 8px;
                letter-spacing: -0.3px;
              ">Naukri Daily Job Alert</h1>
              <p style="color:#94a3b8; font-size:14px; margin:0;">
                📅 ${today} &nbsp;·&nbsp; ⏰ 9:00 AM IST
              </p>
              <div style="
                margin: 20px auto 0;
                background: rgba(56,189,248,0.15);
                border: 1px solid #38bdf8;
                border-radius: 30px;
                display: inline-block;
                padding: 8px 24px;
                color: #38bdf8;
                font-size: 15px;
                font-weight: 600;
              ">🎯 Top ${jobCount} Fresh Jobs · 0–1 Year Experience</div>
            </td>
          </tr>

          <!-- DOMAINS INFO -->
          <tr>
            <td style="background:#0f172a; padding: 16px 32px;">
              <p style="
                color: #64748b; font-size: 12px; margin: 0; text-align:center;
                letter-spacing: 0.3px;
              ">
                DOMAINS: Software Dev · Frontend · Web Dev · Python · Data Analyst · Fresher
              </p>
            </td>
          </tr>

          <!-- JOB CARDS -->
          <tr>
            <td style="background:#0f172a; padding: 24px 24px;">
              ${jobCards}
            </td>
          </tr>

          <!-- FOOTER -->
          <tr>
            <td style="
              background: #0a0f1e;
              border-radius: 0 0 16px 16px;
              padding: 24px 32px;
              text-align: center;
              border-top: 1px solid #1e293b;
            ">
              <p style="color:#475569; font-size:12px; margin:0 0 8px;">
                🤖 Sent automatically by your <strong style="color:#38bdf8;">Naukri Job AI Agent</strong>
              </p>
              <p style="color:#334155; font-size:11px; margin:0;">
                This email runs daily at 9:00 AM IST via GitHub Actions · Jobs sourced from Naukri.com
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `;
}

// Main sendMail function – called from index.js
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
    subject: `💼 ${jobs.length} Fresh Jobs for You – ${today} | Naukri Daily Alert`,
    html:    htmlContent,
  };

  console.log(`📧 Sending email to: ${process.env.RECIPIENT_EMAIL}`);
  const info = await transporter.sendMail(mailOptions);
  console.log(`✅ Email sent! Message ID: ${info.messageId}`);
}

module.exports = { sendJobEmail };
