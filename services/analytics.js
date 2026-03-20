/**
 * analytics.js
 * Generates market intelligence and trend reports from job history.
 */

function generateWeeklyInsights(history) {
  if (!history || history.length === 0) return null;

  // Filter history for the last 7 days
  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

  const recentHistory = history.filter(item => {
    if (typeof item === 'string') return false; // Skip old string history
    return new Date(item.timestamp) > sevenDaysAgo;
  });

  if (recentHistory.length === 0) return null;

  // 1. Top Hiring Companies
  const companyCounts = {};
  recentHistory.forEach(j => {
    companyCounts[j.company] = (companyCounts[j.company] || 0) + 1;
  });
  const topCompanies = Object.entries(companyCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([name, count]) => ({ name, count }));

  // 2. Market Trend (Avg Score)
  const totalScore = recentHistory.reduce((sum, j) => sum + (j.score || 0), 0);
  const avgScore = Math.round(totalScore / recentHistory.length);

  // 3. Hot Skills / Roles Analysis
  const roleCounts = {};
  recentHistory.forEach(j => {
    const role = (j.title || '').split(' ').slice(0, 2).join(' '); // Simple keyword extraction
    roleCounts[role] = (roleCounts[role] || 0) + 1;
  });
  const hotRoles = Object.entries(roleCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3)
    .map(([name]) => name);

  // 4. Platform Distribution
  const platforms = {
    Naukri: recentHistory.filter(j => j.source === 'Naukri').length,
    LinkedIn: recentHistory.filter(j => j.source === 'LinkedIn').length,
    Indeed: recentHistory.filter(j => j.source === 'Indeed').length
  };

  return {
    period: 'Last 7 Days',
    totalJobsAnalyzed: recentHistory.length,
    topCompanies,
    avgScore,
    hotRoles,
    platforms
  };
}

module.exports = { generateWeeklyInsights };
