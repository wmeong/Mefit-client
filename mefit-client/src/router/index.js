// import { createRouter, createWebHistory } from 'vue-router';
// import CharacterSearch from '../views/CharacterSearch.vue';

// const routes = [
//   { path: '/', component: CharacterSearch },  // 기본 경로에서 CharacterSearch 표시
// ];

// const router = createRouter({
//   history: createWebHistory(),
//   routes,
// });

// export default router;
// src/router/index.js
import { createRouter, createWebHistory } from "vue-router";
import Home from "@/views/Home.vue";
import CharacterInfo from "@/views/CharacterInfo.vue";
import Ranking from "@/views/Ranking.vue";
import CodiSimulation from "@/views/CodiSimulation.vue";
import RoyalStyleSimulation from "@/views/RoyalStyleSimulation.vue"; // 새 컴포넌트 추가

const routes = [
  { path: "/", name: "Home", component: Home },
  { path: "/characterinfo", name: "CharacterInfo", component: CharacterInfo },
  { path: "/ranking", name: "Ranking", component: Ranking },
  { path: "/codisimulation", name: "CodiSimulation", component: CodiSimulation },
  { path: "/royal-simulation", name: "RoyalStyleSimulation", component: RoyalStyleSimulation }, // 새 경로 추가
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
