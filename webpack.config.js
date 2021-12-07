const path = require('path');

module.exports = {
  mode: 'production',
  performance: {
    maxEntrypointSize: 1e6,
    maxAssetSize: 1e6,
  },
  optimization: {
    minimize: true,
  },
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
        use: [
          {
            loader: 'style-loader',
            options: {
              insert: function insertAtTop(element) {
                let parent = window.gmStyles;

                if (parent == null) {
                  window.gmStyles = document.createElement('div');
                  parent = window.gmStyles;
                };

                // eslint-disable-next-line no-underscore-dangle
                const lastInsertedElement =
                    window._lastElementInsertedByStyleLoader;

                if (!lastInsertedElement) {
                  parent.insertBefore(element, parent.firstChild);
                } else if (lastInsertedElement.nextSibling) {
                  parent.insertBefore(element, lastInsertedElement.nextSibling);
                } else {
                  parent.appendChild(element);
                }

                // eslint-disable-next-line no-underscore-dangle
                window._lastElementInsertedByStyleLoader = element;
              },
            },
          },
          'css-loader',
        ],
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
