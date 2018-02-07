"use strict";

const gulp = require('gulp');
const imagemin = require('gulp-imagemin');
const imageResize = require('gulp-image-resize');


function processImg (filename) {
 return gulp.src(filename)
  .pipe(imagemin({optimizationLevel: 5}))
  .pipe(gulp.dest('./public/img'))
  .pipe(imageResize({
    width : 300,
    height : 200,
    crop : true,
    upscale : false
  }))
  .pipe(gulp.dest('./public/img/320'))

  .pipe(imageResize({
    width : 120,
    crop : false,
    upscale : false
  }))
  .pipe(gulp.dest('./public/img/120'))

  .pipe(imageResize({
    width : 48,
    height : 48,
    crop : true,
    upscale : false
  }))
  .pipe(gulp.dest('./public/img/48'));
}


process.on('message', function (images) {
  console.log('Image processing started...');
  var stream = processImg(images);
  stream.on('end', function () {
    process.send('Image processing complete');
    process.exit();
  });
  stream.on('error', function (err) {
    process.send(err);
    process.exit(1);
  });
});

module.exports = {};
