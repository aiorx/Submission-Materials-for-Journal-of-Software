```js
// Copy coin images.
gulp.task('copy-images', function () {
  return gulp.src(dir.src + '/images/**/*', {base: dir.src})
    .pipe(gulp.dest(outputDir));
});
```