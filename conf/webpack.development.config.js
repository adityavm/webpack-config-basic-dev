const
  webpack = require("webpack"),
  path = require("path"),
  HtmlWebpackPlugin = require("html-webpack-plugin"),
  ExtractTextPlugin = require("extract-text-webpack-plugin"),
  StylelintWebpackPlugin = require("stylelint-webpack-plugin"),
  glob = require("glob"),
  fs = require("fs"),
  assign = require("lodash.assign");

const
  merge = require("webpack-merge");

const haveEslintConfig = dir => {
  const
    matchesDefault = glob.sync(`${dir}/.eslint*`),
    matchesPackage = require(`${dir}/package.json`).eslintConfig;
  return matchesDefault.length > 0 || matchesPackage;
}

const haveStylelintConfig = dir => {
  const
    matchesDefault = glob.sync(`${dir}/.stylelint*`),
    matchesPackage = require(`${dir}/package.json`).stylelint;
  return matchesDefault.length > 0 || matchesPackage;
}

module.exports = (dirname, overrides = {}) => {
  const
    srcDir = path.resolve(dirname, "src"),
    appDir = path.resolve(dirname, "dist");

  const
    webpackBase = require("./webpack.base.config")(dirname);

  const
    rules = [],
    plugins = [];

  // only run eslint if there's a config
  if (haveEslintConfig(dirname)) {
    rules.push({
      enforce: "pre",
      test: /\.js$/,
      include: srcDir,
      use: "eslint-loader",
    });
  }

  // only run stylelint if there's a config
  if (haveStylelintConfig(dirname)) {
    try {
      if (process.env.JEST_ENV) {
        console.log("STYLELINTWEBPACKPLUGIN");
      }
      plugins.push(new StylelintWebpackPlugin({ syntax: "scss" }));
    } catch (e) {
      throw new Error(`MissingPlugin: Stylelint is missing but a Stylelint configuration was detected. Please install Stylelint or remove the configuration. (${e})`)
    }
  }

  return merge({
    customizeArray(a, b, key) {
      return key === "entry.app"
        ? b
        : undefined;
    },
  })(webpackBase, {
    mode: "development",
    entry: {
      app: [`${srcDir}/index.js`],
    },
    plugins: [
      new webpack.LoaderOptionsPlugin({ options: {} }),
      new webpack.NamedModulesPlugin(assign({}, overrides.NamedModulesPlugin)),
      new webpack.HotModuleReplacementPlugin(assign({ title: "" }, overrides.HotModuleReplacementPlugin)),
      new HtmlWebpackPlugin(assign({ title: "", chunksSortMode: "none" }, overrides.HtmlWebpackPlugin)),
      ...plugins,
    ],
    module: {
      rules: [
        {
          test: /\.js$/,
          include: srcDir,
          exclude: [path.resolve(dirname, "node_modules")],
          use: "babel-loader",
        }, // js
        {
          test: /\.(s[ac]ss|css)$/,
          include: srcDir,
          use: [
            "css-hot-loader",
            ...ExtractTextPlugin.extract(["css-loader", "sass-loader"]),
          ],
        }, // hmr styles
        ...rules,
      ]
    },
    devServer: {
      host: "localhost",
      hot: true,
      compress: true,
      inline: true,
      port: 8008,
      contentBase: appDir,
      clientLogLevel: "error",
      noInfo: true,
      overlay: {
        warnings: true,
        errors: true,
      },
      historyApiFallback: true,
    },
  });
};
