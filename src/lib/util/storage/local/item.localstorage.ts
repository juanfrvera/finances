import type { iItem } from "@/lib/typings";

export class ItemStorage {
    private static readonly itemsLocalStorageKey = "items";

    public static getItems(filter?: { type?: string }): iItem[] {
        const listJsonString = localStorage.getItem(this.itemsLocalStorageKey);
        if (listJsonString != null) {
            let list: iItem[] = JSON.parse(listJsonString);

            if (filter != null) {
                if (filter.type != null) {
                    list = list.filter((i) => i.type === filter.type);
                }
            }

            return list;
        }
        return [];
    }
    public static saveItems(items: iItem[]) {
        localStorage.setItem(this.itemsLocalStorageKey, JSON.stringify(items));
    }
    public static deleteItem(item: iItem) {
        const list = this.getItems();
        if (list != null && list.length > 0) {
            this.saveItems(list.filter((i) => i._id != item._id));
        }
    }
}