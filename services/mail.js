// ============================================================
// services/mail.js
// Premium HTML Email – Naukri Job Alert
// Design: Dark mode, gradient header, city-grouped cards,
//         glassmorphism effects, professional badges
// Now includes: AI Match Scores, Profile Boost Report,
//               Resume Smart Matching + Cover Letter
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

// ─── AI Score color ───────────────────────────────────────────────────────────
function getScoreColor(score) {
  if (score >= 80) return { bg: '#14532d', color: '#4ade80', label: 'Excellent' };
  if (score >= 65) return { bg: '#1e3a5f', color: '#60a5fa', label: 'Good'      };
  if (score >= 50) return { bg: '#422006', color: '#fb923c', label: 'Fair'      };
  return                  { bg: '#450a0a', color: '#f87171', label: 'Low'       };
}

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

// ─── Render one job card (with AI score badge + resume match) ─────────────────
function renderJobCard(job, index, cityColor) {
  const domainStyle = DOMAIN_COLORS[job.domain] || { bg: '#1e293b', color: '#94a3b8' };
  const salary      = fmtSalary(job.salary);
  const company     = trunc(job.company, 40);
  const title       = trunc(job.title, 60);
  const posted      = job.posted || 'Recently';
  const applyUrl    = job.url || 'https://www.naukri.com';

  // AI Score badge
  const hasScore    = job.aiScore && typeof job.aiScore.score === 'number';
  const scoreColor  = hasScore ? getScoreColor(job.aiScore.score) : null;
  const isTopJob    = index === 0;

  // Resume match badge
  const resumeLabel = job.resumeMatch?.resumeLabel || '';

  const aiBadge = hasScore ? `
    <span style="
      background: ${scoreColor.bg};
      color: ${scoreColor.color};
      font-size: 10px;
      font-weight: 800;
      padding: 3px 10px;
      border-radius: 20px;
      letter-spacing: 0.5px;
      border: 1px solid ${scoreColor.color}44;
      font-family: 'Segoe UI', Arial, sans-serif;
    ">🤖 ${job.aiScore.score}% Match</span>` : '';

  const topBadge = isTopJob ? `
    <span style="
      background: linear-gradient(135deg, #854d0e, #78350f);
      color: #fde68a;
      font-size: 10px;
      font-weight: 800;
      padding: 3px 10px;
      border-radius: 20px;
      margin-right: 4px;
      font-family: 'Segoe UI', Arial, sans-serif;
    ">🏆 TOP PICK</span>` : '';

  const resumeBadge = resumeLabel ? `
    <br/>
    <span style="
      color: #64748b;
      font-size: 10px;
      font-family: 'Segoe UI', Arial, sans-serif;
      margin-top: 4px;
      display: inline-block;
    ">${resumeLabel}</span>` : '';

  // Skill gap tip
  const skillGapTip = hasScore && job.aiScore.skillGaps?.length > 0
    ? `<p style="color:#475569; font-size:11px; margin: 8px 0 0; font-family:'Segoe UI', Arial, sans-serif; border-top: 1px solid #1e293b; padding-top: 8px;">
        💡 <strong style="color:#94a3b8;">Learn:</strong> ${job.aiScore.skillGaps.slice(0, 2).join(', ')}
       </p>`
    : '';

  return `
  <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:14px;">
    <tr>
      <td style="
        background: linear-gradient(135deg, #131c2e 0%, #1a2540 100%);
        border: 1px solid ${isTopJob ? cityColor + '66' : '#1e2d45'};
        border-left: 4px solid ${cityColor};
        border-radius: 12px;
        padding: 18px 20px;
        ${isTopJob ? 'box-shadow: 0 0 20px ' + cityColor + '22;' : ''}
      ">
        <!-- Top Row: Badges + Posted -->
        <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:10px;">
          <tr>
            <td>
              ${topBadge}
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
              ">${job.domain}</span>
              &nbsp;${aiBadge}
              ${resumeBadge}
            </td>
            <td align="right" style="vertical-align: top;">
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
              ">💰 ${fmtSalary(job.salary)}</span>
            </td>
          </tr>
        </table>

        ${skillGapTip}

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
          margin-top: 10px;
        ">Apply on Naukri →</a>

      </td>
    </tr>
  </table>`;
}

