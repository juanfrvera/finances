import { ApiService } from "./api.service";

export class CurrencyService{
    public static async getList() {
        const response = await fetch(this.getUrl(), { method: 'GET', headers: this.getHeaders() });
        return ApiService.interceptResponse(response);
    }

    private static getUrl(){
        return `${ApiService.getUrl()}/currency`;
    }

    private static getHeaders() {
        return ApiService.getHeaders();
    }
}