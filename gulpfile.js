var gulp = require('gulp');
var gulpUtil = require('gulp-util');
var imagemin = require('gulp-imagemin');


var paths = {
    images: 'public/img/*'
};


gulp.task('images', function () {
 return gulp.src(paths.images)
    .pipe(imagemin({optimizationLevel: 5}))
    .pipe(gulp.dest('./production/img'));
});


gulp.task('default', ['images']);

