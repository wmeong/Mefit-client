const { defineConfig } = require("@vue/cli-service");
module.exports = defineConfig({
    transpileDependencies: true,
    devServer: {
        proxy: {
            "/api": {
                target: "https://api.mefit.co.kr",
                changeOrigin: true,
                pathRewrite: { "^/api": "/api" },
            },
        },
    },
    // 소스 맵 활성화 설정
    configureWebpack: {
        devtool: false, // 소스맵생성 : 개발계에서 true로 변경
    },

    productionSourceMap: false, //소스보기 : 개발계에서 true로 변경
});
