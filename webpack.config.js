const UglifyJSPlugin = require('uglifyjs-webpack-plugin');

module.exports = {
  entry: './index.js',
  output: {
    filename: 'out/mazemaker.js'
  },
  module: {
    loaders: [
    {
      test: /\.js$/,
      loader: 'babel-loader',
      options: {
        presets: ['es2015']
      }
    }
    ],
  },
  plugins: [
    new UglifyJSPlugin({
      output: {
        comments: false,
        beautify: false,
      }
    })
  ]
}
