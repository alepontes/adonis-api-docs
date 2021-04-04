const _ = require('lodash');

class BuildPaths {

    constructor(route) {
        this.route = route;
        this._path = [];
        this._query = [];
        this._body = [];

        this.groupKeys();
    }

    /** */
    groupKeys() {

        if (!this.route.rules) {
            return;
        }

        const keys = Object.keys(this.route.rules);

        for (const key of keys) {
            const values = this.route.rules[key];

            if (values.startsWith('query|')) {
                this._path.push(key);
            } else if (this._getPathParamByKey(key)) {
                this._query.push(key);
            } else {
                this._body.push(key);
            }
        }
    }

    /** */
    getVerb() {
        const verb = this.route.verbs.find(verb => verb !== 'HEAD');
        return verb.toLocaleLowerCase();
    }

    /** */
    getTag() {
        return this.route._route
            .split('/')
            .slice(1, 2)
            .join('/');
    }

    /** */
    getOperationId() {
        // TODO: ALTERAR AQUI MAIS TARDE
        return this.route.handler;
    }

    /** Format a URL for the swagger template
     * 
     * @example
     * // for 
     * /users/:id
     * 
     * // returns
     * /users/{id}
     */
    getFormatedRoute() {
        return this.route._route
            .split('/')
            .map(url => {
                if (url.startsWith(':')) {
                    url = url.replace(':', '');
                    return `{${url}}`;
                }
                return url;
            })
            .join('/');
    }

    /** Returns Path parameters */
    getPath() {
        return this.route._keys.map(pathParam => {
            return {
                name: pathParam.name,
                in: "path",
                // description: "ID of pet to update",
                required: !pathParam.optional,
                type: 'string',
                // format: "int64",
            }
        });
    }

    /** Returns Body parameters */
    getBody() {

        if (!this._body) {
            return [];
        }

        const properties = this._body.reduce((acc, cur) => {

            const rule = this._getRuleByKey(cur);

            if (!rule) {
                return acc;
            }

            return {
                ...acc,
                [cur]: rule.value,
            };
        }, {});

        const swaggerFormat = this._getSwaggerFormat(properties);

        return [{
            in: "body",
            name: "body",
            // description: "List of user object",
            required: true,
            schema: {
                type: "object",
                properties: swaggerFormat,
            }
        }];
    }

    /** Returns Query parameters */
    getQuery() {
        /* TODO: Verificar se estar listando tudo certo */
        return this._query.map(queryKey => {
            return {
                name: queryKey,
                in: "query",
                required: false,
                type: "string",
                collectionFormat: "multi",
            }
        });
    }

    /** Returns a path parameter by Key
     * @private
     */
    _getPathParamByKey(key) {
        return this.route._keys.find(param => param.name === key);
    }

    /**
     * @private
     */
    _getRuleByKey(key) {
        if (this.route.rules) {
            return {
                key,
                value: this.route.rules[key],
            }
        }
    }

    /** Format JSON of rules to Swagger format
     * @private
    */
    _getSwaggerFormat(obj) {
        const deepObject = this._toDeepObject(obj);
        return this._swaggerTyping(deepObject);
    }

    /** Add swagger typing
     * 
     * @example
     * // to
     * {
     *  item: 'require',
     *  array: [{
     *      item1: 'require',
     *      item2: 'require',
     *  }],
     *  object: {
     *      item1: 'require',
     *      item2: 'require',
     *  }
     * }
     * 
     * // returns
     * {
     * 	"item": {
     * 		"type": "string"
     * 	},
     * 	"array": {
     * 		"type": "array",
     * 		"items": {
     * 			"item1": {
     * 				"type": "string"
     * 			},
     * 			"item2": {
     * 				"type": "string"
     * 			}
     * 		}
     * 	},
     * 	"object": {
     * 		"type": "object",
     * 		"properties": {
     * 			"item1": {
     * 				"type": "string"
     * 			},
     * 			"item2": {
     * 				"type": "string"
     * 			}
     * 		}
     * 	}
     * }
     * 
     * @private
    */
    _swaggerTyping(obj) {
        return _.mapValues(obj, (value, key) => {
            if (_.isString(value)) {
                return {
                    type: 'string',
                }
            }

            if (_.isArray(value)) {
                return {
                    type: 'array',
                    items: this._swaggerTyping(value[0]),
                }
            }

            if (_.isObject(value)) {
                return {
                    type: 'object',
                    properties: this._swaggerTyping(value),
                }
            }

            return value;
        });

    }


    /** Flat object to deep object 
     * // to
     * {
     *   "id": "int",
     *   "item.lorem": "lorem",
     *   "item.ipsum": "ipsum",
     *   "products.*.id": "int",
     *   "products.*.price": "string",
     * }
     * // returns
     * {
     *    "id": "int",
     *    "item": {
     *        "lorem": "lorem",
     *        "ipsum": "ipsum",
     *     },
     *     "products": [{
     *         "id": "int",
     *         "price": "string",
     *     }],
     * }
    */
    _toDeepObject(obg) {
        const keys = Object.keys(obg);

        return keys.reduce((acc, cur) => {

            const key = cur;
            const value = obg[cur];

            const b = this._resolveNotation(key, value);
            return _.merge(acc, b);
        }, {});
    }

    _resolveNotation(key = '', value) {

        if (key.includes('.*.')) {
            const split = key.split('.*.');
            const lastElement = split.pop(-1);
            key = split.join('.*.');
            return this._resolveNotation(key, [{ [lastElement]: value }]);
        }

        if (key.includes('.')) {
            const split = key.split('.');
            const lastElement = split.pop(-1);
            key = split.join('.');
            return this._resolveNotation(key, { [lastElement]: value });
        }

        return {
            [key]: value,
        }

    }

}

module.exports = BuildPaths;