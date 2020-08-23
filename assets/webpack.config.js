const path = require("path");

let config = {
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
