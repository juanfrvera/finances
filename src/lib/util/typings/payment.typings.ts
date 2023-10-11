export interface IPayment { dateString: string; amount: number; note?: string; };

export interface IPayWindow {
    defaultAmount: number;
    saving?: boolean;
    editedPayment?: IPayment;
};