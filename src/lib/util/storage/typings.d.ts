export interface IStorage<T> {
    getAll: () => Promise<T[]>;
    delete: (id: string) => Promise;
}