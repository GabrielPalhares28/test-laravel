import { createApp } from 'vue';
import App from './App.vue';
import { ZiggyVue } from '../../vendor/tightenco/ziggy/dist/vue.m';
const app = createApp(App);

app.use(ZiggyVue);  // Usa o plugin ZiggyVue

app.mount('#app');
