import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import vuetify from './plugins/vuetify';

const app = createApp(App);

// API URL 설정 (확인용)
console.log("API BASE URL:", process.env.VUE_APP_API_BASE_URL);

app.use(router);
app.use(vuetify);
app.mount('#app');
