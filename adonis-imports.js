const { ServiceProvider } = require('@adonisjs/fold');
const { hooks } = require('@adonisjs/ignitor');
const RouteStore = require('@adonisjs/framework/src/Route/Store');
const Route = require('@adonisjs/framework/src/Route/index');

/** 
 * AdonisJS Internal Imports
 */
module.exports = {
    ServiceProvider,
    hooks,
    RouteStore,
    Route
}