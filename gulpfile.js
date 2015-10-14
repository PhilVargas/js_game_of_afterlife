require('babel/register');
var gulp, gulpTasks;

gulp = require('gulp');
gulpTasks = require('./public/js/gulp/game_of_afterlife.js');

gulp.task('js:build', gulpTasks.build.js);
gulp.task('js:watch', gulpTasks.watch.js);
gulp.task('build:js', gulpTasks.build.js);
gulp.task('watch:js', gulpTasks.watch.js);

gulp.task('sass:build', gulpTasks.build.sass);
gulp.task('sass:watch', gulpTasks.watch.sass);
gulp.task('build:sass', gulpTasks.build.sass);
gulp.task('watch:sass', gulpTasks.watch.sass);

gulp.task('assets:build', ['build:js', 'build:sass']);
gulp.task('assets:watch', ['watch:js', 'watch:sass']);
gulp.task('build:assets', ['build:js', 'build:sass']);
gulp.task('watch:assets', ['watch:js', 'watch:sass']);
