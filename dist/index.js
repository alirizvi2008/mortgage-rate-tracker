"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const scraper_1 = require("./scraper");
const email_1 = require("./notifications/email");
async function main() {
    console.log('='.repeat(50));
    console.log('ABN AMRO Mortgage Rate Tracker');
    console.log('='.repeat(50));
    console.log('');
    try {
        // Step 1: Scrape rates from ABN AMRO
        console.log('[1/2] Scraping mortgage rates...');
        const rateResult = await (0, scraper_1.scrapeRates)();
        console.log('');
        console.log('Rates extracted:');
        for (const rate of rateResult.rates) {
            console.log(`  - ${rate.interestPeriod}: ${rate.rate}`);
        }
        console.log('');
        // Check if 5-year rate is below 3.3% threshold
        const fiveYearRate = rateResult.rates.find(r => r.interestPeriod === '5 jaar');
        const fiveYearValue = fiveYearRate ? parseFloat(fiveYearRate.rate.replace('%', '')) : null;
        const isUrgent = fiveYearValue !== null && fiveYearValue < 3.3;
        if (isUrgent) {
            console.log('🚨 ALERT: 5-year rate is below 3.3% threshold!');
            console.log('');
        }
        // Step 2: Send email notification
        console.log('[2/2] Sending email notification...');
        await (0, email_1.sendEmail)(rateResult, {
            user: process.env.GMAIL_USER || '',
            appPassword: process.env.GMAIL_APP_PASSWORD || '',
            recipient: process.env.RECIPIENT_EMAIL || '',
        }, isUrgent);
        console.log('');
        console.log('='.repeat(50));
        console.log('Done!');
        console.log('='.repeat(50));
    }
    catch (error) {
        console.error('');
        console.error('='.repeat(50));
        console.error('ERROR: Rate tracking failed');
        console.error('='.repeat(50));
        console.error(error);
        process.exit(1);
    }
}
main();
//# sourceMappingURL=index.js.map