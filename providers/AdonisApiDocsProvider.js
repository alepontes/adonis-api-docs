'use strict'

const { ServiceProvider } = require('@adonisjs/fold');
const { hooks } = require('@adonisjs/ignitor');
const RouteStore = require('@adonisjs/framework/src/Route/Store');
const Route = require('@adonisjs/framework/src/Route/index');

const StaticDocs = require('../middleware/StaticDocs');
const fs = require('fs');
const npm = require('npm');
const paths = require('../paths');

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
        const routesStringfy = JSON.stringify(routes);
        fs.writeFileSync(`${paths.template}/public/routes`, routesStringfy);
    }

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
