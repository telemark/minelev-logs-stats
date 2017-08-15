'use strict'

// Packages
const Router = require('router')
const finalhandler = require('finalhandler')

// Utilities
const routes = require('./lib/routes')

// Initialize a new router
const router = Router()

router.get('/', routes.frontpage)
router.get('/stats/total', routes.total)
router.get('/stats/total/:type', routes.total)
router.get('/stats/schools', routes.schools)
router.get('/stats/categories', routes.categories)
router.get('/stats/queue', routes.queue)

module.exports = (request, response) => {
  router(request, response, finalhandler(request, response))
}

/*
const readFileSync = require('fs').readFileSync
const marked = require('marked')
const { send } = require('micro')
const resolveRequest = require('./lib/resolve-request')
const handleStats = require('./lib/handle-stats')
const logger = require('./lib/logger')

module.exports = async (request, response) => {
  const query = await resolveRequest(request)
  try {
    if (query.domain === 'stats') {
      logger('info', ['index', 'stats'])
      const result = await handleStats(query)
      response.setHeader('Access-Control-Allow-Origin', '*')
      send(response, 200, result)
    } else {
      logger('info', ['index', 'frontpage'])
      const readme = readFileSync('./README.md', 'utf-8')
      const html = marked(readme)
      send(response, 200, html)
    }
  } catch (error) {
    logger('error', ['index', error])
    send(response, 500, error)
  }
}
*/
