'use strict'

const { ServiceProvider, hooks, RouteStore, Route, resolver } = require('../adonis-imports');

const StaticDocs = require('../middleware/StaticDocs');
const fs = require('fs');
const paths = require('../paths');
const _ = require('lodash');

class AdonisApiDocsProvider extends ServiceProvider {

    async boot() {
        hooks.after.preloading(() => {
            this.loadRoutes();
            this.registerStaticMiddleware();
            this.registerDocRouter();
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
        const rules = this.loadRules(routes);
        const groups = this.getGroups(rules);
        this.writeRoutes(groups);
    }

    /**
     * Groups endpoints by path 
     * 
     * @method getGroups
     * 
     * @return {Array}
     */
    getGroups(routes) {

        const routesWithGroup = routes.map(route => {
            route.group = route._route
                .split('/')
                .slice(0, 2)
                .join('/');

            return route;
        });

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
        // fs.writeFileSync(`${paths.absolutePath}/routes.json`, routesStringfy);
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

}

module.exports = AdonisApiDocsProvider
