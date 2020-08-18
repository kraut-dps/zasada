var sProjectRoot = __dirname  + '/../';

var fnIsCoverageRun = function ( oConfig ) {
	return !!oConfig.coverage;
};

var fnGetWebpackConfig = function ( oConfig ) {
	var oWebpackBase = require( '../src/utils/webpackBase.js' );
	var fnWebpackMerge = require( 'webpack-merge' ).merge;
	var oWebpackConfig = fnWebpackMerge(
		oWebpackBase,
		{
			resolve:{
				alias: {
					zasada: sProjectRoot
				},
				modules: [ sProjectRoot + '/node_modules' ]
			}
		}
	);
	oWebpackConfig.entry = '';
	oWebpackConfig.plugins = [];
	oWebpackConfig.devtool = 'source-map';

	// если этот запрос только генерация coverage
	if ( fnIsCoverageRun( oConfig ) ) {
		oWebpackConfig.module.rules.push(
			{
				test: /\.js$/,
				use: {
					loader: 'istanbul-instrumenter-loader',
					options: {esModules: true}
				},
				enforce: 'post',
				exclude: /node_modules|tests|polyfill/
			}
		);
	}
	return oWebpackConfig;
};

var fnGetReporters = function ( oConfig ) {
	var aReporters = ['dots'];
	if ( fnIsCoverageRun( oConfig ) ) {
		aReporters.push( 'coverage-istanbul' );
	}
	return aReporters;
};


module.exports = function ( config ) {
	config.set( {

		// base path that will be used to resolve all patterns (eg. files, exclude)
		basePath: '..',

		// frameworks to use
		// available frameworks: https://npmjs.org/browse/keyword/karma-adapter
		frameworks: ['jasmine-ajax', 'jasmine'],

		// list of files / patterns to load in the browser
		files: [
			{pattern: 'node_modules/yaku/lib/yaku.js', included: true},
			{pattern: 'node_modules/proto-polyfill/index.js', included: false},
			'./tests/**/*Spec.js',
			'./src/utils/polyfillPromise.js',
			{pattern: './tests/_support/data/*.js', included: false},
			{pattern: 'node_modules/weakmap-polyfill/weakmap-polyfill.js', included: false},
			{pattern: 'node_modules/classlist-polyfill/src/index.js', included: false},
			{pattern: 'node_modules/sourcemapped-stacktrace/dist/sourcemapped-stacktrace.js', included: false}
		],

		// list of files / patterns to exclude
		exclude: [],

		// preprocess matching files before serving them to the browser
		// available preprocessors: https://npmjs.org/browse/keyword/karma-preprocessor
		preprocessors: {
			'./tests/**/*Spec.js': ['webpack', 'sourcemap'],
			'./src/utils/polyfillPromise.js': ['webpack', 'sourcemap']
		},

		// test results reporter to use
		// possible values: 'dots', 'progress'
		// available reporters: https://npmjs.org/browse/keyword/karma-reporter
		reporters: fnGetReporters( config ),

		// web server port
		port: 9876,

		// enable / disable colors in the output (reporters and logs)
		colors: true,

		// level of logging
		// possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
		logLevel: config.LOG_INFO,

		// enable / disable watching file and executing tests whenever any file changes
		autoWatch: false,

		// start these browsers
		// available browser launchers: https://npmjs.org/browse/keyword/karma-launcher
		//browsers: [ 'Firefox', 'Chrome', 'IE9', 'IE10', 'IE11' ],
		//browsers: [ 'IE9' ],
		browsers: ['Chrome'],
		browserNoActivityTimeout: 4000,

		// Continuous Integration mode
		// if true, Karma captures browsers, runs the tests and exits
		singleRun: false,

		// Concurrency level
		// how many browser should be started simultaneous
		concurrency: Infinity,

		webpack: fnGetWebpackConfig( config ),

		// karma-ie-launcher config
		customLaunchers: {
			IE9: {
				base: 'IE',
				'x-ua-compatible': 'IE=EmulateIE9'
			},
			IE10: {
				base: 'IE',
				'x-ua-compatible': 'IE=EmulateIE10'
			},
			IE11: {
				base: 'IE',
				'x-ua-compatible': 'IE=EmulateIE11'
			},
			VirtualBoxIE11onWin7: {
				base: 'VirtualBoxIE11',
				keepAlive: true,
				snapshot: 'pristine',
				vmName: 'IE11 - Win7'
			}
		},

		// karma-coverage-istanbul-reporter config
		coverageIstanbulReporter: {
			reports: ['html'],
			fixWebpackSourcePaths: true
		}
	} )
};