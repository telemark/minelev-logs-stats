const mongo = require('../lib/mongo')
const logger = require('../lib/logger')
const publicDocTypes = require('../lib/public-doctypes')

module.exports = async (request, response) => {
  const db = await mongo()
  const logs = db.collection(process.env.MONGODB_COLLECTION)
  const query = { variant: { $in: publicDocTypes } }
  logs.aggregate([{ $match: query }, { $group: { _id: '$variant', total: { $sum: 1 } } }])
    .sort({ total: -1 }).toArray((error, data) => {
      if (error) {
        logger('error', ['handle-stats', 'action', 'categories', error])
        response.status(500)
        response.send(error)
      } else {
        logger('info', ['handle-stats', 'action', 'categories', 'success'])
        response.json(data)
      }
    })
}
