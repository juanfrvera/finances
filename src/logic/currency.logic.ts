import { CurrencyStorage } from "../storage/currency.storage";
import { Subject } from 'rxjs';

export class CurrencyLogic {
    public static readonly contextKey = "currencyContext";
    public static readonly currencyAddedSubject = new Subject<string>();

    public static currencyContext: ICurrencyContext = {
        getCurrencies: () => CurrencyStorage.getList(),
        addCurrency: (currency: string) => {
            CurrencyStorage.add(currency);
            this.currencyAddedSubject.next(currency);
        }
    }
}

export interface ICurrencyContext {
    getCurrencies: () => string[];
    addCurrency: (currency: string) => void;
}