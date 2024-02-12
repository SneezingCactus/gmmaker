const path = require('path');
const webpack = require('webpack');
const CopyPlugin = require('copy-webpack-plugin');

const {version} = require('./package.json');

module.exports = {
  mode: 'production',
  performance: {
    maxEntrypointSize: 1e10,
    maxAssetSize: 1e10,
  },
  optimization: {
    minimize: true,
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
    ],
  },
  plugins: [
    new webpack.optimize.LimitChunkCountPlugin({
      maxChunks: 1,
    }),
    new CopyPlugin({
      patterns: [
        {from: 'src/icons', to: 'icons'},
        {from: 'src/rules.json', to: 'rules.json'},
        {
          from: 'src/manifest.json',
          to: 'manifest.json',
          transform: (content) => {
            const jsonContent = JSON.parse(content);
            jsonContent.version = version.replace(/-.+/, '');

            return JSON.stringify(jsonContent, null, 2);
          },
        },
      ],
    }),
  ],
  entry: {
    'js/injector': './src/inject/injector.js',
    'js/gmLoader': './src/inject/gmLoader.js',
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
