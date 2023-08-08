export class UserStore {
    public static enableSync() {
        localStorage.setItem(localStorageKeys.syncEnabled, JSON.stringify(true));
    }
    public static isSyncEnabled() {
        return !!localStorage.getItem(localStorageKeys.syncEnabled);
    }
    public static hasLocalData() {
        return !!localStorage.getItem(localStorageKeys.hasLocalData);
    }
}

const localStorageKeys = {
    syncEnabled: 'SYNC_ENABLED',
    hasLocalData: 'LOCAL_DATA'
}