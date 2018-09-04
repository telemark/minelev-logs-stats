const { readFileSync } = require('fs')
const md = require('markdown-it')()
const { send } = require('micro')
const config = require('../config')
const mongojs = require('mongojs')
const db = mongojs(config.DB)
const logs = db.collection('logs')
const logger = require('./logger')
const publicDocTypes = ['atferd', 'fag', 'notat', 'orden', 'samtale', 'yff-bekreftelse', 'yff-bekreftelse-bedrift', 'yff-lokalplan', 'yff-tilbakemelding']

exports.frontpage = (request, response) => {
  logger('info', ['routes', 'frontpage'])
  const readme = readFileSync('./README.md', 'utf-8')
  send(response, 200, md.render(readme))
}

exports.total = (request, response) => {
  const { type } = request.params
  const query = type ? { documentType: type, documentCategory: { '$in': publicDocTypes } } : { documentCategory: { '$in': publicDocTypes } }
  logger('info', ['routes', 'total', 'type', type || 'any'])
  logs.count(query, (error, count) => {
    if (error) {
      logger('error', ['routes', 'total', error])
      send(response, 500, error)
    } else {
      logger('info', ['routes', 'total', 'success', count])
      send(response, 200, { total: count })
    }
  })
}

exports.categoryTotal = (request, response) => {
  const { category } = request.params
  const query = { documentCategory: category }
  logger('info', ['routes', 'categoryTotal', 'category', category])
  logs.count(query, (error, count) => {
    if (error) {
      logger('error', ['routes', 'categoryTotal', error])
      send(response, 500, error)
    } else {
      logger('info', ['routes', 'categoryTotal', 'success', count])
      send(response, 200, { total: count })
    }
  })
}

exports.schools = (request, response) => {
  const { type } = request.params
  const query = type ? { documentType: type, documentCategory: { '$in': publicDocTypes } } : { documentCategory: { '$in': publicDocTypes } }
  logger('info', ['routes', 'schools', 'type', type || 'any'])
  logs.aggregate([{ '$match': query }, { '$group': { '_id': '$schoolName', 'total': { '$sum': 1 } } }])
    .sort({ 'total': -1 }, (error, data) => {
      if (error) {
        logger('error', ['handle-stats', 'action', 'schools', error])
        send(response, 500, error)
      } else {
        logger('info', ['handle-stats', 'action', 'schools', 'success'])
        send(response, 200, data)
      }
    })
}

exports.categorySchools = (request, response) => {
  const { category } = request.params
  const query = { documentCategory: category }
  logger('info', ['routes', 'categorySchools', 'category', category])
  logs.aggregate([{ '$match': query }, { '$group': { '_id': '$schoolName', 'total': { '$sum': 1 } } }])
    .sort({ 'total': -1 }, (error, data) => {
      if (error) {
        logger('error', ['handle-stats', 'action', 'categorySchools', error])
        send(response, 500, error)
      } else {
        logger('info', ['handle-stats', 'action', 'categorySchools', 'success'])
        send(response, 200, data)
      }
    })
}

exports.categories = (request, response) => {
  logger('info', ['handle-stats', 'action', 'categories'])
  const query = { documentCategory: { '$in': publicDocTypes } }
  logs.aggregate([{ '$match': query }, { '$group': { '_id': '$documentCategory', 'total': { '$sum': 1 } } }])
    .sort({ 'total': -1 }, (error, data) => {
      if (error) {
        logger('error', ['handle-stats', 'action', 'categories', error])
        send(response, 500, error)
      } else {
        logger('info', ['handle-stats', 'action', 'categories', 'success'])
        send(response, 200, data)
      }
    })
}

exports.time = (request, response) => {
  logger('info', ['handle-stats', 'action', 'time'])
  const { type } = request.params
  const query = type ? { documentType: type, documentCategory: { '$in': publicDocTypes } } : { documentCategory: { '$in': publicDocTypes } }
  logs.find(query, { 'skjemaUtfyllingStart': 1, 'skjemaUtfyllingStop': 1 }, (error, data) => {
    if (error) {
      logger('error', ['handle-stats', 'action', 'time', error])
      send(response, 500, error)
    } else {
      logger('info', ['handle-stats', 'action', 'time', 'success'])
      const time = data.map(item => parseInt(item.skjemaUtfyllingStop, 10) - parseInt(item.skjemaUtfyllingStart, 10))
      const total = time.reduce((prev, curr) => {
        prev += curr
        return prev
      }, 0)
      send(response, 200, { total: total })
    }
  })
}

exports.usage = (request, response) => {
  const { type } = request.params
  const query = type ? { documentType: type, documentCategory: { '$in': publicDocTypes } } : { documentCategory: { '$in': publicDocTypes } }
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

exports.queue = (request, response) => {
  logger('info', ['handle-stats', 'action', 'queue'])
  logs.count({ isQueued: true }, (error, count) => {
    if (error) {
      logger('error', ['handle-stats', 'action', 'queue', error])
      send(response, 500, error)
    } else {
      logger('info', ['handle-stats', 'action', 'queue', 'success', 'found', count])
      send(response, 200, { queue: count })
    }
  })
}
