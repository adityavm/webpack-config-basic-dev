# webpack-config-basic-dev

Basic Webpack config with React, ESLint and HMR support.

## Usage

```shell
npm i webpack-config-basic-dev
```

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
  + src   // all source
  + dist  // build folder
  - package.json
  - ...
```

# License

Slightly modified MIT. Refer to the [License](LICENSE.md).
