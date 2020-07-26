var fnWebpackItem = require( './webpackItem.js' );

// главная настройка
module.exports = [
	fnWebpackItem(
		{
			index: './desktop/index.es6',
			promise: './promise.es6'
		},
		__dirname + '/www/desktop-build/',
		'desktop-build/',
		{
			alias: {
				"zasada":  __dirname + '/../.',
				"app": __dirname
			},
			modules: [ __dirname + "/base", __dirname + "/desktop", "../node_modules", "node_modules" ]
		}
	),
	fnWebpackItem(
		{
			index: './mobile/index.es6',
			promise: './promise.es6'
		},
		__dirname + '/www/mobile-build/',
		'mobile-build/',
		{
			alias: {
				"zasada":  __dirname + '/../.',
				"app": __dirname
			},
			modules: [ __dirname + "/base", __dirname + "/mobile", "../node_modules", "node_modules" ]
		}
	)
];

