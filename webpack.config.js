const path = require('path');

module.exports = {
  mode: 'production',
  module: {
    rules: [
      {
        test: /\.(png|jpe?g|gif)$/i,
        loader: 'file-loader',
        options: {
          outputPath: './images/',
          name: '[name].[ext]?[hash]',
        },
      },
      {
        test: /\.css$/i,
        use: ['style-loader', 'css-loader'],
      },
      {
        test: /\.(xml|html)$/i,
        use: 'raw-loader',
      },
    ],
  },
  entry: {
    'background': './src/background.js',
    'css/style': './src/gmWindow/style.css',
    'js/injector': './src/inject/injector.js',
    'js/loadInjector': './src/inject/loadInjector.js',
    'js/runInjectors': './src/inject/runInjectors.js',
  },
  output: {
    hashFunction: 'xxhash64',
    filename: '[name].js',
    path: path.resolve(__dirname, 'dist'),
  },
};
