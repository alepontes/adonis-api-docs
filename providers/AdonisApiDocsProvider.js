'use strict'

const { ServiceProvider, hooks, RouteStore, Route, resolver } = require('../adonis-imports');

const StaticDocs = require('../middleware/StaticDocs');
const fs = require('fs');
const paths = require('../paths');
const _ = require('lodash');
const Config = require('../configs');
const BuildPaths = require('../BuildPaths');

class AdonisApiDocsProvider extends ServiceProvider {

    async boot() {
        hooks.after.preloading(() => {
            this.loadRoutes();
            this.registerStaticMiddleware();
            this.registerDocRouter();
            this.removeTemplate();
        });
    }

    /**
     * Load routes from app/routes.js
     * 
     * @method loadRoutes
     * 
     * @return {void}
     */
    loadRoutes() {
        const routes = RouteStore.list();
        const routesWithRules = this.loadRules(routes);
        const buildSwagger = this.buildSwagger(routesWithRules);
        this.writeRoutes(buildSwagger);
    }

    /** 
     * Build Swagger template
     * 
     * @method buildSwagger
     * 
     * @return {String}
    */
    buildSwagger(routes) {
        const paths = this.getPaths(routes);
        const tags = this.getTags(routes);
        const definitions = this.getDefinitions();

        console.log(paths);

        return {
            swagger: "2.0",
            paths: paths,
            tags: tags,
            info: Config.get('swagger.info'),
            host: Config.get('swagger.host'),
            basePath: Config.get('swagger.basePath'),
            schemes: Config.get('swagger.schemes'),
            securityDefinitions: Config.get('swagger.securityDefinitions'),
            externalDocs: Config.get('swagger.externalDocs'),
            definitions: definitions,
        };

    }

    getPaths(routes) {

        const groups = this._groupByRoute(routes);

        return groups.reduce((acc, group) => {
            return {
                ...acc,
                [group.route]: group.group.reduce((acc, cur) => {

                    const buildPaths = new BuildPaths(cur);

                    const httpVerb = buildPaths.getVerb();
                    const tag = buildPaths.getTag()

                    const operationId = buildPaths.getOperationId();

                    const bodyParams = buildPaths.getBody();
                    const pathParams = buildPaths.getPath();
                    const queryParams = buildPaths.getQuery();

                    return {
                        ...acc,
                        [httpVerb]: {
                            tags: [tag],
                            // "summary": "Add a new pet to the store",
                            // "description": "",
                            operationId: operationId,
                            consumes: [
                                "application/json",
                            ],
                            produces: [
                                "application/json",
                            ],
                            parameters: [
                                ...bodyParams,
                                ...pathParams,
                                ...queryParams,
                            ],
                            responses: {
                                "default": {
                                    "description": "successful operation"
                                }
                            },
                            security: [
                                {
                                    "petstore_auth": [
                                        "write:pets",
                                        "read:pets"
                                    ]
                                }
                            ]
                        },
                    }

                }, {}),
            }
        });

    }

    _groupByRoute(routes) {
        return _.chain(routes)
            .groupBy('_route')
            .map((value, key) => ({ route: key, group: value }))
            .value();
    }

    /** */
    getTags(routes = []) {

        const tags = routes.map(route => (new BuildPaths(route)).getTag());

        const uniqueTag = _.uniqBy(tags, (tag) => {
            return tag;
        });

        return uniqueTag.map(tag => {
            return {
                name: tag,
                // description: "Access to Petstore orders",
            }
        });
    }

