export type Item = IAccount | IService | ICurrency | IDebt;
export type ItemType = 'account' | 'service' | 'currency' | 'debt';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export interface iItem<T = any> {
    _id: string;
    updateDate?: Date;
}

export interface IAccount extends iItem {
    type: 'account';
    name: string;
    balance: number;
    currency: string;
}

export interface IService extends iItem {
    type: 'service';
    name: string;
    cost: number;
    currency: string;
    /** If the payment has to be done manually */
    isManual: boolean;
    lastPayDateString: string;
}

export interface ICurrency extends iItem {
    type: 'currency';
    currency: string;
    total: number;
}
export interface IDebt extends iItem {
    type: 'debt';
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