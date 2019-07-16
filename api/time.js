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
  logger('info', ['handle-stats', 'action', 'time'])
  const db = await mongo()
  const logs = db.collection(process.env.MONGODB_COLLECTION)
  const params = getParams(request.url)
  const { type, category } = params
  const query = type ? { documentType: type, documentCategory: { $in: category ? [category] : publicDocTypes } } : { documentCategory: { $in: category ? [category] : publicDocTypes } }
  logs.find(query, { skjemaUtfyllingStart: 1, skjemaUtfyllingStop: 1 }).toArray((error, data) => {
    if (error) {
      logger('error', ['handle-stats', 'action', 'time', error])
      response.status(500)
      response.send(error)
    } else {
      logger('info', ['handle-stats', 'action', 'time', 'success'])
      let count = 0
      const time = data.map(item => {
        let ms = 0
        if (item.skjemaUtfyllingStop && item.skjemaUtfyllingStart) {
          count++
          ms = parseInt(item.skjemaUtfyllingStop, 10) - parseInt(item.skjemaUtfyllingStart, 10)
        }
        return ms
      })
      const total = time.reduce((prev, curr) => {
        prev += curr
        return prev
      }, 0)
      response.json({ total: total, count: count })
    }
  })
}
