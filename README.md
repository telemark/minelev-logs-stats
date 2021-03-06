[![Build Status](https://travis-ci.org/telemark/minelev-logs-stats.svg?branch=master)](https://travis-ci.org/telemark/minelev-logs-stats)
[![js-standard-style](https://img.shields.io/badge/code%20style-standard-brightgreen.svg?style=flat)](https://github.com/feross/standard)

# minelev-logs-stats

Statistics from the MinElev logs

## API

### ```GET /stats/total```

Get stats for total of logs

### ```GET /stats/total/:type```

Get stats for total logs of given type (varsel|samtale|yff)

### ```GET /stats/total/:type/:category```

Get stats for total logs of given type (varsel|samtale|yff) filtered by category

### ```GET /stats/total/category/:category```

Get stats for total logs of given category

### ```GET /stats/schools```

Get stats for schools

### ```GET /stats/schools/:type```

Get stats for schools-logs of given type (varsel|samtale|yff)

### ```GET /stats/schools/category/:category```

Get stats for schools-logs of given category

### ```GET /stats/classes```

Get stats for classes

### ```GET /stats/classes/:type```

Get stats for classes-logs of given type (varsel|samtale|yff)

### ```GET /stats/classes/category/:category```

Get stats for classes-logs of given category

### ```GET /stats/usage```

Get stats for unique users

### ```GET /stats/usage/:type```

Get stats for unique users of given type (varsel|samtale|yff)

### ```GET /stats/time/:type/:category```

Total milliseconds used to produce documents of types (varsel|samtale|yff) filtered by category (sloooooow)

### ```GET /stats/categories```

Get stats for categories

### ```GET /stats/queue```

Get number of logs in queue

### ```GET /stats/email```

Get stats for number of kopiPrPost yff-bekreftelse-bedrift

### ```GET /stats/students```

Get the total number of students (from pifu)

## Development

Add a local .env file

```
MONGODB_CONNECTION=mongodb-connection-string
MONGODB_COLLECTION=mongodb-collection-name
MONGODB_COLLECTION_PIFU=mongodb-collection-name-pifu
MONGODB_NAME=mongodb-db-name
```

```
$ npm run dev
```

## Deploy to ZEIT/Now

```
$ npm run deploy
```

## Related

- [minelev-web](https://github.com/vtfk/minelev-web) web frontend for MinElev
- [minelev-pifu-api](https://github.com/vtfk/azf-pifu-api) pifu azure function for MinElev
- [minelev-notifications](https://github.com/telemark/minelev-notifications) notifications service for MinElev
- [minelev-leder](https://github.com/vtfk/minelev-leder-web) web frontend for MinElev - school administration
- [minelev-logs](https://github.com/telemark/minelev-logs) logs service for MinElev
- [minelev-dashboard](https://github.com/telemark/minelev-dashboard) dashboard for MinElev

## License

[MIT](LICENSE)
