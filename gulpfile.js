require('babel/register');
var gulp, gulpTasks;

gulp = require('gulp');
gulpTasks = require('./public/js/gulp/game_of_afterlife.js')

gulp.task('build:js', gulpTasks.build.js)
gulp.task('watch:js', gulpTasks.watch.js)

gulp.task('build:assets', ['build:js'])
gulp.task('watch:assets', ['watch:js'])
