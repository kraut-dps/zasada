var fnWebpackMerge = require( 'webpack-merge' ).merge;
var oWebpackBase = require( '@zasada/bootstrap/src/webpackBase.js' );

var oConfig = fnWebpackMerge(
	oWebpackBase,
	{
		entry: {
			"1_HelloWorld": __dirname + '/1_HelloWorld/index.js',
			"2_WidgetApi": __dirname +'/2_WidgetApi/index.js',
			"3_LinkerApi": __dirname +'/3_LinkerApi/index.js',
			"4_Di": __dirname +'/4_Di/index.js',
			"polyfill-promise": 'zasada/src/utils/polyfillPromise.js',
		},
		output: {
			filename: ( pathData ) => {
				return pathData.chunk.name === 'polyfill-promise' ? '[name].js' : '[name]/index.js';
			},
			chunkFilename: '[name].js',
			path: __dirname + '/build/',
			publicPath: '/build/',
		},
		//resolve:{
		//	alias: {
		//		zasada: __dirname + '/..'
		//	}
		//},
		devServer:{
			contentBase: __dirname,
		}
	}
);

module.exports = ( oEnv, oArgv ) => {
	if (oArgv.mode === 'development') {
		oConfig.devtool = 'cheap-source-map';
	}
	if (oArgv.mode === 'production') {
		oConfig.devtool = 'source-map';
	}
	return oConfig;
};
