import { PUBLIC_API_URL } from "$env/static/public";
import { AuthService } from "./auth.service";

export class ItemService {
    private static readonly url = `${PUBLIC_API_URL}/items`;

    public static async getItems() {
        const token = AuthService.getToken();
        const response = await fetch(this.url, { method: 'GET', headers: { 'Authorization': `Bearer ${token}` } });
        return response.json();
    }
}