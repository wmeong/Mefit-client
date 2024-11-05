import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import vuetify from './plugins/vuetify'

const app = createApp(App);

// 전역 컴포넌트 등록

app.use(router);
app.use(vuetify)

app.mount('#app');
