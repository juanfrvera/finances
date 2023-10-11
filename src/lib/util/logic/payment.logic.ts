import { CurrencyService } from "@/lib/services/currency.service";
import type { IPayTable, IPayment, IPaymentUI } from "../typings/payment.typings";

export class PaymentLogic {
    public static getPayTable(payments: IPayment[] | undefined, currency: string, currentPayTable: IPayTable | undefined) {
        if (payments && payments.length) {
            if (!currentPayTable) {
                const uiPayments: IPaymentUI[] = [...payments];
                const showUsdColumn = currency === 'ars';
                if (showUsdColumn) {
                    uiPayments.forEach(p => {
                        CurrencyService.arsToUsdOnDate(p.amount, p.dateString).then(usdAmount => {
                            p.usdAmount = usdAmount
                        });
                    });
                }
                return { payments: uiPayments, show: true, showUsdColumn };
            }
            return { ...currentPayTable, show: true };
        }
        return undefined;
    }
}