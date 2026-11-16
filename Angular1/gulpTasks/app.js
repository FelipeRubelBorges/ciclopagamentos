const gulp = require('gulp')
const terser = require('gulp-terser')
const cleanCss = require('gulp-clean-css')
const concat = require('gulp-concat')

function html() {
    return gulp.src('app/**/*.html')
        .pipe(gulp.dest('public'))
}

function css() {
    return gulp.src('app/**/*.css')
        .pipe(concat('app.min.css'))
        .pipe(cleanCss({ rebase: false }))
        .pipe(gulp.dest('public/assets/css'))
}

function js() {
    return gulp.src('app/**/*.js')
        .pipe(concat('app.min.js'))
        .pipe(terser())
        .pipe(gulp.dest('public/assets/js'))
}

function assets() {
    return gulp.src('assets/**/*.*', { encoding: false, allowEmpty: true })
        .pipe(gulp.dest('public/assets'))
}

module.exports = { html, css, js, assets, build: gulp.parallel(html, css, js, assets) }
