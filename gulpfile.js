var gulp = require('gulp');
var concatCss = require('gulp-concat-css');
var less = require('gulp-less');
var path = require('path');
var concat = require('gulp-concat');
var cssmin = require('gulp-cssmin');
var rename = require('gulp-rename');
var lessSrc = 'less/*.less';
var cssSrc = ['node_modules/kendo-ui-core/css/web/kendo.common.core.min.css',
    'node_modules/kendo-ui-core/css/web/kendo.default.min.css',
    'node_modules/kendo-ui-core/css/web/kendo.default.mobile.min.css',
    'node_modules/bootstrap/dist/css/bootstrap.min.css',
    'Content/DataTables/datatables.min.css',
    'node_modules/font-awesome/css/font-awesome.min.css',
    'css/site.css'
  ];

gulp.task('css:watch', ['watch', 'css']);

gulp.task('css', ['less'], function () {
  return gulp.src(cssSrc)
    .pipe(concat("bundle.css"))
    .pipe(gulp.dest('css/'));
});

gulp.task('less', function () {
  return gulp.src(lessSrc)
    .pipe(less({
      paths: [path.join(__dirname, 'less', 'includes')]
    }))
    .pipe(gulp.dest('css/'));
});

gulp.task('watch', function() {
  gulp.watch(lessSrc, ['css']);
});

gulp.task('css:min', function () {
  gulp.src('css/bundle.css')
    .pipe(cssmin())
    .pipe(rename({ suffix: '.min' }))
    .pipe(gulp.dest('css/'));
});