import type { ICurrency } from "../typings";
import { ApiService } from "./api.service";
import { ItemService } from "./item.service";

export class CurrencyService {
    private static list?: ICurrency[];
    private static usdToArsRatio?: number;
    private static historicalUsdToArs: { [dateString: string]: number; } = {};

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

    public static async arsToUsd(ars: number) {
        const usdToArsRatio = await this.getUsdToArsRatio();
        return ars / usdToArsRatio;
    }

    public static async getUsdToArsRatio() {
        if (!this.usdToArsRatio) {
            const response = await fetch('https://api.bluelytics.com.ar/v2/latest', { method: 'GET' });
            if (response.status == 200) {
                const data: { blue: { value_avg: number } } = await response.json();
                this.usdToArsRatio = data.blue.value_avg;
            }
        }
        if (!this.usdToArsRatio) throw new Error("Couldn't get usd price");
        return this.usdToArsRatio;
    }

    public static async arsToUsdOnDate(ars: number, dateString: string) {
        if (!this.historicalUsdToArs[dateString]) {
            const url = `https://api.bluelytics.com.ar/v2/historical?day=${dateString}`;
            const response = await fetch(url, { method: 'GET' });
            if (response.status == 200) {
                const data: { blue: { value_avg: number } } = await response.json();
                this.historicalUsdToArs[dateString] = data.blue.value_avg;
            }
        }
        if (!this.historicalUsdToArs[dateString]) throw new Error("Couldn't get usd price");

        return ars / this.historicalUsdToArs[dateString];
    }

    private static getUrl() {
        return `${ApiService.getUrl()}/currency`;
    }

    private static getHeaders() {
        return ApiService.getHeaders();
    }
}