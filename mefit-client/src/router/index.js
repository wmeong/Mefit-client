import { createRouter, createWebHistory } from "vue-router";
import Home from "@/views/Home.vue";
import CharacterInfo from "@/views/CharacterInfo.vue";
import PersnalColorSelect from "@/views/PersnalColorSelect.vue";
import PersnalColorDetail from "@/views/PersnalColorDetail.vue";
import CodiSimulation from "@/views/CodiSimulation.vue";
import RoyalStyleSimulation from "@/views/RoyalStyleSimulation.vue";

const routes = [
  { path: "/", name: "Home", component: Home },
  { path: "/characterinfo", name: "CharacterInfo", component: CharacterInfo },
  { path: "/persnacolor-select", name: "PersnalColorSelect", component: PersnalColorSelect },
  { path: "/persnacolor-detail",name: "PersnalColorDetail", component: PersnalColorDetail, props: true},
  { path: "/codisimulation", name: "CodiSimulation", component: CodiSimulation },
  { path: "/royal-simulation", name: "RoyalStyleSimulation", component: RoyalStyleSimulation }, // 새 경로 추가
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
