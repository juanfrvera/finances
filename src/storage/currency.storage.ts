export class CurrencyStorage {
    private static readonly localStorageKey = "currencies";

    public static getList(): string[] {
        const storageString = localStorage.getItem(this.localStorageKey);

        if (storageString != null && storageString.length > 0) {
            return JSON.parse(storageString);
        }
        else {
            return [];
        }
    }

    public static add(currency: string) {
        const list = this.getList() ?? [];

        list.push(currency);

        localStorage.setItem(this.localStorageKey, JSON.stringify(list));
    }
}