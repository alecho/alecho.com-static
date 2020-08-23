const path = require("path");

module.exports = {
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
  watch: true
};
