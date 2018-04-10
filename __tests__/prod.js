const path = require("path");

beforeEach(() => {
  process.env.JEST_ENV = true;
});

afterEach(() => {
  jest.resetModules();
});

it("should fail if no environment provided", () => {
  const config = require("../");
  expect(() => config()).toThrow();
});

it("should have HMR and entry files in production env", () => {
  const config = require("../");
  const dir = path.resolve(__dirname, "dirWithPkgJson");
  const prodConfig = config(dir, "production");

  expect(prodConfig.entry.app).toEqual([
    `${dir}/src/index.js`
  ]);
});

it("should have only html webpack and HMR plugins in production env", () => {
  jest.spyOn(global.console, "log").mockImplementation(() => null);

  const config = require("../");
  const dir = path.resolve(__dirname, "dirWithPkgJson");
  const prodConfig = config(dir, "production");
  const webpack = require("webpack");
  const HtmlWebpackPlugin = require("html-webpack-plugin");
  const CleanWebpackPlugin = require("clean-webpack-plugin");
  const StylelintWebpackPlugin = require("stylelint-webpack-plugin");

  expect(prodConfig.plugins).toContainEqual(expect.any(HtmlWebpackPlugin));
  expect(prodConfig.plugins).toContainEqual(expect.any(CleanWebpackPlugin));
  expect(prodConfig.plugins).toContainEqual(expect.any(webpack.DefinePlugin));
  expect(prodConfig.plugins).not.toContainEqual(expect.any(webpack.NamedModulesPlugin));
  expect(prodConfig.plugins).not.toContainEqual(expect.any(webpack.HotModuleReplacementPlugin));
  expect(console.log).not.toHaveBeenCalledWith("STYLELINTWEBPACKPLUGIN");

  global.console.log.mockRestore();
});

// TODO better test?
it("should not have stylelint plugin in production env", () => {
  jest.spyOn(global.console, "log").mockImplementation(() => null);

  const config = require("../");
  const dir = path.resolve(__dirname, "dirWithStylelint");
  const prodConfig = config(dir, "production");

  expect(console.log).not.toHaveBeenCalledWith("STYLELINTWEBPACKPLUGIN");

  global.console.log.mockRestore();
});

it("should have correct rules in production env", () => {
  const config = require("../");
  const dir = path.resolve(__dirname, "dirWithPkgJson");
  const prodConfig = config(dir, "production");
  const ExtractTextPlugin = require("extract-text-webpack-plugin");

  expect(prodConfig.module.rules).toContainEqual({
    test: /\.js$/,
    include: `${dir}/src`,
    exclude: [`${dir}/node_modules`],
    use: [{
      loader: "babel-loader",
      options: {
        compact: true,
      },
    }]
  });
  expect(prodConfig.module.rules).toContainEqual({
    test: /\.(s[ac]ss|css)$/,
    include: `${dir}/src`,
    use: [...ExtractTextPlugin.extract(["css-loader", "sass-loader"])],
  });
  // eslint
  expect(prodConfig.module.rules).not.toContainEqual({
    enforce: "pre",
    test: /\.js$/,
    include: `${dir}/src`,
    use: "eslint-loader",
  });
});

it("should not have eslint-loader in production env", () => {
  const config = require("../");
  const dir = path.resolve(__dirname, "dirWithEslint");
  const prodConfig = config(dir, "production");

  expect(prodConfig.module.rules).not.toContainEqual({
    enforce: "pre",
    test: /\.js$/,
    include: `${dir}/src`,
    use: "eslint-loader",
  });
});

it("should not have devserver config production env", () => {
  const config = require("../");
  const dir = path.resolve(__dirname, "dirWithEslint");
  const prodConfig = config(dir, "production");

  expect(prodConfig.devServer).toBeFalsy();
});

it("should allow overriding config for plugins", () => {
  const config = require("../");
  const dir = path.resolve(__dirname, "dirWithEslint");
  const prodConfig = config(dir, "production", {
    HtmlWebpackPlugin: {
      title: "abcd",
    }
  });

  const HtmlWebpackPlugin = require("html-webpack-plugin");

  const plugin = prodConfig.plugins.find(plugin => plugin.constructor === HtmlWebpackPlugin);
  expect(plugin.options.title).toBe("abcd");
});
