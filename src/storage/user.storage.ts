export class UserStore {
    private static readonly storeTypeOnLocalStoreKey = "storeType";

    public static hasValidSession() {
        let storeType = localStorage.getItem(this.storeTypeOnLocalStoreKey);
        return storeType != null;
    }
}