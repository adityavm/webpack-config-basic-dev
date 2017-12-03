# webpack-config-basic-dev

Basic Webpack config with React, SASS, HMR and optional ESLint and Stylelint support.

[![Build Status](https://img.shields.io/travis/adityavm/webpack-config-basic-dev/master.svg?style=flat-square)](https://travis-ci.org/adityavm/webpack-config-basic-dev)


## Usage

```shell
npm i webpack webpack-dev-server react react-dom react-hot-loader babel-core babel-loader css-loader css-hot-loader sass-loader node-sass # dependencies
npm i webpack-config-basic-dev
```
**Note:** You will need the first line of dependencies to ultimately build successfully, but they are not required by this module and are listed here for convenience.

For ESLint and Stylelint, check the [wiki][1].

Create a `webpack.config.js` in your app directory's root, and add the following lines:

```javascript
const config = require("webpack-config-basic-dev")(__dirname, process.env.NODE_ENV);
module.exports = config;
```

Add your package scripts as normal:

```javascript
{
  ...
  "scripts": {
    ...
    "start": "webpack-dev-server",
    "build": "NODE_ENV=production webpack" // to set environment correctly
  },
}
```

## Assumptions

The module assumes your app folder follows the following structure:

```
AppRoot
  + src         // all source
    - index.js  // entry
  + dist        // build folder
  - package.json
  - ...
```

# License

[MIT][2].

[1]: https://github.com/adityavm/webpack-config-basic-dev/wiki/Additional-Notes
[2]: https://github.com/adityavm/webpack-config-basic-dev/blob/master/LICENSE
