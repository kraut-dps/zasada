var webpack = require( 'webpack' );
var hostname = require( 'os' ).hostname();
module.exports = [
	{
		mode: 'none',
		devtool: 'source-map',
		entry: [
			//'webpack-dev-server/client?http://0.0.0.0/',
			//'webpack/hot/only-dev-server',
			__dirname + '/index.js'
		],
		output: {
			filename: 'index.js',
			path: __dirname + '/build/',
			publicPath: '/build/',
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
								"@babel/plugin-syntax-dynamic-import"
							]
						}
					},
					//exclude: /node_modules/
				},
			]
		},
		devServer: {
			public: 'http://0.0.0.0',
			contentBase: __dirname,
			open: true, // open browser
			openPage: 'http://localhost:8080',
			overlay: true, // display error overlay
			//hot: true, // enable hot module replacement
			disableHostCheck: true,
			stats: "errors-only", // display only errors to reduce the amount of output
			watchContentBase: true // HMR html
		},
		resolve: {
			modules: ["node_modules"]
		},
		plugins: [
			new webpack.HotModuleReplacementPlugin(),
		]
	},
];
