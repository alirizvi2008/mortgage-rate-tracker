import { RateResult } from '../types';
interface EmailConfig {
    user: string;
    appPassword: string;
    recipient: string;
}
export declare function sendEmail(result: RateResult, config: EmailConfig): Promise<void>;
export {};
//# sourceMappingURL=email.d.ts.map