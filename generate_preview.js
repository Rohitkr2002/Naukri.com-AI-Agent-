const fs = require('fs');
const path = require('path');
const { buildHtmlEmail } = require('./services/mail');

// Mock data
const mockJobs = [
  {
    title: 'Senior Software Engineer (Full Stack)',
    company: 'Google Cloud India',
    domain: 'Software Developer',
    exp: '0-1 years',
    location: 'Bangalore, India',
    salary: '₹12L - ₹18L PA',
    url: 'https://www.naukri.com/job-listings',
    posted: '1h ago',
    city: 'Bangalore',
    aiScore: { score: 92, matchReason: 'Excellent match for your React and Node.js profile.', source: 'gemini' }
  },
  {
    title: 'Data Analyst Intern',
    company: 'Microsoft',
    domain: 'Data Analyst',
    exp: '0-1 years',
    location: 'Delhi, India',
    salary: '₹8L - ₹10L PA',
    url: 'https://www.naukri.com/job-listings',
    posted: '4h ago',
    city: 'Delhi',
    aiScore: { score: 78, matchReason: 'Good match for your SQL and Statistics skills.', source: 'gemini' }
  }
];

const mockBoost = {
  profileScore: { percentage: 89 },
  scoreLabel: { label: 'Excellent', color: '#4ade80', emoji: '🌟' },
  todaysTips: ['Update your LinkedIn URL in Naukri profile', 'Add "Next.js" to your skill set'],
  todaysActions: [
    { text: 'Apply to Google Cloud role', step: 1, url: 'https://naukri.com', btn: 'Apply Now' },
    { text: 'Update your portfolio link', step: 2 }
  ],
  keywordGaps: { 'Software Developer': ['Kubernetes', 'Redis'] }
};

const mockGaps = [
  { skill: 'Kubernetes', count: 5, resource: 'Kubernetes for Beginners – KodeKloud' },
  { skill: 'Redis', count: 3, resource: 'Redis Tutorial – The Net Ninja' }
];

console.log('🧪 Rendering Premium Email to preview.html...');
const html = buildHtmlEmail(mockJobs, mockBoost, mockGaps, 'Scheduled');
fs.writeFileSync(path.join(__dirname, 'preview.html'), html);
console.log('✅ preview.html generated successfully!');
