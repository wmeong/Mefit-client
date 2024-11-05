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
import Market from "@/views/Market.vue";

const routes = [
  { path: "/", name: "Home", component: Home },
  { path: "/characterinfo", name: "CharacterInfo", component: CharacterInfo },
  { path: "/ranking", name: "Ranking", component: Ranking },
  { path: "/codisimulation", name: "CodiSimulation", component: CodiSimulation },
  { path: "/market", name: "Market", component: Market },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
