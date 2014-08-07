var gulp = require('gulp');
var imagemin = require('gulp-imagemin');
var imageResize = require('gulp-image-resize');


module.exports = function (filename) {
 return gulp.src(filename)
  .pipe(imagemin({optimizationLevel: 5}))
  .pipe(gulp.dest('public/img')) 
  .pipe(imageResize({ 
    width : 320,
    height : 320,
    crop : true,
    upscale : false
  }))
  .pipe(gulp.dest('public/img/320')) 

  .pipe(imageResize({ 
    width : 120,
    height : 120,
    crop : true,
    upscale : false
  }))
  .pipe(gulp.dest('public/img/120'))
    
  .pipe(imageResize({ 
    width : 48,
    height : 48,
    crop : true,
    upscale : false
  }))
  .pipe(gulp.dest('public/img/48'));
};