// ─── City section header ──────────────────────────────────────────────────────
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
        border-left: 5px solid ${theme.color};
        margin-bottom: 16px;
      ">
        <span style="
          color: ${theme.color};
          font-size: 18px;
          font-weight: 800;
          font-family: 'Segoe UI', Arial, sans-serif;
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

// ─── Profile Boost Section ────────────────────────────────────────────────────
function renderProfileBoostSection(boostReport) {
  if (!boostReport) return '';

  const { profileScore, scoreLabel, todaysTips, todaysActions, keywordGaps } = boostReport;

  // Progress bar
  const pct = profileScore.percentage;

  // Keyword gaps for primary domain
  const primaryDomain = Object.keys(keywordGaps)[0];
  const gaps          = keywordGaps[primaryDomain] || [];

  const tipRows = todaysTips.slice(0, 4).map((tip) => `
    <tr>
      <td style="padding: 6px 0; border-bottom: 1px solid #0f172a;">
        <span style="color:#38bdf8; font-size:12px; margin-right:6px;">✦</span>
        <span style="color:#94a3b8; font-size:12px; font-family:'Segoe UI', Arial, sans-serif; line-height:1.5;">${tip}</span>
      </td>
    </tr>`).join('');

  const actionRows = todaysActions.slice(0, 3).map((action, i) => `
    <tr>
      <td style="padding: 5px 0;">
        <span style="
          background: #1e3a5f;
          color: #7dd3fc;
          font-size: 10px;
          font-weight: 700;
          padding: 2px 8px;
          border-radius: 10px;
          margin-right: 6px;
          font-family: 'Segoe UI', Arial, sans-serif;
        ">STEP ${i + 1}</span>
        <span style="color:#94a3b8; font-size:12px; font-family:'Segoe UI', Arial, sans-serif;">${action}</span>
      </td>
    </tr>`).join('');

  const gapTags = gaps.slice(0, 6).map((g) =>
    `<span style="
      background:#1e293b;
      color:#f87171;
      font-size:10px;
      font-weight:700;
      padding:3px 10px;
      border-radius:20px;
      margin:3px 3px 3px 0;
      display:inline-block;
      font-family:'Segoe UI', Arial, sans-serif;
    ">+ ${g}</span>`
  ).join('');

  return `
  <!-- PROFILE BOOST SECTION -->
  <tr>
    <td style="padding: 0 20px 8px;">
      <table width="100%" cellpadding="0" cellspacing="0" style="
        background: linear-gradient(135deg, #0d1f3c 0%, #0a1628 100%);
        border: 1px solid #1e3a5f;
        border-radius: 16px;
        padding: 24px;
        margin-bottom: 8px;
      ">
        <!-- Header -->
        <tr>
          <td colspan="2" style="padding-bottom: 16px; border-bottom: 1px solid #1e293b;">
            <span style="
              font-size: 18px;
              font-weight: 900;
              color: #38bdf8;
              font-family: 'Segoe UI', Arial, sans-serif;
            ">🚀 Daily Profile Boost Report</span>
            <span style="
              display:inline-block;
              background:#1e3a5f;
              color:#7dd3fc;
              font-size:10px;
              font-weight:700;
              padding:2px 10px;
              border-radius:20px;
              margin-left:8px;
              font-family:'Segoe UI', Arial, sans-serif;
            ">Feature 1</span>
          </td>
        </tr>

        <!-- Completeness Score -->
        <tr>
          <td colspan="2" style="padding-top: 16px; padding-bottom: 16px;">
            <table width="100%" cellpadding="0" cellspacing="0">
              <tr>
                <td>
                  <p style="color:#64748b; font-size:11px; margin:0 0 6px; font-family:'Segoe UI', Arial, sans-serif; letter-spacing:0.5px;">PROFILE COMPLETENESS</p>
                  <!-- Progress bar -->
                  <table width="100%" cellpadding="0" cellspacing="0" style="background:#0f172a; border-radius:20px; height:10px; margin-bottom:6px;">
                    <tr>
                      <td style="
                        width: ${pct}%;
                        background: linear-gradient(90deg, #38bdf8, ${scoreLabel.color});
                        border-radius: 20px;
                        height: 10px;
                      "></td>
                    </tr>
                  </table>
                  <span style="
                    color: ${scoreLabel.color};
                    font-size: 22px;
                    font-weight: 900;
                    font-family: 'Segoe UI', Arial, sans-serif;
                  ">${pct}%</span>
                  <span style="
                    color: ${scoreLabel.color};
                    font-size: 12px;
                    font-weight: 700;
                    margin-left: 6px;
                    font-family: 'Segoe UI', Arial, sans-serif;
                  ">${scoreLabel.emoji} ${scoreLabel.label}</span>
                </td>
              </tr>
            </table>
          </td>
        </tr>

        <!-- Keyword Gaps -->
        ${gaps.length > 0 ? `
        <tr>
          <td colspan="2" style="padding-bottom:16px;">
            <p style="color:#64748b; font-size:11px; margin:0 0 8px; font-family:'Segoe UI', Arial, sans-serif; letter-spacing:0.5px;">🔍 ADD THESE TRENDING KEYWORDS (${primaryDomain})</p>
            ${gapTags}
          </td>
        </tr>` : ''}

        <!-- ATS Tips -->
        <tr>
          <td colspan="2" style="padding-bottom:16px;">
            <p style="color:#64748b; font-size:11px; margin:0 0 8px; font-family:'Segoe UI', Arial, sans-serif; letter-spacing:0.5px;">💡 TODAY'S ATS PROFILE TIPS</p>
            <table width="100%" cellpadding="0" cellspacing="0">
              ${tipRows}
            </table>
          </td>
        </tr>

        <!-- Today's Actions -->
        <tr>
          <td colspan="2">
            <p style="color:#64748b; font-size:11px; margin:0 0 8px; font-family:'Segoe UI', Arial, sans-serif; letter-spacing:0.5px;">⚡ TODAY'S PROFILE BOOST ACTIONS</p>
            <table width="100%" cellpadding="0" cellspacing="0">
              ${actionRows}
            </table>
          </td>
        </tr>

      </table>
    </td>
  </tr>`;
}

