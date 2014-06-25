var concat = require('gulp-concat');
var exec = require('child_process').exec;
var gulp = require('gulp');
var rename = require('gulp-rename');
var uglify = require('gulp-uglify');
var util = require('gulp-util');
var karma = require('gulp-karma');

var specFiles = [
  'node_modules/jquery/dist/jquery.js',
  'node_modules/underscore/underscore.js',
  'node_modules/backbone/backbone.js',
  'node_modules/chai-fuzzy/index.js',
  'spec/support/chai-literals.js',
  'spec/support/mocha-fixture.js',
  'dist/backbone-on-fire.js',
  'spec/**/*_spec.js'
];

gulp.task('spec', function() {
  return gulp.src(specFiles)
    .pipe(karma({
      configFile: 'karma.conf.js',
      action: 'run'
    }))
    .on('error', function(err) { throw err; });
});

gulp.task('compile-app', function() {
  return gulp.src([
    'vendor/json2.js',
    'node_modules/underwear/dist/string.js',
    'node_modules/underwear/dist/array.js',
    'node_modules/underwear/dist/utilities.js',
    'lib/namespace.js',
    'lib/sync.js',
    'lib/serializers/nested_id_serializer.js',
    'lib/serializers/nested_model_serializer.js',
    'lib/serializers/root_prefix_serializer.js',
    'lib/serializers/active_model_serializers.js',
    'lib/serializers/**/*.js',
    'lib/route_creator.js',
    'lib/collection.js',
    'lib/model.js',
    'lib/view.js',
    'lib/collection_view.js',
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
