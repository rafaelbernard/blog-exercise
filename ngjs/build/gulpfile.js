var gulp         = require('gulp'),
    gutil        = require('gulp-util'),
    //sass = require('gulp-ruby-sass'),
    autoprefixer = require('gulp-autoprefixer'),
    cssnano      = require('gulp-cssnano'),
    jshint       = require('gulp-jshint'),
    uglify       = require('gulp-uglify'),
    imagemin     = require('gulp-imagemin'),
    rename       = require('gulp-rename'),
    concat       = require('gulp-concat'),
    notify       = require('gulp-notify'),
    cache        = require('gulp-cache'),
    livereload   = require('gulp-livereload'),
    //$ = require('gulp-load-plugins')(),
    expectfile   = require('gulp-expect-file'),
    del          = require('del');

var vendor = require('./vendor.json');

gulp.task('scripts', function ()
{
    //.pipe(gulp.src('../scripts/services/*.js'))
    //return gulp.src('../scripts/controllers/*.js')
    //return gulp.src(['../scripts/controllers/*.js', '../scripts/services/*.js'])
    return gulp.src(['../scripts/controllers/*.js', '../scripts/directives/*.js', '../scripts/services/*.js', '../scripts/_construct/*.js'])
        .pipe(jshint('.jshintrc'))
        .pipe(jshint.reporter('default'))
        .pipe(concat('main.js'))
        .pipe(gulp.dest('../dist/assets/js'))
        .pipe(rename({suffix: '.min'}))
        //.pipe(uglify())
        .pipe(gulp.dest('../dist/assets/js'));
        //.pipe(notify({message: 'Scripts task complete'}));
});

gulp.task('vendor', function ()
{
    var vendor = require('./vendor.json');

    return gulp.src(vendor.source)
        .pipe(expectfile(vendor.source))
        .on('error', handleError)
        .pipe(jshint.reporter('default'))
        .pipe(concat('vendor.js'))
        .pipe(gulp.dest('../dist/assets/js'))
        .pipe(rename({suffix: '.min'}))
        .pipe(uglify())
        .pipe(gulp.dest('../dist/assets/js'));
        //.pipe(notify({message: 'service task complete'}));
});

gulp.task('css', function ()
{
    var source = [
        "node_modules/bootstrap/dist/css/bootstrap.min.css",
        "node_modules/angular-material/angular-material.min.css",
        //"node_modules/ui-select/dist/select.min.css",
        "../styles/*.css",
    ];

    return gulp.src(source)
        .pipe(expectfile(source))
        .pipe(concat('main.css'))
        .pipe(rename({suffix: '.min'}))
        .pipe(cssnano())
        .pipe(gulp.dest('../dist'));
        //.pipe(notify({message: 'CSSs task complete'}));
});


gulp.task('clean', function ()
{
    return del(['dist/assets/css', 'dist/assets/js', 'dist/assets/img']);
});

gulp.task('watch', ['default'], function ()
{
    // Watch .scss files
    gulp.watch('../styles/**/*.css', ['css']);

    // Watch .js files
    //gulp.watch(['../scripts/**/*.js', './vendor.json'], ['scripts', 'service', 'vendor']);
    gulp.watch('../scripts/**/*.js', ['scripts']);
    gulp.watch('./vendor.json', ['vendor']);

    // Watch image files
    //gulp.watch('src/images/**/*', ['images']);

});

gulp.task('default', ['clean'], function ()
{
    gulp.start('vendor');
    gulp.start('scripts');
    gulp.start('css');
    //gulp.start('service');
});

function handleError(err)
{
    log(err.toString());
    this.emit('end');
}