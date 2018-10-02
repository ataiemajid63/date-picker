var gulp = require('gulp');
var concat = require('gulp-concat');
var sourcemaps = require('gulp-sourcemaps');
var minify = require('gulp-minify');
var sass = require('gulp-sass');
 
gulp.task('default', function(){
  return gulp.src([
  		'./src/*.js', 
  	], {base:'./'})
    // .pipe(sourcemaps.init())
    .pipe(concat('date-picker.js'))
    // .pipe(sourcemaps.write())
    // .pipe(minify())
    .pipe(gulp.dest('dist'))
});

gulp.task('sass', function () {
  return gulp.src('./src/*.scss')
    .pipe(sass().on('error', sass.logError))
    .pipe(gulp.dest('./dist'));
});
 
gulp.task('sass:watch', function () {
  gulp.watch('./src/*.scss', ['sass']);
});