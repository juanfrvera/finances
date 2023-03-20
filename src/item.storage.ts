import type { IItemData } from "./typings";

export class ItemStorage {
    private static readonly itemsLocalStorageKey = "items";

    public static getItems(): IItemData[] {
        const listJsonString = localStorage.getItem(this.itemsLocalStorageKey);
        if (listJsonString != null) {
            return JSON.parse(listJsonString);
        }
        return [];
    }
    public static saveItems(items: IItemData[]) {
        localStorage.setItem(this.itemsLocalStorageKey, JSON.stringify(items));
    }
}