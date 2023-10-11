export interface IPayment { dateString: string; amount: number; note?: string; };

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