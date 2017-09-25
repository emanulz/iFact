const debug = process.env.NODE_ENV !== 'production'
const webpack = require('webpack')
const path = require('path')
const ExtractTextPlugin = require('extract-text-webpack-plugin')
const LiveReloadPlugin = require('webpack-livereload-plugin')

const config = {
  // TODO: Add common Configuration
  module: {}
}

const jsConfig = Object.assign({}, config, {
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
      new webpack.optimize.UglifyJsPlugin()
    ]

})

const stylesConfig = Object.assign({}, config, {
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
