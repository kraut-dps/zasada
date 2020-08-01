module.exports = [
{
  mode: 'none',
  devtool: 'source-map',
  entry: {
    index: __dirname + '/index.js'
  },
  output: {
    filename: '[name].js',
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
    contentBase: __dirname,
    disableHostCheck: true
  },
  resolve: {
    modules: ["node_modules"]
  },
  plugins: []
} ];
