var gulp = require('gulp'),
    jshint = require('gulp-jshint'),
    stylish = require('jshint-stylish'),
    uglify = require('gulp-uglify'),
    pump = require('pump'),
    rename = require('gulp-rename'), // TODO: delete ?
    concat = require('gulp-concat'),
    runSequence = require('run-sequence'),
    chalk = require('chalk');

var isProductionBuild = false;

gulp.task('build', function() {
  runSequence('lint', 'compress', function(err) {
    if (err) console.log(err.plugin + chalk.red(' FAIL'));
  });
});

gulp.task('lint', function() {
    return gulp.src('web/js/*.js')
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
