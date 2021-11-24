
module.exports = exports = {
  exclude: 'node_modules/**',
  presets: [
    [ "@babel/preset-env", {
      modules: false,
      useBuiltIns: "usage",
      corejs: { version: 3, shippedProposals: true },
    } ],
    [ "@babel/preset-react", {
      "runtime": "automatic",
    } ],
  ],
};
