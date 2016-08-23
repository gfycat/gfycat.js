var gulp = require('gulp'),
    jshint = require('gulp-jshint'),
    stylish = require('jshint-stylish'),
    uglify = require('gulp-uglify'),
    pump = require('pump'),
    rename = require('gulp-rename'), // TODO: delete ?
    concat = require('gulp-concat'),
    runSequence = require('run-sequence'),
    chalk = require('chalk');

gulp.task('build', function() {
  runSequence('lint', 'compress', function(err) {
    console.log(err.plugin + chalk.red(' FAIL'));
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

gulp.task('compress', function (cb) {
  pump([
      gulp.src('web/js/*.js'),
      concat('gfycat.min.js'),
      uglify(),
      gulp.dest('dist')
    ]
  );
});

gulp.task('watch', function() {
  gulp.watch('web/js/*.js', ['build']);
});
