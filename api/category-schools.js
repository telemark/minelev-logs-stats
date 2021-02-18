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
  const query = { variant: category }
  logger('info', ['routes', 'categorySchools', 'category', category])
  logs.aggregate([{ $match: query }, { $group: { _id: '$school.name', total: { $sum: 1 } } }])
    .sort({ total: -1 }).toArray((error, data) => {
      if (error) {
        logger('error', ['handle-stats', 'action', 'categorySchools', error])
        response.status(500)
        response.send(error)
      } else {
        logger('info', ['handle-stats', 'action', 'categorySchools', 'success'])
        response.json(data)
      }
    })
}
