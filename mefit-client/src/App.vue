<template>
  <div id="app">
    <!-- 헤더 -->
    <AppHeader />

    <!-- 콘텐츠 영역 -->
    <AppContent />

    <!-- 풋터 -->
    <AppFooter />
  </div>
</template>

<script>
import AppHeader from './layouts/AppHeader.vue';
import AppContent from './layouts/AppContent.vue';
import AppFooter from './layouts/AppFooter.vue';

export default {
  name: 'App',
  components: {
    AppHeader,
    AppContent,
    AppFooter
  }
}
</script>

<style>
html, body {
  padding: 0;
  margin: 0;
}
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin: 0;
  padding: 0;
}

/* 전역 스타일: 활성 메뉴 스타일 */
.menu a.router-link-active {
  background-color: #007bff51;
  color: white;
  font-weight: bold;
  border-radius: 5px;
}
</style>
