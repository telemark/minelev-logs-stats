const mongo = require('../lib/mongo')
const logger = require('../lib/logger')

module.exports = async (request, response) => {
  const db = await mongo()
  const logs = db.collection(process.env.MONGODB_COLLECTION)
  logger('info', ['handle-stats', 'action', 'email'])
  const query = {
    type: 'yff',
    variant: 'bekreftelse',
    'content.bekreftelse.kopiPrEpost': { $exists: true, $ne: '' }
  }
  try {
    const count = await logs.countDocuments(query)
    logger('info', ['handle-stats', 'action', 'email', 'success', 'found', count])
    response.json({ total: count })
  } catch (error) {
    logger('error', ['handle-stats', 'action', 'email', error])
    response.status(500)
    response.send(error)
  }
}
