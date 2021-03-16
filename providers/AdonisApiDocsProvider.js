'use strict'

const { ServiceProvider, hooks, RouteStore, Route } = require('../adonis-imports');

const StaticDocs = require('../middleware/StaticDocs');
const fs = require('fs');
const npm = require('npm');
const paths = require('../paths');
const _ = require('lodash');

class AdonisApiDocsProvider extends ServiceProvider {

    async boot() {
        hooks.after.preloading(() => {
            this.loadRoutes();
            this.buildTemplate();
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
        const groups = this.getGroups(routes);
        const routesStringfy = JSON.stringify(groups);
        fs.writeFileSync(`${paths.template}/public/routes`, routesStringfy);
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
     * Build templete Next with NPM API
     * 
     * @method buildTemplate
     * 
     * @return {void}
     */
    buildTemplate() {
        npm.load((err) => {

            err && console.log('Errouuuuuuuuu');

            npm.prefix = paths.root;
            npm.commands['run-script'](['template-build'], (err, data) => {
                console.log(err);
                console.log(data);
            });

            npm.on('log', (message) => {
                console.log(message);
            });
        });
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
            const index = fs.readFileSync(`${paths.public}/index.html`, 'utf-8');

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
