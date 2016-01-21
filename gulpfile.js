var gulp = require('gulp');
var plugins = require('gulp-load-plugins')({
	scope: ['dependencies', 'devDependencies', 'peerDependencies'],
	rename: {
		"gulp-html-extend": "extender",
		"gulp-sass": "sass",
		"gulp-inline-css": "inliner",
		"gulp-watch": "watch",
		"rimraf": "rimraf",
		"gulp-css-rebase-urls": "rebaseUrls",
		"gulp-replace": "replace"
	}
});

var path = {
    build: { 
        html: 'build/',
        img: 'build/images/',
        css: 'src/css/'
    },
    src: { 
        html: ['src/*.html', '!src/master.html'], 
        style: 'src/css/main.scss',
        css: 'src/css/main.css',
        img: 'src/images/**/*.*'
    },
    watch: { 
        html: 'src/*.html', 
        style: 'src/css/main.scss',
        img: 'src/images/**/*.*'
    }
};

gulp.task('style:build', function () {
    gulp.src(path.src.style) 
        .pipe(plugins.sass())
        .pipe(plugins.rebaseUrls())
        .pipe(plugins.replace("src\/", ""))
        .pipe(gulp.dest(path.build.css));
});

gulp.task('image:build', function () {
    gulp.src(path.src.img) 
        .pipe(gulp.dest(path.build.img));
});

gulp.task('html:build', function () {
    gulp.src(path.src.html) 
        .pipe(plugins.extender({annotations:false}))
        .pipe(plugins.inliner({
                applyStyleTags: true,
                applyLinkTags: true,
                removeStyleTags: true,
                removeLinkTags: true
        }))
        .pipe(gulp.dest(path.build.html));
});

gulp.task('watch', function(){
    plugins.watch([path.watch.html], function(event, cb) {
        gulp.start('build');
    });
    plugins.watch([path.watch.style], function(event, cb) {
        gulp.start('build');
    });
    plugins.watch([path.watch.img], function(event, cb) {
        gulp.start('build');
    });
});

gulp.task('clean', function (cb) {
    plugins.rimraf(path.build.html, cb);
});

gulp.task('build', [
    'style:build',
    'image:build',
    'html:build'
]);

gulp.task('default', ['build', 'watch']);