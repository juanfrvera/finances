import type { IDebt } from "@/lib/typings";

export class DebtLogic {
    public static calculatePayStateString(data: IDebt) {
        const paidAmount = this.getPaidAmount(data);
        const isPaid = paidAmount >= data.amount;
        const who = data.withWho;
        let stateString = `${who} owes`;
        const theyPayMe = data.theyPayMe;

        if (theyPayMe && isPaid) return `${who} paid`;
        if (!theyPayMe && isPaid) return `You paid ${who}`;
        if (!theyPayMe && !isPaid) return `You owe ${who}`;

        return stateString;
    }

    public static getPaidAmount(data: IDebt) {
        let paidAmount = 0;
        if (data.payments) {
            data.payments.forEach((p) => (paidAmount += p.amount));
        }
        return paidAmount;
    }
}