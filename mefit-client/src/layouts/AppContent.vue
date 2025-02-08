<template>
  <div class="page-container">
    <!-- 좌측 광고 영역 -->
    <!-- <div class="ad-container ad-left">
      <img src="광고이미지1.png" alt="광고" />
    </div> -->

    <!-- 중앙 콘텐츠 영역 -->
    <div class="app-content">
      <router-view /> <!-- 동적 콘텐츠 렌더링 -->
    </div>

    <!-- 우측 광고 영역 -->
    <!-- <div class="ad-container ad-right">
      <img src="광고이미지2.png" alt="광고" />
    </div> -->
  </div>
</template>

<script>
export default {
  name: "AppContent"
};
</script>

<style scoped>
@import url("https://fonts.googleapis.com/css2?family=Noto+Sans+KR:wght@400;700&display=swap");
@import url("https://spoqa.github.io/spoqa-han-sans/css/SpoqaHanSansNeo.css");

:root {
  --main-font: 'Spoqa Han Sans Neo', 'Noto Sans KR', 'Nanum Gothic', sans-serif;
}

.page-container {
  display: flex;
  justify-content: center;
  align-items: flex-start;
  width: 100%;
  max-width: 1600px;
  margin: 0 auto;
  padding-top: 5px; /* 헤더 높이만큼 여백 추가 */
}

header {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  z-index: 1000;
  background-color: #ffffff;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.ad-container {
  width: 150px; /* 광고 영역 너비 */
  min-height: calc(100vh - 80px); /* 헤더 높이 제외한 전체 높이 */
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #f5f5f5;
  border: 1px solid #ddd;
  box-shadow: 0 0 5px rgba(0, 0, 0, 0.1);
}

.ad-left {
  margin-right: 10px;
}

.ad-right {
  margin-left: 10px;
}

.app-content {
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  padding: 16px;
  min-height: calc(100vh - 80px);
  font-size: 0.8rem;
  font-family: var(--main-font);
  transition: all 0.3s ease;
  max-width: 1100px;
  margin: 0 auto;
  background-color: #fff;
}

@media (max-width: 1200px) {
  .ad-container {
    display: none; /* 작은 화면에서는 광고 영역 숨김 */
  }

  .app-content {
    padding: 12px;
    font-size: 0.8rem;
  }
}

@media (max-width: 768px) {
  .app-content {
    padding: 8px;
    min-height: 65vh;
    font-size: 0.7rem;
  }
}

@media (max-width: 480px) {
  .app-content {
    padding: 4px;
    min-height: 60vh;
    font-size: 0.6rem;
  }
}
</style>