// ─── AI Score Summary Section ─────────────────────────────────────────────────
function renderAIScoreSummary(jobs, skillGapSummary) {
  if (!jobs[0]?.aiScore) return '';

  const topJob  = jobs[0];
  const hasGemini = topJob.aiScore.source === 'gemini';
  const highMatchJobs = jobs.filter((j) => j.aiScore?.score >= 70).length;
  const avgScore      = Math.round(jobs.reduce((s, j) => s + (j.aiScore?.score || 0), 0) / jobs.length);

  const gapRows = (skillGapSummary || []).slice(0, 3).map((item) => `
    <tr>
      <td style="padding: 8px 0; border-bottom: 1px solid #0f172a;">
        <table width="100%" cellpadding="0" cellspacing="0">
          <tr>
            <td>
              <span style="
                background: #450a0a;
                color: #f87171;
                font-size: 10px;
                font-weight: 700;
                padding: 2px 8px;
                border-radius: 10px;
                font-family: 'Segoe UI', Arial, sans-serif;
              ">${item.skill}</span>
            </td>
            <td align="right">
              <span style="color:#64748b; font-size:11px; font-family:'Segoe UI', Arial, sans-serif;">needed in ${item.count} jobs</span>
            </td>
          </tr>
          <tr>
            <td colspan="2">
              <span style="color:#475569; font-size:11px; font-family:'Segoe UI', Arial, sans-serif;">📚 ${item.resource}</span>
            </td>
          </tr>
        </table>
      </td>
    </tr>`).join('');

  return `
  <!-- AI SCORE SUMMARY SECTION -->
  <tr>
    <td style="padding: 0 20px 8px;">
      <table width="100%" cellpadding="0" cellspacing="0" style="
        background: linear-gradient(135deg, #0a1628 0%, #0d1f3c 100%);
        border: 1px solid #2d1f3e;
        border-radius: 16px;
        padding: 24px;
        margin-bottom: 8px;
      ">
        <!-- Header -->
        <tr>
          <td style="padding-bottom:16px; border-bottom: 1px solid #1e293b;">
            <span style="
              font-size: 18px;
              font-weight: 900;
              color: #a78bfa;
              font-family: 'Segoe UI', Arial, sans-serif;
            ">🤖 AI Job Match Analysis</span>
            <span style="
              display:inline-block;
              background:#2d1f3e;
              color:#c4b5fd;
              font-size:10px;
              font-weight:700;
              padding:2px 10px;
              border-radius:20px;
              margin-left:8px;
              font-family:'Segoe UI', Arial, sans-serif;
            ">${hasGemini ? '✨ Gemini AI' : '🔢 Heuristic'} · Feature 2</span>
          </td>
        </tr>

        <!-- Stats -->
        <tr>
          <td style="padding-top:16px; padding-bottom:16px;">
            <table width="100%" cellpadding="0" cellspacing="0">
              <tr>
                <td width="33%" align="center">
                  <div style="color:#4ade80; font-size:26px; font-weight:900; font-family:'Segoe UI', Arial, sans-serif;">${topJob.aiScore.score}%</div>
                  <div style="color:#475569; font-size:10px; letter-spacing:0.5px; font-family:'Segoe UI', Arial, sans-serif;">TOP JOB SCORE</div>
                </td>
                <td width="33%" align="center" style="border-left:1px solid #1e293b; border-right:1px solid #1e293b;">
                  <div style="color:#60a5fa; font-size:26px; font-weight:900; font-family:'Segoe UI', Arial, sans-serif;">${avgScore}%</div>
                  <div style="color:#475569; font-size:10px; letter-spacing:0.5px; font-family:'Segoe UI', Arial, sans-serif;">AVG SCORE</div>
                </td>
                <td width="33%" align="center">
                  <div style="color:#fb923c; font-size:26px; font-weight:900; font-family:'Segoe UI', Arial, sans-serif;">${highMatchJobs}</div>
                  <div style="color:#475569; font-size:10px; letter-spacing:0.5px; font-family:'Segoe UI', Arial, sans-serif;">HIGH MATCH (≥70%)</div>
                </td>
              </tr>
            </table>
          </td>
        </tr>

        <!-- Top Job Highlight -->
        <tr>
          <td style="padding-bottom:16px;">
            <p style="color:#64748b; font-size:11px; margin:0 0 8px; font-family:'Segoe UI', Arial, sans-serif; letter-spacing:0.5px;">🏆 TOP MATCHED JOB</p>
            <table width="100%" cellpadding="0" cellspacing="0" style="
              background: #14532d22;
              border: 1px solid #14532d;
              border-radius: 8px;
              padding: 12px;
            ">
              <tr>
                <td style="padding: 4px 12px;">
                  <div style="color:#f1f5f9; font-size:14px; font-weight:700; font-family:'Segoe UI', Arial, sans-serif;">${trunc(topJob.title, 50)}</div>
                  <div style="color:#94a3b8; font-size:12px; font-family:'Segoe UI', Arial, sans-serif;">🏢 ${trunc(topJob.company, 35)} · 📍 ${topJob.city || 'India'}</div>
                  ${topJob.aiScore.matchReason ? `<div style="color:#4ade80; font-size:11px; margin-top:4px; font-family:'Segoe UI', Arial, sans-serif;">✅ ${topJob.aiScore.matchReason}</div>` : ''}
                </td>
              </tr>
            </table>
          </td>
        </tr>

        <!-- Skill Gaps -->
        ${gapRows ? `
        <tr>
          <td>
            <p style="color:#64748b; font-size:11px; margin:0 0 8px; font-family:'Segoe UI', Arial, sans-serif; letter-spacing:0.5px;">📚 TOP SKILL GAPS TO CLOSE</p>
            <table width="100%" cellpadding="0" cellspacing="0">
              ${gapRows}
            </table>
          </td>
        </tr>` : ''}

      </table>
    </td>
  </tr>`;
}

