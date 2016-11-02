'use strict';

var gulp = require('gulp'),
	watch = require('gulp-watch'),
	prefixer = require('gulp-autoprefixer'),
	uglify = require('gulp-uglify'),
	sass = require('gulp-sass'),
	sourcemaps = require('gulp-sourcemaps'),
	cleanCSS = require('gulp-clean-css'),
	imagemin = require('gulp-imagemin'),
	pngquant = require('imagemin-pngquant'),
	rimraf = require('rimraf'),
    pug = require('gulp-pug'),
    plumber = require('gulp-plumber'),
    notify = require('gulp-notify'),
    // wiredep = require('gulp-wiredep'),
    useref = require('gulp-useref'),
	browserSync = require('browser-sync'),
	reload = browserSync.reload;

var path = {
    build: {
        html: 'build/',
        css: 'build/css/',
        img: 'build/img/',
        fonts: 'build/fonts/',
        js: 'build/js/'
    },
    src: {
        html: 'src/*.pug',
        css: 'src/scss/main.scss',
        img: 'src/img/**/*.*',
        fonts: 'src/fonts/**/*.*',
        js: 'src/js/main.js'
    },
    watch: {
        html: 'src/**/*.pug',
        css: 'src/scss/**/*.scss',
        js: 'src/js/**/*.js',
        img: 'src/img/**/*.*',
        fonts: 'src/fonts/**/*.*'
    },
    clean: 'build'
};

var config = {
    server: {
        baseDir: "build"
    },
    open: false
},
    configTunnel = {
        server: {
            baseDir: "build"
        },
    tunnel: false,
    browser: 'chrome',
    open: 'tunnel'
};

gulp.task('html:build', function () {
    gulp.src(path.src.html) //Выберем файлы по нужному пути
        .pipe(plumber({
            errorHandler: notify.onError(function(err){
                return {
                    title: "Html",
                    message: err.message
                }
            })
        }))
        // .pipe(wiredep({ //Добавим ссылки на плагины bower
        //     directory: 'bower_components/'
        // }))
        .pipe(pug({pretty: true}))//Скомпилируем
        .pipe(gulp.dest(path.build.html)) //Выплюнем их в папку build
        .on('end', function() { //запускаем useref по завершению html
            useref();
        })
        .pipe(reload({stream: true})); //И перезагрузим сервер
});

gulp.task('js:build', function () {
    gulp.src(path.src.js) //Найдем наш main файл
        .pipe(sourcemaps.init()) //Инициализируем sourcemap
        .pipe(uglify()) //Сожмем наш js
        .pipe(sourcemaps.write('.')) //Пропишем карты
        .pipe(gulp.dest(path.build.js)) //Выплюнем готовый файл в build
        .pipe(reload({stream: true})); //И перезагрузим сервер
});

gulp.task('css:build', function () {
    gulp.src(path.src.css) //Выберем наш main.scss
        .pipe(plumber({
            errorHandler: notify.onError(function(err){
                return {
                    title: "Css",
                    message: err.message
                }
            })
        }))
        .pipe(sourcemaps.init()) //То же самое что и с js
        .pipe(sass().on('error', sass.logError)) //Скомпилируем
        .pipe(prefixer({
                browsers: ['last 5 versions'],
                cascade: false})) //Добавим вендорные префиксы
        .pipe(cleanCSS()) //Сожмем
        .pipe(sourcemaps.write('.'))
        .pipe(gulp.dest(path.build.css)) //И в build
        .pipe(reload({stream: true}));
});

gulp.task('img:build', function () {
    gulp.src(path.src.img) //Выберем наши картинки
        .pipe(imagemin({ //Сожмем их
            progressive: true,
            svgoPlugins: [{removeViewBox: false}],
            use: [pngquant()],
            interlaced: true
        }))
        .pipe(gulp.dest(path.build.img)) //И бросим в build
        .pipe(reload({stream: true}));
});

gulp.task('fonts:build', function() {
    gulp.src(path.src.fonts)
        .pipe(gulp.dest(path.build.fonts))
});

gulp.task('build', [
    'html:build',
    'css:build',
    'fonts:build',
    'img:build',
    'js:build'
]);

gulp.task('watch', function(){
    watch([path.watch.html], function(event, cb) {
        gulp.start('html:build');
    });
    watch([path.watch.css], function(event, cb) {
        gulp.start('css:build');
    });
    watch([path.watch.img], function(event, cb) {
        gulp.start('img:build');
    });
    watch([path.watch.fonts], function(event, cb) {
        gulp.start('fonts:build');
    });
    watch([path.watch.js], function(event, cb) {
        gulp.start('js:build');
    });
});

gulp.task('webserver', function () {
    browserSync(config);
});

gulp.task('webserverTunnel', function () {
    browserSync(configTunnel);
});

gulp.task('clean', function (cb) {
    rimraf(path.clean, cb);
});

gulp.task('default', ['build', 'webserver', 'watch']);



