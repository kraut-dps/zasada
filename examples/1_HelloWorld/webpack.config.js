module.exports = [
	{
		mode: 'none',
		devtool: 'source-map',
		entry: {
			index: __dirname +'/index.js'
		},
		output: {
			filename: '[name].js',
			path: __dirname + '/build/',
			publicPath: '/build/',
		},
		devServer: {
			open: true, // open browser

			// только чтобы правильно хост и порт устанавливался в sockJs http://localhost:8080/sockjs-node/info...
			openPage: 'http://localhost:8080',
			public: 'http://0.0.0.0',
			disableHostCheck: true,

			watchContentBase: true, // HMR для html частей приложения

			contentBase: __dirname,

			overlay: true, // display error overlay
			stats: "errors-only"
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
		}
	}
];
