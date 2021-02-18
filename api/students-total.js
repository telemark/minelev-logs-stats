const mongo = require('../lib/mongo')
const logger = require('../lib/logger')

module.exports = async (request, response) => {
  const db = await mongo()
  const pifu = db.collection(process.env.MONGODB_COLLECTION_PIFU)
  logger('info', ['handle-stats', 'action', 'students'])
  try {
    const count = await pifu.countDocuments({ type: 'student' })
    logger('info', ['handle-stats', 'action', 'students', 'success', 'found', count])
    response.json({ total: count })
  } catch (error) {
    logger('error', ['handle-stats', 'action', 'students', error])
    response.status(500)
    response.send(error)
  }
}
