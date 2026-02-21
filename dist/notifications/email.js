"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendEmail = sendEmail;
const nodemailer_1 = __importDefault(require("nodemailer"));
const formatter_1 = require("../formatter");
async function sendEmail(result, config) {
    if (!config.user || !config.appPassword || !config.recipient) {
        console.log('Email configuration incomplete, skipping email notification.');
        return;
    }
    console.log('Configuring email transport...');
    const transporter = nodemailer_1.default.createTransport({
        service: 'gmail',
        auth: {
            user: config.user,
            pass: config.appPassword,
        },
    });
    const htmlContent = (0, formatter_1.formatHtmlEmail)(result);
    const textContent = (0, formatter_1.formatPlainText)(result);
    const mailOptions = {
        from: `Mortgage Rate Tracker <${config.user}>`,
        to: config.recipient,
        subject: `📊 ABN AMRO Mortgage Rates - ${result.date}`,
        text: textContent,
        html: htmlContent,
    };
    console.log(`Sending email to ${config.recipient}...`);
    try {
        const info = await transporter.sendMail(mailOptions);
        console.log('Email sent successfully:', info.messageId);
    }
    catch (error) {
        console.error('Failed to send email:', error);
        throw error;
    }
}
//# sourceMappingURL=email.js.map