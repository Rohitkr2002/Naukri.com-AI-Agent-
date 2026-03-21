const { scrapeAllJobs } = require('./services/scraper');
const { filterJobs } = require('./services/filter');

// Since CITIES isn't exported, we'll just run it as is, 
// but we know it's 10 cities now. 
// We'll just run a full scrape but let it log the cities.

async function testScaling() {
    console.log('🧪 Running Scaling & Platform Test (Full 10-City Sweep)...');
    try {
        const rawJobs = await scrapeAllJobs();
        const filtered = filterJobs(rawJobs, []);
        
        const counts = { Naukri: 0, LinkedIn: 0, Indeed: 0 };
        const cities = {};

        filtered.forEach(j => {
            const source = j.source || 'Naukri';
            counts[source] = (counts[source] || 0) + 1;
            cities[j.city] = (cities[j.city] || 0) + 1;
        });

        console.log('\n📊 Platform Distribution:');
        console.log(`   Naukri:   ${counts.Naukri}`);
        console.log(`   LinkedIn: ${counts.LinkedIn}`);
        console.log(`   Indeed:   ${counts.Indeed}`);

        console.log('\n📍 City Distribution:');
        Object.keys(cities).forEach(c => {
            console.log(`   ${c}: ${cities[c]} jobs`);
        });

        if (filtered.length >= 50) {
            console.log('\n✅ Scaling test passed! Met the 50-job target.');
        } else {
            console.log(`\n⚠️ Scaling test low yield (${filtered.length}/50).`);
        }
    } catch (err) {
        console.error('❌ Test failed:', err);
    }
}

testScaling();
