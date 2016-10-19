var path = require("path");
var webpack = require("webpack");
var $ld = require("lodash");


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
    new webpack.NormalModuleReplacementPlugin(/\$platform/, function(a) {
      a.request = $ld.replace(a.request, /\$platform/gi, "hyperion");
      a.resource = $ld.replace(a.resource, /\$platform/gi, "hyperion");
    })
  ]
};