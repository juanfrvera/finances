import type { IAccount, ICurrency, Item, iItem } from "../typings";
import { ApiService } from "./api.service";

export class ItemService {
    public static async getItems() {
        const response = await fetch(this.getUrl(), { method: 'GET', headers: this.getHeaders() });
        const list: Item[] = await ApiService.interceptResponse(response);

        // Fill currencies with balance
        const currencies = list.filter(i => i.type === 'currency') as ICurrency[];
        currencies.forEach(c => {
            const accounts = list.filter(l => l.type === 'account' && l.config.currency === c.config.currency) as IAccount[];
            if (accounts && accounts.length) {
                c.config.total = accounts.map(a => a.config.balance).reduce((accumulator, value) => accumulator + value);
            } else {
                c.config.total = 0;
            }
        });

        return list;
    }

    public static async create(data): Promise<Item> {
        const response = await fetch(this.getUrl(), { method: 'POST', body: JSON.stringify(data), headers: this.getHeaders() });
        return ApiService.interceptResponse(response);
    }

    public static async delete(id: string) {
        const response = await fetch(`${this.getUrl()}/${id}`, { method: 'DELETE', headers: this.getHeaders() });
        return ApiService.interceptResponse(response);
    }

    private static getUrl() {
        return `${ApiService.getUrl()}/items`;
    }

    private static getHeaders() {
        return ApiService.getHeaders();
    }
}