import { Subject } from 'rxjs';
import { ItemStorage } from "../storage/item";
import { CurrencyItem } from "./item";
import type { ICurrencyConfig, IItemData } from "../typings";

export class CurrencyLogic {
    public static readonly contextKey = "currencyContext";
    public static readonly currencyAddedSubject = new Subject<string>();

    public static getCurrencies() {
        return ItemStorage.getItems({ type: CurrencyItem.getTypeString() });
    }
}

export interface ICurrencyContext {
    getCurrencies: () => Array<IItemData<ICurrencyConfig>>;
    onGoToCreation: () => void;
}