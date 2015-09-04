require('babel/register');
var gulp, gulpTasks;

gulp = require('gulp');
gulpTasks = require('./public/js/gulp/game_of_afterlife.js');

gulp.task('build:js', gulpTasks.build.js);
gulp.task('watch:js', gulpTasks.watch.js);

gulp.task('build:sass', gulpTasks.build.sass);
gulp.task('watch:sass', gulpTasks.watch.sass);

gulp.task('build:assets', ['build:js', 'build:sass']);
gulp.task('watch:assets', ['watch:js', 'watch:sass']);
