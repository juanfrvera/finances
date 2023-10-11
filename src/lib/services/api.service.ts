import { goto } from "$app/navigation";
import { base } from "$app/paths";
import { PUBLIC_API_URL } from "$env/static/public";
import { AuthService } from "./auth.service";

export class ApiService {
    private static readonly url = PUBLIC_API_URL;
    public static getUrl() {
        return this.url;
    }
    public static getHeaders() {
        const token = AuthService.getToken();
        return { 'Authorization': `Bearer ${token}` };
    }
    public static async interceptResponse(response: Response) {
        const data = await response.json();
        if (response.status !== 200 && response.status !== 201) {
            if (response.status === 401) {
                goto(`${base}/auth/login`);
            }
            throw new Error(data);
        }
        return data;
    }
}