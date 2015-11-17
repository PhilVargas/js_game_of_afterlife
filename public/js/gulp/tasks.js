const gulp = require('gulp');
const clean = require('del');
const merge = require('merge-stream');
const ghPages = require('gulp-gh-pages');
const sass = require('gulp-sass');
const browserify = require('browserify');
const babelify = require('babelify');
const source = require('vinyl-source-stream');
const paths = require('./filepaths.js');
const displayError = paths.displayError;

const browserifyOptions = {
  entries: paths.entries,
  basedir: paths.jsRoot,
  paths: paths.includes,
  extensions: ['.js'],
  debug: true,
  cache: {},
  packageCache: {},
  fullPaths: true
};

/**
 * @name buildJs
 * @param {String} destination path to the output destination. This value changes based on
 * production / development deploy and should be set (using bind) in the export of this file.
 * @listens {event:error} gulp event error emmitted when a bundle compilation fails. logs a custom
 * error message from `displayError`
 * @summary Function responsible for building the javascript bundle using babelify (babel 6).
 * @return {Function} stream object used for gulp tasks
 */
function buildJs(destination){
  return browserify(browserifyOptions)
    .transform(babelify, {
      presets: ['es2015']
    })
    .bundle()
    .on('error', function(e){
      displayError(e);
      return;
    })
    .pipe(source('bundle.js'))
    .pipe(gulp.dest(destination));
}

/**
 * @name watchJs
 * @borrows buildJs
 * @summary gulp task responsible for watching the javascript bundle. invoke the build task and
 * set up a watcher on the JS files
 * @return {void}
 */
function watchJs(){
  buildJs(paths.build);
  console.log(`[watcher] Bundle initialized at ${new Date()}`);
  gulp.watch(paths.jsFiles, function(e){
    buildJs(paths.build);
    console.log(`[watcher] File ${e.path.replace(/.*(?=js)/, '')} was ${e.type} at ${new Date()}, compiling...`);
  });
}

/**
 * @name buildSass
 * @function
 * @param {String} destination path to the output destination. This value changes based on
 * production / development deploy and should be set (using bind) in the export of this file.
 * @param {String} outputStyle `node-sass` config option for the outputStyle
 * @summary build task used to build minified css sheets.
 * @return {Function} stream object used for gulp tasks
 */
function buildSass(destination, outputStyle){
  return gulp.src('public/style/sass/application.scss')
    .pipe(sass({ outputStyle }).on('error', sass.logError))
    .pipe(gulp.dest(destination));
}

/**
 * @name watchSass
 * @function
 * @listens {event:change} gulp event emmitted on a changed scss file
 * @summary watch task used to build minified css sheets on change.
 * @return {void}
 */
function watchSass(){
  buildSass(paths.stylesRoot, 'nested');
  console.log(`[watcher] Bundle initialized at ${new Date()}`);
  gulp.watch(paths.sassFiles, function(e){
    buildSass(paths.stylesRoot, 'nested');
    console.log(`[watcher] File ${e.path.replace(/.*(?=sass)/, '')} was ${e.type} at ${new Date()}, compiling...`);
  });
}

/**
 * @name cleanScripts
 * @function
 * @requires del
 * @summary gulp task used to clear out listed directories or files
 * @return {Function} stream used for gulp tasks
 */
function cleanScripts(){
  return clean([
    './dist'
  ]);
}

/**
 * @name deployPrep
 * @function
 * @borrows buildSass
 * @borrows buildJs
 * @summary executes a set of gulp tasks. These tasks must all be asyncronous (must not depend on a
 * previous task in order to run) and must all return gulp streams. Its primary use is to build the
 * `dist` directory for deployment
 * @return {Function} stream used for gulp tasks
 */
function deployPrep(){
  return merge(
    buildSass(paths.stylesDeployRoot, 'compressed'),
    buildJs(paths.jsDeployRoot),
    gulp.src('README.md').pipe(gulp.dest('./dist/')),
    gulp.src('favicon.ico').pipe(gulp.dest('./dist/')),
    gulp.src('public/img/*').pipe(gulp.dest('./dist/img')),
    gulp.src('index.html').pipe(gulp.dest('./dist/'))
  );
}

/**
 * @name deployProd
 * @function
 * @summary Task used to deploy everything in the dist folder to gh-pages
 * @return {Function} stream used for gulp tasks
 */
function deployProd(){
  return gulp.src('./dist/**/*').pipe(ghPages({ force: true }));
}

module.exports.watch = {
  js: watchJs,
  sass: watchSass
};
module.exports.build = {
  js: buildJs.bind(null, paths.build),
  sass: buildSass.bind(null, paths.stylesRoot, 'compressed')
};
module.exports.deploy = {
  clean: cleanScripts,
  prep: deployPrep,
  prod: deployProd
};
