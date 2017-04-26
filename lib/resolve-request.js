'use strict'

const { parse } = require('url')
const { json } = require('micro')
const resolveAction = require('./resolve-action')

module.exports = request => {
  return new Promise(async (resolve, reject) => {
    const {pathname, query} = await parse(request.url, true)
    const data = request.method === 'POST' ? await json(request) : query
    const action = resolveAction({pathname: pathname, method: request.method})

    resolve(Object.assign({data: data}, action))
  })
}
