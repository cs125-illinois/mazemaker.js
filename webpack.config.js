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
    ]
  }
}
