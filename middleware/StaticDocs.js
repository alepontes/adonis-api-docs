'use strict'

/*
 * This code was just copied from Adonis Core
*/

const serveStatic = require('serve-static')
const defaultConfig = {}
let staticServer = null

/**
 * Server middleware to serve static resources. All GET and HEAD
 * requests are handled by this middleware and response is
 * made when there is a resource inside the `public`
 * directory.
 *
 * @binding Adonis/Src/Static
 * @alias Static
 * @group Http
 *
 * @class Static
 */
class Static {
  /**
   * The handle method called by Server on each request
   *
   * @method handle
   *
   * @param  {Object}   options.request
   * @param  {Object}   options.response
   * @param  {Function} next
   *
   * @return {void}
   */
  async handle ({ request, response }, next) {
    if (['GET', 'HEAD'].indexOf(request.method()) === -1) {
      return next()
    }

    try {
      await staticServer(request.request, request.response)
    } catch (error) {
      if (error.status === 404) {
        return next()
      }
      error.message = `${error.message} while resolving ${request.url()}`
      throw error
    }
  }

}

module.exports = function (publicPath, Config, promisify) {
  /**
   * Mount the static server if not already mounted
   */
  if (!staticServer) {
    const options = Config.merge('app.static', defaultConfig)
    options.fallthrough = false
    staticServer = promisify(serveStatic(publicPath, options))
  }

  /**
   * Return middleware
   */
  return new Static()
}
