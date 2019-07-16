const mongo = require('../lib/mongo')
const logger = require('../lib/logger')

function getParams (url) {
  const list = url.split('/')
  return {
    category: list[4]
  }
}

module.exports = async (request, response) => {
  const db = await mongo()
  const logs = db.collection(process.env.MONGODB_COLLECTION)
  const params = getParams(request.url)
  const { category } = params
  const query = { documentCategory: category }
  logger('info', ['routes', 'categoryTotal', 'category', category])
  try {
    const count = await logs.countDocuments(query)
    logger('info', ['routes', 'categoryTotal', 'success', count])
    response.json({ total: count })
  } catch (error) {
    logger('error', ['routes', 'categoryTotal', error])
    response.status(500)
    response.send(error)
  }
}