    /** */
    getDefinitions() {
        return {
            "ApiResponse": {
                "type": "object",
                "properties": {
                    "code": {
                        "type": "integer",
                        "format": "int32"
                    },
                    "type": {
                        "type": "string"
                    },
                    "message": {
                        "type": "string"
                    }
                }
            },
            "Category": {
                "type": "object",
                "properties": {
                    "id": {
                        "type": "integer",
                        "format": "int64"
                    },
                    "name": {
                        "type": "string"
                    }
                },
                "xml": {
                    "name": "Category"
                }
            },
            "Pet": {
                "type": "object",
                "required": [
                    "name",
                    "photoUrls"
                ],
                "properties": {
                    "id": {
                        "type": "integer",
                        "format": "int64"
                    },
                    "category": {
                        "$ref": "#/definitions/Category"
                    },
                    "name": {
                        "type": "string",
                        "example": "doggie"
                    },
                    "photoUrls": {
                        "type": "array",
                        "xml": {
                            "wrapped": true
                        },
                        "items": {
                            "type": "string",
                            "xml": {
                                "name": "photoUrl"
                            }
                        }
                    },
                    "tags": {
                        "type": "array",
                        "xml": {
                            "wrapped": true
                        },
                        "items": {
                            "xml": {
                                "name": "tag"
                            },
                            "$ref": "#/definitions/Tag"
                        }
                    },
                    "status": {
                        "type": "string",
                        "description": "pet status in the store",
                        "enum": [
                            "available",
                            "pending",
                            "sold"
                        ]
                    }
                },
                "xml": {
                    "name": "Pet"
                }
            },
            "Tag": {
                "type": "object",
                "properties": {
                    "id": {
                        "type": "integer",
                        "format": "int64"
                    },
                    "name": {
                        "type": "string"
                    }
                },
                "xml": {
                    "name": "Tag"
                }
            },
            "Order": {
                "type": "object",
                "properties": {
                    "id": {
                        "type": "integer",
                        "format": "int64"
                    },
                    "petId": {
                        "type": "integer",
                        "format": "int64"
                    },
                    "quantity": {
                        "type": "integer",
                        "format": "int32"
                    },
                    "shipDate": {
                        "type": "string",
                        "format": "date-time"
                    },
                    "status": {
                        "type": "string",
                        "description": "Order Status",
                        "enum": [
                            "placed",
                            "approved",
                            "delivered"
                        ]
                    },
                    "complete": {
                        "type": "boolean"
                    }
                },
                "xml": {
                    "name": "Order"
                }
            },
            "User": {
                "type": "object",
                "properties": {
                    "id": {
                        "type": "integer",
                        "format": "int64"
                    },
                    "username": {
                        "type": "string"
                    },
                    "firstName": {
                        "type": "string"
                    },
                    "lastName": {
                        "type": "string"
                    },
                    "email": {
                        "type": "string"
                    },
                    "password": {
                        "type": "string"
                    },
                    "phone": {
                        "type": "string"
                    },
                    "userStatus": {
                        "type": "integer",
                        "format": "int32",
                        "description": "User Status"
                    }
                },
                "xml": {
                    "name": "User"
                }
            }
        };
    }


    /**
     * Groups endpoints by path 
     * 
     * @method getGroups
     * @private
     * @return {Array}
     */
    addTags(routes) {

        const routesWithGroup = routes.map(route => {
            route.tag = route._route
                .split('/')
                .slice(1, 2)
                .join('/');

            return route;
        });

        console.log('routesWithGroup');
        console.log(routesWithGroup);

        return _.chain(routesWithGroup)
            .groupBy('group')
            .map((value, key) => ({ group: key, routes: value }))
            .value();
    }

    /**
     * load route validator rules 
     * 
     * @method loadRules
     * 
     * @return {void}
     */
    loadRules(routes = []) {

        const routerList = [];

        for (const route of routes) {
            const av = route.middlewareList.find(middleware => middleware.startsWith('av:'));
            if (!av) {
                routerList.push(route);
            } else {
                const validator = av.replace('av:', '');
                const validatorInstance = resolver.forDir('validators').resolve(validator);

                routerList.push({
                    ...route,
                    rules: validatorInstance.rules,
                });
            }
        }

        return routerList;
    }

    /**
     * write routes
     * 
     * @method writeRoutes
     * 
     * @return {void}
     */
    writeRoutes(routes) {
        const routesStringfy = JSON.stringify(routes);
        fs.writeFileSync(`${paths.public}/routes.json`, routesStringfy);
    }

    /**
     * Register the static resource middleware provider
     * 
     * @method registerStaticMiddleware
     * 
     * @return {void}
     */
    registerStaticMiddleware() {
        this.app.bind('Adonis/Middleware/StaticDocs', (app) => {
            const Helpers = app.use('Adonis/Src/Helpers');
            return StaticDocs(`${paths.public}`, app.use('Adonis/Src/Config'), Helpers.promisify);
        });

        const Server = use('Server')
        Server.use(['Adonis/Middleware/StaticDocs'])
    }

    /**
     * Register documentation router
     * 
     * @method registerDocRouter
     * 
     * @return {void}
     */
    registerDocRouter() {
        const handler = ctx => {
            const index = fs.readFileSync(`${paths.root}/assets/index.html`, 'utf-8');

            const response = ctx.response.response
            response.writeHeader(200, { "Content-Type": "text/html" });
            response.write(index);
            response.end();
        };

        const routeInstance = new Route('/docs', handler, ['GET']);
        RouteStore.add(routeInstance);
    }

    /** 
     * Remove HTML template
     * 
     * @method removeTemplate
     * 
     * @return {void}
    */
    removeTemplate() {
        const index = `${paths.public}/index.html`;
        fs.existsSync(index) && fs.unlinkSync(index);
    }

}

module.exports = AdonisApiDocsProvider
