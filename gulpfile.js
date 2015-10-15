var gulp 					= require('gulp');
var bower 				= require('gulp-bower');
var sass 					= require('gulp-sass');
var notify 				= require('gulp-notify');
var jade					= require('gulp-jade');
var templateCache = require ('gulp-angular-templatecache');
var streamqueue 	= require('streamqueue');


gulp.task('jade', function(){
	var j = jade({
		pretty: true
	});
	j.on('error', function(err){
		console.log(err);
		notify().write("jade error");
		j.end();
		gulp.watch();
	})
	return gulp.src('./app/views/*.jade')
	.pipe(j)
	.pipe(gulp.dest('./app/views/temp/'))
})

//compile the HTML views to a templatecache file for angular
gulp.task('views',['jade'], function(){
 return streamqueue({ objectMode: true },
    gulp.src('./app/views/temp/*.html')
    )
    .pipe(templateCache('./app/views/temp/templateCache.js', { module: 'templatescache', standalone: true }))
    .pipe(gulp.dest('./app/scripts/'));
});


//move the index file to the root of public
gulp.task('index', ['views'], function(){
	return gulp.src('./app/views/temp/index.html')
		.pipe(gulp.dest('./public'))
})


//move scripts to the public scripts folder
gulp.task('scripts', ['index'], function(){
	return streamqueue({ objectMode: true },
		gulp.src('./app/scripts/angular-app.js'),
		gulp.src('./app/scripts/data.js'),
		gulp.src('./app/scripts/temp/templateCache.js')
		)
		.pipe(gulp.dest('./public/assets/js/'));
});


//compile scss to css
gulp.task('sass', ['scripts'], function(){
	return gulp.src('./app/styles/*.scss')
		.pipe(sass({
			style: 'compressed',
			errLogToConsole: false,
			onError: function(err){
				return notify().write(err);
			}
		}))
		.pipe(gulp.dest('./public/src/css/'));
});


gulp.task('build',['sass'], function(){
	console.log('build complete')
})


//compile on change
gulp.task('watch', function(){
	gulp.watch(['./app/views/*', './app/styles/*'], ['build']);
});

gulp.task('bower', function(){
	return bower()
		.pipe(gulp.dest('./public/src/js/lib/'));
});



//the dafault task
gulp.task('default', ['watch', 'build', 'bower']);

