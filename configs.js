const _ = require('lodash');

const configs = {
    swagger: {
        info: {
            description: "Mandala AWS API server.  You can find out more about Swagger at [http://swagger.io](http://swagger.io) or on [irc.freenode.net, #swagger](http://swagger.io/irc/).  For this sample, you can use the api key `special-key` to test the authorization filters.",
            version: "1.0.5",
            title: "Mandala API Docs",
            termsOfService: "http://swagger.io/terms/",
            contact: {
                "email": "apiteam@swagger.io"
            },
            license: {
                "name": "Apache 2.0",
                "url": "http://www.apache.org/licenses/LICENSE-2.0.html"
            }
        },
        host: "petstore.swagger.io",
        basePath: "/v2",
        securityDefinitions: {
            api_key: {
                type: "apiKey",
                name: "api_key",
                in: "header"
            },
            petstore_auth: {
                type: "oauth2",
                authorizationUrl: "https://petstore.swagger.io/oauth/authorize",
                flow: "implicit",
                scopes: {
                    'read:pets': "read your pets",
                    'write:pets': "modify pets in your account"
                }
            }
        },
        schemes: [
            "https",
            "http"
        ],
        externalDocs: {
            "description": "Find out more about Swagger",
            "url": "http://swagger.io"
        }
    }
}


module.exports = {
    get: function (key, defaultValue) {
        return _.get(configs, key, defaultValue);
    },
    set: function (key, value) {
        _.set(configs, key, value);
    },
}
