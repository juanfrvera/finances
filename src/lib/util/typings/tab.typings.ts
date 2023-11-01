export interface ITab<T> {
    title: string;
    active?: boolean;
    type: T;
}