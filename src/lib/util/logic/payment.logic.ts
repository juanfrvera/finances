import { CurrencyService } from "@/lib/services/currency.service";
import type { IPayTable, IPayWindow, IPayment, IPaymentUI } from "../typings/payment.typings";
import { ItemService } from "@/lib/services/item.service";
import type { ItemWithPayments } from "@/lib/typings";

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

    public static async addPayment(item: ItemWithPayments, payment: IPayment, payWindow: IPayWindow, payTable?: IPayTable) {
        payWindow.saving = true;
        const createdPayment = await ItemService.addPayment(item._id, payment);
        payWindow.saving = false;

        if (!item.payments) item.payments = [];

        // If we have an original payment, we are editing
        if (!payWindow.editedPayment) {
            item.payments.unshift(createdPayment);

            // Sort: Recent dates first
            item.payments = item.payments.sort((a, b) => a.date > b.date ? -1 : (a.date < b.date ? 1 : 0));
            if (payTable && payTable.payments) {
                payTable.payments.unshift(createdPayment);

                // Sort: Recent dates first
                payTable.payments = payTable.payments.sort((a, b) => a.dateString > b.dateString ? -1 : (a.dateString < b.dateString ? 1 : 0));
            }
        } else {
            // Just edit the original object
            payWindow.editedPayment.amount = createdPayment.amount;
            payWindow.editedPayment.dateString = createdPayment.dateString;
            payWindow.editedPayment.note = createdPayment.note;
        }
    }

    public static getLastPayment(payments: IPayment[]) {
        let max: { date: Date, payment: IPayment } | undefined;
        for (const payment of payments) {
            const date = new Date(payment.dateString);
            if (!max || date > max.date) {
                max = { date, payment };
            }
        }

        if (!max) return undefined;
        return max.payment;
    }
}