import { goto } from '$app/navigation';
import { PUBLIC_API_URL } from '$env/static/public';
import { UserStore } from '../util/storage/user.storage';

export class AuthService {
    private static readonly url = `${PUBLIC_API_URL}/auth`;
    private static token: string;

    public static async logIn(data: { username: string; password: string; }) {
        const response = await fetch(`${this.url}/login`, { method: 'POST', body: JSON.stringify(data) });

        const serverData: string = await response.json();

        if (response.status !== 200) throw new Error(serverData);

        this.token = serverData;
        UserStore.enableSync();
        goto('/');
    }

    public static getToken() {
        return this.token;
    }
}