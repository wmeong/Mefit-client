const { defineConfig } = require('@vue/cli-service');
const config = require('./src/config.js'); 

module.exports = defineConfig({
  publicPath: process.env.NODE_ENV === 'production' ? '/' : '/',
  transpileDependencies: true,
  devServer: process.env.NODE_ENV === 'development' ? {
    proxy: {
      "/api": {
        target: config.API_BASE_URL, 
        changeOrigin: true,
        pathRewrite: { "^/api": "" },
      },
    },
  } : {},
  productionSourceMap: false,
  configureWebpack: {
    devtool: process.env.NODE_ENV === 'development' ? 'source-map' : false,
  },
});
