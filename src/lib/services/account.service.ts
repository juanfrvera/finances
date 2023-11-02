import type { IAccount } from "../typings";
import type { IPayment } from "../util/typings/payment.typings";
import { ApiService } from "./api.service";
import { ItemService } from "./item.service";
import { PaymentService } from "./payment.service";

export class AccountService {
    public static async addTransaction(account: IAccount, payment: IPayment) {
        const createdPayment = await PaymentService.create({ ...payment, itemId: account._id });

        let balance = account.balance;
        if (createdPayment.amount != 0) {
            if (createdPayment.transactionType === 'add') {
                balance += createdPayment.amount;
            } else if (createdPayment.transactionType === 'subtract') {
                balance -= createdPayment.amount;
            }
            await ItemService.update(account._id, { balance });
        }

        return { createdPayment, balance };
    }

    private static getUrl() {
        return `${ApiService.getUrl()}/items`;
    }

    private static getHeaders() {
        return ApiService.getHeaders();
    }
}