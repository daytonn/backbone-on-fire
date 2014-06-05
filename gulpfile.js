var concat = require('gulp-concat');
var exec = require('child_process').exec;
var gulp = require('gulp');
var rename = require('gulp-rename');
var uglify = require('gulp-uglify');
var util = require('gulp-util');
// var yuidoc = require("gulp-yuidoc");

gulp.task('compile-app', function() {
  return gulp.src([
    'node_modules/underwear/dist/string.js',
    'node_modules/underwear/dist/array.js',
    'node_modules/underwear/dist/utilities.js',
    'lib/namespace.js',
    'lib/sync.js',
    'lib/serializers/**/*.js',
    'lib/route_creator.js',
    'lib/collection.js',
    'lib/model.js',
    'lib/controller.js',
    'lib/application.js'
  ])
    .pipe(concat('backbone-on-fire.js'))
    .pipe(gulp.dest('dist'))
    .pipe(gulp.dest('example/vendor/backbone-on-fire'));
});

gulp.task('minify-app', ['compile-app'], function() {
  return gulp.src('dist/backbone-on-fire.js')
    .pipe(uglify().on('error', util.log))
    .pipe(rename('backbone-on-fire.min.js'))
    .pipe(gulp.dest('dist'));
});

gulp.task('src-docs', function() {
  exec('yuidoc -t assets/friendly-theme -o source-documentation lib', function(err, stdout, stderr) {
    console.log(stdout);
  });
});

gulp.task('build', ['minify-app', 'src-docs']);

gulp.task('watch', function() {
  gulp.watch(['lib/**/*'], ['build']);
});

gulp.task('default', ['build', 'watch']);
