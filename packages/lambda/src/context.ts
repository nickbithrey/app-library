import { Service } from '@app-library/core';
import { DynamodbStore } from '@app-library/dynamodb';
import { APIGatewayEvent, Context } from 'aws-lambda';

const TABLE_NAME = process.env.DYNAMODB_TABLE;

export const buildContext = (event: APIGatewayEvent, context: Context) => {
    if (!TABLE_NAME) {
        console.error('DynamoDB Table not defined');
        throw Error('Service configured incorrectly');
    }
    return {
        service: new Service(new DynamodbStore(TABLE_NAME))
    }
}