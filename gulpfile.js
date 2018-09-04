const gulp = require('gulp'),
    htmlmin = require('gulp-htmlmin'),
    uglify = require('gulp-uglify-es').default,
    cleancss = require('gulp-clean-css'),
    imagemin = require('gulp-imagemin'),
    del = require('del'),
    run_sequence = require('run-sequence');

/*minify all the HTML files*/
gulp.task('minify-html', () => {
    gulp.src('./src/*.html')
        .pipe(htmlmin({
            collapseWhitespace: true,
            removeComments: true
        }))
        .pipe(gulp.dest('./dist'));
});

/*minify all the CSS files*/
gulp.task('minify-css', () => {
    gulp.src('./src/css/*.css')
        .pipe(cleancss())
        .pipe(gulp.dest('./dist/css'));
});

/*minify all the JS files*/
gulp.task('minify-js', () => {
    gulp.src('./src/js/*.js')
        .pipe(uglify())
        .pipe(gulp.dest('./dist/js'));
});

/*optimize all the images*/
gulp.task('minify-image', () => {
    gulp.src('./src/images/*.png')
        .pipe(imagemin())
        .pipe(gulp.dest('./dist/images'))
});

/*pipe all the audio files*/
gulp.task('pipe-audio', () => {
    gulp.src('./src/audio/*.mp3')
        .pipe(gulp.dest('./dist/audio'));
});

/*clean the destination folder before piping all the source files*/
gulp.task('clean', () => del(['dist']));

/*run the default task*/
gulp.task('default', ['clean'], () => {
    run_sequence('minify-html', 'minify-css', 'minify-js', 'minify-image', 'pipe-audio');
});