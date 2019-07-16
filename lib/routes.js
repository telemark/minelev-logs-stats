const { send } = require('micro')
const mongo = require('./mongo')
const logger = require('./logger')
const publicDocTypes = ['atferd', 'fag', 'notat', 'orden', 'samtale', 'yff-bekreftelse', 'yff-bekreftelse-bedrift', 'yff-lokalplan', 'yff-tilbakemelding']

exports.total = async (request, response) => {
  const db = await mongo()
  const logs = db.collection(process.env.MONGODB_COLLECTION)
  const { type, category } = request.params
  const query = type ? { documentType: type, documentCategory: { $in: category ? [category] : publicDocTypes } } : { documentCategory: { $in: category ? [category] : publicDocTypes } }
  logger('info', ['routes', 'total', 'type', type || 'any'])
  try {
    const count = await logs.countDocuments(query)
    logger('info', ['routes', 'total', 'success', count])
    send(response, 200, { total: count })
  } catch (error) {
    logger('error', ['routes', 'total', error])
    send(response, 500, error)
  }
}

exports.categoryTotal = async (request, response) => {
  const db = await mongo()
  const logs = db.collection(process.env.MONGODB_COLLECTION)
  const { category } = request.params
  const query = { documentCategory: category }
  logger('info', ['routes', 'categoryTotal', 'category', category])
  try {
    const count = await logs.countDocuments(query)
    logger('info', ['routes', 'categoryTotal', 'success', count])
    send(response, 200, { total: count })
  } catch (error) {
    logger('error', ['routes', 'categoryTotal', error])
    send(response, 500, error)
  }
}

exports.schools = async (request, response) => {
  const db = await mongo()
  const logs = db.collection(process.env.MONGODB_COLLECTION)
  const { type } = request.params
  const query = type ? { documentType: type, documentCategory: { $in: publicDocTypes } } : { documentCategory: { $in: publicDocTypes } }
  logger('info', ['routes', 'schools', 'type', type || 'any'])
  logs.aggregate([{ $match: query }, { $group: { _id: '$schoolName', total: { $sum: 1 } } }])
    .sort({ total: -1 }).toArray((error, data) => {
      if (error) {
        logger('error', ['handle-stats', 'action', 'schools', error])
        send(response, 500, error)
      } else {
        logger('info', ['handle-stats', 'action', 'schools', 'success'])
        send(response, 200, data)
      }
    })
}

exports.categorySchools = async (request, response) => {
  const db = await mongo()
  const logs = db.collection(process.env.MONGODB_COLLECTION)
  const { category } = request.params
  const query = { documentCategory: category }
  logger('info', ['routes', 'categorySchools', 'category', category])
  logs.aggregate([{ $match: query }, { $group: { _id: '$schoolName', total: { $sum: 1 } } }])
    .sort({ total: -1 }).toArray((error, data) => {
      if (error) {
        logger('error', ['handle-stats', 'action', 'categorySchools', error])
        send(response, 500, error)
      } else {
        logger('info', ['handle-stats', 'action', 'categorySchools', 'success'])
        send(response, 200, data)
      }
    })
}

exports.groups = async (request, response) => {
  const db = await mongo()
  const logs = db.collection(process.env.MONGODB_COLLECTION)
  const { type } = request.params
  const query = type ? { documentType: type, documentCategory: { $in: publicDocTypes } } : { documentCategory: { $in: publicDocTypes } }
  logger('info', ['routes', 'groups', 'type', type || 'any'])
  logs.aggregate([{ $match: query }, { $group: { _id: '$studentMainGroupName', total: { $sum: 1 } } }])
    .sort({ total: -1 }).toArray((error, data) => {
      if (error) {
        logger('error', ['handle-stats', 'action', 'groups', error])
        send(response, 500, error)
      } else {
        logger('info', ['handle-stats', 'action', 'groups', 'success'])
        send(response, 200, data)
      }
    })
}

