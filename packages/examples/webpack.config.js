var fnWebpackMerge = require( 'webpack-merge' ).merge;
var oWebpackBase = require( '@zasada/bootstrap/src/webpackBase.js' );
var sProject = __dirname + '/src';

var oConfig = fnWebpackMerge(
	oWebpackBase,
	{
		entry: {
			"1_HelloWorld": sProject + '/1_HelloWorld/index.js',
			"2_WidgetApi": sProject +'/2_WidgetApi/index.js',
			"3_LinkerApi": sProject +'/3_LinkerApi/index.js',
			"4_Di": sProject +'/4_Di/index.js',
			"polyfill-promise": '@zasada/core/src/utils/polyfillPromise.js',
		},
		output: {
			filename: ( pathData ) => {
				return pathData.chunk.name === 'polyfill-promise' ? '[name].js' : '[name]/index.js';
			},
			chunkFilename: '[name].js',
			path: sProject + '/build/',
			publicPath: '/build/',
		},
		//resolve:{
		//	alias: {
		//		zasada: __dirname + '/..'
		//	}
		//},
		devServer:{
			contentBase: sProject,
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
