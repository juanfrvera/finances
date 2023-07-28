export abstract class StoreLogic {
    public static getTypeString() { return ""; }
}
export class LocalStoreLogic extends StoreLogic {
    public static getTypeString() { return "localStore" }
}
export class DBStoreLogic extends StoreLogic {
    public static getTypeString() { return "dbStore" }
}

export class StoreHelper {
    private static readonly logics: Array<typeof StoreLogic> = [LocalStoreLogic];

    public static getLogicByType(typeString: string) {
        return this.logics.find((l) => l.getTypeString() === typeString);
    }
}