const mongo = require('../lib/mongo')
const logger = require('../lib/logger')
const publicDocTypes = require('../lib/public-doctypes')

function getParams (url) {
  const list = url.split('/')
  return {
    type: list[3]
  }
}

module.exports = async (request, response) => {
  const db = await mongo()
  const logs = db.collection(process.env.MONGODB_COLLECTION)
  const params = getParams(request.url)
  const { type } = params
  const query = type ? { type: type, variant: { $in: publicDocTypes } } : { variant: { $in: publicDocTypes } }
  logger('info', ['routes', 'groups', 'type', type || 'any'])
  logs.aggregate([{ $match: query }, { $group: { _id: '$student.classId', total: { $sum: 1 } } }])
    .sort({ total: -1 }).toArray((error, data) => {
      if (error) {
        logger('error', ['handle-stats', 'action', 'groups', error])
        response.status(500)
        response.send(error)
      } else {
        logger('info', ['handle-stats', 'action', 'groups', 'success'])
        response.json(data)
      }
    })
}
