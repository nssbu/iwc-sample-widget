var gulp = require('gulp');
var browserSync = require('browser-sync').create();
var template = require('gulp-template');
var zip = require('gulp-zip');
var del = require('del');
var argv = require('yargs').argv;

var config = {
    tmp: './tmp',
    dist: './dist',
    warName: 'iwc-sample-widgets.war',
    host: argv.host && argv.port ? argv.host + ':' + argv.port : 'http://localhost:13000',
    https: argv.https,
    landing: './app/index.html',
    configTemplate: {
        src: './app/config.js',
        dest: 'config.js'
    },
    vendor: [
        './node_modules/ozpIwc/dist/js/ozpIwc-client.min.js',
        './node_modules/jquery/dist/jquery.min.js'
    ],
    data: './app/data-api/**/*',
    intents: {
        dest: './tmp/intents-api',
        main: './app/intents-api/index.html',
        css: './app/intents-api/style/**/*',
        vendor: './app/intents-api/vendor/**/*',
        common: './app/intents-api/common/**/*',
        capper: './app/intents-api/capper/**/*',
        reverser: './app/intents-api/reverser/**/*',
        producer: './app/intents-api/producer/**/*'
    },
    data: {
        dest: './tmp/data-api',
        main: './app/data-api/index.html',
        css: './app/data-api/style/**/*',
        vendor: './app/data-api/vendor/**/*',
        common: './app/data-api/common/**/*',
        amazon: './app/data-api/amazon/**/*',
        bestbuy: './app/data-api/bestbuy/**/*',
        cart: './app/data-api/cart/**/*'
    },
    jsonViewer: {
        dest: './tmp/json-viewer',
        src: './app/json-viewer/**/*'
    }
};

gulp.task('clean', function() {
    // del.sync() ensures the clean task finishes before others begin
    del.sync([
        config.tmp,
        config.dist
    ]);
});

gulp.task('landing', function() {
    return gulp.src(config.landing)
        .pipe(gulp.dest(config.tmp))
        .pipe(browserSync.stream());
});

gulp.task('config', function() {
    return gulp.src(config.configTemplate.src)
        .pipe(template({ iwcHost: config.host }))
        .pipe(gulp.dest(config.intents.dest))
        .pipe(gulp.dest(config.data.dest))
        .pipe(gulp.dest(config.jsonViewer.dest))
        .pipe(browserSync.stream());
});

// Data API tasks
gulp.task('amazon', function() {
    return gulp.src([config.data.amazon, config.data.css, config.data.vendor, config.data.common].concat(config.vendor))
        .pipe(gulp.dest(config.data.dest + '/amazon'))
        .pipe(browserSync.stream());
});

gulp.task('bestbuy', function() {
    return gulp.src([config.data.bestbuy, config.data.css, config.data.vendor, config.data.common].concat(config.vendor))
        .pipe(gulp.dest(config.data.dest + '/bestbuy'))
        .pipe(browserSync.stream());
});

gulp.task('cart', function() {
    return gulp.src([config.data.cart, config.data.css, config.data.vendor, config.data.common].concat(config.vendor))
        .pipe(gulp.dest(config.data.dest + '/cart'))
        .pipe(browserSync.stream());
});

gulp.task('data', ['amazon', 'bestbuy', 'cart'], function() {
    return gulp.src(config.data.main)
        .pipe(gulp.dest(config.data.dest));
});

// Intents API tasks
gulp.task('capper', function() {
    return gulp.src([config.intents.capper, config.intents.css, config.intents.vendor, config.intents.common].concat(config.vendor))
        .pipe(gulp.dest(config.intents.dest + '/capper'))
        .pipe(browserSync.stream());
});

gulp.task('reverser', function() {
    return gulp.src([config.intents.reverser, config.intents.css, config.intents.vendor, config.intents.common].concat(config.vendor))
        .pipe(gulp.dest(config.intents.dest + '/reverser'))
        .pipe(browserSync.stream());
});

gulp.task('producer', function() {
    return gulp.src([config.intents.producer, config.intents.css, config.intents.vendor, config.intents.common].concat(config.vendor))
        .pipe(gulp.dest(config.intents.dest + '/producer'))
        .pipe(browserSync.stream());
});

gulp.task('intents', ['capper', 'reverser', 'producer'], function() {
    return gulp.src(config.intents.main)
        .pipe(gulp.dest(config.intents.dest))
        .pipe(browserSync.stream());
});

// Json Viewer task
gulp.task('json-viewer', function() {
    return gulp.src([config.jsonViewer.src].concat(config.vendor))
        .pipe(gulp.dest(config.jsonViewer.dest))
        .pipe(browserSync.stream());
});

gulp.task('serve', ['clean', 'landing', 'config', 'data', 'intents', 'json-viewer'], function() {
    browserSync.init({
        server: config.tmp,
        https: config.https
    });

    gulp.watch(config.landing, ['landing']);
    gulp.watch(config.configTemplate.src, ['config']);

    gulp.watch([config.data.main, config.data.css, config.data.common], ['data']);
    gulp.watch(config.data.amazon, ['amazon']);
    gulp.watch(config.data.bestbuy, ['bestbuy']);
    gulp.watch(config.data.cart, ['cart']);

    gulp.watch([config.intents.main, config.intents.css, config.intents.common], ['intents']);
    gulp.watch(config.intents.capper, ['capper']);
    gulp.watch(config.intents.reverser, ['reverser']);
    gulp.watch(config.intents.producer, ['producer']);

    gulp.watch(config.jsonViewer.src, ['json-viewer']);
});

gulp.task('build', ['clean', 'landing', 'config', 'data', 'intents', 'json-viewer'], function() {
    gulp.src(config.tmp + '/**/*')
        .pipe(zip(config.warName))
        .pipe(gulp.dest(config.dist));
});

gulp.task('default', ['serve']);
