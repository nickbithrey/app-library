import { AppLibraryContext } from "@app-library/api/src/types/AppLibraryContext";
import { AppType } from "@app-library/api/src/types/AppType";
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, GetCommand, PutCommand, ScanCommand } from "@aws-sdk/lib-dynamodb";

const dbClient = new DynamoDBClient();
const docClient = DynamoDBDocumentClient.from(dbClient);

export const putApp = async (app: AppType, context: AppLibraryContext) => {
    const result = await docClient.send(new PutCommand({
        TableName: context.tableName,
        Item: app,
        ReturnValues: 'ALL_OLD'
    }));
    console.info('Updated app', app.id, 'from', JSON.stringify(result.Attributes), 'to', JSON.stringify(app));
    return app;
}

export const getApp = async (id: string, context: AppLibraryContext) => {
    const result = await docClient.send(new GetCommand({
        TableName: context.tableName,
        Key: {
            id
        }
    }));
    console.info('Retrieved app', id);
    return result.Item;
}

export const getAllApps = async (context: AppLibraryContext) => {
    const result = await docClient.send(new ScanCommand({
        TableName: context.tableName
    }));
    console.info('Retrieved', result.Count, 'apps');
    return result.Items;
}