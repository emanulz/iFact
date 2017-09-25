const debug = process.env.NODE_ENV !== 'production'
const webpack = require('webpack')
const path = require('path')
const ExtractTextPlugin = require('extract-text-webpack-plugin')
const LiveReloadPlugin = require('webpack-livereload-plugin')

module.exports = {
  context: __dirname,
  devtool: debug
    ? 'inline-sourcemap'
    : '',
  entry: {
    landing: './frontend/landing/app.js',
    landingCss: './frontend/landing/main.sass',
    admin: './frontend/admin/app.js',
    adminCss: './frontend/admin/styles/styles.sass'
  },

  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /(node_modules|bower_components)/,
        loader: 'babel-loader'
      }, {
        test: /\.(sass|css)$/,
        loader: ExtractTextPlugin.extract(['css-loader', 'sass-loader'])
      }
    ]
  },

  output: {
    path: path.join(__dirname, '/backend/public'),
    filename: './js/[name].js'
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
}
