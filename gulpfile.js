var gulp = require('gulp'),
    jshint = require('gulp-jshint'),
    stylish = require('jshint-stylish'),
    uglify = require('gulp-uglify'),
    pump = require('pump'),
    rename = require('gulp-rename'), // TODO: delete ?
    concat = require('gulp-concat'),
    runSequence = require('run-sequence'),
    chalk = require('chalk'),
    Server = require('karma').Server;

var isProductionBuild = false;

gulp.task('build', function() {
  runSequence('lint', 'compress', function(err) {
    if (err) console.log(err.plugin + chalk.red(' FAIL'));
  });
});

// TODO separate lint for code and tests
gulp.task('lint', function() {
    return gulp.src(['web/js/*.js', 'tests/**/*.js'])
      .pipe(jshint({
        shadow: true // suppresses warnings about variable shadowing
      }))
      .pipe(jshint.reporter(stylish))
      .pipe(jshint.reporter('fail'));
});

gulp.task('compress', function () {
  gulp.src('web/js/*.js')
    .pipe(concat('gfycat.js'))
    .pipe(gulp.dest('dist'));

  if (isProductionBuild) {
    gulp.src('dist/gfycat.js')
      .pipe(uglify())
      .pipe(concat('gfycat.min.js'))
      .pipe(gulp.dest('dist'));
  }
});

gulp.task('watch', function() {
  gulp.watch('web/js/*.js', ['build']);
});

gulp.task('watch-test', function() {
  gulp.watch(['web/js/*.js', 'tests/**/*.js'], ['build']);
});

/**
 * Run test once and exit
 */
gulp.task('test', function (done) {
  new Server({
    configFile: __dirname + '/karma.conf.js',
    singleRun: true
  }, done).start();
});

/**
 * Watch for file changes and re-run tests on each change
 */
gulp.task('tdd', function (done) {
  new Server({
    configFile: __dirname + '/karma.conf.js'
  }, done).start();
});

//gulp.task('default', ['tdd']);
