import axios from 'axios';
import { RateResult } from '../types';
import { formatWhatsApp } from '../formatter';

interface WhatsAppConfig {
  phone: string;
  apiKey: string;
}

const CALLMEBOT_API_URL = 'https://api.callmebot.com/whatsapp.php';

export async function sendWhatsApp(result: RateResult, config: WhatsAppConfig): Promise<void> {
  if (!config.phone || !config.apiKey) {
    console.log('WhatsApp configuration incomplete, skipping WhatsApp notification.');
    return;
  }

  const message = formatWhatsApp(result);

  // URL encode the message
  const encodedMessage = encodeURIComponent(message);

  const url = `${CALLMEBOT_API_URL}?phone=${config.phone}&text=${encodedMessage}&apikey=${config.apiKey}`;

  console.log(`Sending WhatsApp message to ${config.phone}...`);

  try {
    const response = await axios.get(url, {
      timeout: 30000,
      headers: {
        'User-Agent': 'MortgageRateTracker/1.0',
      },
    });

    if (response.status === 200) {
      console.log('WhatsApp message sent successfully');
    } else {
      console.warn('WhatsApp API returned status:', response.status);
    }
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error('Failed to send WhatsApp message:', error.message);
      if (error.response) {
        console.error('Response status:', error.response.status);
        console.error('Response data:', error.response.data);
      }
    } else {
      console.error('Failed to send WhatsApp message:', error);
    }
    throw error;
  }
}
