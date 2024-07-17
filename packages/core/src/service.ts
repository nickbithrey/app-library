import { AppType } from '@app-library/api';
import { ServiceType } from '@app-library/api/src/ServiceType';
import { AppLibraryContext, StorageType } from '@app-library/spi';

export class Service implements ServiceType {

    constructor(readonly storageProvider: StorageType) {
    }

    getApp(id: string, context: AppLibraryContext) {
        console.info('Getting Application', id);
        return this.storageProvider.get(id, context);
    }
    
    getApps(context: AppLibraryContext) {
        console.info('Getting all applications');
        return this.storageProvider.getAll(context);
    }
    
    registerApp(app: AppType, context: AppLibraryContext) {
        console.info('Registering application', JSON.stringify(app));
        return this.storageProvider.upsert(app, context);
    }
    
    removeApp(id: string, context: AppLibraryContext) {
        console.info('Removing application', id);
        return this.storageProvider.remove(id, context);
    }
};

