'use strict'

module.exports = data => {
  const list = data.pathname.split('/').filter(line => line !== '')
  let result = {
    domain: 'frontpage',
    method: data.method,
    action: ''
  }
  if (list.includes('stats')) {
    result.domain = 'stats'
    if (list.includes('total')) {
      result.action = 'total'
    } else if (list.includes('schools')) {
      result.action = 'schools'
    } else if (list.includes('categories')) {
      result.action = 'categories'
    } else if (list.includes('queue')) {
      result.action = 'queue'
    }
  }

  return result
}
