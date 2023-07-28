import type { IItemData } from "@/lib/components/item/typings";
import { PUBLIC_API_URL } from '$env/static/public';
import type { IStorage } from "../typings";

export class ItemStorage implements IStorage<IItemData> {
    private readonly url = `${PUBLIC_API_URL}/items`;

    public async getAll() {
        const res = await fetch(this.url, {
            method: 'GET',
            headers: {
                Authorization: 'eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJqdWFuIiwiZXhwIjoxNjkwMTU2ODAyfQ.zmi0AHiWUyHxIGVbiKzz2oHun1BYo4q5AmgxU2u0hrA'
            }
        });

        if (!res.ok) throw new Error(res.statusText);

        return res.json();
    }
    public async delete(id: string) {
        const res = await fetch(`${this.url}/${id}`, {
            method: 'DELETE',
            headers: {
                Authorization: 'eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJqdWFuIiwiZXhwIjoxNjkwMTU2ODAyfQ.zmi0AHiWUyHxIGVbiKzz2oHun1BYo4q5AmgxU2u0hrA'
            }
        });

        if (!res.ok) throw new Error(res.statusText);

        return res.json();
    }
}