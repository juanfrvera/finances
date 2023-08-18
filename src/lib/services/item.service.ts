import { goto } from "$app/navigation";
import { PUBLIC_API_URL } from "$env/static/public";
import { AuthService } from "./auth.service";

export class ItemService {
    private static readonly url = `${PUBLIC_API_URL}/items`;

    public static async getItems() {
        const response = await fetch(this.url, { method: 'GET', headers: this.getHeaders() });
        return this.interceptResponse(response);
    }

    public static async delete(id: string) {
        const response = await fetch(`${this.url}/${id}`, { method: 'DELETE', headers: this.getHeaders() });
        return this.interceptResponse(response);
    }

    private static getHeaders() {
        const token = AuthService.getToken();
        return { 'Authorization': `Bearer ${token}` };
    }

    private static async interceptResponse(response: Response) {
        const data = await response.json();
        if (response.status !== 200) {
            if (response.status === 401) {
                goto('auth/login');
            }
            throw new Error(data);
        }
        return data;
    }
}