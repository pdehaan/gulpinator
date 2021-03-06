var gulp          = require('gulp'),
    rename        = require('gulp-rename'),
    config        = require('../utilities/getConfig').getConfig(),
    exporter      = require('../utilities/createExportsObject');

var moveAdditionalFiles = function() {
  return gulp.src(config.additionalFiles + '/**/*', { base: config.additionalFiles + '/' })
    .pipe(gulp.dest(config.defaultDest));
};

module.exports = exporter(moveAdditionalFiles);
