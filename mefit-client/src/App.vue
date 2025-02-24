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
  background-color: #D6B4FC; /* 연보라색 */
  color: white;
  font-weight: bold;
  border-radius: 5px;
  transition: background-color 0.3s ease-in-out;
}

/* Vuetify 탭 활성화 스타일도 추가 */
.v-tab.v-tab--active {
  background-color: #D6B4FC !important;
  color: white !important;
}

</style>
