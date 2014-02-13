var gulp = require('gulp'),
  nodemon = require('gulp-nodemon'),
  gutil = require('gulp-util'),
  spawn = require('gulp-spawn-shim'),
  debug = require('gulp-debug'),
  through = require('through2'),
  concat = require('gulp-concat'),
  uglify = require('gulp-uglify');

var paths = {
  server: '/server'
};

var trim = function(buf) {
  return buf.toString('utf8', 0, 1000).trim() + '...\n';
};

gulp.task('mongo', function(cb) {
  var options = {
    cmd: 'mongod',
    args: [],
    silent: false
  };

  return gulp.src('server.js')
    .pipe(spawn(options))
    .pipe(through.obj(function(chunk, enc, callback) {
      gutil.log(trim(chunk.contents));
      callback();
    }));
});


gulp.task('redis', function() {
  var options = {
    cmd: 'redis-server',
    args: [],
    silent: false
  };

  return gulp.src('server.js')
    .pipe(spawn(options))
    .pipe(through.obj(function(chunk, enc, callback) {
      gutil.log(trim(chunk.contents));
      callback();
    }));
});

gulp.task('startNode', ['mongo', 'redis'], function() {
  return nodemon({ script: 'server.js', options: '-i app' });
//    .on('restart', ['lint'])
});

gulp.task('startNodeDebug', ['mongo', 'redis'], function() {
  return nodemon({ script: 'server.js', options: '-i app --debug-brk' });
//    .on('restart', ['lint'])
});

gulp.task('server', ['mongo', 'redis', 'startNode']);
gulp.task('debug', ['mongo', 'redis', 'startNodeDebug']);


// The default task (called when you run `gulp` from cli)
gulp.task('default', ['server']);
