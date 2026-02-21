import { RateResult } from './types';

export function formatPlainText(result: RateResult): string {
  const lines: string[] = [
    `ABN AMRO Mortgage Rates - ${result.date}`,
    `(Energy Label ${result.filters.energyLabel}, ABN AMRO Account, ${result.filters.ltv} LTV)`,
    '',
    'Interest Period | Rate',
    '----------------|-------',
  ];

  for (const rate of result.rates) {
    const period = rate.interestPeriod.padEnd(15);
    lines.push(`${period} | ${rate.rate}`);
  }

  lines.push('');
  lines.push('Source: abnamro.nl/hypotheken');

  return lines.join('\n');
}

export function formatWhatsApp(result: RateResult): string {
  // WhatsApp-friendly format with emoji
  const lines: string[] = [
    `📊 *ABN AMRO Mortgage Rates*`,
    `📅 ${result.date}`,
    `🏠 Energy Label ${result.filters.energyLabel} | ${result.filters.ltv} LTV`,
    '',
  ];

  for (const rate of result.rates) {
    lines.push(`• ${rate.interestPeriod}: *${rate.rate}*`);
  }

  lines.push('');
  lines.push('🔗 abnamro.nl/hypotheken');

  return lines.join('\n');
}

export function formatHtmlEmail(result: RateResult): string {
  const rateRows = result.rates
    .map(rate => `
      <tr>
        <td style="padding: 12px 16px; border-bottom: 1px solid #e0e0e0;">${rate.interestPeriod}</td>
        <td style="padding: 12px 16px; border-bottom: 1px solid #e0e0e0; font-weight: bold; color: #004d40;">${rate.rate}</td>
      </tr>
    `)
    .join('');

  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
  <div style="background: linear-gradient(135deg, #004d40 0%, #00796b 100%); color: white; padding: 24px; border-radius: 12px 12px 0 0;">
    <h1 style="margin: 0; font-size: 24px;">📊 ABN AMRO Mortgage Rates</h1>
    <p style="margin: 8px 0 0 0; opacity: 0.9;">${result.date}</p>
  </div>

  <div style="background: #f5f5f5; padding: 16px; border-left: 1px solid #e0e0e0; border-right: 1px solid #e0e0e0;">
    <p style="margin: 0; font-size: 14px; color: #666;">
      🏠 Energy Label <strong>${result.filters.energyLabel}</strong> |
      🏦 ABN AMRO Account Discount |
      📊 ${result.filters.ltv} LTV
    </p>
  </div>

  <table style="width: 100%; border-collapse: collapse; background: white; border: 1px solid #e0e0e0;">
    <thead>
      <tr style="background: #f9f9f9;">
        <th style="padding: 12px 16px; text-align: left; border-bottom: 2px solid #004d40;">Interest Period</th>
        <th style="padding: 12px 16px; text-align: left; border-bottom: 2px solid #004d40;">Rate</th>
      </tr>
    </thead>
    <tbody>
      ${rateRows}
    </tbody>
  </table>

  <div style="background: #f5f5f5; padding: 16px; border: 1px solid #e0e0e0; border-top: none; border-radius: 0 0 12px 12px;">
    <p style="margin: 0; font-size: 12px; color: #888;">
      Source: <a href="https://www.abnamro.nl/nl/prive/hypotheken/actuele-hypotheekrente/index.html" style="color: #004d40;">ABN AMRO Mortgage Rates</a><br>
      <em>Rates are indicative and subject to change.</em>
    </p>
  </div>
</body>
</html>
  `.trim();
}
