export type TransactionType = 'add' | 'subtract' | 'update';
export interface IPayment { _id?: string; dateString: string; amount: number; note?: string; transactionType?: TransactionType };

export interface IPayWindow {
    defaultAmount: number;
    saving?: boolean;
    editedPayment?: IPayment;
};

export interface IPaymentUI extends IPayment {
    usdAmount?: number;
}

export interface IPayTable {
    payments: IPaymentUI[];
    show?: boolean;
    showUsdColumn?: boolean;
}