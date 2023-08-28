import type { ICurrency } from "../typings";
import { ApiService } from "./api.service";
import { ItemService } from "./item.service";

export class CurrencyService {
    private static list?: ICurrency[];

    public static async getList() {
        if (!this.list) {
            const response = await fetch(this.getUrl(), { method: 'GET', headers: this.getHeaders() });
            this.list = await ApiService.interceptResponse(response);
        }

        return this.list!;
    }

    public static async create(data) {
        const result = await ItemService.create(data);

        if (this.list) this.list.unshift(result as ICurrency);

        return result;
    }

    private static getUrl() {
        return `${ApiService.getUrl()}/currency`;
    }

    private static getHeaders() {
        return ApiService.getHeaders();
    }
}