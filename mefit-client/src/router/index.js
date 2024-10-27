import { createRouter, createWebHistory } from 'vue-router';
import CharacterSearch from '../components/CharacterSearch.vue';

const routes = [
  { path: '/', component: CharacterSearch },  // 기본 경로에서 CharacterSearch 표시
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
