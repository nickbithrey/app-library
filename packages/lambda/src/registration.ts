import { APIGatewayProxyHandler } from 'aws-lambda';
import { buildContext } from './context';
import { checkMethod } from './util';


export const registerApp: APIGatewayProxyHandler = async (event, context) => {

    console.log('event', JSON.stringify(event));
    if (!event.body) {
        return {
            statusCode: 400,
            body: JSON.stringify({
                error: 'No Application in request for registration'
            })
        };
    }
    if (!checkMethod(event.httpMethod, ['post', 'put'])) {
        return {
            statusCode: 400,
            body: JSON.stringify({
                error: 'Only put and patch accepted methods'
            })
        };
    }

    const parsedEvent = JSON.parse(event.body);
    
    const appContext = buildContext(event, context);

    try {
        const app = await appContext.service.registerApp(parsedEvent, appContext);

        return {
            statusCode: 200,
            body: JSON.stringify({
                message: 'Registered application ' + app.id,
                application: app
            })
        };
    } catch (err) {
        console.log('Error in registering application', JSON.stringify(err))
        return {
            statusCode: 500,
            body: JSON.stringify({
                error: 'Error in storing application'
            })
        }
    }
}