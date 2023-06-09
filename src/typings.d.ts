// eslint-disable-next-line @typescript-eslint/no-explicit-any
export interface IItemData<T = any> {
    id: string;
    type: string;
    config: T;
    updateDate?: Date;
}

export type IItemConfig = IAccountConfig | IServiceConfig | IDebtConfig | ICurrencyConfig;
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
    paidDate: string;
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
    type: string;
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