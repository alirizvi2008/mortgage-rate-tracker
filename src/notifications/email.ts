import nodemailer from 'nodemailer';
import { RateResult } from '../types';
import { formatHtmlEmail, formatPlainText } from '../formatter';

interface EmailConfig {
  user: string;
  appPassword: string;
  recipient: string;
}

export async function sendEmail(result: RateResult, config: EmailConfig, urgent: boolean = false): Promise<void> {
  if (!config.user || !config.appPassword || !config.recipient) {
    console.log('Email configuration incomplete, skipping email notification.');
    return;
  }

  console.log('Configuring email transport...');

  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: config.user,
      pass: config.appPassword,
    },
  });

  const htmlContent = formatHtmlEmail(result);
  const textContent = formatPlainText(result);

  const subject = urgent
    ? `🚨 URGENT: ABN AMRO Mortgage Rates - ${result.date} - 5yr below 3.3%!`
    : `📊 ABN AMRO Mortgage Rates - ${result.date}`;

  const mailOptions: nodemailer.SendMailOptions = {
    from: `Mortgage Rate Tracker <${config.user}>`,
    to: config.recipient,
    subject,
    text: textContent,
    html: htmlContent,
    priority: urgent ? 'high' : 'normal',
    headers: urgent ? {
      'X-Priority': '1',
      'X-MSMail-Priority': 'High',
      'Importance': 'high',
    } : undefined,
  };

  console.log(`Sending email to ${config.recipient}...`);

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log('Email sent successfully:', info.messageId);
  } catch (error) {
    console.error('Failed to send email:', error);
    throw error;
  }
}
