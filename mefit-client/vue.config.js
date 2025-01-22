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
  // 소스 맵 활성화 설정
  configureWebpack: {
    devtool: 'source-map', // 소스 맵 생성 (로컬 크롬에서 디버깅을 하기 위함)
  },
  // 프로덕션에서도 소스 맵을 활성화하려면 아래 옵션 추가 (배포된 애플리케이션을 디버깅하거나 문제를 파악하려면 이 옵션이 필요)
  productionSourceMap: true,
});
