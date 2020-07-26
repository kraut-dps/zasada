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

			// no o = new Class(); o.method() в (new Class()).method()
			collapse_vars: false
		}
	},
	extractComments: true,
	sourceMap: true
};

/**
 * @param {string[]} aEntries
 * @param {string} sPath
 * @param {string} sPublicPath
 * @param {object} oResolve
 */
module.exports = function ( aEntries, sPath, sPublicPath, oResolve = { modules: [ "node_modules" ] } ) {
	var fnModuleFilename = function ( oInfo ) {
		var sPath = oInfo.resourcePath.replace( 'webpack:///', '' );
		// remove related links
		sPath = sPath.replace( /^\.\//, '' );
		return 'app:///' + sPath;
	};

	return {
		//mode: 'production',
		//mode: 'development',
		mode: 'none',
		devtool: 'source-map',
		entry: aEntries,
		output: {
			path: sPath,
			filename: '[name].js',
			chunkFilename: '[name].js?v=[chunkhash]',
			publicPath: sPublicPath,
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
					test: /\.es6$/,
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
					exclude: /node_modules/
				},
			]
		},
		resolve: oResolve,
		plugins: []
	}
};