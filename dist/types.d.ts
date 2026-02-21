export interface MortgageRate {
    interestPeriod: string;
    rate: string;
    ltvBand: string;
}
export interface RateResult {
    date: string;
    rates: MortgageRate[];
    filters: {
        energyLabel: string;
        bankAccount: boolean;
        ltv: string;
    };
}
export interface NotificationConfig {
    gmail: {
        user: string;
        appPassword: string;
        recipient: string;
    };
    whatsapp: {
        phone: string;
        apiKey: string;
    };
}
//# sourceMappingURL=types.d.ts.map