const { buildHtmlEmail } = require('./services/mail');

const dummyJobs = [{ title: 'Test Job', company: 'Test Co', domain: 'Test', url: 'http://test.com', aiScore: { score: 90, matchReason: 'Great' } }];
const dummyInsights = { 
  topCompanies: [{ name: 'Test Co', count: 5 }],
  avgScore: 85,
  hotRoles: ['Developer'],
  platforms: { Naukri: 10, LinkedIn: 5, Indeed: 0 }
};

try {
  const html = buildHtmlEmail(dummyJobs, null, null, 'Manual', dummyInsights);
  console.log('✅ buildHtmlEmail succeeded!');
  if (html.includes('Weekly Market Intelligence')) {
    console.log('✅ Weekly Market Intelligence section found in HTML!');
  } else {
    console.error('❌ Weekly Market Intelligence section MISSING from HTML!');
  }
} catch (err) {
  console.error('❌ buildHtmlEmail failed:', err.message);
  console.error(err.stack);
}
