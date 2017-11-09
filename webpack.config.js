const debug = process.env.NODE_ENV !== 'production'
const webpack = require('webpack')
const path = require('path')
const ExtractTextPlugin = require('extract-text-webpack-plugin')
const LiveReloadPlugin = require('webpack-livereload-plugin')
const JavaScriptObfuscator = require('webpack-obfuscator')

const config = {
  // TODO: Add common Configuration
  module: {}
}

const jsConfig = Object.assign({}, config, {
  context: __dirname,
  devtool: debug ? 'inline-sourcemap' : '',
  name: 'js',
  entry: {
    // landing: './frontend/landing/app.js',
    admin: './frontend/admin/app.js'
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /(node_modules|bower_components)/,
        loader: 'babel-loader'
      }
    ]
  },
  output: {
    path: path.join(__dirname, '/backend/static/public'),
    filename: './js/[name].js'
  },

  plugins: debug
    ? [
      new LiveReloadPlugin()
    ]
    : [
      new webpack.DefinePlugin({
        'process.env': {
          'NODE_ENV': JSON.stringify('production')
        }
      }),
      // new JavaScriptObfuscator({
      //   rotateUnicodeArray: true
      // }, []),
      new webpack.optimize.UglifyJsPlugin({
        comments: false,
        compress: {
          // remove warnings
          warnings: false,

          // Drop console statements
          drop_console: true
        }
      }),
      new webpack.optimize.OccurrenceOrderPlugin()
    ]

})

const stylesConfig = Object.assign({}, config, {
  context: __dirname,
  devtool: debug ? 'inline-sourcemap' : '',
  name: 'styles',
  entry: {
    // landing: './frontend/landing/main.sass',
    admin: './frontend/admin/styles/styles.sass'
  },
  module: {
    rules: [
      {
        test: /\.(sass|css)$/,
        loader: ExtractTextPlugin.extract(['css-loader', 'sass-loader'])
      }
    ]
  },
  output: {
    path: path.join(__dirname, '/backend/static/public'),
    filename: './css/[name].css'
  },

  plugins: debug
    ? [
      new ExtractTextPlugin({filename: './css/[name].css', allChunks: true}),
      new LiveReloadPlugin()
    ]
    : [
      new webpack.DefinePlugin({
        'process.env': {
          'NODE_ENV': JSON.stringify('production')
        }
      }),
      new ExtractTextPlugin({filename: './css/[name].css', allChunks: true}),
      new webpack.optimize.UglifyJsPlugin()
    ]

})

module.exports = [
  jsConfig, stylesConfig
]
