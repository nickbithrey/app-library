import { AppType } from '@app-library/api';
import Serverless, { Options } from 'serverless';
import Plugin, { Logging, Commands, Hooks } from 'serverless/classes/Plugin'

type Registration = {
    app: AppType;
    url: string;
}

class RegistrationPlugin implements Plugin {

    serverless: Serverless
    commands: Commands = {};
    hooks: Hooks;
    log;
    writeText

    constructor(sls: Serverless, options: Options, { log, writeText }: Logging) {
        this.serverless = sls
        this.log = log;
        this.writeText = writeText;
        this.hooks = {
            initialize: () => this.init(),
            'after:deploy:deploy': () => this.afterDeploy(),
        }
    }

    init() {
        this.log.info('Registration Plugin initialised')
    }

    afterDeploy() {
        const {app, url} = this.serverless.service.custom.registration as Registration;
        this.log.info('Registering app', app, 'at url', JSON.stringify(url))
        this.writeText(`Registering application ${app.id}`)
        fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(app)
        }).then(res => {
            this.log.success(`App ${app.id} sent for registration with response ${JSON.stringify(res)}`);
            this.writeText(`Application ${app.id} sent for registration with response ${JSON.stringify(res)}`)
        }).catch(err => {
            this.log.error(`App ${app.id} failed to register due to ${JSON.stringify(err)}`);
            this.writeText(`Application ${app.id} failed to register due to ${JSON.stringify(err)}`)
            throw err
        })
    }

}

module.exports = RegistrationPlugin