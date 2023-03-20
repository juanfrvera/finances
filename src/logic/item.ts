import AccountEditRender from "../routes/item-edit/renders/account-edit-render.svelte";
import ServiceEditRender from "../routes/item-edit/renders/service-edit-render.svelte";
import AccountListRender from "../routes/item-list/account-list-render.svelte";
import ServiceListRender from "../routes/item-list/service-list-render.svelte";
import TotalListRender from "../routes/item-list/total-list-render.svelte";
import AccountSeeRender from "../routes/item-see/renders/account-see-render.svelte";
import ServiceSeeRender from "../routes/item-see/renders/service-see-render.svelte";
import type { IAccountItemConfig, IAccountItemCreationConfig, IItemCreationData, IItemData, ITotalItemConfig } from "../typings";

export type ListRender = typeof AccountListRender | typeof ServiceListRender | typeof TotalListRender;
export type EditRender = typeof AccountEditRender | typeof ServiceEditRender;
export type SeeRender = typeof AccountSeeRender | typeof ServiceSeeRender;

export abstract class Item {
    public static getTypeString() { return ""; }
    public static getListRender(): ListRender { return AccountListRender; }
    public static getEditRender(): EditRender { return AccountEditRender; }
    public static getSeeRender(): SeeRender { return AccountSeeRender; }
}

export class AccountItem extends Item {
    public static getTypeString(): string { return "Account"; }
    public static getListRender(): ListRender { return AccountListRender; }
    public static getEditRender(): EditRender { return AccountEditRender; }
    public static getSeeRender(): SeeRender { return AccountSeeRender; }

    public static getDefaultData(): IItemCreationData<IAccountItemCreationConfig> {
        return { type: this.getTypeString(), config: { name: '', balance: 0, currency: 'ars' } };
    }
}

export class ServiceItem extends Item {
    public static getTypeString(): string { return "Service"; }
    public static getListRender(): ListRender { return ServiceListRender; }
    public static getEditRender(): EditRender { return ServiceEditRender; }
    public static getSeeRender(): SeeRender { return ServiceSeeRender; }
}

export class TotalItem extends Item {
    public static getTypeString(): string { return "Total"; }
    public static getListRender(): ListRender { return TotalListRender; }
    public static getEditRender(): EditRender { return ServiceEditRender; }
    public static getSeeRender(): SeeRender { return ServiceSeeRender; }
    public static calculate(list: IItemData[], total: IItemData<ITotalItemConfig>) {
        for (let i = 0; i < list.length; i++) {
            const item = list[i];

            if (item.type === AccountItem.getTypeString()) {
                const account = item as IItemData<IAccountItemConfig>;
                const currencyObject = total.config.currencies.find((c) => c.name === account.config.currency);

                if (currencyObject != null) {
                    currencyObject.total += account.config.balance;
                }
            }
        }
    }
}

export class ItemHelper {
    private static readonly itemClasses: Array<typeof Item> = [AccountItem, ServiceItem, TotalItem];

    public static getClassByTypeString(type: string) {
        return this.itemClasses.find((c) => c.getTypeString() === type);
    }
}