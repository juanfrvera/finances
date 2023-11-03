import type { IDebt } from "@/lib/typings";

export class DebtLogic {
    public static calculatePayStateString(data: IDebt) {
        const paidAmount = this.getPaidAmount(data);
        const isPaid = paidAmount >= data.amount;
        const who = data.withWho;
        const theyPayMe = data.theyPayMe;

        if (theyPayMe && isPaid) return `${who} paid`;
        if (!theyPayMe && isPaid) return `You paid ${who}`;
        if (!theyPayMe && !isPaid) return `You owe ${who}`;

        return `${who} owes`;
    }

    /**
     * Calculates the total paid amount of the debt
     * @param data 
     * @returns Fixed number (rounded to 10 decimals) to account for floating precision issues
     */
    public static getPaidAmount(data: IDebt) {
        let paidAmount = 0;
        if (data.payments) {
            data.payments.forEach((p) => (paidAmount += p.amount));
        }
        return (Number)(paidAmount.toFixed(10));
    }

    /**
     * Calculates the owed amount of the current debt
     * @param data 
     * @returns Fixed number (rounded to 10 decimals) to account for floating precision issues, or 0 if no debt
     */
    public static getOwedAmountOrZero(data: IDebt) {
        const paidAmount = this.getPaidAmount(data);
        const owed = (Number)((data.amount - paidAmount).toFixed(10));
        return owed > 0 ? owed : 0;
    }
}