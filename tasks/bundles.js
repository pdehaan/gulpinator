var gulp        = require('gulp'),
    concat      = require('gulp-concat'),
    gulpif      = require('gulp-if'),
    uglify      = require('gulp-uglify'),
    eventStream = require('event-stream'),
    gulpPrint   = require('gulp-print'),
    changed     = require('gulp-changed'),
    rev         = require('gulp-rev'),
    config      = require('../utilities/getConfig').getConfig(),
    exporter    = require('../utilities/createExportsObject');

// JS compile function
var compileJsBundle = function(src, filename, dest, minify) {
  return gulp.src(src)
    .pipe(gulpif(config.verbose, gulpPrint(function(filepath) {
      return 'running bundle-task on: ' + filepath;
    })))
    .pipe(concat(filename))
    .pipe(gulpif(minify, uglify()))
    .pipe(gulpif(config.rev, rev()))
    .pipe(gulp.dest(dest));
};

var compileBundle = function(bundle) {
  return compileJsBundle(
    bundle.sources, bundle.name + '.js',
    config.defaultDest + '/' + config.dest.scripts,
    bundle.minify
  );
};

var compileBundlesAsSingleStream = function() {
  var streams = [];

  for (var i = 0; i < config.libraries.length; i++) {
    var bundle = config.libraries[i];
    streams.push(compileBundle(bundle));
  }

  return eventStream.merge(streams);
};

var compileBundlesAsSeperateStreams = function() {
  var streams = [];

  for (var i = 0; i < config.libraries.length; i++) {
    var bundle = config.libraries[i];
    streams.push({
      stream: compileBundle(bundle),
      name: bundle.name
    });
  }

  return streams;
};

module.exports = {
  getStream: compileBundlesAsSingleStream,
  getTask: function() {
    return compileBundlesAsSingleStream;
  },
  getSeperateStreams: compileBundlesAsSeperateStreams
};
