import { APIGatewayProxyHandler } from 'aws-lambda';
import { buildContext } from './context';
import { checkMethod } from './util';

export const getService: APIGatewayProxyHandler = async (event, context) => {

    console.log('Event', JSON.stringify(event));
    if (!checkMethod(event.httpMethod, ['get'])) {
        return {
            statusCode: 400,
            body: JSON.stringify({
                error: 'Only get accepted method'
            })
        };
    }

    const id = event.pathParameters?.id;
    if (!id) {
        return {
            statusCode: 400,
            body: JSON.stringify({
                error: 'Cannot get application with no id.'
            })
        };
    }
    
    const appContext = buildContext(event, context);

    try {
        const app = await appContext.service.getApp(id, appContext);

        return {
            statusCode: 200,
            body: JSON.stringify(app)
        };
    } catch (err) {
        console.log('Error in getting application', JSON.stringify(err))
        return {
            statusCode: 500,
            body: JSON.stringify({
                error: 'Error in getting application with id ' + id
            })
        }
    }
}