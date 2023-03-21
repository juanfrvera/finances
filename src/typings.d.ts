export interface IItemData<T = any> {
    id: string;
    type: string;
    config: T;
}

export type IItemConfig = IAccountItemConfig | IServiceItemConfig;
export interface IAccountItemConfig {
    name: string;
    balance: number;
    currency: string;
}
export interface IServiceItemConfig {
    name: string;
    cost: number;
    currency: string;
    /** If the payment has to be done manually */
    isManual: boolean;
    lastPayDate: Date;
}
export interface ITotalItemConfig {
    currencies: Array<{ name: string; total: number; }>;
}

export interface IAsyncOp<Data, Success, Error> {
    data: Data;
    onComplete: (result: IAsyncOpResult<Success, Error>) => void;
}
export interface IAsyncOpResult<Success, Error> {
    successData?: Success; errorData?: Error;
}

//#region Creation
export interface IItemCreationData<T = IItemCreationConfig> {
    type: string;
    config: T;
}

export type IItemCreationConfig = IAccountItemCreationConfig | IServiceItemCreationConfig;

export interface IAccountItemCreationConfig {
    name?: string;
    balance?: number;
    currency?: string;
}
export interface IServiceItemCreationConfig {
    name?: string;
    cost?: number;
    currency?: string;
    /** If the payment has to be done manually */
    isManual: boolean;
}
//#endregion