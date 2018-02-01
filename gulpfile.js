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

const composer = require('gulp-uglify/composer');
const uglify = composer(uglify_es, console);

gulp.task('default', [
    'sass',
    'jshint',
    'uglify',
    'watch',
]);

gulp.task('jshint', () => {
    pump([
        gulp.src('spoopy.game.js'),
        jshint('.jshintrc'),
        jshint.reporter('jshint-stylish'),
        livereload(),
    ]);
});

gulp.task('sass', () => {
    pump([
        gulp.src('scss/*.scss'),
        sourcemaps.init(),
        sass().on('error', sass.logError),
        autoprefixer({
            browsers: ['last 2 versions'],
            cascade: false,
        }),
        cssnano(),
        sourcemaps.write('./'),
        gulp.dest('assets/css'),
        livereload(),
    ]);
});

gulp.task('uglify', () => {
    pump([
        gulp.src('spoopy.game.js'),
        uglify(),
        gulp.dest('assets/js'),
        livereload(),
    ]);
});

gulp.task('watch', () => {
    livereload.listen();
    
    gulp.watch('scss/*.scss', ['scss']);
    gulp.watch('views/*.pug', ['scss']);
    gulp.watch(['index.html', 'spoopy.game.js'], ['jshint', 'uglify']);
});
