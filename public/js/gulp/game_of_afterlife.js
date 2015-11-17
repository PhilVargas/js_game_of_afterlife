let gulp,
    clean,
    merge,
    ghPages,
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
clean = require('del');
merge = require('merge-stream');
ghPages = require('gulp-gh-pages');
sass = require('gulp-sass');
browserify = require('browserify');
babelify = require('babelify');
watchify = require('watchify');
uglify = require('gulp-uglify');
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
  fullPaths: true
};

function buildJs(destination){
  let browserBundle;

  browserBundle = browserify(browserifyOptions);
  return browserBundle.transform(babelify, {
    presets: ['es2015']
  })
    .bundle()
    .pipe(source('bundle.js'))
    .pipe(gulp.dest(destination));
}
function initializeWatcher(bundleToWatch){
  let watcher, updateStart;

  watcher = watchify(bundleToWatch);
  watcher.on('update', function(){
    updateStart = Date.now();
    watcher.bundle().on('error', function(e){
      displayError(e);
      return;
    }).pipe(source('bundle.js'))
    .pipe(gulp.dest(paths.build));
    console.log(`Updated! ${Date.now() - updateStart}ms. Complete at ${new Date()}`);
  });
  return watcher;
}

function watchJs(){
  let browserBundle, watcher;

  browserBundle = browserify(browserifyOptions);
  browserBundle.transform(babelify);
  watcher = initializeWatcher(browserBundle);
  watcher.bundle().on('error', function(e){
    displayError(e);
    return;
  })
  .pipe(source('bundle.js'))
  .pipe(gulp.dest(paths.build));
  return;
}

function buildSass(destination){
  return gulp.src('public/style/sass/application.scss')
    .pipe(sass({ outputStyle: 'compressed' }).on('error', sass.logError))
    .pipe(gulp.dest(destination));
}

function watchSass(){
  gulp.watch(paths.sassFiles, ['build:sass'])
  .on('change', function(e){
    console.log(`[watcher] File ${e.path.replace(/.*(?=sass)/, '')} was ${e.type} at ${new Date()}, compiling...`);
  });
}

function cleanScripts(){
  return clean([
    './dist'
  ]);
}
function deployPrep(){
  return merge(
    buildSass(paths.stylesDeployRoot),
    buildJs(paths.jsDeployRoot),
    gulp.src('README.md').pipe(gulp.dest('./dist/')),
    gulp.src('favicon.ico').pipe(gulp.dest('./dist/')),
    gulp.src('public/img/*').pipe(gulp.dest('./dist/img')),
    gulp.src('index.html').pipe(gulp.dest('./dist/'))
  );
}

function deployProd(){
  return gulp.src('./dist/**/*').pipe(ghPages({ force: true }));
}

module.exports.watch = {
  js: watchJs,
  sass: watchSass
};
module.exports.build = {
  js: buildJs.bind(null, paths.build),
  sass: buildSass.bind(null, paths.stylesRoot)
};
module.exports.deploy = {
  clean: cleanScripts,
  prep: deployPrep,
  prod: deployProd
}
