const gulp = require('gulp')
const app = require('./gulpTasks/app')
const server = require('./gulpTasks/server')

exports.build = app.build
exports.default = gulp.series(exports.build, server)
