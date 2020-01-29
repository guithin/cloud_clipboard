const {
  override,
  addWebpackPlugin,
  addWebpackResolve,
  useBabelRc,
} = require("customize-cra");
const path = require('path');
const CircularDependencyPlugin = require('circular-dependency-plugin')

module.exports = override(
  useBabelRc(),
  addWebpackPlugin(new CircularDependencyPlugin({
    // exclude detection of files based on a RegExp
    exclude: /node_modules/,
    // include specific files based on a RegExp
    include: /src/,
    // add errors to webpack instead of warnings
    failOnError: false,
    // allow import cycles that include an asyncronous import,
    // e.g. via import(/* webpackMode: "weak" */ './file.js')
    allowAsyncCycles: false,
    // set the current working directory for displaying module paths
    cwd: process.cwd(),
  })),
  addWebpackResolve({
    modules: [path.join(__dirname, 'src'), 'node_modules'],
    extensions: ['.tsx', '.ts', '.js'],
  })
);
