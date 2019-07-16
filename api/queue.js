const mongo = require('../lib/mongo')
const logger = require('../lib/logger')

module.exports = async (request, response) => {
  const db = await mongo()
  const logs = db.collection(process.env.MONGODB_COLLECTION)
  logger('info', ['handle-stats', 'action', 'queue'])
  try {
    const count = await logs.countDocuments({ isQueued: true })
    logger('info', ['handle-stats', 'action', 'queue', 'success', 'found', count])
    response.json({ queue: count })
  } catch (error) {
    logger('error', ['handle-stats', 'action', 'queue', error])
    response.status(500)
    response.send(error)
  }
}
