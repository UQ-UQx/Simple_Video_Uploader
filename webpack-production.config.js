"use strict";
var webpack = require("webpack");

var webpackConfig = require('./webpack.config.js');

//webpackConfig.devtool = "";
// strip out //console.log statements
webpackConfig.forEach(function(object, index){

        object.devtool = false;
        object.module.loaders.push({
                test: /\.js$/,
                exclude: /node_modules/,
                loader: 'strip-loader?strip[]=//console.log'
        });

})

module.exports = webpackConfig;