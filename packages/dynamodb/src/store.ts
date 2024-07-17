import { AppLibraryContext, AppType } from '@app-library/api';
import { StorageType } from '@app-library/spi';
import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DeleteCommand, DynamoDBDocumentClient, GetCommand, PutCommand, ScanCommand } from "@aws-sdk/lib-dynamodb";

const dbClient = new DynamoDBClient();
const docClient = DynamoDBDocumentClient.from(dbClient);

export type StoreContext = {
    tableName: string;
};

const putApp = async (app: AppType, storeContext: StoreContext) => {
    const result = await docClient.send(new PutCommand({
        TableName: storeContext.tableName,
        Item: app,
        ReturnValues: 'ALL_OLD'
    }));
    console.info('Updated app', app.id, 'from', JSON.stringify(result.Attributes), 'to', JSON.stringify(app));
    return app;
}

const TABLE_NAME = process.env.DYNAMODB_TABLE;
const getApp = async (id: string, context: StoreContext) => {
    const result = await docClient.send(new GetCommand({
        TableName: context.tableName,
        Key: {
            id
        }
    }));
    console.info('Retrieved app', id);
    return result.Item as AppType;
}

const removeApp = async (id: string, context: StoreContext) => {
    const result = await docClient.send(new DeleteCommand({
        TableName: context.tableName,
        Key: {
            id
        }
    }));
    console.info('Retrieved app', id);
    return result.Attributes as AppType;
}

const getAllApps = async (context: StoreContext) => {
    const result = await docClient.send(new ScanCommand({
        TableName: context.tableName
    }));
    console.info('Retrieved', result.Count, 'apps');
    return result.Items as AppType[];
}

export class DynamodbStore implements StorageType {
    
    private readonly tableName: string;

    constructor(tableName: string) {
        this.tableName = tableName;
    }

    get = (id: string, storeContext: AppLibraryContext) => { return getApp(id, {tableName: this.tableName}); }
    getAll = (storeContext: AppLibraryContext) => { return getAllApps({tableName: this.tableName}) };
    upsert = (app: AppType, storeContext: AppLibraryContext) => { return putApp(app, {tableName: this.tableName}) };
    remove = (id: string, storeContext: AppLibraryContext) => { return removeApp(id, {tableName: this.tableName}) };

}