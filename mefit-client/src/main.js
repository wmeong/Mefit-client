import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import vuetify from './plugins/vuetify'
//import config from "@/config.js";

const app = createApp(App);
//console.log("API URL:", config.API_BASE_URL);

// 전역 컴포넌트 등록

app.use(router);
app.use(vuetify)

app.mount('#app');
