'use strict'

const config = require('../config')
const mongojs = require('mongojs')
const db = mongojs(config.DB)
const logs = db.collection('logs')
const logger = require('./logger')

module.exports = query => {
  return new Promise((resolve, reject) => {
    if (query.action === 'total') {
      logger('info', ['handle-stats', 'action', 'total'])
      logs.count({}, (error, count) => {
        if (error) {
          logger('error', ['handle-stats', 'action', 'total', error])
          reject(error)
        } else {
          logger('info', ['handle-stats', 'action', 'total', 'success', count])
          resolve({total: count})
        }
      })
    } else if (query.action === 'schools') {
      logger('info', ['handle-stats', 'action', 'schools'])
      logs.aggregate({'$group': {'_id': '$schoolName', 'total': {'$sum': 1}}})
        .sort({'total': -1}, (error, data) => {
          if (error) {
            logger('error', ['handle-stats', 'action', 'schools', error])
            reject(error)
          } else {
            logger('info', ['handle-stats', 'action', 'schools', 'success'])
            resolve(data)
          }
        })
    } else if (query.action === 'categories') {
      logger('info', ['handle-stats', 'action', 'categories'])
      logs.aggregate({'$group': {'_id': '$documentCategory', 'total': {'$sum': 1}}})
        .sort({'total': -1}, (error, data) => {
          if (error) {
            logger('error', ['handle-stats', 'action', 'categories', error])
            reject(error)
          } else {
            logger('info', ['handle-stats', 'action', 'categories', 'success'])
            resolve(data)
          }
        })
    } else if (query.action === 'queue') {
      logger('info', ['handle-stats', 'action', 'queue'])
      logs.count({isQueued: true}, (error, count) => {
        if (error) {
          logger('error', ['handle-stats', 'action', 'queue', error])
          reject(error)
        } else {
          logger('info', ['handle-stats', 'action', 'queue', 'success', 'found', count])
          resolve({queue: count})
        }
      })
    } else {
      logger('warn', ['handle-stats', 'action', 'unknown action', query.action])
      resolve(query)
    }
  })
}
