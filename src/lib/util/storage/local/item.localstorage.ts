import type { IItemData } from "@/lib/typings";

export class ItemStorage {
    private static readonly itemsLocalStorageKey = "items";

    public static getItems(filter?: { type?: string }): IItemData[] {
        const listJsonString = localStorage.getItem(this.itemsLocalStorageKey);
        if (listJsonString != null) {
            let list: IItemData[] = JSON.parse(listJsonString);

            if (filter != null) {
                if (filter.type != null) {
                    list = list.filter((i) => i.type === filter.type);
                }
            }

            return list;
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