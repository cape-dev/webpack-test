var path = require("path");
var webpack = require("webpack");
var $ld = require("lodash");
var fs = require("fs");
var nodeExternals = require('webpack-node-externals');


function DynamicPathReplacementPlugin(placeholder, replacement) {
  var _ = require('lodash');

  if (!placeholder) {
    throw new Error('Webpack DynamicPathReplacementPlugin: argument "placeholder" must be defined!')
  }
  if (!replacement) {
    throw new Error('Webpack DynamicPathReplacementPlugin: argument "replacement" must be defined!')
  }
  if (!_.isRegExp(placeholder) && !_.isString(placeholder)) {
    throw new Error('Webpack DynamicPathReplacementPlugin: argument "placeholder" must be either a RegExp or a String!')
  }
  if (!_.isFunction(replacement) && !_.isString(replacement)) {
    throw new Error('Webpack DynamicPathReplacementPlugin: argument "replacement" must be either a Function or a String!')
  }

  return {
    'apply':  function(compiler) {
      compiler.plugin(
        'normal-module-factory',

        function(normalModuleFactory) {
          normalModuleFactory.plugin(
            'before-resolve',

            function (result, callback) {
              if(!result) return callback();
              if (_.isFunction(replacement)) {
                replacement = _.bind(replacement, {}, placeholder);
              }
              result.request = _.replace(result.request, placeholder, replacement);

              return callback(null, result);
            }
          );
          normalModuleFactory.plugin(
            'after-resolve',

            function (result, callback) {
              if(!result) return callback();
              if (_.isFunction(replacement)) {
                replacement = _.bind(replacement, {}, placeholder);
              }
              result.resource = path.resolve(path.dirname(result.resource), _.replace(result.resource, placeholder, replacement));

              return callback(null, result);
            }
          );
        }
      );
    }
  };
}


module.exports = {
  entry: "./entry.js",
  output: {
    path: __dirname,
    filename: "bundle.js"
  },
  target: 'web',
  module: {
    loaders: [
      {test: /\.less$/, loaders: ['style', 'css', 'less']},
      {test: /\.css$/, loaders: ['style', 'css']},
      {test: /\.(png|jpg)$/, loader: 'file'},
      {test: /\.html$/, loader: 'html'},
      {test: /\.json$/, loader: 'json'},
      {test: /\.ts$/, loaders: ['ts']},
      {test: /\.js$/, loader: 'babel', query: {presets: ['es2015', 'react']}},
    ]
  },
  resolve : {
    extensions: ['', '.js', '.ts', '.json'],
    root: [
      path.resolve(__dirname),
      //path.resolve('./src'), // Beispiele für die Anwendung von globalen Pfaden
      //path.resolve('./src/q/w'),
      ],
    alias: {
      foo: "a/b",
      bar: "a/b/c/bar/src",
      bar1: "a/b/c/bar1/src",
      foo1: "src/q/w/e/r",
      baz: "src/q"
    }
  },
  plugins: [
    // DynamicPathReplacementPlugin(/\$REPLACE2\$/, function(a) {console.log("exec0", a); return "baz/bum"}),
    // DynamicPathReplacementPlugin(/REPLACE3/, function(a) {console.log("exec1", a); return "t"}),
    // DynamicPathReplacementPlugin(/\$lala/, function(a) {console.log("exec2", a); return "test"}),
    // DynamicPathReplacementPlugin(/\$platform/, function(a) {console.log("exec3", a); return "hyperion"}),
    new webpack.NormalModuleReplacementPlugin(/\$REPLACE2\$/, function(a) {a.request = $ld.replace(a.request, /\$REPLACE2\$/gi, "baz/bum"); console.log("res", a.resource)}),
    new webpack.NormalModuleReplacementPlugin(/REPLACE3/, function(a) {a.request = $ld.replace(a.request, /REPLACE3/gi, "t"); console.log("res", a.resource)}),
    new webpack.NormalModuleReplacementPlugin(/\$lala/, function(a) {a.request = $ld.replace(a.request, /\$lala/gi, "test"); console.log("res", a.resource)}),
    new webpack.NormalModuleReplacementPlugin(/\$platform/, function(a) {a.request = $ld.replace(a.request, /\$platform/gi, "hyperion"); console.log("res", a.resource)})
  ]
};