const { resolve } = require('path');

module.exports = exports = {
  extends: "twipped/react",
  // rules: {
  //   "node/no-missing-import": [ 2, {
  //     "resolvePaths": [
  //       resolve(__dirname, 'src'),
  //     ],
  //   } ],
  // },
  parser: '@babel/eslint-parser',
  settings: {
    'import/resolver': {
      parcel: {
        rootDir: __dirname // wherever your entrypoints are located
      }
    }
  }
};
