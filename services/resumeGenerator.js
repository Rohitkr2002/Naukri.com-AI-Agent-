// ============================================================
// services/resumeGenerator.js
// Feature 2 – Dynamic AI Resume Generator
// Uses Gemini to tailor content & pdfkit to generate PDFs
// ============================================================

const PDFDocument = require('pdfkit');
const fs = require('fs');
const path = require('path');
const https = require('https');

const RESUME_DIR = path.join(__dirname, '../dashboard/public/resumes');

/**
 * Call Gemini to tailor resume content for a specific job
 */
async function tailorResumeContent(job, baseResume) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) return null;

    const prompt = `Tailor this resume for the following job. 
Return a JSON object with: 
1. "tailoredSummary": A 3-4 line professional summary optimized with JD keywords.
2. "optimizedExperience": An array of strings (bullet points) for the "Web Development Intern" role, using action verbs and JD keywords.
3. "topSkills": A list of top 10 technical skills relevant to this specific job.

JOB: ${job.title} at ${job.company}
JD: ${job.domain} role, targeting ${job.city}.

BASE RESUME:
${baseResume}

Output ONLY JSON.`;

    const body = JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: { temperature: 0.2, maxOutputTokens: 2048 },
    });

    return new Promise((resolve) => {
        const url = `https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash:generateContent?key=${apiKey}`;
        const req = https.request(url, { method: 'POST', headers: { 'Content-Type': 'application/json' } }, (res) => {
            let data = '';
            res.on('data', (c) => data += c);
            res.on('end', () => {
                try {
                    const parsed = JSON.parse(data);
                    const text = parsed?.candidates?.[0]?.content?.parts?.[0]?.text || '';
                    const jsonMatch = text.match(/\{[\s\S]*\}/);
                    resolve(jsonMatch ? JSON.parse(jsonMatch[0]) : null);
                } catch (e) { resolve(null); }
            });
        });
        req.on('error', () => resolve(null));
        req.write(body);
        req.end();
    });
}

/**
 * Generate a professional PDF resume
 */
async function generatePDFResume(job, tailoredData, baseResume) {
    if (!fs.existsSync(RESUME_DIR)) fs.mkdirSync(RESUME_DIR, { recursive: true });

    const fileName = `Resume_${job.company.replace(/\s+/g, '_')}_${Date.now()}.pdf`;
    const filePath = path.join(RESUME_DIR, fileName);
    const doc = new PDFDocument({ margin: 50, size: 'A4' });

    doc.pipe(fs.createWriteStream(filePath));

    // --- Header ---
    doc.fillColor('#020617').fontSize(22).font('Helvetica-Bold').text('ROHIT KUMAR SINGH', { align: 'center' });
    doc.fontSize(10).font('Helvetica').fillColor('#64748b').text('Patna, Bihar, India | 9065039396 | rajputrohitsingh998@gmail.com', { align: 'center' });
    doc.text('LinkedIn: linkedin.com/in/rohit-kumar-singh | GitHub: github.com/Rohitkr2002', { align: 'center' });
    doc.moveDown(2);

    // --- Summary ---
    doc.fillColor('#0f172a').fontSize(12).font('Helvetica-Bold').text('PROFESSIONAL SUMMARY');
    doc.rect(50, doc.y, 500, 1).fill('#cbd5e1');
    doc.moveDown(0.5);
    doc.fontSize(10).font('Helvetica').fillColor('#334155').text(tailoredData?.tailoredSummary || 'Entry-level Software Engineer...');
    doc.moveDown(1.5);

    // --- Experience ---
    doc.fillColor('#0f172a').fontSize(12).font('Helvetica-Bold').text('EXPERIENCE');
    doc.rect(50, doc.y, 500, 1).fill('#cbd5e1');
    doc.moveDown(0.5);
    doc.fontSize(10).font('Helvetica-Bold').text('Web Development Intern | Rinex', { continued: true }).font('Helvetica').text(' | July 2022 – Aug 2022', { align: 'right' });
    
    const expPoints = tailoredData?.optimizedExperience || [
        'Developed 5+ responsive web pages using HTML5, CSS3, and JavaScript',
        'Improved page load time by 30% by optimizing CSS and JavaScript'
    ];
    
    expPoints.forEach(p => {
        doc.fontSize(10).font('Helvetica').text(`• ${p}`, { indent: 15 });
    });
    doc.moveDown(1.5);

    // --- Education ---
    doc.fillColor('#0f172a').fontSize(12).font('Helvetica-Bold').text('EDUCATION');
    doc.rect(50, doc.y, 500, 1).fill('#cbd5e1');
    doc.moveDown(0.5);
    doc.fontSize(10).font('Helvetica-Bold').text('Haldia Institute of Technology', { continued: true }).font('Helvetica').text(' | 2021 – 2025', { align: 'right' });
    doc.fontSize(10).font('Helvetica').text('B.Tech – Electronics and Communication Engineering | CGPA: 7.33');
    doc.moveDown(1.5);

    // --- Technical Skills ---
    doc.fillColor('#0f172a').fontSize(12).font('Helvetica-Bold').text('TECHNICAL SKILLS');
    doc.rect(50, doc.y, 500, 1).fill('#cbd5e1');
    doc.moveDown(0.5);
    doc.fontSize(10).font('Helvetica').text(`Skills: ${(tailoredData?.topSkills || ['JavaScript', 'Python', 'React', 'HTML', 'CSS']).join(', ')}`);

    doc.end();
    return `/resumes/${fileName}`;
}

/**
 * Main function to generate tailored resumes for a set of jobs
 */
async function generateTailoredResumes(jobs) {
    console.log(`\n📄 Feature 2: Generating Tailored AI Resumes (PDF)...`);
    const baseResume = fs.readFileSync(path.join(__dirname, '../resumes/resume_software.txt'), 'utf8');
    
    const results = [];
    const topJobs = jobs.slice(0, 3); // Tailor for top 3 matches to save API quota

    for (const job of topJobs) {
        console.log(`   ✍️ Tailoring resume for: ${job.company}...`);
        const tailoredData = await tailorResumeContent(job, baseResume);
        const pdfUrl = await generatePDFResume(job, tailoredData, baseResume);
        results.push({ jobId: job.id, pdfUrl });
        job.tailoredResume = pdfUrl; // Add to job object directly
    }

    console.log(`   ✅ Generated ${results.length} unique AI Resumes.`);
    return results;
}

module.exports = { generateTailoredResumes };
