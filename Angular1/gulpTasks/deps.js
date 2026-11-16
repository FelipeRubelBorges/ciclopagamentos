const { mkdir, readFile, writeFile } = require('node:fs/promises')
const { dirname } = require('node:path')
const gulp = require('gulp')

async function writeBundle(files, output, separator) {
    const contents = await Promise.all(files.map(file => readFile(file, 'utf8')))
    await mkdir(dirname(output), { recursive: true })
    await writeFile(output, contents.join(separator))
}

function js() {
    return writeBundle([
        'node_modules/jquery/dist/jquery.min.js',
        'node_modules/angular/angular.min.js',
        'node_modules/angular-ui-router/release/angular-ui-router.min.js',
        'node_modules/angular-animate/angular-animate.min.js',
        'node_modules/angular-toastr/dist/angular-toastr.tpls.min.js',
        'node_modules/bootstrap/dist/js/bootstrap.min.js',
        'node_modules/admin-lte/plugins/slimScroll/jquery.slimscroll.min.js',
        'node_modules/admin-lte/dist/js/app.min.js'
    ], 'public/assets/js/deps.min.js', ';\n')
}

function css() {
    return writeBundle([
        'node_modules/angular-toastr/dist/angular-toastr.min.css',
        'node_modules/font-awesome/css/font-awesome.min.css',
        'node_modules/bootstrap/dist/css/bootstrap.min.css',
        'node_modules/admin-lte/dist/css/AdminLTE.min.css',
        'node_modules/admin-lte/dist/css/skins/_all-skins.min.css'
    ], 'public/assets/css/deps.min.css', '\n')
}

function fonts() {
    return gulp.src([
        'node_modules/font-awesome/fonts/*.*',
        'node_modules/bootstrap/dist/fonts/*.*'
    ], { encoding: false })
        .pipe(gulp.dest('public/assets/fonts'))
}

module.exports = gulp.parallel(js, css, fonts)
