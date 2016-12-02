var gulp = require('gulp');
var browserSync = require('browser-sync').create();
var template = require('gulp-template');
var shell = require('gulp-shell');
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
    images: {
        src: './app/images/**/*',
        dest: './tmp/images'
    },
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
        clickAction: './app/data-api/click-action/**/*',
        messageAction: './app/data-api/message-action/**/*',
        actionCounter: './app/data-api/action-counter/**/*'
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

// Images
gulp.task('images', function() {
    return gulp.src(config.images.src)
        .pipe(gulp.dest(config.images.dest));
});

// Data API tasks
gulp.task('clickAction', function() {
    return gulp.src([config.data.clickAction, config.data.css, config.data.vendor, config.data.common].concat(config.vendor))
        .pipe(gulp.dest(config.data.dest + '/click-action'))
        .pipe(browserSync.stream());
});

gulp.task('messageAction', function() {
    return gulp.src([config.data.messageAction, config.data.css, config.data.vendor, config.data.common].concat(config.vendor))
        .pipe(gulp.dest(config.data.dest + '/message-action'))
        .pipe(browserSync.stream());
});

gulp.task('actionCounter', function() {
    return gulp.src([config.data.actionCounter, config.data.css, config.data.vendor, config.data.common].concat(config.vendor))
        .pipe(gulp.dest(config.data.dest + '/action-counter'))
        .pipe(browserSync.stream());
});

gulp.task('data', ['clickAction', 'messageAction', 'actionCounter'], function() {
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
    gulp.watch(config.data.clickAction, ['clickAction']);
    gulp.watch(config.data.messageAction, ['messageAction']);
    gulp.watch(config.data.actionCounter, ['actionCounter']);

    gulp.watch([config.intents.main, config.intents.css, config.intents.common], ['intents']);
    gulp.watch(config.intents.capper, ['capper']);
    gulp.watch(config.intents.reverser, ['reverser']);
    gulp.watch(config.intents.producer, ['producer']);

    gulp.watch(config.jsonViewer.src, ['json-viewer']);
});

gulp.task('build', ['clean', 'images', 'landing', 'config', 'data', 'intents', 'json-viewer'], function() {
    gulp.src(config.tmp + '/**/*')
        .pipe(zip(config.warName))
        .pipe(gulp.dest(config.dist));
});

gulp.task('tarDistDate', shell.task([
    './packageRelease.sh iwc-sample-widgets-debug tmp'
]));

gulp.task('default', ['serve']);
