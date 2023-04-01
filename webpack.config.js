const path = require('path');
const webpack = require('webpack');

const minimize = true;

module.exports = {
  mode: 'production',
  performance: {
    maxEntrypointSize: 1e10,
    maxAssetSize: 1e10,
  },
  optimization: {
    minimize: minimize,
  },
  module: {
    rules: [
      {
        test: /\.(png|jpg|gif)$/i,
        use: [
          {
            loader: 'url-loader',
          },
        ],

        type: 'javascript/auto',
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
      {
        test: /\.(woff|woff2|eot|ttf|otf)$/i,
        type: 'asset/inline',
      },
      {
        test: /\.gmm$/,
        use: ['arraybuffer-loader'],
      },
      {
        test: /\.(raw\.js)$/i,
        use: minimize ? [
          {
            loader: path.resolve('./minify-loader.js'),
          },
        ] : undefined,
        type: 'asset/source',
      },
    ],
  },
  plugins: [
    new webpack.optimize.LimitChunkCountPlugin({
      maxChunks: 1,
    }),
  ],
  entry: {
    'js/injector': './src/inject/injector.js',
    'js/gmLoader': './src/inject/gmLoader.js',
    'background': './src/background.js',
    'css/style': './src/gmWindow/style.css',
    'js/loadInjector': './src/inject/loadInjector.js',
    'js/runInjectors': './src/inject/runInjectors.js',
  },
  output: {
    hashFunction: 'xxhash64',
    chunkFormat: 'array-push',
    filename: '[name].js',
    path: path.resolve(__dirname, 'dist'),
  },
};
