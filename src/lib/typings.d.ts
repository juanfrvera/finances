export type Item = IAccount | IService | ICurrency | IDebt;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export interface iItem<T = any> {
    _id: string;
    updateDate?: Date;
}

export interface IAccount extends iItem {
    type: 'account';
    config: IAccountConfig;
}

export interface IService extends iItem {
    type: 'service';
    config: IServiceConfig;
}

export interface ICurrency extends iItem {
    type: 'currency';
    config: ICurrencyConfig;
}
export interface IDebt extends iItem {
    type: 'debt';
    config: IDebtConfig;
}

export type iItemConfig = IAccountConfig | IServiceConfig | IDebtConfig | ICurrencyConfig;
export interface IAccountConfig {
    name: string;
    balance: number;
    currency: string;
}
export interface IServiceConfig {
    name: string;
    cost: number;
    currency: string;
    /** If the payment has to be done manually */
    isManual: boolean;
    lastPayDateString: string;
}
export interface ICurrencyConfig {
    currency: string;
    total: number;
}
export interface IDebtConfig {
    withWho: string;
    description: string;
    amount: number;
    currency: string;
    theyPayMe: boolean;
    paidDate?: string;
}

export interface IAsyncOp<Data, Success, Error> {
    data: Data;
    onComplete: (result: IAsyncOpResult<Success, Error>) => void;
}
export interface IAsyncOpResult<Success, Error> {
    successData?: Success; errorData?: Error;
}

//#region Creation
export interface IItemCreationData<T = ICreationConfig> {
    type: ItemType;
    config: T;
}

export type ICreationConfig = IAccountCreationConfig | IServiceCreationConfig | IDebtCreationConfig | ICurrencyCreationConfig;

export interface IAccountCreationConfig {
    name?: string;
    balance?: number;
    currency?: string;
}
export interface IServiceCreationConfig {
    name?: string;
    cost?: number;
    currency?: string;
    /** If the payment has to be done manually */
    isManual?: boolean;
}
export interface IDebtCreationConfig {
    withWho?: string;
    amount?: number;
    currency?: string;
    theyPayMe?: boolean;
    description?: string;
}
export interface ICurrencyCreationConfig {
    currency?: string;
    total?: number;
}
//#endregion