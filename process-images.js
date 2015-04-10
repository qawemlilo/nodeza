"use strict";

var gulp = require('gulp');
var imagemin = require('gulp-imagemin');
var imageResize = require('gulp-image-resize');


function processImg (filename) {
 return gulp.src(filename)
  .pipe(imagemin({optimizationLevel: 3}))
  .pipe(gulp.dest('public/img'))
  .pipe(imageResize({
    format: 'jpg',
    width: 300,
    height: 200,
    crop: true
  }))
  .pipe(gulp.dest('public/img/320'))

  .pipe(imageResize({
    format: 'jpg',
    width: 120,
    height: 120,
    crop: true
  }))
  .pipe(gulp.dest('public/img/120'))

  .pipe(imageResize({
    format: 'jpg',
    width: 48,
    height: 48,
    crop: true
  }))
  .pipe(gulp.dest('public/img/48'));
}


process.on('message', function (img) {
  var stream = processImg(img);

  stream.on('end', function () {
    process.send('complete');
    process.exit();
  });

  stream.on('error', function (err) {
    process.send(err);
    process.exit(1);
  });
});

module.exports = {};



