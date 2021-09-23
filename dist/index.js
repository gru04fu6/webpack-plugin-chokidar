
'use strict'

if (process.env.NODE_ENV === 'production') {
  module.exports = require('./webpack-plugin-chokidar.cjs.production.min.js')
} else {
  module.exports = require('./webpack-plugin-chokidar.cjs.development.js')
}
