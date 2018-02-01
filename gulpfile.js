'use strict';

// imports
const gulp = require('gulp');
const sass = require('gulp-sass');
const cssnano = require('gulp-cssnano');
const sourcemaps = require('gulp-sourcemaps');
const autoprefixer = require('gulp-autoprefixer');
const jshint = require('gulp-jshint');
const livereload = require('gulp-livereload');
const pump = require('pump');
const uglify_es = require('uglify-es');
const html5lint = require('gulp-html5-lint');

const composer = require('gulp-uglify/composer');
const uglify = composer(uglify_es, console);

const paths = {
    scss: {
        src: 'src/scss/*.scss',
        dest: 'assets/css/',
    },

    js: {
        src: 'src/js/*.js',
        dest: 'assets/js/spoopy/',
    },

    pug: {
        src: 'views/*.pug',
    }
};

gulp.task('default', [
    'sass',
    'jshint',
    'html5lint',
    'uglify',
    'watch',
]);

gulp.task('jshint', () => {
    pump([
        gulp.src(paths.js.src),
        jshint('.jshintrc'),
        jshint.reporter('jshint-stylish'),
        livereload(),
    ]);
});

gulp.task('html5lint', () => {
    pump([
        gulp.src('index.html'),
        html5lint('index.html'),
        livereload(),
    ]);
});

gulp.task('sass', () => {
    pump([
        gulp.src(paths.scss.src),
        sourcemaps.init(),
        sass().on('error', sass.logError),
        autoprefixer({
            browsers: ['last 2 versions'],
            cascade: false,
        }),
        cssnano(),
        sourcemaps.write('./'),
        gulp.dest(paths.scss.dest),
        livereload(),
    ]);
});

gulp.task('uglify', () => {
    pump([
        gulp.src(paths.js.src),
        uglify(),
        gulp.dest(paths.js.dest),
        livereload(),
    ]);
});

gulp.task('livereload', () => {
    livereload();
});

gulp.task('watch', () => {
    livereload.listen();
    
    gulp.watch(paths.scss.src, ['sass']);
    gulp.watch(paths.pug.src, ['livereload']);
    gulp.watch(paths.js.src, ['jshint', 'uglify']);
    gulp.watch('index.html', ['html5lint', 'livereload']);
});
