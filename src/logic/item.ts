import AccountConfig from "../routes/creation-configs/account-config.svelte";
import ServiceConfig from "../routes/creation-configs/service-config.svelte";
import AccountItemRender from "../routes/item-render/account-item-render.svelte";
import ServiceItemRender from "../routes/item-render/service-item-render.svelte";
import type { IAccountItemCreationConfig, IItemCreationData } from "../typings";

export type ItemRenderer = typeof AccountItemRender | typeof ServiceItemRender;
export type ConfigRenderer = typeof AccountConfig | typeof ServiceConfig;

export abstract class Item {
    public static getTypeString() { return ""; }
    public static getRenderer(): ItemRenderer { return AccountItemRender; }
    public static getConfigRenderer(): ConfigRenderer { return AccountConfig; }
}

export class AccountItem extends Item {
    public static getTypeString(): string { return "Account"; }
    public static getRenderer(): ItemRenderer { return AccountItemRender; }
    public static getConfigRenderer(): ConfigRenderer { return AccountConfig; }
    public static getDefaultData(): IItemCreationData<IAccountItemCreationConfig> {
        return { type: this.getTypeString(), config: { name: '', balance: 0, currency: 'ars' } };
    }
}

export class ServiceItem extends Item {
    public static getTypeString(): string { return "Service"; }
    public static getRenderer(): ItemRenderer { return ServiceItemRender; }
    public static getConfigRenderer(): ConfigRenderer { return ServiceConfig; }
}

export class ItemHelper {
    private static readonly itemClasses: Array<typeof Item> = [AccountItem, ServiceItem];

    public static getClassByTypeString(type: string) {
        return this.itemClasses.find((c) => c.getTypeString() === type);
    }
}