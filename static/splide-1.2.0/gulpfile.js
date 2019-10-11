'use strict';

/*
 * Dependencies.
 */
const gulp          = require( 'gulp' );
const rename        = require( 'gulp-rename' );
const sass          = require( 'gulp-sass' );
const sassGlob      = require( 'gulp-sass-glob' );
const postcss       = require( 'gulp-postcss' );
const autoprefixer  = require( 'autoprefixer' );
const cssnano       = require( 'cssnano' );
const merge         = require( 'merge-stream' );
const concat        = require( 'gulp-concat' );
const webpackStream = require( 'webpack-stream' );
const eslint        = require( 'gulp-eslint' );
const gzip          = require( 'gulp-gzip' );

/*
 * Webpack config paths.
 */
const js = {
	complete: {
		path: './build/complete/config',
		dest: './dist/js',
		gzip: true,
	},
};


/*
 * Path definitions.
 */
const css = {
	all: {
		path : './src/sass/core/*.scss',
		dest : './dist/css',
		merge: {
			filename: 'splide.css',
			path    : './src/sass/themes/default/*.scss',
		},
	},
	core: {
		path: './src/sass/core/*.scss',
		dest: './dist/css',
	},
	themes: {
		path: [
			'./src/sass/themes/default/*.scss',
		],
		dest: './dist/css/themes',
	},
};

/*
 * Build a script file.
 */
gulp.task( 'build:js', done => {
	Object.values( js ).forEach( settings => {
		const stream = webpackStream( { config: require( settings.path ) } )
			.pipe( rename( { suffix: '.min' } ) )
			.pipe( gulp.dest( settings.dest ) );

		if ( settings.gzip ) {
			stream.pipe( gzip() ).pipe( gulp.dest( settings.dest ) );
		}
	} );

	done();
} );

/*
 * Build sass files.
 */
gulp.task( 'build:sass', done => {
	Object.values( css ).forEach( settings => {
		let stream = gulp.src( settings.path );

		if ( settings.merge ) {
			stream = merge( stream, gulp.src( settings.merge.path ) )
				.pipe( sassGlob() )
				.pipe( sass() )
				.pipe( concat( settings.merge.filename ) );
		}

		stream
			.pipe( sassGlob() )
			.pipe( sass() )
			.pipe( postcss( [
				cssnano( { reduceIdents: false } ),
				autoprefixer( { overrideBrowserslist: [ '> 5%' ] } )
			] ) )
			.pipe( rename( { suffix: '.min' } ) )
			.pipe( gulp.dest( settings.dest ) );
	} );

	done();
} );

gulp.task( 'lint', () => {
	return gulp.src( [ './src/**/*.js', './tests/**/*.js' ] )
		.pipe( eslint( { useEslintrc: true } ) )
		.pipe( eslint.format() )
		.pipe( eslint.failAfterError() );
} );