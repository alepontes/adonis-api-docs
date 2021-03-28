// const { ServiceProvider } = require('@adonisjs/fold');
// const { hooks } = require('@adonisjs/ignitor');
// const RouteStore = require('@adonisjs/framework/src/Route/Store');
// const Route = require('@adonisjs/framework/src/Route/index');
// const { resolver } = require('@adonisjs/fold');

const adonis = `../../test-api/node_modules/@adonisjs`;
const { ServiceProvider } = require(`${adonis}/fold`);
const { hooks } = require(`${adonis}/ignitor`);
const RouteStore = require(`${adonis}/framework/src/Route/Store`);
const Route = require(`${adonis}/framework/src/Route/index`);
const { resolver } = require(`${adonis}/fold`);

/** 
 * AdonisJS Internal Imports
 */
module.exports = {
    ServiceProvider,
    hooks,
    RouteStore,
    Route,
    resolver,
}