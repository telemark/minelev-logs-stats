'use strict'
process.env.DB = 'mongodb://minelev-system:afcacd42-6689-48a5-b538-29e16952fd5d@aws-eu-central-1-portal.0.dblayer.com:15604,aws-eu-central-1-portal.1.dblayer.com:15604/minelev-logs?ssl=true'
module.exports = {
  DB: process.env.DB || 'mongodb://localhost/louie',
  PAPERTRAIL_HOSTNAME: process.env.PAPERTRAIL_HOSTNAME || 'minelev-logs',
  PAPERTRAIL_HOST: process.env.PAPERTRAIL_HOST || 'logs.papertrailapp.com',
  PAPERTRAIL_PORT: process.env.PAPERTRAIL_PORT || 12345
}
