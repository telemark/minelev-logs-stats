const mongo = require('../lib/mongo')
const logger = require('../lib/logger')

module.exports = async (request, response) => {
  const db = await mongo()
  const tjommi = db.collection(process.env.MONGODB_COLLECTION_TJOMMI)
  logger('info', ['handle-stats', 'action', 'students'])
  try {
    const count = await tjommi.countDocuments({ type: 'student' })
    logger('info', ['handle-stats', 'action', 'students', 'success', 'found', count])
    response.json({ total: count })
  } catch (error) {
    logger('error', ['handle-stats', 'action', 'students', error])
    response.status(500)
    response.send(error)
  }
}
