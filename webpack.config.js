const path = require("path");

module.exports = {
  mode: "production",
  module: {
    rules: [
      {
        test: /\.(png|jpe?g|gif)$/i,
        loader: 'file-loader',
        options: {
          outputPath: './images/',
          name: '[name].[ext]?[hash]'
        }
      },
      {
        test: /\.css$/i,
        use: ["style-loader", "css-loader"],
      },
      {
        test: /\.xml$/i,
        use: 'raw-loader',
      },
    ]
  },
  entry: {
    "background": "./src/background.js",
    "js/injector": "./src/js/injector.js",
    "js/loadInjector": "./src/js/loadInjector.js",
    "js/runInjectors": "./src/js/runInjectors.js",
    "css/style": "./src/css/style.css"
  },
  output: {
    filename: "[name].js",
    path: path.resolve(__dirname, "dist")
  }
};
