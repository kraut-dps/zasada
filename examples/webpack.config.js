var fnWebpackMerge = require( 'webpack-merge' ).merge;
var oWebpackBase = require( 'zasada/src/utils/webpackBase.js' );

var oConfig = fnWebpackMerge(
	oWebpackBase,
	{
		entry: {
			"1_HelloWorld": __dirname + '/1_HelloWorld/index.js',
			"2_Api": __dirname +'/2_Api/index.js',
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
		devServer:{
			contentBase: __dirname,
		}
	}
);

module.exports = ( oEnv, oArgv ) => {
	if (oArgv.mode === 'development') {
		oConfig.devtool = 'eval-cheap-module-source-map';
	}
	if (oArgv.mode === 'production') {
		oConfig.devtool = 'source-map';
	}
	return oConfig;
};
