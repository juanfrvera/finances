import { PUBLIC_API_URL } from "$env/static/public";
import { AuthService } from "./auth.service";

export class ItemService {
    private static readonly url = `${PUBLIC_API_URL}/items`;

    public static async getItems() {
        const response = await fetch(this.url, { method: 'GET', headers: this.getHeaders() });
        return response.json();
    }

    public static async delete(id: string) {
        const response = await fetch(`${this.url}/${id}`, { method: 'DELETE', headers: this.getHeaders() });
        return response.json();
    }

    private static getHeaders() {
        const token = AuthService.getToken();
        return { 'Authorization': `Bearer ${token}` };
    }
}