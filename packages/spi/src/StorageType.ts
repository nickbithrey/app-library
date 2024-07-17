import { AppLibraryContext, AppType } from "@app-library/api";

export interface StorageType {
    get: (id: string, storeContext: AppLibraryContext) => Promise<AppType>;
    getAll: (storeContext: AppLibraryContext) => Promise<AppType[]>;
    upsert: (app: AppType, storeContext: AppLibraryContext) => Promise<AppType>;
    remove: (id: string, storeContext: AppLibraryContext) => Promise<AppType>;
}