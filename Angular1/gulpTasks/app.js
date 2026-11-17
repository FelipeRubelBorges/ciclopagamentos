const { cp, mkdir, readFile, writeFile } = require('node:fs/promises')
const gulp = require('gulp')
const cleanCss = require('gulp-clean-css')
const concat = require('gulp-concat')

async function html() {
    let index = await readFile('app/index.html', 'utf8')
    for (const name of ['header.html', 'menu.html', 'footer.html']) {
        const template = await readFile('app/template/' + name, 'utf8')
        index = index.replace(' data-template="' + name + '">', () => '>' + template.trim())
    }
    await mkdir('public', { recursive: true })
    await cp('app/template', 'public/template', { recursive: true })
    await writeFile('public/index.html', index)
}

function css() {
    return gulp.src('app/**/*.css')
        .pipe(concat('app.min.css'))
        .pipe(cleanCss({ rebase: false }))
        .pipe(gulp.dest('public/assets/css'))
}

function assets() {
    return gulp.src('assets/**/*.*', { encoding: false, allowEmpty: true })
        .pipe(gulp.dest('public/assets'))
}

module.exports = { html, css, assets, build: gulp.parallel(html, css, assets) }
