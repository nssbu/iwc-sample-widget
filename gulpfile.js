var gulp = require('gulp');
var browserSync = require('browser-sync').create();
var del = require('del');

var config = {
    dist: './dist',
    landing: './app/index.html',
    data: './app/data-api/**/*',
    intents: {
        dest: './dist/intents-api',
        main: './app/intents-api/index.html',
        css: './app/intents-api/style/**/*',
        vendor: './app/intents-api/vendor/**/*',
        common: './app/intents-api/common/**/*',
        capper: './app/intents-api/capper/**/*',
        reverser: './app/intents-api/reverser/**/*',
        producer: './app/intents-api/producer/**/*'
    },
    data: {
        dest: './dist/data-api',
        main: './app/data-api/index.html',
        css: './app/data-api/style/**/*',
        vendor: './app/data-api/vendor/**/*',
        common: './app/data-api/common/**/*',
        amazon: './app/data-api/amazon/**/*',
        bestbuy: './app/data-api/bestbuy/**/*',
        cart: './app/data-api/cart/**/*'
    },
    jsonViewer: {
        dest: './dist/json-viewer',
        src: './app/json-viewer/**/*'
    }
};

gulp.task('clean', function() {
    // del.sync() ensures the clean task finishes before others begin
    del.sync([
        config.dist
    ]);
});

gulp.task('landing', function() {
    return gulp.src(config.landing)
        .pipe(gulp.dest(config.dist))
        .pipe(browserSync.stream());
});

// Data API tasks
gulp.task('amazon', function() {
    return gulp.src([config.data.amazon, config.data.css, config.data.vendor, config.data.common])
        .pipe(gulp.dest(config.data.dest + '/amazon'))
        .pipe(browserSync.stream());
});

gulp.task('bestbuy', function() {
    return gulp.src([config.data.bestbuy, config.data.css, config.data.vendor, config.data.common])
        .pipe(gulp.dest(config.data.dest + '/bestbuy'))
        .pipe(browserSync.stream());
});

gulp.task('cart', function() {
    return gulp.src([config.data.cart, config.data.css, config.data.vendor, config.data.common])
        .pipe(gulp.dest(config.data.dest + '/cart'))
        .pipe(browserSync.stream());
});

gulp.task('data', ['amazon', 'bestbuy', 'cart'], function() {
    return gulp.src(config.data.main)
        .pipe(gulp.dest(config.data.dest));
});

// Intents API tasks
gulp.task('capper', function() {
    return gulp.src([config.intents.capper, config.intents.css, config.intents.vendor, config.intents.common])
        .pipe(gulp.dest(config.intents.dest + '/capper'))
        .pipe(browserSync.stream());
});

gulp.task('reverser', function() {
    return gulp.src([config.intents.reverser, config.intents.css, config.intents.vendor, config.intents.common])
        .pipe(gulp.dest(config.intents.dest + '/reverser'))
        .pipe(browserSync.stream());
});

gulp.task('producer', function() {
    return gulp.src([config.intents.producer, config.intents.css, config.intents.vendor, config.intents.common])
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
    return gulp.src(config.jsonViewer.src)
        .pipe(gulp.dest(config.jsonViewer.dest))
        .pipe(browserSync.stream());
});

gulp.task('serve', ['clean', 'landing', 'data', 'intents', 'json-viewer'], function() {
    browserSync.init({
        server: config.dist
    });

    gulp.watch(config.landing, ['landing']);

    gulp.watch(config.data.main, ['data']);
    gulp.watch(config.data.css, ['data']);
    gulp.watch(config.data.common, ['data']);
    gulp.watch(config.data.amazon, ['amazon']);
    gulp.watch(config.data.bestbuy, ['bestbuy']);
    gulp.watch(config.data.cart, ['cart']);

    gulp.watch(config.intents.main, ['intents']);
    gulp.watch(config.intents.css, ['intents']);
    gulp.watch(config.intents.common, ['intents']);
    gulp.watch(config.intents.capper, ['capper']);
    gulp.watch(config.intents.reverser, ['reverser']);
    gulp.watch(config.intents.producer, ['producer']);

    gulp.watch(config.jsonViewer.src, ['json-viewer']);
});

gulp.task('default', ['serve']);
