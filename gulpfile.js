/**
 * Copyright 2014-2016 Gfycat, Inc. All Rights Reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS-IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

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
