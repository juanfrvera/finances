import { CurrencyStorage } from "../storage/currency.storage";

export class CurrencyLogic {
    public static readonly contextKey = "currencyContext";

    public static currencyContext: ICurrencyContext = {
        getCurrencies: () => CurrencyStorage.getList(),
        addCurrency: (currency: string) => CurrencyStorage.add(currency)
    }
}

export interface ICurrencyContext {
    getCurrencies: () => string[];
    addCurrency: (currency: string) => void;
}