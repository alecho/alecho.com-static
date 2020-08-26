const path = require("path");
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

let config = {
  plugins: [new MiniCssExtractPlugin()],
  entry: {
    app: "./js/app.js"
  },
  output: {
    filename: "[name].js",
    path: path.resolve("../static")
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/
        /*use: ["babel-loader", "eslint-loader"]*/
      }
    ],
    rules: [
      {
        test: /\.css$/,
        exclude: /node_modules/,
        use: [
          {
            loader: MiniCssExtractPlugin.loader,
            options: {
              publicPath: '../static/',
            },
          },
          {
            loader: 'css-loader',
            options: {
              importLoaders: 1,
            }
          },
          {
            loader: 'postcss-loader'
          }
        ]
      }
    ]
  },
  resolve: {
    extensions: ["*", ".js"]
  },
  stats: {
    colors: true
  },
  devtool: "source-map",
  mode: "development",
  watch: true,
  watchOptions: {
    ignored: /node_modules/
  }
};

module.exports = (env, argv) => {

  if (argv.mode === 'production') {
    config.watch = false;
    config.devtool = '';
  }

  return config;
};
