var gulp = require('gulp');
var browserSync = require('browser-sync').create();
var del = require('del');

var config = {
    dist: './dist',
    landing: './app/index.html',
    data: './app/data-api/**/*',
    intents: {
        dest: './dist/intents-api',
        css: './app/intents-api/style/**/*',
        vendor: './app/intents-api/vendor/**/*',
        capper: './app/intents-api/capper/**/*',
        reverser: './app/intents-api/reverser/**/*',
        producer: './app/intents-api/producer/**/*'
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

gulp.task('data', function() {
    return gulp.src(config.data)
        .pipe(gulp.dest(config.dist + '/data-api'))
        .pipe(browserSync.stream());
});

gulp.task('capper', function() {
    return gulp.src([config.intents.capper, config.intents.css, config.intents.vendor])
        .pipe(gulp.dest(config.intents.dest + '/capper'))
        .pipe(browserSync.stream());
});

gulp.task('reverser', function() {
    return gulp.src([config.intents.reverser, config.intents.css, config.intents.vendor])
        .pipe(gulp.dest(config.intents.dest + '/reverser'))
        .pipe(browserSync.stream());
});

gulp.task('producer', function() {
    return gulp.src([config.intents.producer, config.intents.css, config.intents.vendor])
        .pipe(gulp.dest(config.intents.dest + '/producer'))
        .pipe(browserSync.stream());
});

gulp.task('intents', ['capper', 'reverser', 'producer']);

gulp.task('serve', ['clean', 'landing', 'data', 'intents'], function() {
    browserSync.init({
        server: config.dist
    });

    gulp.watch(config.landing, ['landing']);
    gulp.watch(config.data, ['data']);
    gulp.watch(config.intents.css, ['intents']);
    gulp.watch(config.intents.capper, ['capper']);
    gulp.watch(config.intents.reverser, ['reverser']);
    gulp.watch(config.intents.producer, ['producer']);
});

gulp.task('default', ['serve']);
