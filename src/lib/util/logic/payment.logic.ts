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

    public static async savePayment(item: ItemWithPayments, payment: IPayment, payWindow: IPayWindow, payTable?: IPayTable) {
        const isCreating = !payWindow.editedPayment;

        payWindow.saving = true;
        let savedPayment: IPayment;

        if (isCreating) savedPayment = await ItemService.addPayment(item._id, payment);
        else savedPayment = await ItemService.updatePayment(item._id, payment);

        payWindow.saving = false;

        if (!item.payments) item.payments = [];

        // If we have an original payment, we are editing
        if (isCreating) {
            item.payments.unshift(savedPayment);

            // Sort: Recent dates first
            item.payments = item.payments.sort((a, b) => a.dateString > b.dateString ? -1 : (a.dateString < b.dateString ? 1 : 0));
            if (payTable && payTable.payments) {
                payTable.payments.unshift(savedPayment);

                // Sort: Recent dates first
                payTable.payments = payTable.payments.sort((a, b) => a.dateString > b.dateString ? -1 : (a.dateString < b.dateString ? 1 : 0));
            }
        } else if (payWindow.editedPayment) {
            // Just edit the original object
            payWindow.editedPayment.amount = savedPayment.amount;
            payWindow.editedPayment.dateString = savedPayment.dateString;
            payWindow.editedPayment.note = savedPayment.note;
        }
    }

    public static getLastPayment(payments: IPayment[]) {
        let max: IPayment | undefined;
        for (const payment of payments) {
            if (!max || payment.dateString > max.dateString) {
               max = payment;
            }
        }

        if (!max) return undefined;
        return max;
    }
}