const { hooks } = require('@adonisjs/ignitor');

const { ServiceProvider } = require('@adonisjs/fold');

const RouteStore = require('@adonisjs/framework/src/Route/Store');

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
    registerDocRouter() { }

}

module.exports = AdonisApiDocsProvider
