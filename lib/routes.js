'use strict'

const readFileSync = require('fs').readFileSync
const marked = require('marked')
const { send } = require('micro')
const config = require('../config')
const mongojs = require('mongojs')
const db = mongojs(config.DB)
const logs = db.collection('logs')
const logger = require('./logger')

exports.frontpage = (request, response) => {
  logger('info', ['routes', 'frontpage'])
  const readme = readFileSync('./README.md', 'utf-8')
  const html = marked(readme)
  send(response, 200, html)
}

exports.total = (request, response) => {
  const { type } = request.params
  const query = type ? {documentType: type} : {}
  logger('info', ['routes', 'total', 'type', type || 'any'])
  logs.count(query, (error, count) => {
    if (error) {
      logger('error', ['routes', 'total', error])
      send(response, 500, error)
    } else {
      logger('info', ['routes', 'total', 'success', count])
      send(response, 200, {total: count})
    }
  })
}

exports.schools = (request, response) => {
  const { type } = request.params
  const query = type ? {documentType: type} : {}
  logger('info', ['routes', 'schools', 'type', type || 'any'])
  logs.aggregate([{'$match': query}, {'$group': {'_id': '$schoolName', 'total': {'$sum': 1}}}])
    .sort({'total': -1}, (error, data) => {
      if (error) {
        logger('error', ['handle-stats', 'action', 'schools', error])
        send(response, 500, error)
      } else {
        logger('info', ['handle-stats', 'action', 'schools', 'success'])
        send(response, 200, data)
      }
    })
}

exports.categories = (request, response) => {
  logger('info', ['handle-stats', 'action', 'categories'])
  logs.aggregate({'$group': {'_id': '$documentCategory', 'total': {'$sum': 1}}})
    .sort({'total': -1}, (error, data) => {
      if (error) {
        logger('error', ['handle-stats', 'action', 'categories', error])
        send(response, 500, error)
      } else {
        logger('info', ['handle-stats', 'action', 'categories', 'success'])
        send(response, 200, data)
      }
    })
}

exports.queue = (request, response) => {
  logger('info', ['handle-stats', 'action', 'queue'])
  logs.count({isQueued: true}, (error, count) => {
    if (error) {
      logger('error', ['handle-stats', 'action', 'queue', error])
      send(response, 500, error)
    } else {
      logger('info', ['handle-stats', 'action', 'queue', 'success', 'found', count])
      send(response, 200, {queue: count})
    }
  })
}