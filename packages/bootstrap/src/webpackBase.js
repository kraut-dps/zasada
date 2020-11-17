/**
 * базовый конфиг webpack
 */
var UglifyJsPlugin = require( 'uglifyjs-webpack-plugin' );
var oUglifyJsCfg = {
	parallel: true,
	uglifyOptions: {
		// for frendly debug
		compress: {
			// no "...;..." to var ...,..
			sequences: false,
			join_vars: false,

			// no if()... modify
			conditionals: false,
			if_return: false,

			// no o = new Class(); o.method() to (new Class()).method()
			collapse_vars: false
		}
	},
	extractComments: true,
	sourceMap: true
};

var fnModuleFilename = function ( oInfo ) {
	var sPath = oInfo.resourcePath.replace( 'webpack:///', '' );
	// remove related links
	sPath = sPath.replace( /^\.\//, '' );
	return 'app:///' + sPath;
};

module.exports = {
	mode: 'none',
	output: {
		// "webpack:///" => app:/// повыше в браузере, удобнее
		devtoolModuleFilenameTemplate: fnModuleFilename,
		devtoolFallbackModuleFilenameTemplate: fnModuleFilename
	},
	optimization: {
		splitChunks: {
			name: true,
			minSize: 0
		},
		minimizer: [
			new UglifyJsPlugin( oUglifyJsCfg )
		]
	},
	module: {
		rules: [
			{
				test: /\.js$/,
				use: {
					loader: 'babel-loader',
					options: {
						presets: [
							[
								"@babel/preset-env",
								{
									"loose": false,
									"targets": {
										"ie": "9"
									}
								}
							]
						],
						plugins: [
							"@babel/plugin-proposal-class-properties",
							"@babel/plugin-proposal-function-bind",
							"@babel/plugin-proposal-object-rest-spread",
							"@babel/plugin-syntax-dynamic-import",
							[
								"@babel/plugin-transform-runtime",
								{
									"corejs": false,
									"helpers": true,
									"regenerator": true,
									"useESModules": false
								}
							]
						]
					}
				},
				// https://github.com/webpack/webpack/issues/2031#issuecomment-219040479
				exclude: /node_modules\/(?!(di-box|@zasada)\/).*/
			},
		]
	},
	devServer: {
		open: true, // open browser

		// только чтобы правильно хост и порт устанавливался в sockJs http://localhost:8080/sockjs-node/info...
		openPage: 'http://localhost:8080',
		public: 'http://0.0.0.0',
		disableHostCheck: true,

		watchContentBase: true, // HMR для html частей приложения

		//contentBase: __dirname,

		overlay: true, // display error overlay
		stats: "errors-only",

		clientLogLevel: "warning"
	},
};