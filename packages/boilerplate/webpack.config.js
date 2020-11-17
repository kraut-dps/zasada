var fnWebpackMerge = require( 'webpack-merge' ).merge;
var oWebpackBase = require( '@zasada/bootstrap/src/webpackBase.js' );
var sProject = __dirname + '/src';

var oConfig = fnWebpackMerge(
	oWebpackBase,
	{
		entry: {
			"index": sProject + '/index.js',
			"polyfill-promise": '@zasada/bootstrap/src/polyfillPromise.js',
		},
		output: {
			filename: '[name].js',
			chunkFilename: '[name].js',
			path: sProject + '/build/',
			publicPath: '/build/',
		},
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
