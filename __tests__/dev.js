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

it("should have HMR and entry files in development env", () => {
  const config = require("../");
  const dir = path.resolve(__dirname, "dirWithPkgJson");
  const devConfig = config(dir, "development");

  expect(devConfig.entry.app).toEqual([`${dir}/src/index.js`]);
});

it("should have html webpack only in development env", () => {
  jest.spyOn(global.console, "log").mockImplementation(() => null);

  const config = require("../");
  const dir = path.resolve(__dirname, "dirWithPkgJson");
  const devConfig = config(dir, "development");
  const webpack = require("webpack");
  const HtmlWebpackPlugin = require("html-webpack-plugin");

  expect(devConfig.plugins).toContainEqual(expect.any(HtmlWebpackPlugin));
  expect(console.log).not.toHaveBeenCalledWith("STYLELINTWEBPACKPLUGIN");

  global.console.log.mockRestore();
});

// TODO better test?
it("should have stylelint plugin in development env", () => {
  jest.spyOn(global.console, "log").mockImplementation(() => null);

  const config = require("../");
  const dir = path.resolve(__dirname, "dirWithStylelint");
  const devConfig = config(dir, "development");

  expect(console.log).toHaveBeenCalledWith("STYLELINTWEBPACKPLUGIN");

  global.console.log.mockRestore();
});

it("should have correct rules in development env", () => {
  const config = require("../");
  const dir = path.resolve(__dirname, "dirWithPkgJson");
  const devConfig = config(dir, "development");
  const ExtractTextPlugin = require("extract-text-webpack-plugin");

  expect(devConfig.module.rules).toContainEqual({
    test: /\.js$/,
    include: `${dir}/src`,
    exclude: [`${dir}/node_modules`],
    use: "babel-loader",
  });
  expect(devConfig.module.rules).toContainEqual({
    test: /\.(s[ac]ss|css)$/,
    include: `${dir}/src`,
    use: [
      "css-hot-loader",
      ...ExtractTextPlugin.extract(["css-loader", "sass-loader"]),
    ],
  });
  // eslint
  expect(devConfig.module.rules).not.toContainEqual({
    enforce: "pre",
    test: /\.js$/,
    include: `${dir}/src`,
    use: "eslint-loader",
  });
});

it("should have eslint-loader in development env", () => {
  const config = require("../");
  const dir = path.resolve(__dirname, "dirWithEslint");
  const devConfig = config(dir, "development");

  expect(devConfig.module.rules).toContainEqual({
    enforce: "pre",
    test: /\.js$/,
    include: `${dir}/src`,
    use: "eslint-loader",
  });
});

it("should have devserver config in development env", () => {
  const config = require("../");
  const dir = path.resolve(__dirname, "dirWithEslint");
  const devConfig = config(dir, "development");

  expect(devConfig.devServer).toBeTruthy();

  // test separately to not fail on path
  expect(devConfig.devServer.contentBase).toBe(`${dir}/dist`);
  delete devConfig.devServer.contentBase;

  expect(devConfig.devServer).toMatchSnapshot();
});

it("should allow overriding config for plugins", () => {
  const config = require("../");
  const dir = path.resolve(__dirname, "dirWithEslint");
  const devConfig = config(dir, "development", {
    NamedModulesPlugin: {
      setting: "wxyz",
    }
  });

  const webpack = require("webpack");

  const plugin = devConfig.plugins.find(plugin => plugin.constructor === webpack.NamedModulesPlugin);
  expect(plugin.options.setting).toBe("wxyz");
});
