'use strict'

// Packages
const Router = require('router')
const finalhandler = require('finalhandler')
const cors = require('cors')

// Utilities
const routes = require('./lib/routes')

// Initialize a new router
const router = Router()

// CORS
router.use(cors({methods: ['GET']}))

router.get('/', routes.frontpage)
router.get('/stats/total', routes.total)
router.get('/stats/total/:type', routes.total)
router.get('/stats/schools', routes.schools)
router.get('/stats/schools/:type', routes.schools)
router.get('/stats/categories', routes.categories)
router.get('/stats/queue', routes.queue)

module.exports = (request, response) => {
  router(request, response, finalhandler(request, response))
}
