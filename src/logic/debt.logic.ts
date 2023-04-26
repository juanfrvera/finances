import type { IDebtConfig, IItemData } from "../typings";

export class DebtLogic {
    public static calculatePayStateString(data: IItemData<IDebtConfig>) {
        const isPaid = data.config.paidDate != null;
        const who = data.config.withWho;
        let stateString = `${who} owes`;
        const theyPayMe = data.config.theyPayMe;

        if (theyPayMe && isPaid) return `${who} paid`;
        if (!theyPayMe && isPaid) return `You paid ${who}`;
        if (!theyPayMe && !isPaid) return `You owe ${who}`;

        return stateString;
    }
}