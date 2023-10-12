import { goto } from '$app/navigation';
import { PUBLIC_API_URL } from '$env/static/public';
import { UserStore } from '../util/storage/user.storage';

export class AuthService {
    private static readonly url = `${PUBLIC_API_URL}/auth`;
    private static token: string | null;
    private static readonly tokenStorageKey = 'token';
    private static readonly tokenExpirationDateKey = 'token_expiration';
    private static tokenExpirationDate: Date | null;

    public static async logIn(data: { username: string; password: string; }) {
        const response = await fetch(`${this.url}/login`, { method: 'POST', body: JSON.stringify(data) });

        const serverData = await response.json();

        if (response.status !== 200) throw new Error(serverData);

        this.setToken(serverData);
        UserStore.setSyncEnabled(true);
    }

    public static async register(data: { username: string; password: string; name?: string; }) {
        const response = await fetch(`${this.url}/register`, { method: 'POST', body: JSON.stringify(data) });

        const serverData = await response.json();

        if (response.status !== 200) throw new Error(serverData);

        this.setToken(serverData);
        UserStore.setSyncEnabled(true);
    }

    public static getToken() {
        if (!this.token) this.token = localStorage.getItem(this.tokenStorageKey);
        return this.token;
    }

    public static hasValidToken() {
        const token = this.getToken();
        if (!token) return false;

        const expirationDate = this.getTokenExpirationDate();
        if (expirationDate) {
            if (Date.now() > expirationDate.getTime()) return false;
        }

        return true;
    }

    public static removeToken() {
        this.token = null;
        localStorage.setItem(this.tokenStorageKey, '');
        localStorage.setItem(this.tokenExpirationDateKey, '');
    }

    private static setToken(data: { token: string, expirationDate: string }) {
        this.token = data.token;
        localStorage.setItem(this.tokenStorageKey, data.token);
        this.tokenExpirationDate = new Date(data.expirationDate);
        localStorage.setItem(this.tokenExpirationDateKey, data.expirationDate);
    }

    private static getTokenExpirationDate() {
        if (!this.tokenExpirationDate) {
            const expirationDate = localStorage.getItem(this.tokenExpirationDateKey);
            if (expirationDate) {
                this.tokenExpirationDate = new Date(expirationDate);
            }
        }
        return this.tokenExpirationDate;
    }
}