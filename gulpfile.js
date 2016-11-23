var gulp = require('gulp');
var concatCss = require('gulp-concat-css');
var less = require('gulp-less');
var path = require('path');

gulp.task('css', ['less'], function () {
    return gulp.src('styles/site.css')
        .pipe(concatCss("bundle.css"))
        .pipe(gulp.dest('dist/'));
});

gulp.task('less', function () {
  return gulp.src('src/less/*.less')
    .pipe(less({
      paths: [ path.join(__dirname, 'less', 'includes') ]
    }))
    .pipe(gulp.dest('styles/'));
});