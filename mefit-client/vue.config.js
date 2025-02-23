const { defineConfig } = require('@vue/cli-service');
require('dotenv').config(); // 환경 변수 로드

module.exports = defineConfig({
  publicPath: process.env.NODE_ENV === 'production' ? '/' : '/',
  transpileDependencies: true,
  devServer: process.env.NODE_ENV === 'development' ? {
    historyApiFallback: true,
    proxy: {
      "/api": {
        target: process.env.VUE_APP_API_BASE_URL,
        changeOrigin: true,
        pathRewrite: { "^/api": "" },
      },
    }
  } : {},
  productionSourceMap: false,
  configureWebpack: {
    devtool: process.env.NODE_ENV === 'development' ? 'source-map' : false,
  }
});
