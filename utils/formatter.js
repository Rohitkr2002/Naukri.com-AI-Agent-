// ============================================================
// utils/formatter.js
// Cleans and formats scraped data for display in the email
// ============================================================

// Format posted time into consistent readable label
function formatPostedTime(text) {
  if (!text || text.trim() === '') return 'Recently';

  const t = text.toLowerCase().trim();

  if (t.includes('just') || t.includes('few minutes') || t.includes('now'))
    return '🟢 Just Now';
  if (t.includes('min'))
    return `🟢 ${text.trim()}`;
  if (t.includes('hour') || t.includes('hr'))
    return `🟡 ${text.trim()}`;
  if (t.includes('today'))
    return '🟡 Today';
  if (t.includes('1 day') || t.includes('yesterday') || t === '1 day ago')
    return '🟠 1 Day Ago';
  if (t.includes('day'))
    return `🟠 ${text.trim()}`;
  if (t.includes('week'))
    return `🔴 ${text.trim()}`;

  return text.trim();
}

// Format salary – return cleaned text or default
function formatSalary(text) {
  if (!text || text.trim() === '' || text.toLowerCase().includes('not')) {
    return 'Not Disclosed';
  }
  return text.trim();
}

// Truncate long text with ellipsis
function truncate(text, maxLen = 60) {
  if (!text) return '';
  return text.length > maxLen ? text.slice(0, maxLen) + '…' : text;
}

module.exports = { formatPostedTime, formatSalary, truncate };
