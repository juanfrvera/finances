import { ApiService } from "./api.service";

export class ItemService {
    public static async getItems() {
        const response = await fetch(this.getUrl(), { method: 'GET', headers: this.getHeaders() });
        return ApiService.interceptResponse(response);
    }

    public static async delete(id: string) {
        const response = await fetch(`${this.getUrl()}/${id}`, { method: 'DELETE', headers: this.getHeaders() });
        return ApiService.interceptResponse(response);
    }

    private static getUrl(){
        return `${ApiService.getUrl()}/items`;
    }

    private static getHeaders() {
        return ApiService.getHeaders();
    }
}