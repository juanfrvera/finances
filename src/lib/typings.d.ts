import type { IPayment } from "./util/typings/payment.typings";

export type ItemT = IAccount | IService | ICurrency | IDebt;
export type ItemWithPayments = IDebt | IService;
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
    payments?: IPayment[];
}

export interface IService extends iItem {
    type: 'service';
    name: string;
    cost: number;
    currency: string;
    /** If the payment has to be done manually */
    isManual: boolean;
    payments?: IPayment[];
}

export interface ICurrency extends iItem {
    type: 'currency';
    currency: string;
    total: number;
}
export interface ICurrencyUI extends ICurrency {
    accounts?: Array<{ _id: string, name: string, balance: number }>;
}
export interface IDebt extends iItem {
    type: 'debt';
    withWho: string;
    description: string;
    amount: number;
    currency: string;
    theyPayMe: boolean;
    payments?: IPayment[];
}

export interface IAsyncOp<Data, Success, Error> {
    data: Data;
    onComplete: (result: IAsyncOpResult<Success, Error>) => void;
}
export interface IAsyncOpResult<Success, Error> {
    successData?: Success; errorData?: Error;
}