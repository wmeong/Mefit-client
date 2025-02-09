const { defineConfig } = require("@vue/cli-service");
module.exports = defineConfig({
    transpileDependencies: true,
    devServer: {
        proxy: {
            "/api": {
                target: "https://api.mefit.co.kr", // Spring Boot 서버 URL
                changeOrigin: true,
                pathRewrite: { "^/api": "/api" }, // 필요한 경우 경로 재작성
            },
        },
    },
    // 소스 맵 활성화 설정
    configureWebpack: {
        devtool: "source-map", // 소스 맵 생성 (로컬 크롬에서 디버깅을 하기 위함)
    },

    productionSourceMap: false,
});
