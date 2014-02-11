var gulp = require('gulp'),
  nodemon = require('gulp-nodemon'),
  gutil = require('gulp-util');

var paths = {
  server: '/server'
};

//
//gulp.task('watch', function() {
//  gulp.watch(paths.server, ['scripts']);
////  gulp.watch(paths.images, ['images']);
//});

gulp.task('server', function () {
  nodemon({ script: 'server.js', options: '-i app' });
//    .on('restart', ['lint'])
});

// The default task (called when you run `gulp` from cli)
gulp.task('default', ['server']);
