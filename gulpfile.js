const { series, src, dest } = require('gulp');
const karma = require('karma').Server;
const jshint = require('gulp-jshint');
const stylish = require('jshint-stylish');
const browserify = require("browserify");
const glob = require('glob');
const jshintSummary = require('jshint-stylish-summary');
const source = require('vinyl-source-stream');
const buffer = require("vinyl-buffer");
const uglify = require("gulp-uglify");

function lint() {
  return src('./src/**/*.js')
    .pipe(jshint('.jshintrc'))
    .pipe(jshint.reporter('jshint-stylish'))
    .pipe(jshint.reporter('fail'))
    .pipe(jshintSummary.collect())
    .on('end', jshintSummary.summarize());
}

function unitTests(done) {
  return new karma({
    configFile: __dirname + '/karma.conf.js',
    singleRun: true
  }, function() {
    done();
  }).start();
}
 
function compile() {
  const files = glob.sync('./src/**/*.js');

  return browserify({
    entries: files
  })
  .bundle()
  .pipe(source('angular-mem-cache.min.js'))
  .pipe(buffer())
  .pipe(uglify())
  .pipe(dest('dist/'));
}

exports.test = series(lint, unitTests);
exports.build = compile;