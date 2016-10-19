var path = require("path");
var webpack = require("webpack");
var $ld = require("lodash");
var fs = require("fs");


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
              // result.resource = path.resolve(path.dirname(result.resource), _.replace(result.resource, placeholder, replacement));
              if (result.request.includes("lil")){
                console.log(result)
                // console.log(path.basename(_.replace(result.resource, placeholder, replacement)))
                // result.resource = path.basename(_.replace(result.request, placeholder, replacement));
                // result.request = _.replace(result.resource, placeholder, replacement);
                // result.userRequest = _.replace(result.request, placeholder, replacement);
              }
              return callback(null, result);
            }
          );
        }
      );

      // compiler.plugin("after-resolvers", function(compiler) {
      //   console.log("after-resolvers", compiler.resolvers.normal.apply)
      // });
    }
  };
}


module.exports = {
  debug: true,
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
    // DynamicPathReplacementPlugin(/\$platform/, function(a) {
    //   console.log("exec3", a);
    //   return "hyperion"
    // }),
    new webpack.NormalModuleReplacementPlugin(/\$platform/, function(result) {
      console.log("exec");
      var temp = $ld.replace(result.request, /\$platform/gi, "hyperion");
      // $ld.set(result, 'dependency.userRequest', temp);
      // $ld.set(result, 'dependency.request', temp);
      result.request = temp;
    })
  ]
};