<template>
  <div class="app-content">
    <router-view /> <!-- 동적 콘텐츠 렌더링 -->
  </div>
</template>

<script>
export default {
  name: "AppContent"
};
</script>

<style scoped>
/* Google Fonts 및 Spoqa Han Sans Neo 추가 */
@import url("https://fonts.googleapis.com/css2?family=Noto+Sans+KR:wght@400;700&display=swap");
@import url("https://spoqa.github.io/spoqa-han-sans/css/SpoqaHanSansNeo.css");

:root {
  --main-font: 'Spoqa Han Sans Neo', 'Noto Sans KR', 'Nanum Gothic', sans-serif;
}

.app-content {
  display: flex; /* Flexbox 활성화 */
  justify-content: center; /* 가로 중앙 정렬 */
  align-items: center; /* 세로 중앙 정렬 */
  flex-direction: column; /* 콘텐츠를 세로로 배치 */
  padding: 16px;
  min-height: 75vh;
  font-size: 0.8rem;
  font-family: var(--main-font); /* 통일된 글씨체 적용 */
  transition: all 0.3s ease; /* 크기 변화 애니메이션 추가 */
  max-width: 1100px; /* 최대 너비 제한 */
  margin: 0 auto; /* 가로 여백 자동 (부모가 flex가 아니더라도) */
}

@media (max-width: 1200px) {
  .app-content {
    padding: 12px;
    font-size: 0.8rem; /* 글씨 크기 소폭 축소 */
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
