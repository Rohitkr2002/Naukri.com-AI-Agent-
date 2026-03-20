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

// ─── Cyber-Pro Theme Tokens (HSL) ───────────────────────────────────────────
const THEME = {
  bg: '#020617', // Deeper slate-950 for better contrast
  glass: 'rgba(255, 255, 255, 0.04)',
  border: 'rgba(255, 255, 255, 0.12)',
  text: { main: '#f8fafc', dim: '#cbd5e1', muted: '#64748b' },
  accent: '#38bdf8', // Sky-400
  glow: '0 0 20px rgba(56, 189, 248, 0.4)',
};

const CITY_THEME = {
  'Bangalore': { accent: '#fb923c', glow: 'rgba(251, 146, 60, 0.3)', emoji: '🏙️' }, // Orange-400
  'Delhi': { accent: '#f87171', glow: 'rgba(248, 113, 113, 0.3)', emoji: '🕌' }, // Red-400
  'Pune': { accent: '#c084fc', glow: 'rgba(192, 132, 252, 0.3)', emoji: '🏯' }, // Purple-400
  'Kolkata': { accent: '#2dd4bf', glow: 'rgba(45, 212, 191, 0.3)', emoji: '🌉' }, // Teal-400
};

function getScoreStyle(score) {
  if (score >= 85) return { color: '#4ade80', bg: 'rgba(74, 222, 128, 0.1)', glow: 'rgba(74, 222, 128, 0.3)' };
  if (score >= 70) return { color: '#60a5fa', bg: 'rgba(96, 165, 250, 0.1)', glow: 'rgba(96, 165, 250, 0.3)' };
  if (score >= 50) return { color: '#fb923c', bg: 'rgba(251, 146, 60, 0.1)', glow: 'rgba(251, 146, 60, 0.3)' };
  return { color: '#f87171', bg: 'rgba(248, 113, 113, 0.1)', glow: 'rgba(248, 113, 113, 0.3)' };
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

// ─── Render one job card ───────────────────────────────────────────────────────
function renderJobCard(job, index, cityTheme) {
  const accentColor = cityTheme.accent;
  const score = job.aiScore?.score || 0;
  const scoreStyle = getScoreStyle(score);
  const isTopJob = index === 0;

  // AI Match Progress Bar (Premium Redesign)
  const meterWidth = Math.max(10, score);
  const matchMeter = `
    <table width="100%" cellpadding="0" cellspacing="0" style="margin-top: 16px; margin-bottom: 4px;">
      <tr>
        <td style="padding-bottom: 8px;">
          <span style="color: ${scoreStyle.color}; font-size: 11px; font-weight: 900; font-family: 'Outfit', sans-serif; letter-spacing: 1px;">AI MATCH CONFIDENCE: ${score}%</span>
        </td>
      </tr>
      <tr>
        <td>
          <div style="background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.08); border-radius: 20px; height: 8px; overflow: hidden; position: relative;">
            <div style="width: ${meterWidth}%; height: 100%; background: linear-gradient(90deg, ${scoreStyle.color}88, ${scoreStyle.color}); box-shadow: 0 0 15px ${scoreStyle.glow}; border-radius: 20px;"></div>
          </div>
        </td>
      </tr>
    </table>`;

  return `
  <!-- JOB CARD: ${job.title} -->
  <div style="
    background: ${THEME.glass};
    border: 1px solid ${isTopJob ? accentColor + '66' : THEME.border};
    border-radius: 24px;
    padding: 28px;
    margin-bottom: 24px;
    position: relative;
    box-shadow: ${isTopJob ? '0 15px 40px ' + cityTheme.glow : 'none'};
  ">
    ${isTopJob ? `<div style="position: absolute; top: -14px; right: 28px; background: linear-gradient(135deg, ${accentColor}, #818cf8); color: #000; font-size: 10px; font-weight: 900; padding: 6px 16px; border-radius: 30px; box-shadow: 0 5px 15px ${cityTheme.glow}; letter-spacing: 1.5px; border: 2px solid ${THEME.bg};">PREMIUM MATCH</div>` : ''}

    <table width="100%" cellpadding="0" cellspacing="0">
      <tr>
        <td style="vertical-align: top;">
          <!-- Badge Row -->
          <div style="margin-bottom: 16px;">
            <span style="background: ${accentColor}10; color: ${accentColor}; font-size: 10px; font-weight: 900; padding: 5px 14px; border-radius: 40px; border: 1px solid ${accentColor}30; text-transform: uppercase; letter-spacing: 1.5px;">#${index + 1} ${job.domain}</span>
            <span style="color: ${THEME.text.muted}; font-size: 11px; margin-left: 12px; font-weight: 700;">• ${job.posted || 'Recently'}</span>
          </div>

          <!-- Title -->
          <a href="${job.url}" target="_blank" style="color: ${THEME.text.main}; font-size: 22px; font-weight: 900; text-decoration: none; display: block; margin-bottom: 8px; line-height: 1.2; font-family: 'Outfit', sans-serif; letter-spacing: -0.5px;">${trunc(job.title, 75)}</a>

          <!-- Company -->
          <div style="color: ${THEME.text.dim}; font-size: 15px; margin-bottom: 20px; font-weight: 600; display: flex; align-items: center;">
            <span style="opacity: 0.7; margin-right: 6px;">🏢</span> ${trunc(job.company, 50)}
          </div>

          <!-- Info Pill Cloud -->
          <div style="margin-bottom: 20px;">
            <span style="background: rgba(56, 189, 248, 0.1); color: #7dd3fc; padding: 7px 16px; border-radius: 14px; font-size: 11px; font-weight: 800; margin-right: 8px; border: 1px solid rgba(56, 189, 248, 0.2);">💼 ${job.exp || '0-1 yr'}</span>
            <span style="background: rgba(34, 197, 94, 0.1); color: #86efac; padding: 7px 16px; border-radius: 14px; font-size: 11px; font-weight: 800; margin-right: 8px; border: 1px solid rgba(34, 197, 94, 0.2);">📍 ${job.location || 'India'}</span>
            <span style="background: rgba(168, 85, 247, 0.1); color: #d8b4fe; padding: 7px 16px; border-radius: 14px; font-size: 11px; font-weight: 800; border: 1px solid rgba(168, 85, 247, 0.2);">💰 ${fmtSalary(job.salary)}</span>
          </div>

          ${matchMeter}

          ${job.aiScore?.matchReason ? `
            <div style="margin-top: 20px; padding: 16px; background: rgba(255,255,255,0.02); border-radius: 16px; border-left: 4px solid ${scoreStyle.color};">
              <p style="color: ${scoreStyle.color}; font-size: 13px; margin: 0; line-height: 1.6; font-style: italic; font-weight: 500;">
                " ${job.aiScore.matchReason} "
              </p>
            </div>` : ''}
        </td>
      </tr>
      <tr>
        <td style="padding-top: 28px;">
           <a href="${job.url}" target="_blank" style="display: block; width: 100%; text-align: center; background: linear-gradient(135deg, ${accentColor}, #6366f1); color: #fff; font-size: 14px; font-weight: 900; padding: 18px; border-radius: 16px; text-decoration: none; letter-spacing: 1.5px; box-shadow: 0 10px 25px ${cityTheme.glow}; text-transform: uppercase;">Apply to this role on Naukri →</a>
        </td>
      </tr>
    </table>
  </div>`;
}

// ─── City section header ──────────────────────────────────────────────────────
function renderCitySection(cityName, jobs) {
  const theme = CITY_THEME[cityName] || { accent: '#38bdf8', glow: 'rgba(56,189,248,0.2)', emoji: '📍' };
  const cards = jobs.map((job, i) => renderJobCard(job, i, theme)).join('');

  return `
  <!-- CITY SECTION: ${cityName} -->
  <div style="margin-top: 40px; margin-bottom: 24px;">
    <table width="100%" cellpadding="0" cellspacing="0">
      <tr>
        <td style="background: linear-gradient(90deg, ${theme.accent}22 0%, transparent 100%); border-left: 4px solid ${theme.accent}; padding: 12px 20px; border-radius: 0 12px 12px 0;">
          <span style="color: ${theme.accent}; font-size: 20px; font-weight: 900; font-family: 'Outfit', sans-serif; letter-spacing: 1px;">${theme.emoji} ${cityName.toUpperCase()}</span>
          <span style="color: ${THEME.text.muted}; font-size: 13px; font-family: 'Inter', sans-serif; margin-left: 12px; font-weight: 600;">— ${jobs.length} NEW OPPORTUNITIES</span>
        </td>
      </tr>
    </table>
  </div>
  ${cards}`;
}

// ─── Profile Boost Section ────────────────────────────────────────────────────
function renderProfileBoostSection(boostReport) {
  if (!boostReport) return '';

  const { profileScore, scoreLabel, todaysTips, todaysActions, keywordGaps } = boostReport;
  const pct = profileScore.percentage;
  const primaryDomain = Object.keys(keywordGaps)[0];
  const gaps = keywordGaps[primaryDomain] || [];

  const actionRows = todaysActions.slice(0, 5).map((action, i) => {
    const isObj = typeof action === 'object';
    const text = isObj ? action.text : action;
    const url = isObj ? action.url : null;

    return `
    <div style="padding: 14px 0; border-bottom: 1px solid ${THEME.border};">
      <table width="100%" cellpadding="0" cellspacing="0">
        <tr>
          <td width="1%" style="vertical-align: top; padding-right: 14px;">
            <div style="background: linear-gradient(135deg, ${THEME.accent}, #818cf8); color: #000; width: 22px; height: 22px; border-radius: 6px; text-align: center; line-height: 22px; font-size: 11px; font-weight: 900;">${i + 1}</div>
          </td>
          <td style="color: ${THEME.text.dim}; font-size: 14px; font-family: 'Inter', sans-serif; font-weight: 500;">
            ${text}
            ${url ? `<br/><a href="${url}" target="_blank" style="color: ${THEME.accent}; font-size: 12px; text-decoration: none; font-weight: 700; margin-top: 6px; display: inline-block;">Complete Task →</a>` : ''}
          </td>
        </tr>
      </table>
    </div>`;
  }).join('');

  const gapTags = gaps.slice(0, 8).map((g) =>
    `<span style="background: rgba(248,113,113,0.08); color: #f87171; border: 1px solid rgba(248,113,113,0.2); font-size: 11px; font-weight: 800; padding: 5px 12px; border-radius: 10px; margin: 4px; display: inline-block; letter-spacing: 0.5px;">+ ${g}</span>`
  ).join('');

  return `
  <!-- PROFILE BOOST SECTION -->
  <div style="background: ${THEME.glass}; border: 1px solid ${THEME.border}; border-radius: 24px; padding: 28px; margin-bottom: 24px; position: relative; overflow: hidden;">
    <div style="position: absolute; top: 0; left: 0; width: 4px; height: 100%; background: linear-gradient(to bottom, ${THEME.accent}, #6366f1);"></div>
    
    <div style="margin-bottom: 24px; border-bottom: 1px solid ${THEME.border}; padding-bottom: 18px;">
      <span style="color: ${THEME.accent}; font-size: 18px; font-weight: 900; font-family: 'Outfit', sans-serif; letter-spacing: 0.5px; text-transform: uppercase;">🚀 Profile Accelerator</span>
      <span style="float: right; color: ${THEME.text.muted}; font-size: 10px; font-weight: 900; border: 1px solid ${THEME.text.muted}; padding: 3px 10px; border-radius: 6px; letter-spacing: 1px;">STRATEGY ENGINE</span>
    </div>

    <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom: 28px;">
      <tr>
        <td width="55%">
          <div style="color: ${scoreLabel.color}; font-size: 44px; font-weight: 900; font-family: 'Outfit', sans-serif; line-height: 1;">${pct}%</div>
          <div style="color: ${THEME.text.muted}; font-size: 11px; letter-spacing: 1.5px; font-weight: 800; margin-top: 4px;">STRENGTH: ${scoreLabel.label.toUpperCase()}</div>
        </td>
        <td style="text-align: right;">
           <div style="background: ${scoreLabel.color}08; border: 1px solid ${scoreLabel.color}20; padding: 14px; border-radius: 16px; display: inline-block; text-align: left; max-width: 200px;">
             <div style="color: ${scoreLabel.color}; font-size: 12px; font-weight: 900; margin-bottom: 4px; letter-spacing: 0.5px;">${scoreLabel.emoji} EXPERT TIP:</div>
             <div style="color: ${THEME.text.dim}; font-size: 12px; line-height: 1.4; font-weight: 500;">${todaysTips[0]}</div>
           </div>
        </td>
      </tr>
    </table>

    <div style="margin-bottom: 24px;">
      <div style="color: ${THEME.text.muted}; font-size: 10px; font-weight: 900; letter-spacing: 1.5px; margin-bottom: 14px; text-transform: uppercase;">🔥 PRIORITY ACTIONS</div>
      ${actionRows}
    </div>

    ${gaps.length > 0 ? `
    <div>
      <div style="color: ${THEME.text.muted}; font-size: 10px; font-weight: 900; letter-spacing: 1.5px; margin-bottom: 12px; text-transform: uppercase;">🔍 TARGET KEYWORDS (${primaryDomain})</div>
      <div style="margin-left: -4px;">${gapTags}</div>
    </div>` : ''}
  </div>`;
}

// ─── AI Score Summary Section ─────────────────────────────────────────────────
function renderAIScoreSummary(jobs, skillGapSummary) {
  if (!jobs[0]?.aiScore) return '';

  const topJob = jobs[0];
  const hasGemini = topJob.aiScore.source === 'gemini';
  const highMatch = jobs.filter((j) => j.aiScore?.score >= 70).length;
  const avgScore = Math.round(jobs.reduce((s, j) => s + (j.aiScore?.score || 0), 0) / jobs.length);

  const gapRows = (skillGapSummary || []).slice(0, 3).map((item) => `
    <div style="padding: 12px 0; border-bottom: 1px solid ${THEME.border};">
      <table width="100%" cellpadding="0" cellspacing="0">
        <tr>
          <td><span style="background: rgba(248,113,113,0.1); color: #f87171; font-size: 11px; font-weight: 800; padding: 3px 10px; border-radius: 8px; border: 1px solid rgba(248,113,113,0.2);">${item.skill}</span></td>
          <td align="right"><span style="color: ${THEME.text.muted}; font-size: 11px; font-weight: 700;">${item.count} JOBS</span></td>
        </tr>
        <tr><td colspan="2" style="color: ${THEME.text.dim}; font-size: 12px; padding-top: 8px; font-family: 'Inter', sans-serif; font-weight: 500;">📚 <span style="color: ${THEME.accent};">Rec:</span> ${item.resource}</td></tr>
      </table>
    </div>`).join('');

  return `
  <!-- AI MATCH ANALYSIS SECTION -->
  <div style="background: ${THEME.glass}; border: 1px solid ${THEME.border}; border-radius: 24px; padding: 28px; margin-bottom: 24px;">
    <div style="margin-bottom: 24px; border-bottom: 1px solid ${THEME.border}; padding-bottom: 18px;">
      <span style="color: #a78bfa; font-size: 18px; font-weight: 900; font-family: 'Outfit', sans-serif; letter-spacing: 0.5px; text-transform: uppercase;">🤖 Intelligence Report</span>
      <span style="float: right; color: ${THEME.text.muted}; font-size: 10px; font-weight: 900; border: 1px solid ${THEME.text.muted}; padding: 3px 10px; border-radius: 6px; letter-spacing: 1px;">${hasGemini ? 'GEMINI FLASH 2.5' : 'CORE ENGINE'}</span>
    </div>

    <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom: 28px;">
      <tr>
        <td width="33%" align="center">
          <div style="color: #4ade80; font-size: 28px; font-weight: 900; font-family: 'Outfit', sans-serif;">${topJob.aiScore.score}%</div>
          <div style="color: ${THEME.text.muted}; font-size: 9px; font-weight: 900; letter-spacing: 1px; margin-top: 4px;">PEAK MATCH</div>
        </td>
        <td width="33%" align="center" style="border-left: 1px solid ${THEME.border}; border-right: 1px solid ${THEME.border};">
          <div style="color: #60a5fa; font-size: 28px; font-weight: 900; font-family: 'Outfit', sans-serif;">${avgScore}%</div>
          <div style="color: ${THEME.text.muted}; font-size: 9px; font-weight: 900; letter-spacing: 1px; margin-top: 4px;">AVG RELEVANCE</div>
        </td>
        <td width="33%" align="center">
          <div style="color: #fb923c; font-size: 28px; font-weight: 900; font-family: 'Outfit', sans-serif;">${highMatch}</div>
          <div style="color: ${THEME.text.muted}; font-size: 9px; font-weight: 900; letter-spacing: 1px; margin-top: 4px;">ELITE ROLES</div>
        </td>
      </tr>
    </table>

    ${gapRows ? `<div><div style="color: ${THEME.text.muted}; font-size: 10px; font-weight: 900; letter-spacing: 1.5px; margin-bottom: 10px; text-transform: uppercase;">📚 KNOWLEDGE OPTIMIZATION</div>${gapRows}</div>` : ''}
  </div>`;
}

// ─── Resume & Cover Letter Section ────────────────────────────────────────────
function renderResumeSection(jobs) {
  const topJob = jobs.find((j) => j.coverLetterPreview) || jobs[0];
  if (!topJob || !topJob.resumeMatch) return '';

  const { resumeMatch, coverLetterPreview } = topJob;
  const swCount = jobs.filter((j) => j.resumeMatch?.domainType === 'software').length;
  const dataCount = jobs.filter((j) => j.resumeMatch?.domainType === 'data').length;

  return `
  <!-- RESUME ANALYSIS SECTION -->
  <div style="background: ${THEME.glass}; border: 1px solid ${THEME.border}; border-radius: 24px; padding: 28px; margin-bottom: 24px;">
    <div style="margin-bottom: 24px; border-bottom: 1px solid ${THEME.border}; padding-bottom: 18px;">
      <span style="color: #4ade80; font-size: 18px; font-weight: 900; font-family: 'Outfit', sans-serif; letter-spacing: 0.5px; text-transform: uppercase;">📄 Semantic Matching</span>
      <span style="float: right; color: ${THEME.text.muted}; font-size: 10px; font-weight: 900; border: 1px solid ${THEME.text.muted}; padding: 3px 10px; border-radius: 6px; letter-spacing: 1px;">RESUME V2.0</span>
    </div>

    <div style="margin-bottom: 28px;">
      <div style="color: ${THEME.text.muted}; font-size: 10px; font-weight: 900; letter-spacing: 1.5px; margin-bottom: 14px; text-transform: uppercase;">📈 Portfolio Alignment</div>
      <table cellpadding="0" cellspacing="0">
        <tr>
          <td style="padding-right:14px;"><span style="background: rgba(30, 58, 95, 0.2); color: #93c5fd; font-size: 11px; font-weight: 800; padding: 7px 16px; border-radius: 12px; border: 1px solid rgba(147, 197, 253, 0.2);">💻 Software Roles: ${swCount}</span></td>
          <td><span style="background: rgba(31, 45, 62, 0.2); color: #7dd3fc; font-size: 11px; font-weight: 800; padding: 7px 16px; border-radius: 12px; border: 1px solid rgba(125, 211, 252, 0.2);">📊 Data Roles: ${dataCount}</span></td>
        </tr>
      </table>
    </div>

    ${coverLetterPreview ? `
    <div>
      <div style="color: ${THEME.text.muted}; font-size: 10px; font-weight: 900; letter-spacing: 1.5px; margin-bottom: 14px; text-transform: uppercase;">✉️ Cover Letter Draft (Snippet)</div>
      <div style="background: #020617; border-left: 4px solid #4ade80; padding: 20px; border-radius: 16px; color: ${THEME.text.dim}; font-size: 13px; font-family: 'Inter', sans-serif; line-height: 1.8; font-weight: 500; border: 1px solid ${THEME.border};">
        ${coverLetterPreview.replace(/\n/g, '<br/>').slice(0, 600)}...
      </div>
    </div>` : ''}
  </div>`;
}

// ─── Build full HTML email ─────────────────────────────────────────────────────
function buildHtmlEmail(jobs, boostReport, skillGapSummary, runMode = 'Manual') {
  const isScheduled = runMode === 'Scheduled';
  const hasJobs = jobs.length > 0;
  const today = new Date().toLocaleDateString('en-IN', {
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
    timeZone: 'Asia/Kolkata',
  });

  // Theme Constants (Safe)
  const colors = {
    bg: '#020617',
    card: '#0f172a',
    border: '#1e293b',
    text: '#f8fafc',
    muted: '#94a3b8',
    blue: '#38bdf8',
    purple: '#a78bfa',
    green: '#4ade80',
    orange: '#fb923c'
  };

  // ─── Helper: Render Job Card ───────────────────────────────────────────────
  const renderCard = (job, index) => {
    const score = job.aiScore?.score || 0;
    const scoreColor = score >= 85 ? colors.green : (score >= 70 ? colors.blue : colors.orange);
    const domainLabel = job.domain.toUpperCase();
    const source = job.source || 'Naukri';
    const sourceColor = source === 'LinkedIn' ? '#0077B5' : (source === 'Indeed' ? '#2164f3' : colors.blue);

    return `
      <tr>
        <td style="padding-bottom: 24px;">
          <table width="100%" cellpadding="0" cellspacing="0" style="background: ${colors.card}; border: 1px solid ${colors.border}; border-radius: 16px; overflow: hidden;">
            <tr>
              <td style="padding: 24px;">
                <!-- Tag & Posted -->
                <table width="100%" cellpadding="0" cellspacing="0">
                  <tr>
                    <td>
                      <span style="background:rgba(56,189,248,0.1); color:${colors.blue}; font-size: 10px; font-weight: 800; padding: 4px 10px; border-radius: 4px; border: 1px solid rgba(56,189,248,0.2); letter-spacing: 1px;">#${index + 1} ${domainLabel}</span>
                      <span style="background:${sourceColor}22; color:${sourceColor}; font-size: 10px; font-weight: 900; padding: 4px 10px; border-radius: 4px; border: 1px solid ${sourceColor}44; letter-spacing: 1px; margin-left:8px;">${source.toUpperCase()}</span>
                    </td>
                    <td align="right" style="color:${colors.muted}; font-size: 11px; font-weight: 600;">
                      ${job.posted || 'Recently'}
                    </td>
                  </tr>
                </table>

                <!-- Title -->
                <div style="margin-top: 16px;">
                  <a href="${job.url}" target="_blank" style="color: ${colors.text}; font-size: 20px; font-weight: 800; text-decoration: none; font-family: 'Segoe UI', Roboto, Helvetica, sans-serif;">${job.title}</a>
                </div>

                <!-- Company -->
                <div style="margin-top: 4px; color: ${colors.blue}; font-size: 14px; font-weight: 700;">
                  ${job.company}
                </div>

                <!-- Labels -->
                <div style="margin-top: 16px;">
                  <table cellpadding="0" cellspacing="0">
                    <tr>
                      <td style="background: #1e293b; color: #cbd5e1; font-size: 11px; font-weight: 700; padding: 6px 12px; border-radius: 8px; border: 1px solid #334155;">📍 ${job.location || 'India'}</td>
                      <td width="8"></td>
                      <td style="background: #1e293b; color: #cbd5e1; font-size: 11px; font-weight: 700; padding: 6px 12px; border-radius: 8px; border: 1px solid #334155;">💼 ${job.exp || '0-1 Yr'}</td>
                    </tr>
                  </table>
                </div>

                <!-- Match Progress -->
                <div style="margin-top: 20px;">
                  <table width="100%" cellpadding="0" cellspacing="0">
                    <tr>
                      <td style="padding-bottom: 6px;">
                        <span style="color: ${scoreColor}; font-size: 11px; font-weight: 900; letter-spacing: 1px;">AI MATCH: ${score}%</span>
                      </td>
                    </tr>
                    <tr>
                      <td>
                        <div style="background: #1e293b; border-radius: 10px; height: 6px; overflow: hidden;">
                          <div style="width: ${score}%; height: 100%; background: ${scoreColor}; border-radius: 10px;"></div>
                        </div>
                      </td>
                    </tr>
                  </table>
                </div>

                <!-- Insight -->
                ${job.aiScore?.matchReason ? `
                <div style="margin-top: 20px; padding: 16px; background: rgba(248,250,252,0.03); border-radius: 12px; border-left: 3px solid ${scoreColor};">
                  <p style="margin:0; color: #94a3b8; font-size: 13px; font-style: italic; line-height: 1.5;">"${job.aiScore.matchReason}"</p>
                </div>` : ''}

                <!-- Button -->
                <div style="margin-top: 24px;">
                  <a href="${job.url}" target="_blank" style="display: block; width: 100%; text-align: center; background: ${colors.blue}; color: #020617; font-size: 13px; font-weight: 800; padding: 14px 0; border-radius: 10px; text-decoration: none; text-transform: uppercase; letter-spacing: 1px;">View Job Details →</a>
                </div>
              </td>
            </tr>
          </table>
        </td>
      </tr>`;
  };

  // ─── Jobs Render ───────────────────────────────────────────────────────────
  let jobItems = '';
  jobs.slice(0, 50).forEach((job, index) => {
    jobItems += renderCard(job, index);
  });

  return `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Naukri AI Alert</title>
</head>
<body style="margin: 0; padding: 0; background-color: ${colors.bg}; font-family: 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color: ${colors.bg};">
    <tr>
      <td align="center" style="padding: 40px 15px;">
        <table width="600" cellpadding="0" cellspacing="0" style="width: 100%; max-width: 600px;">
          
          <!-- HEADER -->
          <tr>
            <td style="padding: 40px 0; text-align: center; background: linear-gradient(135deg, #0f172a, #020617); border-radius: 24px 24px 0 0; border: 1px solid ${colors.border}; border-bottom: none;">
              <div style="display: inline-block; background: ${colors.blue}; color: #020617; width: 50px; height: 50px; line-height: 50px; border-radius: 12px; font-size: 24px; font-weight: 900; margin-bottom: 20px;">AI</div>
              <h1 style="margin: 0; color: #ffffff; font-size: 32px; font-weight: 900; letter-spacing: -1px;">Naukri AI Agent</h1>
              <p style="margin: 8px 0 0; color: ${colors.muted}; font-size: 14px; font-weight: 600;">Daily Intelligence Report • ${today}</p>
              <div style="margin-top: 20px;">
                <span style="background: rgba(34,197,94,0.1); color: ${colors.green}; font-size: 10px; font-weight: 800; padding: 6px 14px; border-radius: 20px; border: 1px solid rgba(34,197,94,0.2); letter-spacing: 1px; text-transform: uppercase;">● SYSTEM ACTIVE: ${jobs.length} JOBS FOUND</span>
              </div>
            </td>
          </tr>

          <!-- STATS -->
          <tr>
            <td style="background: ${colors.card}; border: 1px solid ${colors.border}; border-top: 1px solid ${colors.border};">
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td width="50%" align="center" style="padding: 20px 0; border-right: 1px solid ${colors.border};">
                    <div style="color: ${colors.text}; font-size: 22px; font-weight: 900;">${jobs.length}</div>
                    <div style="color: ${colors.muted}; font-size: 9px; font-weight: 800; letter-spacing: 1px;">TOTAL MATCHES</div>
                  </td>
                  <td width="50%" align="center" style="padding: 20px 0;">
                    <div style="color: ${colors.purple}; font-size: 22px; font-weight: 900;">${jobs[0]?.aiScore?.score || 0}%</div>
                    <div style="color: ${colors.muted}; font-size: 9px; font-weight: 800; letter-spacing: 1px;">TOP CONFIDENCE</div>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- MAIN CONTENT -->
          <tr>
            <td style="padding: 40px 30px; background: ${colors.bg}; border: 1px solid ${colors.border}; border-top: none; border-bottom: none;">
              
              <!-- PROFILE SECTION -->
              ${boostReport ? renderProfileBoostSection(boostReport) : ''}

              <!-- JOB LIST -->
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td style="padding-bottom: 20px;">
                    <span style="color: ${colors.muted}; font-size: 10px; font-weight: 800; letter-spacing: 2px; text-transform: uppercase;">Curated Elite Opportunities</span>
                  </td>
                </tr>
                ${hasJobs ? jobItems : `
                <tr>
                  <td align="center" style="padding: 60px 0;">
                    <div style="font-size: 40px; margin-bottom: 20px;">🔍</div>
                    <h3 style="color: #fff; margin:0;">No Perfect Matches Today</h3>
                    <p style="color: ${colors.muted}; font-size: 14px; margin-top: 10px;">The radar was clear. Check back tomorrow!</p>
                  </td>
                </tr>`}
              </table>
            </td>
          </tr>

          <!-- FOOTER -->
          <tr>
            <td style="padding: 40px 30px; background: #000; border: 1px solid ${colors.border}; border-top: none; border-radius: 0 0 24px 24px; text-align: center;">
              <h4 style="margin:0; color: #fff; font-size: 16px; font-weight: 900; letter-spacing: -0.5px;">Naukri AI Monitoring System</h4>
              <p style="margin: 10px 0 0; color: ${colors.muted}; font-size: 12px; line-height: 1.6;">Autonomous career intelligence for junior engineers.</p>
              <div style="margin-top: 24px; padding-top: 24px; border-top: 1px solid #1e293b;">
                <p style="margin: 0; color: ${colors.muted}; font-size: 10px; font-weight: 700; letter-spacing: 1px;">© 2026 Rohit Kumar Singh • Powered by Gemini AI</p>
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
async function sendJobEmail(jobs, boostReport, skillGapSummary, runMode = 'Manual') {
  if (!process.env.GMAIL_USER || !process.env.GMAIL_PASS) {
    throw new Error('❌ Missing GMAIL_USER or GMAIL_PASS in .env file!');
  }
  if (!process.env.RECIPIENT_EMAIL) {
    throw new Error('❌ Missing RECIPIENT_EMAIL in .env file!');
  }

  const transporter = createTransporter();
  const htmlContent = buildHtmlEmail(jobs, boostReport, skillGapSummary, runMode);
  const today = new Date().toLocaleDateString('en-IN', {
    day: '2-digit', month: 'short', year: 'numeric', timeZone: 'Asia/Kolkata',
  });

  const hasJobs = jobs.length > 0;
  const topScore = jobs[0]?.aiScore?.score;
  const scorePart = topScore ? ` | 🤖 Match: ${topScore}%` : '';
  const statusIcon = hasJobs ? '💼' : '✅';
  const statusText = hasJobs ? `${jobs.length} Fresh Jobs` : 'Daily Status: Active';

  const mailOptions = {
    from: `"Naukri AI Agent 🤖" <${process.env.GMAIL_USER}>`,
    to: process.env.RECIPIENT_EMAIL,
    subject: `${statusIcon} ${statusText} – ${today}${scorePart} [${runMode}]`,
    html: htmlContent,
  };

  console.log(`\n📧 Sending email (${runMode}) to: ${process.env.RECIPIENT_EMAIL}`);
  const info = await transporter.sendMail(mailOptions);
  console.log(`✅ Email sent! Message ID: ${info.messageId}`);
}

module.exports = { sendJobEmail, buildHtmlEmail };
