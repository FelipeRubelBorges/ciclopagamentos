const gulp = require('gulp')
const browserSync = require('browser-sync').create()
const app = require('./app')

module.exports = function server(done) {
    browserSync.init({
        server: 'public',
        listen: '127.0.0.1',
        host: '127.0.0.1',
        port: 3000,
        ui: false,
        ghostMode: false,
        files: ['public/**/*']
    }, done)

    gulp.watch('app/**/*.html', app.html)
    gulp.watch('app/**/*.css', app.css)
    gulp.watch('assets/**/*.*', app.assets)
}
