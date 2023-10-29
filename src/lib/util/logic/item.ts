import AccountEditRender from "@/lib/components/item/item-edit/renders/account-edit-render.svelte";
import DebtEditRender from "@/lib/components/item/item-edit/renders/debt-edit-render.svelte";
import ServiceEditRender from "@/lib/components/item/item-edit/renders/service-edit-render.svelte";
import AccountListRender from "@/lib/components/item/item-list/renders/account-list-render.svelte";
import DebtListRender from "@/lib/components/item/item-list/renders/debt-list-render.svelte";
import ServiceListRender from "@/lib/components/item/item-list/renders/service-list-render.svelte";
import CurrencyListRender from "@/lib/components/item/item-list/renders/currency-list-render.svelte";
import AccountSeeRender from "@/lib/components/item/item-see/renders/account-see-render.svelte";
import DebtSeeRender from "@/lib/components/item/item-see/renders/debt-see-render.svelte";
import ServiceSeeRender from "@/lib/components/item/item-see/renders/service-see-render.svelte";
import type { iItem, ItemType, IService, IAccount, ICurrency, Item as ItemT, IDebt } from "@/lib/typings";
import CurrencySeeRender from "@/lib/components/item/item-see/renders/currency-see-render.svelte";
import CurrencyEditRender from "@/lib/components/item/item-edit/renders/currency-edit-render.svelte";
import { PaymentLogic } from "./payment.logic";

export type ListRender = typeof AccountListRender | typeof ServiceListRender | typeof CurrencyListRender | typeof DebtListRender;
export type EditRender = typeof AccountEditRender | typeof ServiceEditRender | typeof DebtEditRender | typeof CurrencyEditRender;
export type SeeRender = typeof AccountSeeRender | typeof ServiceSeeRender | typeof DebtSeeRender | typeof CurrencySeeRender;

export abstract class Item {
    public static getTypeString(): ItemType { return 'account'; }
    public static getListRender(): ListRender { return AccountListRender; }
    public static getEditRender(): EditRender { return AccountEditRender; }
    public static getSeeRender(): SeeRender { return AccountSeeRender; }
    public static isItemOnQuery(item: iItem, query: string) { return false; }
}

export class AccountItem extends Item {
    public static getTypeString(): ItemType { return 'account'; }
    public static getListRender(): ListRender { return AccountListRender; }
    public static getEditRender(): EditRender { return AccountEditRender; }
    public static getSeeRender(): SeeRender { return AccountSeeRender; }

    public static isItemOnQuery(item: IAccount, query: string) {
        const lwQuery = query.toLowerCase();
        const config = item;

        if (config.name.toLowerCase().includes(lwQuery)) return true;
        if (config.balance.toString().includes(query)) return true;
        if (config.currency.toLowerCase().includes(query)) return true;

        return false;
    }
}

export class ServiceItem extends Item {
    public static getTypeString(): ItemType { return 'service'; }
    public static getListRender(): ListRender { return ServiceListRender; }
    public static getEditRender(): EditRender { return ServiceEditRender; }
    public static getSeeRender(): SeeRender { return ServiceSeeRender; }

    public static isItemOnQuery(item: IService, query: string) {
        const lwQuery = query.toLowerCase();
        const config = item;

        if (config.name.toLowerCase().includes(lwQuery)) return true;
        if (config.cost.toString().includes(query)) return true;
        if (config.currency.toLowerCase().includes(query)) return true;
        if (config.isManual && query === "manual") return true;
        if (!config.isManual && lwQuery === "auto") return true;

        return false;
    }

    public static wasThisMonthPaid(data: IService) {
        if (!data.payments) return false;

        const lastPayment = PaymentLogic.getLastPayment(data.payments);
        if (lastPayment != null) {
            const today = new Date();
            const lastPayDate = new Date(lastPayment.dateString.substring(0, 10));
            return lastPayDate != null && (lastPayDate.getMonth() === today.getMonth() && lastPayDate.getFullYear() === today.getFullYear());
        }
        return false;
    }
}

export class CurrencyItem extends Item {
    public static getTypeString(): ItemType { return 'currency'; }
    public static getListRender(): ListRender { return CurrencyListRender; }
    public static getEditRender(): EditRender { return CurrencyEditRender; }
    public static getSeeRender(): SeeRender { return CurrencySeeRender; }

    public static calculate(list: ItemT[], totalItem: ICurrency) {
        totalItem.total = 0;
        for (let i = 0; i < list.length; i++) {
            const item = list[i];

            if (item.type === AccountItem.getTypeString()) {
                const account = item as IAccount;
                if (account.currency === totalItem.currency) {
                    totalItem.total += account.balance;
                }
            }
        }
    }
}

export class DebtItem extends Item {
    public static getTypeString(): ItemType { return 'debt'; }
    public static getListRender(): ListRender { return DebtListRender; }
    public static getEditRender(): EditRender { return DebtEditRender; }
    public static getSeeRender(): SeeRender { return DebtSeeRender; }

    public static isItemOnQuery(item: IDebt, query: string) {
        const lwQuery = query.toLowerCase();
        const config = item;

        if (config.withWho.toLowerCase().includes(lwQuery)) return true;
        if (config.amount.toString().includes(query)) return true;
        if (config.currency.toLowerCase().includes(query)) return true;

        return false;
    }
}

export class ItemHelper {
    private static readonly itemClasses: Array<typeof Item> = [AccountItem, ServiceItem, DebtItem, CurrencyItem];

    public static getClassByTypeString(type: string) {
        const itemClass = this.itemClasses.find((c) => c.getTypeString() === type);
        if (itemClass != null) {
            return itemClass;
        }
    }
    public static isItemOnQuery(item: ItemT, query: string) {
        const lwQuery = query.toLowerCase();

        if (item._id.includes(query)) return true;
        if (item.type.toLowerCase().includes(lwQuery)) return true;

        return this.getClassByTypeString(item.type)?.isItemOnQuery(item, query);
    }
    public static getItemClasses() {
        return this.itemClasses;
    }
}