exports.categoryClasses = async (request, response) => {
  const db = await mongo()
  const logs = db.collection(process.env.MONGODB_COLLECTION)
  const { category } = request.params
  const query = { documentCategory: category }
  logger('info', ['routes', 'categoryClasses', 'category', category])
  logs.aggregate([{ $match: query }, { $group: { _id: '$studentMainGroupName', total: { $sum: 1 } } }])
    .sort({ total: -1 }).toArray((error, data) => {
      if (error) {
        logger('error', ['handle-stats', 'action', 'categoryClasses', error])
        send(response, 500, error)
      } else {
        logger('info', ['handle-stats', 'action', 'categoryClasses', 'success'])
        send(response, 200, data)
      }
    })
}

exports.categories = async (request, response) => {
  logger('info', ['handle-stats', 'action', 'categories'])
  const db = await mongo()
  const logs = db.collection(process.env.MONGODB_COLLECTION)
  const query = { documentCategory: { $in: publicDocTypes } }
  logs.aggregate([{ $match: query }, { $group: { _id: '$documentCategory', total: { $sum: 1 } } }])
    .sort({ total: -1 }).toArray((error, data) => {
      if (error) {
        logger('error', ['handle-stats', 'action', 'categories', error])
        send(response, 500, error)
      } else {
        logger('info', ['handle-stats', 'action', 'categories', 'success'])
        send(response, 200, data)
      }
    })
}

exports.time = async (request, response) => {
  logger('info', ['handle-stats', 'action', 'time'])
  const db = await mongo()
  const logs = db.collection(process.env.MONGODB_COLLECTION)
  const { type, category } = request.params
  const query = type ? { documentType: type, documentCategory: { $in: category ? [category] : publicDocTypes } } : { documentCategory: { $in: category ? [category] : publicDocTypes } }
  logs.find(query, { skjemaUtfyllingStart: 1, skjemaUtfyllingStop: 1 }).toArray((error, data) => {
    if (error) {
      logger('error', ['handle-stats', 'action', 'time', error])
      send(response, 500, error)
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
      send(response, 200, { total: total, count: count })
    }
  })
}

exports.usage = async (request, response) => {
  const db = await mongo()
  const logs = db.collection(process.env.MONGODB_COLLECTION)
  const { type } = request.params
  const query = type ? { documentType: type, documentCategory: { $in: publicDocTypes } } : { documentCategory: { $in: publicDocTypes } }
  logger('info', ['routes', 'usage', 'type', type || 'any'])
  logs.distinct('userName', query, (error, data) => {
    if (error) {
      logger('error', ['handle-stats', 'action', 'usage', error])
      send(response, 500, error)
    } else {
      logger('info', ['handle-stats', 'action', 'usage', 'success'])
      send(response, 200, { total: data.length })
    }
  })
}

exports.queue = async (request, response) => {
  const db = await mongo()
  const logs = db.collection(process.env.MONGODB_COLLECTION)
  logger('info', ['handle-stats', 'action', 'queue'])
  try {
    const count = await logs.countDocuments({ isQueued: true })
    logger('info', ['handle-stats', 'action', 'queue', 'success', 'found', count])
    send(response, 200, { queue: count })
  } catch (error) {
    logger('error', ['handle-stats', 'action', 'queue', error])
    send(response, 500, error)
  }
}

exports.email = async (request, response) => {
  const db = await mongo()
  const logs = db.collection(process.env.MONGODB_COLLECTION)
  logger('info', ['handle-stats', 'action', 'email'])
  const query = {
    documentType: 'yff',
    documentCategory: 'yff-bekreftelse-bedrift',
    kopiPrEpost: { $exists: true, $ne: '' }
  }
  try {
    const count = await logs.countDocuments(query)
    logger('info', ['handle-stats', 'action', 'email', 'success', 'found', count])
    send(response, 200, { total: count })
  } catch (error) {
    logger('error', ['handle-stats', 'action', 'email', error])
    send(response, 500, error)
  }
}
