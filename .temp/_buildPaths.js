    /** */
    _buildPaths(routes = []) {

        // const _formatRoute = (route) => {
        //     return route
        //         .split('/')
        //         .map(url => {
        //             if (url.startsWith(':')) {
        //                 url = url.replace(':', '');
        //                 return `{${url}}`;
        //             }
        //             return url;
        //         })
        //         .join('/');
        // }

        // const _loadPathParams = (route) => {
        //     return route._keys.map(key => {
        //         return {
        //             name: key.name,
        //             in: "path",
        //             // description: "ID of pet to update",
        //             required: true,
        //             type: "integer",
        //             format: "int64",
        //         }
        //     });
        // }

        const _loadBodyParams = (body = {}) => {

            const keys = Object.keys(body);

            const properties = keys.reduce((acc, cur) => {
                return {
                    ...acc,
                    [cur]: { type: 'string' },
                };
            }, {});

            console.log('properties')
            console.log(properties)

            return [{
                in: "body",
                name: "body",
                description: "List of user object",
                required: true,
                schema: {
                    type: "object",
                    properties: properties,
                    // properties: {
                    //     id: { type: 'string' },
                    //     name: { type: 'string' },
                    // },
                }
            }];
        }

        const _loadQueryParams = (rules = []) => {
            // return route
            return [{
                name: "status",
                in: "query",
                required: true,
                type: "string",
                collectionFormat: "multi",
            }];
        }

        const _formatVerbs = (verbs = []) => {
            const verb = verbs.find(verb => verb !== 'HEAD');
            return verb.toLocaleLowerCase();
        }

        const groupParams = (route) => {

            let path = {};
            let body = {};
            let query = {};

            if (!route.rules) {
                return { path, body, query };
            }

            const keys = Object.keys(route.rules)

            for (const key of keys) {
                const rule = route.rules[key];

                if (rule.startsWith('query')) {
                    query[key] = rule;
                }

                if (rule.startsWith('path')) {
                    path[key] = rule;
                }

                if (rule.startsWith('') || rule.startsWith('body')) {
                    body[key] = rule;
                }
            }

            return { path, body, query };
        }

        return routes.reduce((acc, route) => {
            const verbHttp = _formatVerbs(route.verbs);
            const formatedRoute = _formatRoute(route._route);

            const { path, body, query } = groupParams(route);

            const pathParams = _loadPathParams(route);
            const bodyParams = _loadBodyParams(body);
            const queryParams = _loadQueryParams(route.rules);

            return {
                ...acc,
                [formatedRoute]: {
                    [verbHttp]: {
                        tags: [route.tag],
                        summary: '',
                        description: '',
                        operationId: `${Math.random()}`,
                        consumes: [
                            "application/json"
                        ],
                        produces: [
                            "application/json",
                            "application/xml"
                        ],
                        responses: {
                            "default": {
                                "description": "successful operation"
                            }
                        },
                        parameters: [
                            ...pathParams,
                            ...bodyParams,
                            ...queryParams,
                        ],
                    }
                },
            };
        }, {});
    }