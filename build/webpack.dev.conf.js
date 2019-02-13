const config = require('./webpack.base.conf')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const webpack = require('webpack')
const path = require('path')

process.env.NODE_ENV = 'development'

config.devtool = '#eval-source-map'
config.mode = 'development'

config.devServer = {
  host: '10.22.144.119',
  port: 1806,
  historyApiFallback: true,
  hotOnly: true,
  overlay: true,
  noInfo: true,
}

config.module.rules = (config.module.rules || []).concat([
  { 
    test: /\.css$/, 
    use: [ 
      { loader: 'style-loader' },
      { loader: 'css-loader' }
    ],
  },
])

config.plugins = (config.plugins || []).concat([
  new webpack.DefinePlugin({
    'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV),
  }),

  new HtmlWebpackPlugin({
    title: 'BookUp',
    filename: 'index.html',
    template: path.resolve(__dirname, '../src/index.html'),
  }),

  new webpack.optimize.OccurrenceOrderPlugin(),
  new webpack.NoEmitOnErrorsPlugin(),
])

module.exports = config
