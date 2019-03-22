// vue.config.js
module.exports = {
  // set relative url
  publicPath: process.env.NODE_ENV === 'production'
    ? '/vuetify-date-range-selector'
    : '/',
  
  // set output dir
  outputDir: 'docs',

  // no source maps in production
  productionSourceMap: false
}