// ─── Resume & Cover Letter Section ────────────────────────────────────────────
function renderResumeSection(jobs) {
  const topJob = jobs.find((j) => j.coverLetterPreview) || jobs[0];
  if (!topJob || !topJob.resumeMatch) return '';

  const { resumeMatch, coverLetterPreview } = topJob;
  const tips = (resumeMatch.tips || []).slice(0, 3);

  const tipRows = tips.map((tip) => `
    <tr>
      <td style="padding: 5px 0; border-bottom: 1px solid #0f172a;">
        <span style="color:#f59e0b; font-size:12px; margin-right:6px;">●</span>
        <span style="color:#94a3b8; font-size:12px; font-family:'Segoe UI', Arial, sans-serif;">${tip}</span>
      </td>
    </tr>`).join('');

  const coverLetterHtml = coverLetterPreview
    ? coverLetterPreview.replace(/\n/g, '<br/>').slice(0, 900) + (coverLetterPreview.length > 900 ? '...' : '')
    : '';

  // Resume distribution stats
  const swCount   = jobs.filter((j) => j.resumeMatch?.domainType === 'software').length;
  const dataCount = jobs.filter((j) => j.resumeMatch?.domainType === 'data').length;

  return `
  <!-- RESUME & COVER LETTER SECTION -->
  <tr>
    <td style="padding: 0 20px 8px;">
      <table width="100%" cellpadding="0" cellspacing="0" style="
        background: linear-gradient(135deg, #0a1a0a 0%, #0d1f0d 100%);
        border: 1px solid #14532d;
        border-radius: 16px;
        padding: 24px;
        margin-bottom: 8px;
      ">
        <!-- Header -->
        <tr>
          <td style="padding-bottom:16px; border-bottom: 1px solid #1e293b;">
            <span style="
              font-size: 18px;
              font-weight: 900;
              color: #4ade80;
              font-family: 'Segoe UI', Arial, sans-serif;
            ">📄 Resume Smart Matching</span>
            <span style="
              display:inline-block;
              background:#14532d;
              color:#4ade80;
              font-size:10px;
              font-weight:700;
              padding:2px 10px;
              border-radius:20px;
              margin-left:8px;
              font-family:'Segoe UI', Arial, sans-serif;
            ">Feature 3</span>
          </td>
        </tr>

        <!-- Resume Distribution -->
        <tr>
          <td style="padding-top:16px; padding-bottom:16px; border-bottom: 1px solid #1e293b;">
            <p style="color:#64748b; font-size:11px; margin:0 0 10px; font-family:'Segoe UI', Arial, sans-serif; letter-spacing:0.5px;">📊 RESUME ASSIGNMENT FOR TODAY'S JOBS</p>
            <table cellpadding="0" cellspacing="0">
              <tr>
                <td style="padding-right:12px;">
                  <span style="
                    background:#1e3a5f;
                    color:#93c5fd;
                    font-size:12px;
                    font-weight:700;
                    padding:6px 14px;
                    border-radius:20px;
                    font-family:'Segoe UI', Arial, sans-serif;
                  ">💻 Software Resume → ${swCount} jobs</span>
                </td>
                <td>
                  <span style="
                    background:#1f2d3e;
                    color:#7dd3fc;
                    font-size:12px;
                    font-weight:700;
                    padding:6px 14px;
                    border-radius:20px;
                    font-family:'Segoe UI', Arial, sans-serif;
                  ">📊 Data Resume → ${dataCount} jobs</span>
                </td>
              </tr>
            </table>
          </td>
        </tr>

        <!-- Resume Improvement Tips -->
        <tr>
          <td style="padding-top:16px; padding-bottom:16px; border-bottom: 1px solid #1e293b;">
            <p style="color:#64748b; font-size:11px; margin:0 0 8px; font-family:'Segoe UI', Arial, sans-serif; letter-spacing:0.5px;">🛠️ RESUME IMPROVEMENT TIPS (${resumeMatch.resumeLabel})</p>
            <table width="100%" cellpadding="0" cellspacing="0">
              ${tipRows}
            </table>
          </td>
        </tr>

        <!-- Cover Letter -->
        ${coverLetterHtml ? `
        <tr>
          <td style="padding-top:16px;">
            <p style="color:#64748b; font-size:11px; margin:0 0 10px; font-family:'Segoe UI', Arial, sans-serif; letter-spacing:0.5px;">
              ✉️ CUSTOMIZED COVER LETTER PREVIEW
              <span style="color:#475569;"> – for ${trunc(topJob.title, 35)} @ ${trunc(topJob.company, 25)}</span>
            </p>
            <div style="
              background: #0f172a;
              border-left: 3px solid #4ade80;
              border-radius: 8px;
              padding: 16px;
              color: #94a3b8;
              font-size: 12px;
              font-family: 'Segoe UI', Arial, sans-serif;
              line-height: 1.8;
            ">${coverLetterHtml}</div>
          </td>
        </tr>` : ''}

      </table>
    </td>
  </tr>`;
}

