import type { IAccount, ICurrencyUI, Item } from "../typings";
import type { IPayment } from "../util/typings/payment.typings";
import { ApiService } from "./api.service";
import { PaymentService } from "./payment.service";

export class ItemService {
    public static async getItems() {
        const response = await fetch(this.getUrl(), { method: 'GET', headers: this.getHeaders() });
        const list: Item[] = await ApiService.interceptResponse(response);

        // Fill currencies with balance
        const currencies = list.filter(i => i.type === 'currency') as ICurrencyUI[];
        currencies.forEach(c => {
            const accounts = list.filter(l => l.type === 'account' && l.currency === c.currency) as IAccount[];
            if (accounts && accounts.length) {
                c.total = accounts.map(a => a.balance).reduce((accumulator, value) => accumulator + value);
                c.accounts = accounts.map(a => ({ _id: a._id, name: a.name, balance: a.balance }));
            } else {
                c.total = 0;
            }
        });

        return list;
    }

    public static async create(data): Promise<Item> {
        const response = await fetch(this.getUrl(), { method: 'POST', body: JSON.stringify(data), headers: this.getHeaders() });
        return ApiService.interceptResponse(response);
    }

    public static async update(id: string, updatedFields: Partial<Item>) {
        const response = await fetch(
            `${this.getUrl()}/${id}`,
            { method: 'PATCH', body: JSON.stringify(updatedFields), headers: this.getHeaders() }
        );
        return ApiService.interceptResponse(response);
    }

    public static async delete(id: string) {
        const response = await fetch(`${this.getUrl()}/${id}`, { method: 'DELETE', headers: this.getHeaders() });
        return ApiService.interceptResponse(response);
    }

    /** Creates a payment and returns the created one from the server */
    public static addPayment(itemId: string, payment: IPayment) {
        return PaymentService.create({ ...payment, itemId });
    }

    public static updatePayment(itemId: string, payment: IPayment) {
        return PaymentService.update({ ...payment, itemId });
    }

    private static getUrl() {
        return `${ApiService.getUrl()}/items`;
    }

    private static getHeaders() {
        return ApiService.getHeaders();
    }
}