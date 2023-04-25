import type { IItemData } from "../typings";

export class ItemStore {
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
    public static deleteItem(item: IItemData) {
        const list = this.getItems();
        if (list != null && list.length > 0) {
            this.saveItems(list.filter((i) => i.id != item.id));
        }
    }
}