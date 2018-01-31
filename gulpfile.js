'use strict';

// imports
const gulp = require('gulp');
const sass = require('gulp-sass');
const cssnano = require('gulp-cssnano');
const sourcemaps = require('gulp-sourcemaps');
const autoprefixer = require('gulp-autoprefixer');
const jshint = require('gulp-jshint');
const livereload = require('gulp-livereload');
const nodemon = require('gulp-nodemon');
const pump = require('pump');
const uglify_es = require('uglify-es');

const composer = require('gulp-uglify/composer');
const uglify = composer(uglify_es, console);

gulp.task('default', [
    'sass',
    'jshint',
    'uglify',
    'watch',
    'server',
]);

gulp.task('server', () => {
    nodemon({
        'script': 'server.min/spoopy.server.js',
        'args': ['--port=3000'],
    });
});

gulp.task('jshint', () => {
    pump([
        gulp.src('spoopy.server.js'),
        jshint('.jshintrc'),
        jshint.reporter('jshint-stylish'),
    ]);

    pump([
        gulp.src('spoopy.client.js'),
        jshint('.jshintrc'),
        jshint.reporter('jshint-stylish'),
    ]);

    livereload();
});

gulp.task('sass', () => {
    pump([
        gulp.src('sass/*.scss'),
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
        gulp.src('spoopy.client.js'),
        uglify(),
        gulp.dest('assets/js'),
    ]);

    pump([
        gulp.src('spoopy.server.js'),
        uglify(),
        gulp.dest('server.min'),
    ]);

    livereload();
});

gulp.task('watch', () => {
    livereload.listen();
    
    gulp.watch('sass/*.scss', ['sass']);
    gulp.watch('views/*.pug', ['sass']);
    gulp.watch(['spoopy.server.js', 'spoopy.client.js'], ['jshint', 'uglify']);
});
