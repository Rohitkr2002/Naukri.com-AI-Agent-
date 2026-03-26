// utils/generate_naukri_resume.js
const PDFDocument = require('pdfkit');
const fs = require('fs');
const path = require('path');

const RESUME_DIR = path.join(__dirname, '../resumes');

function generateGenericPDF(txtFile, pdfName) {
    const txtPath = path.join(RESUME_DIR, txtFile);
    if (!fs.existsSync(txtPath)) {
        console.error('Missing: ' + txtPath);
        return;
    }
    
    let content = fs.readFileSync(txtPath, 'utf8');
    
    // ATS Cleanups: Remove all drawing characters and hard brackets around techs in headings
    content = content.replace(/─+/g, '');
    content = content.replace(/\[.*?\]/g, ''); 
    // Save the cleaned content back
    fs.writeFileSync(txtPath, content);
    
    // Split into lines for PDF layout
    const lines = content.split('\n');
    
    const pdfPath = path.join(RESUME_DIR, pdfName);
    const doc = new PDFDocument({ margin: 50, size: 'A4' });
    doc.pipe(fs.createWriteStream(pdfPath));
    
    doc.font('Helvetica');
    let lastY = 0;
    
    lines.forEach(line => {
        let text = line.trimRight();
        if (text.length === 0) {
            doc.moveDown(0.5);
            return;
        }

        if (text.startsWith('ROHIT KUMAR SINGH')) {
            doc.fontSize(16).font('Helvetica-Bold').fillColor('#020617').text(text, {align: 'center'});
            doc.moveDown(0.5);
            doc.font('Helvetica');
        } 
        else if (text.startsWith('Patna') || text.startsWith('Phone') || text.startsWith('LinkedIn')) {
            doc.fontSize(10).fillColor('#475569').text(text, {align: 'center'});
        } 
        else if (text.match(/SUMMARY|EDUCATION|EXPERIENCE|PROJECTS|TECHNICAL SKILLS|LEADERSHIP|ADDITIONAL INFORMATION/)) {
            doc.moveDown(1);
            doc.fontSize(12).fillColor('#0f172a').font('Helvetica-Bold').text(text.trim());
            
            // Clean underline
            const underlineY = doc.y;
            if (underlineY !== lastY) {
                doc.rect(50, underlineY, 500, 1).fill('#cbd5e1');
                lastY = underlineY;
            }
            doc.moveDown(0.5);
        } 
        else if (text.startsWith('–') || text.startsWith('-') || text.startsWith('•')) {
            // Bullet points
            // Clean the bullet character and render a standard dot
            let bulletText = text.replace(/^[–\-•]\s*/, '');
            doc.fontSize(10).font('Helvetica').fillColor('#334155').text(`• ${bulletText}`, {indent: 15});
        } 
        else {
            // Normal text (like company names, dates, degrees)
            // Attempt to bold the job titles or degree labels
            if (text.includes('Aug 20') || text.includes('June 20') || text.includes('March 20') || text.includes('July 20') || text.includes('Sep 20') || text.includes('Oct 20')) {
                // Split at date to bold the front part
                let parts = text.split(/\s{4,}/); // Usually split by multiple spaces
                if (parts.length >= 2) {
                    doc.fontSize(10).font('Helvetica-Bold').fillColor('#1e293b').text(parts[0], {continued: true});
                    doc.font('Helvetica').fillColor('#64748b').text(`  ${parts.slice(1).join(' ')}`, {align: 'right'});
                } else {
                    doc.fontSize(10).font('Helvetica-Bold').fillColor('#1e293b').text(text);
                }
            } else {
                doc.fontSize(10).font('Helvetica').fillColor('#1e293b').text(text);
            }
        }
    });
    
    doc.end();
    console.log(`✅ Automated ATS Optimization & Generation complete: ${pdfName}`);
}

// Generate the primary generic resumes for Naukri upload
generateGenericPDF('resume_software.txt', 'Software_Resume.pdf');
generateGenericPDF('resume_data.txt', 'Data_Analyst_Resume.pdf');
