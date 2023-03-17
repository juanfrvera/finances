export interface IItemData<T> extends IItemCreationData<T> {
    id: string;
}

export interface IItemCreationData<T> {
    type: string;
    config: T;
}

export interface IAccountItem {
    name: string;
    balance: number;
    currency: string;
}
export interface IServiceItem {
    name: string;
    cost: number;
    currency: string;
}

export type IItem = IAccountItem | IServiceItem;