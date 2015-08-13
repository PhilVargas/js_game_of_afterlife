var gulp,
    sass,
    browserify,
    babelify,
    watchify,
    uglify,
    buffer,
    source,
    paths,
    displayError,
    browserifyOptions;

gulp = require('gulp');
sass = require('gulp-sass');
browserify = require('browserify');
babelify = require('babelify');
watchify = require('watchify');
uglify = require('gulp-uglify')
buffer = require('vinyl-buffer');
source = require('vinyl-source-stream');
paths = require('./filepaths.js');
displayError = paths.displayError;

browserifyOptions = {
  entries: paths.entries,
  basedir: paths.jsRoot,
  paths: paths.includes,
  extensions: ['.js'],
  debug: true,
  cache: {},
  packageCache: {},
  fullPaths: true,
}

function buildJs(){
  var browserBundle, watcher;
  browserBundle = browserify(browserifyOptions);
  browserBundle.transform(babelify);
  watcher = watchify(browserBundle)
  watcher.bundle()
    .pipe(source('bundle.js'))
    .pipe(buffer())
    .pipe(uglify())
    .pipe(gulp.dest(paths.build))
    .on('end', function(){
      watcher.close();
    });
}

function initializeWatcher(bundleToWatch){
  var watcher = watchify(bundleToWatch);
  watcher.on('update', function(){
    updateStart = Date.now();
    watcher.bundle().on('error', function(e){
      displayError(e);
      return
    }).pipe(source('bundle.js'))
    .pipe(gulp.dest(paths.build));
    console.log('Updated! ' + (Date.now() - updateStart) + 'ms. Complete at' + new Date())
  });
  return watcher
}

function watchJs(){
  var browserBundle, watcher;
  browserBundle = browserify(browserifyOptions);
  browserBundle.transform(babelify);
  watcher = initializeWatcher(browserBundle);
  watcher.bundle().on('error', function(e){
    displayError(e);
    return
  })
  .pipe(source('bundle.js'))
  .pipe(gulp.dest(paths.build));
  return
}

module.exports.watch = {
  js: watchJs
}
module.exports.build = {
  js: buildJs
}
