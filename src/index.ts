import 'dotenv/config';
import { scrapeRates } from './scraper';
import { sendEmail } from './notifications/email';
import { sendWhatsApp } from './notifications/whatsapp';

async function main(): Promise<void> {
  console.log('='.repeat(50));
  console.log('ABN AMRO Mortgage Rate Tracker');
  console.log('='.repeat(50));
  console.log('');

  try {
    // Step 1: Scrape rates from ABN AMRO
    console.log('[1/3] Scraping mortgage rates...');
    const rateResult = await scrapeRates();

    console.log('');
    console.log('Rates extracted:');
    for (const rate of rateResult.rates) {
      console.log(`  - ${rate.interestPeriod}: ${rate.rate}`);
    }
    console.log('');

    // Step 2: Send email notification
    console.log('[2/3] Sending email notification...');
    await sendEmail(rateResult, {
      user: process.env.GMAIL_USER || '',
      appPassword: process.env.GMAIL_APP_PASSWORD || '',
      recipient: process.env.RECIPIENT_EMAIL || '',
    });
    console.log('');

    // Step 3: Send WhatsApp notification
    console.log('[3/3] Sending WhatsApp notification...');
    await sendWhatsApp(rateResult, {
      phone: process.env.WHATSAPP_PHONE || '',
      apiKey: process.env.CALLMEBOT_API_KEY || '',
    });
    console.log('');

    console.log('='.repeat(50));
    console.log('All notifications sent successfully!');
    console.log('='.repeat(50));

  } catch (error) {
    console.error('');
    console.error('='.repeat(50));
    console.error('ERROR: Rate tracking failed');
    console.error('='.repeat(50));
    console.error(error);
    process.exit(1);
  }
}

main();
