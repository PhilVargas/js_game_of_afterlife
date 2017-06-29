import gulp from 'gulp';
import gutil from 'gulp-util';
import clean from 'del';
import merge from 'merge-stream';
import ghPages from 'gulp-gh-pages';
import sass from 'gulp-sass';
import webpack from 'webpack';
import paths from './filepaths';
import config from '../../../webpack.config';

/**
 * @name buildJs
 * @summary Function responsible for building the javascript bundle using webpack.
 * @return {void}
 */
function buildJs({ shouldDisplayLog = true } = {}){
  webpack(config, function(err, stats){
    if (err) { throw new gutil.PluginError('webpack', err); }
    if (shouldDisplayLog) { gutil.log(`[${gutil.colors.blue('webpack')}]`, stats.toString({ })); }
  });
}

/**
 * @name watchJs
 * @borrows buildJs
 * @summary gulp task responsible for watching the javascript bundle. invoke the build task and
 * set up a watcher on the JS files
 * @return {void}
 */
function watchJs(){
  gutil.log('Bundle initialized. compiling...');
  buildJs({ shouldDisplayLog: false });
  gutil.log('Bundle initialized. complete.');
  gulp.watch(paths.jsFiles, function(e){
    const fileName = e.path.replace(/.*\/(?=.*\.js)/, '');

    buildJs({ shouldDisplayLog: false });
    gutil.log(`[${gutil.colors.blue('watcher')}]`, `File \`${fileName}\` was ${e.type}. Compilation complete.`);
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
  buildJs();

  return merge(
    buildSass(paths.stylesDeployRoot, 'compressed'),
    gulp.src('public/js/app.bundle.js').pipe(gulp.dest('./dist/public/js/')),
    gulp.src('README.md').pipe(gulp.dest('./dist/')),
    gulp.src('favicon.ico').pipe(gulp.dest('./dist/')),
    gulp.src('public/img/*').pipe(gulp.dest('./dist/public/img')),
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

const watch = {
  js: watchJs,
  sass: watchSass
};
const build = {
  js: buildJs,
  sass: buildSass.bind(null, paths.stylesRoot, 'compressed')
};
const deploy = {
  clean: cleanScripts,
  prep: deployPrep,
  prod: deployProd
};

export { watch, build, deploy };