// ─── Build full HTML email ─────────────────────────────────────────────────────
function buildHtmlEmail(jobs, boostReport, skillGapSummary) {
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
  let citySections   = '';
  let totalRendered  = 0;

  const cityOrder    = ['Bangalore', 'Delhi', 'Pune', 'Kolkata'];
  const sortedCities = [
    ...cityOrder.filter((c) => byCity[c]),
    ...Object.keys(byCity).filter((c) => !cityOrder.includes(c)),
  ];

  sortedCities.forEach((city) => {
    if (byCity[city] && byCity[city].length > 0) {
      citySections  += renderCitySection(city, byCity[city]);
      totalRendered += byCity[city].length;
    }
  });

  // Stats bar
  const cityCount  = Object.keys(byCity).length;
  const domainSet  = [...new Set(jobs.map((j) => j.domain))];
  const topScore   = jobs[0]?.aiScore?.score;
  const hasAI      = !!topScore;

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
    <table width="660" cellpadding="0" cellspacing="0" style="max-width:660px; width:100%;">

      <!-- ═══════════════ HEADER ═══════════════ -->
      <tr>
        <td style="
          background: linear-gradient(135deg, #0d1f3c 0%, #1a2e52 40%, #0d2137 100%);
          border-radius: 20px 20px 0 0;
          padding: 40px 32px 32px;
          text-align: center;
          border-bottom: 2px solid #1e3a5f;
        ">
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

          <h1 style="
            color: #f8fafc;
            font-size: 28px;
            font-weight: 900;
            margin: 0 0 6px;
            letter-spacing: -0.5px;
          ">Naukri Job Alert</h1>
          <p style="color: #94a3b8; font-size: 13px; margin: 0 0 20px;">
            📅 ${today} &nbsp;·&nbsp; ⏰ 9:00 AM IST
          </p>

          <div style="
            display: inline-block;
            background: linear-gradient(135deg, rgba(56,189,248,0.15), rgba(129,140,248,0.15));
            border: 1px solid rgba(56,189,248,0.4);
            border-radius: 50px;
            padding: 10px 28px;
            color: #7dd3fc;
            font-size: 14px;
            font-weight: 700;
          ">🎯 Top ${totalRendered} Fresh Jobs · 0–1 Year Experience</div>
        </td>
      </tr>

      <!-- ═══════════════ STATS BAR ═══════════════ -->
      <tr>
        <td style="background: #0d1526; padding: 0;">
          <table width="100%" cellpadding="0" cellspacing="0">
            <tr>
              <td width="25%" align="center" style="padding: 16px 6px; border-right: 1px solid #1e293b;">
                <div style="color:#38bdf8; font-size:20px; font-weight:900;">${totalRendered}</div>
                <div style="color:#475569; font-size:10px; letter-spacing:0.5px; margin-top:3px;">TOTAL JOBS</div>
              </td>
              <td width="25%" align="center" style="padding: 16px 6px; border-right: 1px solid #1e293b;">
                <div style="color:#a78bfa; font-size:20px; font-weight:900;">${cityCount}</div>
                <div style="color:#475569; font-size:10px; letter-spacing:0.5px; margin-top:3px;">CITIES</div>
              </td>
              <td width="25%" align="center" style="padding: 16px 6px; border-right: 1px solid #1e293b;">
                <div style="color:#34d399; font-size:20px; font-weight:900;">${domainSet.length}</div>
                <div style="color:#475569; font-size:10px; letter-spacing:0.5px; margin-top:3px;">DOMAINS</div>
              </td>
              <td width="25%" align="center" style="padding: 16px 6px;">
                <div style="color:#fb923c; font-size:20px; font-weight:900;">${hasAI ? topScore + '%' : 'ON'}</div>
                <div style="color:#475569; font-size:10px; letter-spacing:0.5px; margin-top:3px;">${hasAI ? 'TOP AI SCORE' : 'AI SCORING'}</div>
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
                    font-family: 'Segoe UI', Arial, sans-serif;
                  ">${c}</span>
                </td>`;
              }).join('')}
            </tr>
          </table>
        </td>
      </tr>

      <!-- ═══════════════ PROFILE BOOST REPORT ═══════════════ -->
      <tr>
        <td style="background: #0a1120; padding: 20px 0 0;">
          <table width="100%" cellpadding="0" cellspacing="0">
            ${renderProfileBoostSection(boostReport)}
          </table>
        </td>
      </tr>

      <!-- ═══════════════ AI JOB SCORE SUMMARY ═══════════════ -->
      <tr>
        <td style="background: #0a1120; padding: 0;">
          <table width="100%" cellpadding="0" cellspacing="0">
            ${renderAIScoreSummary(jobs, skillGapSummary)}
          </table>
        </td>
      </tr>

      <!-- ═══════════════ RESUME SECTION ═══════════════ -->
      <tr>
        <td style="background: #0a1120; padding: 0;">
          <table width="100%" cellpadding="0" cellspacing="0">
            ${renderResumeSection(jobs)}
          </table>
        </td>
      </tr>

      <!-- ═══════════════ SECTION DIVIDER ═══════════════ -->
      <tr>
        <td style="background: #0a1120; padding: 8px 20px 16px;">
          <table width="100%" cellpadding="0" cellspacing="0">
            <tr>
              <td style="border-top: 1px solid #1e293b; padding-top: 16px;">
                <span style="color:#475569; font-size:13px; font-weight:700; letter-spacing:0.5px; font-family:'Segoe UI', Arial, sans-serif;">
                  💼 TODAY'S JOB LISTINGS
                </span>
              </td>
            </tr>
          </table>
        </td>
      </tr>

      <!-- ═══════════════ JOB CARDS ═══════════════ -->
      <tr>
        <td style="background: #0a1120; padding: 0 20px 24px;">
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
            Features: Profile Boost 🚀 · AI Scoring 🤖 · Resume Matcher 📄<br/>
            Built with Node.js · Puppeteer · Gemini AI · Nodemailer
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
async function sendJobEmail(jobs, boostReport, skillGapSummary) {
  if (!process.env.GMAIL_USER || !process.env.GMAIL_PASS) {
    throw new Error('❌ Missing GMAIL_USER or GMAIL_PASS in .env file!');
  }
  if (!process.env.RECIPIENT_EMAIL) {
    throw new Error('❌ Missing RECIPIENT_EMAIL in .env file!');
  }

  const transporter = createTransporter();
  const htmlContent = buildHtmlEmail(jobs, boostReport, skillGapSummary);
  const today       = new Date().toLocaleDateString('en-IN', {
    day: '2-digit', month: 'short', year: 'numeric', timeZone: 'Asia/Kolkata',
  });

  const topScore    = jobs[0]?.aiScore?.score;
  const scorePart   = topScore ? ` | 🤖 Top Match: ${topScore}%` : '';

  const mailOptions = {
    from:    `"Naukri AI Agent 🤖" <${process.env.GMAIL_USER}>`,
    to:      process.env.RECIPIENT_EMAIL,
    subject: `💼 ${jobs.length} Fresh Jobs – ${today}${scorePart} | Bangalore · Delhi · Pune · Kolkata`,
    html:    htmlContent,
  };

  console.log(`\n📧 Sending email to: ${process.env.RECIPIENT_EMAIL}`);
  const info = await transporter.sendMail(mailOptions);
  console.log(`✅ Email sent! Message ID: ${info.messageId}`);
}

module.exports = { sendJobEmail };
