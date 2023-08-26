import type { IDebtConfig, IItemData } from "../typings";

export class DebtLogic {
    public static calculatePayStateString(data: IItemData<IDebtConfig>) {
        const isPaid = data.paidDate != null;
        const who = data.withWho;
        let stateString = `${who} owes`;
        const theyPayMe = data.theyPayMe;

        if (theyPayMe && isPaid) return `${who} paid`;
        if (!theyPayMe && isPaid) return `You paid ${who}`;
        if (!theyPayMe && !isPaid) return `You owe ${who}`;

        return stateString;
    }
}