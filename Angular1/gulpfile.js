const gulp = require('gulp')
const app = require('./gulpTasks/app')
const deps = require('./gulpTasks/deps')
const server = require('./gulpTasks/server')

exports.build = gulp.parallel(deps, app.build)
exports.default = gulp.series(exports.build, server)
