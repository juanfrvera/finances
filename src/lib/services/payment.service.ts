import type { IPayment } from "../util/typings/payment.typings";
import { ApiService } from "./api.service";

export class PaymentService {
    public static async create(data: IPayment & { itemId: string }): Promise<IPayment> {
        const response = await fetch(this.getUrl(), { method: 'POST', body: JSON.stringify(data), headers: this.getHeaders() });
        return ApiService.interceptResponse(response);
    }

    public static async update(data: IPayment & { itemId: string }): Promise<IPayment> {
        const response = await fetch(`${this.getUrl()}/${data._id}`, { method: 'PATCH', body: JSON.stringify(data), headers: this.getHeaders() });
        return ApiService.interceptResponse(response);
    }

    private static getUrl() {
        return `${ApiService.getUrl()}/payments`;
    }

    private static getHeaders() {
        return ApiService.getHeaders();
    }
}