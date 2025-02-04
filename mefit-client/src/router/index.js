import { createRouter, createWebHistory } from "vue-router";
import Home from "@/views/Home.vue";
import CharacterInfo from "@/views/CharacterInfo.vue";
import PersonalColorSelect from "@/views/PersonalColorSelect.vue";
import PersonalColorDetail from "@/views/PersonalColorDetail.vue";
import ColorAwards from "@/views/ColorAwards.vue";
import RoyalStyleSimulation from "@/views/RoyalStyleSimulation.vue";
import PersonalColorTwelve from "@/views/PersonalColorTwelve.vue";
import ColorPick from "@/views/ColorPick.vue";
import TestRedis from "@/views/TestRedis.vue";
import PersonalColorTest from "@/views/PersonalColorTest.vue";

const routes = [
    { path: "/", name: "Home", component: Home },
    { path: "/characterinfo", name: "CharacterInfo", component: CharacterInfo },
    { path: "/colorAwards", name: "ColorAwards", component: ColorAwards },
    {
        path: "/royal-simulation",
        name: "RoyalStyleSimulation",
        component: RoyalStyleSimulation,
    },
    {
        path: "/personalcolor-select",
        name: "PersonalColorSelect",
        component: PersonalColorSelect,
    },
    {
        path: "/personalcolor-detail",
        name: "PersonalColorDetail",
        component: PersonalColorDetail,
        props: true,
    },
    {
        path: "/personal-color-twelve/:color",
        name: "PersonalColorTwelve",
        component: PersonalColorTwelve,
        props: true,
    },
    { path: "/color-pick", name: "ColorPick", component: ColorPick },
    {
        path: "/personal-colorTest",
        name: "PersonalColorTest",
        component: PersonalColorTest,
    },
    {
        path: "/test-redis",
        name: "TestRedis",
        component: TestRedis,
    },
];

const router = createRouter({
    history: createWebHistory(),
    routes,
});

export default router;
