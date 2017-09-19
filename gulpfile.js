var gulp = require('gulp');
var karma = require('karma').Server;

var jshint = require('gulp-jshint');
var stylish = require('jshint-stylish');
var jshintSummary = require('jshint-stylish-summary');
var minify = require('gulp-minify');

gulp.task('lint', function() {
  return gulp.src('./src/**/*.js')
    .pipe(jshint('.jshintrc'))
    .pipe(jshint.reporter('jshint-stylish'))
    .pipe(jshint.reporter('fail'))
    .pipe(jshintSummary.collect())
    .on('end', jshintSummary.summarize());
});

gulp.task('karma', function(done) {
  return new karma({
    configFile: __dirname + '/karma.conf.js',
    singleRun: true
  }, function() {
    done();
  }).start();
});
 
gulp.task('build', function() {
  return gulp.src('src/*.js')
  .pipe(minify({
      ext: {
        src: '.debug.js',
        min: '.min.js'
      }
  }))
  .pipe(gulp.dest('dist'));
});

gulp.task('test', ['lint', 'karma']);