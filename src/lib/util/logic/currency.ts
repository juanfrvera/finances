import { Subject } from 'rxjs';
import type { ICurrency } from "@/lib/typings";
import { CurrencyService } from '@/lib/services/currency.service';

export class CurrencyLogic {
    public static readonly contextKey = "currencyContext";
    public static readonly currencyAddedSubject = new Subject<string>();

    public static getCurrencies() {
        return CurrencyService.getList();
    }
}

export interface ICurrencyContext {
    getCurrencies: () => Promise<ICurrency[]>;
    onGoToCreation: () => void;
}