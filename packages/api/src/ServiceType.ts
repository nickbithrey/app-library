import { AppLibraryContext } from "./AppLibraryContext";
import { AppType } from "./AppType";

export type ServiceType = {
    getApp: (id: string, storeContext: AppLibraryContext) => Promise<AppType>;
    getApps: (storeContext: AppLibraryContext) => Promise<AppType[]>;
    registerApp: (app: AppType, storeContext: AppLibraryContext) => Promise<AppType>;
    removeApp: (id: string, storeContext: AppLibraryContext) => Promise<AppType>;
}