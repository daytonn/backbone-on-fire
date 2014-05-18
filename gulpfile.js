var concat = require('gulp-concat');
var exec = require('child_process').exec;
var gulp = require('gulp');
var util = require('gulp-util');
var rename = require('gulp-rename');
var uglify = require('gulp-uglify');

gulp.task('compile-app', function() {
  return gulp.src([
    'node_modules/underwear/dist/string.js',
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

gulp.task('build', ['minify-app']);

gulp.task('watch', function() {
  gulp.watch(['lib/**/*'], ['build']);
});

gulp.task('default', ['build', 'watch']);
