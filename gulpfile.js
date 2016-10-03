var gulp = require('gulp');
var browserSync = require('browser-sync').create();
var del = require('del');

var config = {
    dist: './dist',
    src: {
        landing: './app/index.html',
        intentsApi: './app/intents-api/**/*',
        dataApi: './app/data-api/**/*',
    }
};

gulp.task('clean', function() {
    // del.sync() ensures the clean task finishes before others begin
    del.sync([
        config.dist
    ]);
});

gulp.task('landing', function() {
    return gulp.src(config.src.landing)
        .pipe(gulp.dest(config.dist))
        .pipe(browserSync.stream());
});

gulp.task('data', function() {
    return gulp.src(config.src.dataApi)
        .pipe(gulp.dest(config.dist + '/data-api'))
        .pipe(browserSync.stream());
});

gulp.task('intents', function() {
    return gulp.src(config.src.intentsApi)
        .pipe(gulp.dest(config.dist + '/intents-api'))
        .pipe(browserSync.stream());
});

gulp.task('serve', ['clean', 'landing', 'data', 'intents'], function() {
    browserSync.init({
        server: config.dist
    });

    gulp.watch(config.src.landing, ['landing']);
    gulp.watch(config.src.dataApi, ['data']);
    gulp.watch(config.src.intentsApi, ['intents']);
});

gulp.task('default', ['serve']);
