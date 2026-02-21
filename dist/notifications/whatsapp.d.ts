import { RateResult } from '../types';
interface WhatsAppConfig {
    phone: string;
    apiKey: string;
}
export declare function sendWhatsApp(result: RateResult, config: WhatsAppConfig): Promise<void>;
export {};
//# sourceMappingURL=whatsapp.d.ts.map