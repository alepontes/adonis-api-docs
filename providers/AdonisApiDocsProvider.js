const { ServiceProvider } = require('@adonisjs/fold')
const { hooks } = require('@adonisjs/ignitor');
const RouteStore = require('@adonisjs/framework/src/Route/Store');
const Route = require('@adonisjs/framework/src/Route/index');

const path = require('path');
const fs = require('fs');

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
        const routesStringfy = JSON.stringify(routes);
        const dist = path.join(__dirname, '..', 'public', 'routes');
        fs.writeFileSync(dist, routesStringfy);
    }

    /**
     * Register the static resource middleware provider
     * 
     * @method registerStaticMiddleware
     * 
     * @return {void}
     */
    registerStaticMiddleware() { }

    /**
     * Register documentation router
     * 
     * @method registerDocRouter
     * 
     * @return {void}
     */
    registerDocRouter() {
        const handler = ({ response }) => response.status(418).send('Hello World');

        const routeInstance = new Route('/docs', handler, ['GET']);
        RouteStore.add(routeInstance);
    }

}

module.exports = AdonisApiDocsProvider
