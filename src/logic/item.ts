import AccountItemRender from "../routes/item-render/account-item-render.svelte";
import ServiceItemRender from "../routes/item-render/service-item-render.svelte";

export type ItemRenderer = typeof AccountItemRender | typeof ServiceItemRender;

export abstract class Item {
    public static getTypeString() { return ""; }
    public static getRenderer(): ItemRenderer { return AccountItemRender; }
}

export class AccountItem extends Item {
    public static getTypeString(): string { return "Account"; }
    public static getRenderer(): ItemRenderer { return AccountItemRender; }
}

export class ServiceItem extends Item {
    public static getTypeString(): string { return "Service"; }
    public static getRenderer(): ItemRenderer { return ServiceItemRender; }
}

export class ItemHelper {
    private static readonly itemClasses: Array<typeof Item> = [AccountItem, ServiceItem];

    public static getClassByTypeString(type: string) {
        return this.itemClasses.find((c) => c.getTypeString() === type);
    }
}