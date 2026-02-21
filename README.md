# ABN AMRO Mortgage Rate Tracker

Automated daily tracking of ABN AMRO Netherlands mortgage interest rates with email and WhatsApp notifications.

## Features

- Scrapes current mortgage rates from ABN AMRO website
- Filters for Energy Label A properties
- Applies ABN AMRO Bank Account discount
- Tracks rates for 2, 3, 5, and 10-year fixed periods at ≤85% LTV
- Sends formatted notifications via email and WhatsApp
- Runs automatically at 9 AM CET via GitHub Actions

## Setup

### 1. Gmail App Password

1. Go to [Google Account Security](https://myaccount.google.com/security)
2. Enable 2-Factor Authentication if not already enabled
3. Go to [App Passwords](https://myaccount.google.com/apppasswords)
4. Generate a new app password for "Mail"
5. Save the 16-character password

### 2. CallMeBot WhatsApp Setup

1. Save **+34 644 71 71 60** to your phone contacts
2. Send this WhatsApp message: `I allow callmebot to send me messages`
3. You'll receive an API key in the response
4. Save this API key

### 3. Local Development

```bash
# Clone the repository
git clone <your-repo-url>
cd mortgage-rate-tracker

# Install dependencies
npm install

# Install Playwright browsers
npx playwright install chromium

# Create environment file
cp .env.example .env

# Edit .env with your credentials
nano .env

# Run locally
npm run start
```

### 4. GitHub Actions Setup

1. Create a new GitHub repository
2. Push this code to the repository
3. Go to **Settings → Secrets and variables → Actions**
4. Add the following secrets:

| Secret | Description |
|--------|-------------|
| `GMAIL_USER` | Your Gmail address |
| `GMAIL_APP_PASSWORD` | 16-character app password from step 1 |
| `RECIPIENT_EMAIL` | Email address to receive notifications |
| `WHATSAPP_PHONE` | Your phone number with country code (e.g., `31612345678`) |
| `CALLMEBOT_API_KEY` | API key from CallMeBot setup |

### 5. Test the Workflow

1. Go to **Actions** tab in your repository
2. Select **Daily Mortgage Rate Check**
3. Click **Run workflow** to test manually

## Project Structure

```
mortgage-rate-tracker/
├── src/
│   ├── index.ts              # Main entry point
│   ├── scraper.ts            # ABN AMRO page scraper
│   ├── notifications/
│   │   ├── email.ts          # Gmail SMTP sender
│   │   └── whatsapp.ts       # CallMeBot integration
│   ├── types.ts              # TypeScript interfaces
│   └── formatter.ts          # Message formatting
├── .github/
│   └── workflows/
│       └── daily-check.yml   # GitHub Actions cron job
├── package.json
├── tsconfig.json
├── .env.example
└── README.md
```

## Sample Output

```
📊 ABN AMRO Mortgage Rates - 21 Feb 2026
(Energy Label A, ABN AMRO Account, ≤85% LTV)

Interest Period | Rate
----------------|-------
2 jaar          | 3.45%
3 jaar          | 3.52%
5 jaar          | 3.68%
10 jaar         | 3.89%

Source: abnamro.nl/hypotheken
```

## Troubleshooting

### Rates not being extracted

The ABN AMRO website may change its structure. Check the GitHub Actions logs for debug output. The scraper saves page content on failure for debugging.

### Email not sending

- Verify your Gmail App Password is correct
- Ensure 2FA is enabled on your Google account
- Check if "Less secure app access" is disabled (should be)

### WhatsApp not sending

- Verify you completed the CallMeBot setup
- Check your phone number format (country code, no + or spaces)
- Ensure the API key is correct

## License

MIT
