# ABN AMRO Mortgage Rate Tracker

Automated daily tracking of ABN AMRO Netherlands mortgage interest rates with email notifications.

## Features

- Scrapes current mortgage rates from ABN AMRO website
- Applies Energy Label A discount (0.15%)
- Applies ABN AMRO Bank Account discount (0.20%)
- Tracks rates for 2, 3, 5, and 10-year fixed periods at ≤85% LTV
- Sends formatted HTML email notifications
- **Urgent alerts**: When 5-year rate drops below 3.3%, email is marked as high priority with "URGENT" in subject
- Runs automatically at 9 AM CET via GitHub Actions

## Setup

### 1. Gmail App Password

1. Go to [Google Account Security](https://myaccount.google.com/security)
2. Enable 2-Factor Authentication if not already enabled
3. Go to [App Passwords](https://myaccount.google.com/apppasswords)
4. Generate a new app password for "Mail"
5. Save the 16-character password

### 2. GitHub Actions Setup

1. Fork or clone this repository
2. Go to **Settings → Secrets and variables → Actions**
3. Add the following secrets:

| Secret | Description |
|--------|-------------|
| `GMAIL_USER` | Your Gmail address |
| `GMAIL_APP_PASSWORD` | 16-character app password from step 1 |
| `RECIPIENT_EMAIL` | Email address to receive notifications |

### 3. Test the Workflow

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
│   │   └── email.ts          # Gmail SMTP sender
│   ├── types.ts              # TypeScript interfaces
│   └── formatter.ts          # Message formatting
├── dist/                     # Compiled JavaScript
├── .github/
│   └── workflows/
│       └── daily-check.yml   # GitHub Actions cron job
├── package.json
├── tsconfig.json
└── README.md
```

## Sample Output

```
ABN AMRO Mortgage Rates - 21 feb 2026
(Energy Label A, ABN AMRO Account, ≤85% LTV)

  - 2 jaar: 3.37%
  - 3 jaar: 3.42%
  - 5 jaar: 3.47%
  - 10 jaar: 3.80%
```

## Troubleshooting

### Rates not being extracted

The ABN AMRO website may change its structure. Check the GitHub Actions logs for debug output.

### Email not sending

- Verify your Gmail App Password is correct (16 characters, no spaces)
- Ensure 2FA is enabled on your Google account
- Check that `GMAIL_USER` matches the account that generated the app password

### Timeout errors

The scraper may timeout if the ABN AMRO website is slow. The workflow will retry on the next scheduled run.

## License

MIT
