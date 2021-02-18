const mongo = require('../lib/mongo')
const logger = require('../lib/logger')
const publicDocTypes = require('../lib/public-doctypes')

function getParams (url) {
  const list = url.split('/')
  return {
    type: list[3],
    category: list[4]
  }
}

module.exports = async (request, response) => {
  const db = await mongo()
  const logs = db.collection(process.env.MONGODB_COLLECTION)
  const params = getParams(request.url)
  const { type, category } = params
  const query = type ? { type: type, variant: { $in: category ? [category] : publicDocTypes } } : { variant: { $in: category ? [category] : publicDocTypes } }
  logger('info', ['routes', 'total', 'type', type || 'any'])
  try {
    const count = await logs.countDocuments(query)
    logger('info', ['routes', 'total', 'success', count])
    response.json({ total: count })
  } catch (error) {
    logger('error', ['routes', 'total', error])
    response.status(500)
    response.send(error)
  }
}
