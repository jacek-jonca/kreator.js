var browserify = require('browserify');
var gulp = require('gulp');
var pug = require('gulp-pug');
var stylus = require('gulp-stylus');
var fs = require('fs');
var mold = require('mold-source-map');

var paths = {
	js  : {
		in: './lib/main.js',
		out: './lib/build/main.js'
	},
	css : {
		in: ['./css/*.styl'],
		out: './css'
	},
	html: {
		in: ['./views/*.pug'],
		out: './output'
	}
};

//gulp.task('browserify', function(){
//    browserify(paths.js.in, {debug: true})
//    .bundle()
//    .pipe(mold.transformSourcesRelativeTo(__dirname))
//    .pipe(fs.createWriteStream(paths.js.out));
//});

gulp.task('browserify', function () {
    var b = browserify({
        entries: paths.js.in,
        debug: true,
//        transform: [vueify, babelify.configure({presets: ["es2015"]})]
    });
    return b.bundle()
//        .pipe(source('build.js'))
//        .pipe(buffer())
//        .on('error', gutil.log)
//        .pipe(gulp.dest('./dist/'));
		.pipe(mold.transformSourcesRelativeTo(__dirname))
		.pipe(fs.createWriteStream(paths.js.out));
    });

gulp.task('build-css', function(){
	return gulp.src(paths.css.in)
	.pipe(stylus({
		set: ['compress']
	}))
	.pipe(gulp.dest(paths.css.out));
});

gulp.task('build-html', function(){
	return gulp.src(paths.html.in)
	.pipe(pug({pretty: true}))
	.pipe(gulp.dest(paths.html.out));
});

gulp.task('watch', function() {
	gulp.watch('./lib/*.js', ['browserify']);
	gulp.watch(paths.css.in, ['build-css']);
	gulp.watch(paths.html.in, ['build-html']);
});

//gulp.task('default', ['browserify', 'build-html', 'build-css']);
gulp.task('default', gulp.series('browserify', 'build-html', 'build-css'));
