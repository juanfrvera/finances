import AccountEditRender from "../routes/item-edit/renders/account-edit-render.svelte";
import ServiceEditRender from "../routes/item-edit/renders/service-edit-render.svelte";
import AccountListRender from "../routes/item-list/account-list-render.svelte";
import ServiceListRender from "../routes/item-list/service-list-render.svelte";
import TotalListRender from "../routes/item-list/total-list-render.svelte";
import AccountSeeRender from "../routes/item-see/renders/account-see-render.svelte";
import ServiceSeeRender from "../routes/item-see/renders/service-see-render.svelte";
import type { IAccountItemConfig, IAccountItemCreationConfig, IItemCreationData, IItemData, IServiceItemConfig, ITotalItemConfig } from "../typings";

export type ListRender = typeof AccountListRender | typeof ServiceListRender | typeof TotalListRender;
export type EditRender = typeof AccountEditRender | typeof ServiceEditRender;
export type SeeRender = typeof AccountSeeRender | typeof ServiceSeeRender;

export abstract class Item {
    public static getTypeString() { return ""; }
    public static getListRender(): ListRender { return AccountListRender; }
    public static getEditRender(): EditRender { return AccountEditRender; }
    public static getSeeRender(): SeeRender { return AccountSeeRender; }
    public static isItemOnQuery(item: IItemData, query: string) { return false; }
}

export class AccountItem extends Item {
    public static getTypeString(): string { return "Account"; }
    public static getListRender(): ListRender { return AccountListRender; }
    public static getEditRender(): EditRender { return AccountEditRender; }
    public static getSeeRender(): SeeRender { return AccountSeeRender; }

    public static isItemOnQuery(item: IItemData<IAccountItemConfig>, query: string) {
        const lwQuery = query.toLowerCase();
        const config = item.config;

        if (config.name.toLowerCase().includes(lwQuery)) return true;
        if (config.balance.toString().includes(query)) return true;
        if (config.currency.toLowerCase().includes(query)) return true;

        return false;
    }

    public static getDefaultData(): IItemCreationData<IAccountItemCreationConfig> {
        return { type: this.getTypeString(), config: { name: '', balance: 0, currency: 'ars' } };
    }
}

export class ServiceItem extends Item {
    public static getTypeString(): string { return "Service"; }
    public static getListRender(): ListRender { return ServiceListRender; }
    public static getEditRender(): EditRender { return ServiceEditRender; }
    public static getSeeRender(): SeeRender { return ServiceSeeRender; }

    public static isItemOnQuery(item: IItemData<IServiceItemConfig>, query: string) {
        const lwQuery = query.toLowerCase();
        const config = item.config;

        if (config.name.toLowerCase().includes(lwQuery)) return true;
        if (config.cost.toString().includes(query)) return true;
        if (config.currency.toLowerCase().includes(query)) return true;
        if (config.isManual && query === "manual") return true;
        if (!config.isManual && lwQuery === "auto") return true;

        return false;
    }

    public static wasThisMonthPaid(data: IItemData<IServiceItemConfig>) {
        if (data.config.lastPayDateString != null) {
            const today = new Date();
            const lastPayDate = new Date(data.config.lastPayDateString.substring(0, 10));
            return lastPayDate != null && (lastPayDate.getMonth() === today.getMonth() && lastPayDate.getFullYear() === today.getFullYear());
        }
        return false;
    }
}

export class TotalItem extends Item {
    public static getTypeString(): string { return "Total"; }
    public static getListRender(): ListRender { return TotalListRender; }
    public static getEditRender(): EditRender { return ServiceEditRender; }
    public static getSeeRender(): SeeRender { return ServiceSeeRender; }

    public static calculate(list: IItemData[], totalItem: IItemData<ITotalItemConfig>) {
        totalItem.config.currencies.forEach((c) => c.total = 0);
        for (let i = 0; i < list.length; i++) {
            const item = list[i];

            if (item.type === AccountItem.getTypeString()) {
                const account = item as IItemData<IAccountItemConfig>;
                const currencyObject = totalItem.config.currencies.find((c) => c.name === account.config.currency);

                if (currencyObject != null) {
                    currencyObject.total += account.config.balance;
                }
            }
        }
    }
}

export class ItemHelper {
    private static readonly itemClasses: Array<typeof Item> = [AccountItem, ServiceItem];
    private static readonly specialItemClasses: Array<typeof Item> = [TotalItem];

    public static getClassByTypeString(type: string) {
        const itemClass = this.itemClasses.find((c) => c.getTypeString() === type);
        if (itemClass != null) {
            return itemClass;
        }
        return this.getSpecialClassByTypeString(type);
    }
    /** Returns the class if one is found, or null if not */
    public static getSpecialClassByTypeString(type: string) {
        return this.specialItemClasses.find((c) => c.getTypeString() === type);
    }
    public static isItemOnQuery(item: IItemData, query: string) {
        const lwQuery = query.toLowerCase();

        if (item.id.includes(query)) return true;
        if (item.type.toLowerCase().includes(lwQuery)) return true;

        return this.getClassByTypeString(item.type)?.isItemOnQuery(item, query);
    }
}