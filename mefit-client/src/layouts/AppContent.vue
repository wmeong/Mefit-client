<template>
  <div class="app-content">
    <router-view /> <!-- 동적 콘텐츠 렌더링 -->
  </div>
</template>

<script>
export default {
  name: "AppContent"
}
</script>

<style scoped>
.app-content {
  padding: 20px;
  min-height: 80vh; /* 전체 화면의 80% 높이 */
}

@media (max-width: 768px) {
  .app-content {
    padding: 10px; /* 모바일에서 패딩 줄이기 */
  }
}
</style>
