'use strict'

const readFileSync = require('fs').readFileSync
const marked = require('marked')
const { send } = require('micro')
const resolveRequest = require('./lib/resolve-request')
const handleStats = require('./lib/handle-stats')

module.exports = async (request, response) => {
  const query = await resolveRequest(request)

  if (!query.domain === 'frontpage') {
    response.setHeader('Access-Control-Allow-Origin', '*')
  }
  try {
    if (query.domain === 'stats') {
      const result = await handleStats(query)
      send(response, 200, result)
    } else {
      const readme = readFileSync('./README.md', 'utf-8')
      const html = marked(readme)
      send(response, 200, html)
    }
  } catch (error) {
    console.error(error)
    send(response, 500, error)
  }
}
