import { createRouter, createWebHistory } from "vue-router";
import Home from "@/views/Home.vue";
import CharacterInfo from "@/views/CharacterInfo.vue";
import PersonalColorSelect from "@/views/PersonalColorSelect.vue";
import PersonalColorDetail from "@/views/PersonalColorDetail.vue";
import CodiSimulation from "@/views/CodiSimulation.vue";
import RoyalStyleSimulation from "@/views/RoyalStyleSimulation.vue";
import PersonalColorTwelve from "@/views/PersonalColorTwelve.vue";

const routes = [
  { path: "/", name: "Home", component: Home },
  { path: "/characterinfo", name: "CharacterInfo", component: CharacterInfo },
  { path: "/personalcolor-select", name: "PersonalColorSelect", component: PersonalColorSelect },
  { path: "/personalcolor-detail", name: "PersonalColorDetail", component: PersonalColorDetail, props: true },
  { path: "/codisimulation", name: "CodiSimulation", component: CodiSimulation },
  { path: "/royal-simulation", name: "RoyalStyleSimulation", component: RoyalStyleSimulation }, // 새 경로 추가
  { path: "/personal-color-twelve/:color", name: "PersonalColorTwelve", component: PersonalColorTwelve, props: true }
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
