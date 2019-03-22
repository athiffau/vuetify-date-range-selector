// vue.config.js
module.exports = {
  // set relative url
  publicPath: process.env.NODE_ENV === 'production'
    ? '/vuetify-date-range-selector'
    : '/',
  
  // set output dir
  outputDir: 'dist',

  // no source maps in production
  productionSourceMap: false
}