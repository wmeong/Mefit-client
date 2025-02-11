const { defineConfig } = require('@vue/cli-service');

module.exports = defineConfig({
  publicPath: process.env.NODE_ENV === 'production' ? '/mefit-static-files/' : '/',
  transpileDependencies: true,
  devServer: process.env.NODE_ENV === 'development' ? {
    proxy: {
      "/api": {
        target: "https://mefit.co.kr",
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
