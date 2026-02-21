import { chromium, Browser, Page, Frame } from 'playwright';
import { MortgageRate, RateResult } from './types';

const ABN_AMRO_RATES_URL = 'https://www.abnamro.nl/nl/prive/hypotheken/actuele-hypotheekrente/index.html';

const TARGET_PERIODS = ['2 jaar', '3 jaar', '5 jaar', '10 jaar'];
const LTV_COLUMN_INDEX = 3; // ≤85% is the 4th column (0-indexed: 0=period, 1=NHG, 2=≤65%, 3=≤85%)

export async function scrapeRates(): Promise<RateResult> {
  let browser: Browser | null = null;

  try {
    console.log('Launching browser...');
    browser = await chromium.launch({
      headless: true,
    });

    const context = await browser.newContext({
      userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36',
      locale: 'nl-NL',
    });

    const page = await context.newPage();

    console.log('Navigating to ABN AMRO rates page...');
    await page.goto(ABN_AMRO_RATES_URL, { waitUntil: 'networkidle', timeout: 60000 });

    // Handle OneTrust cookie consent
    await handleCookieConsent(page);

    // Wait for iframe to load
    await page.waitForTimeout(3000);

    // Get the rates iframe
    const frame = page.frame({ url: /hypotheken.abnamro.nl\/interest-rates/ });
    if (!frame) {
      throw new Error('Rate table iframe not found');
    }

    console.log('Found rate table iframe');

    // Ensure bank account discount is checked (should be by default)
    await ensureBankAccountDiscount(frame);

    // Select Energy Label A
    await selectEnergyLabel(frame);

    // Wait for rates to update
    await page.waitForTimeout(2000);

    // Expand table to show all periods
    await expandTable(frame);

    // Extract rates
    const rates = await extractRates(frame);

    const today = new Date();
    const dateStr = today.toLocaleDateString('nl-NL', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });

    return {
      date: dateStr,
      rates,
      filters: {
        energyLabel: 'A',
        bankAccount: true,
        ltv: '≤85%',
      },
    };
  } catch (error) {
    console.error('Scraping error:', error);
    throw error;
  } finally {
    if (browser) {
      await browser.close();
    }
  }
}

async function handleCookieConsent(page: Page): Promise<void> {
  try {
    await page.waitForTimeout(2000);

    // OneTrust cookie banner
    const acceptBtn = page.locator('#onetrust-accept-btn-handler');
    if (await acceptBtn.isVisible({ timeout: 3000 }).catch(() => false)) {
      console.log('Accepting cookies...');
      await acceptBtn.click({ force: true });
      await page.waitForTimeout(1500);
    }

    // Remove any remaining overlay
    await page.evaluate(() => {
      const overlay = document.querySelector('#onetrust-consent-sdk');
      if (overlay) overlay.remove();
    });
  } catch (error) {
    console.log('Cookie consent handling:', error);
  }
}

async function ensureBankAccountDiscount(frame: Frame): Promise<void> {
  try {
    const checkbox = frame.locator('#huisbankkorting_check');
    if (await checkbox.isVisible({ timeout: 2000 }).catch(() => false)) {
      const isChecked = await checkbox.isChecked();
      if (!isChecked) {
        console.log('Enabling bank account discount...');
        await checkbox.click({ force: true });
        await frame.waitForTimeout(1000);
      } else {
        console.log('Bank account discount already enabled');
      }
    }
  } catch (error) {
    console.log('Bank account discount check:', error);
  }
}

async function selectEnergyLabel(frame: Frame): Promise<void> {
  try {
    // The dropdown is a custom aab-select component
    const dropdown = frame.locator('#duurzaamheidskorting_selector');

    if (await dropdown.isVisible({ timeout: 2000 }).catch(() => false)) {
      console.log('Selecting Energy Label A...');

      // Click to open dropdown
      await dropdown.click();
      await frame.waitForTimeout(500);

      // Select "Energielabel A (0,15%)"
      const optionA = frame.locator('text="Energielabel A (0,15%)"');
      if (await optionA.isVisible({ timeout: 2000 }).catch(() => false)) {
        await optionA.click();
        console.log('Energy Label A selected');
        await frame.waitForTimeout(1000);
      } else {
        // Try alternative: look for list item
        const listItem = frame.locator('[role="option"]:has-text("Energielabel A")');
        if (await listItem.isVisible({ timeout: 1000 }).catch(() => false)) {
          await listItem.click();
          console.log('Energy Label A selected (via list item)');
          await frame.waitForTimeout(1000);
        }
      }
    }
  } catch (error) {
    console.log('Energy label selection:', error);
  }
}

async function expandTable(frame: Frame): Promise<void> {
  try {
    const expandBtn = frame.locator('#table-extend-btn');
    if (await expandBtn.isVisible({ timeout: 2000 }).catch(() => false)) {
      console.log('Expanding rate table...');
      await expandBtn.click({ force: true });
      await frame.waitForTimeout(1500);
    }
  } catch (error) {
    console.log('Table expansion:', error);
  }
}

async function extractRates(frame: Frame): Promise<MortgageRate[]> {
  const rates: MortgageRate[] = [];

  console.log('Extracting rates from table...');

  const table = frame.locator('#primaryTable');
  const rows = await table.locator('tbody tr').all();

  console.log(`Found ${rows.length} rate rows`);

  for (const row of rows) {
    const cells = await row.locator('td').all();
    if (cells.length < 4) continue;

    // Get period text from first cell
    const periodText = (await cells[0].textContent() || '').trim();

    // Check if this is a target period
    for (const targetPeriod of TARGET_PERIODS) {
      if (periodText.toLowerCase().startsWith(targetPeriod.toLowerCase())) {
        // Get rate from ≤85% column (index 3)
        const rateText = (await cells[LTV_COLUMN_INDEX].textContent() || '').trim();
        const rateMatch = rateText.match(/(\d+,\d+)%/);

        if (rateMatch) {
          rates.push({
            interestPeriod: targetPeriod,
            rate: rateMatch[1].replace(',', '.') + '%',
            ltvBand: '≤85%',
          });
          console.log(`  ${targetPeriod}: ${rateMatch[1]}%`);
        }
        break;
      }
    }
  }

  if (rates.length === 0) {
    throw new Error('Failed to extract any mortgage rates from the table');
  }

  console.log(`Extracted ${rates.length} rates`);
  return rates;
}
