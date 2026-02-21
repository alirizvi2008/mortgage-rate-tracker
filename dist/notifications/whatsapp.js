"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendWhatsApp = sendWhatsApp;
const axios_1 = __importDefault(require("axios"));
const formatter_1 = require("../formatter");
const CALLMEBOT_API_URL = 'https://api.callmebot.com/whatsapp.php';
async function sendWhatsApp(result, config) {
    if (!config.phone || !config.apiKey) {
        console.log('WhatsApp configuration incomplete, skipping WhatsApp notification.');
        return;
    }
    const message = (0, formatter_1.formatWhatsApp)(result);
    // URL encode the message
    const encodedMessage = encodeURIComponent(message);
    const url = `${CALLMEBOT_API_URL}?phone=${config.phone}&text=${encodedMessage}&apikey=${config.apiKey}`;
    console.log(`Sending WhatsApp message to ${config.phone}...`);
    try {
        const response = await axios_1.default.get(url, {
            timeout: 30000,
            headers: {
                'User-Agent': 'MortgageRateTracker/1.0',
            },
        });
        if (response.status === 200) {
            console.log('WhatsApp message sent successfully');
        }
        else {
            console.warn('WhatsApp API returned status:', response.status);
        }
    }
    catch (error) {
        if (axios_1.default.isAxiosError(error)) {
            console.error('Failed to send WhatsApp message:', error.message);
            if (error.response) {
                console.error('Response status:', error.response.status);
                console.error('Response data:', error.response.data);
            }
        }
        else {
            console.error('Failed to send WhatsApp message:', error);
        }
        throw error;
    }
}
//# sourceMappingURL=whatsapp.js.map