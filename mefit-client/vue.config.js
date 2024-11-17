const { defineConfig } = require('@vue/cli-service');
module.exports = defineConfig({
  transpileDependencies: true,
  devServer: {
    proxy: {
      "/api": {
        target: "http://localhost:8081", // Spring Boot 서버 URL
        changeOrigin: true,
        pathRewrite: { "^/api": "/api" }, // 필요한 경우 경로 재작성
      },
    },
  },
});
