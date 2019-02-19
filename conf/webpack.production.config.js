const
  webpack = require("webpack"),
  path = require("path"),
  HtmlWebpackPlugin = require("html-webpack-plugin"),
  MiniCssPlugin = require("mini-css-extract-plugin"),
  CleanWebpackPlugin = require("clean-webpack-plugin");
  assign = require("lodash.assign");

const
  merge = require("webpack-merge");

module.exports = (dirname, overrides = {}) => {

  const
    srcDir = path.resolve(dirname, "src"),
    appDir = path.resolve(dirname, "dist"),
    webpackBase = require("./webpack.base.config")(dirname);

  /*
   * Transform environment variables for injection for JS and CSS
   */
  let envVars = {};
  if (overrides.environmentVariables) {
    const env = overrides.environmentVariables;
    envVars = Object.keys(env).reduce((final, b) => {
      final.js[`process.env.${b.toUpperCase()}`] = JSON.stringify(env[b]);
      final.css = `${final.css}$${b.toUpperCase()}:"${env[b]}";`;
      return final;
    }, { js: {}, css: "" });
  }

  return merge(webpackBase, {
    mode: "production",
    plugins: [
      new webpack.DefinePlugin(assign(
        { "process.env.NODE_ENV": JSON.stringify("production") },
        envVars.js,
        overrides.DefinePlugin,
      )),
      new CleanWebpackPlugin(appDir, assign({ root: dirname, verbose: false }, overrides.CleanWebpackPlugin)),
      new HtmlWebpackPlugin(assign({ title: "", chunksSortMode: "none" }, overrides.HtmlWebpackPlugin)),
      new MiniCssPlugin(assign({ filename: "css/[name].css" }, overrides.MiniCssPlugin)),
    ],
    module: {
      rules: [
        {
          test: /\.js$/,
          include: srcDir,
          exclude: [path.resolve(dirname, "node_modules")],
          use: [{
            loader: "babel-loader",
            options: {
              compact: true,
            },
          }]
        }, // js
        {
          test: /\.(s[ac]ss|css)$/,
          include: srcDir,
          use: [
            MiniCssPlugin.loader,
            "css-loader",
            envVars.css ? { loader: "sass-loader", options: { data: envVars.css } } : "sass-loader",
          ],
        }, // css / sass
      ],
    },
  });
};
